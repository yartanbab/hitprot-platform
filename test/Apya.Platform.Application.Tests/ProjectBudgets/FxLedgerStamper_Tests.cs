using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.ExchangeRates;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Shouldly;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.Tests.Application.ProjectBudgets;

/// <summary>
/// Kur köprüsünün sözleşmesi: kayıt oluşurken ₺ ve donör karşılığı DAMGALANIR.
///
/// En kritik davranış: kur bulunamadığında HATA FIRLATILMAZ. Dövizli tek bir
/// kayıt yüzünden gider girişinin tamamen bloke olması, eksik bir donör
/// rakamından çok daha zararlı olurdu — eksiklik ekranda zaten görünüyor.
/// </summary>
public class FxLedgerStamper_Tests
{
    private readonly IRepository<Project, Guid> _projectRepo;
    private readonly IRepository<ExchangeRate, Guid> _rateRepo;
    private readonly IRepository<FundingTranche, Guid> _trancheRepo;
    private readonly FxLedgerStamper _sut;

    private readonly Guid _projectId = Guid.NewGuid();

    public FxLedgerStamper_Tests()
    {
        _projectRepo = Substitute.For<IRepository<Project, Guid>>();
        _rateRepo = Substitute.For<IRepository<ExchangeRate, Guid>>();
        _trancheRepo = Substitute.For<IRepository<FundingTranche, Guid>>();

        var resolver = new FxRateResolver(_rateRepo, _trancheRepo);
        _sut = new FxLedgerStamper(_projectRepo, resolver);

        var services = new ServiceCollection();
        services.AddSingleton<IGuidGenerator>(SimpleGuidGenerator.Instance);
        services.AddSingleton<ICurrentTenant>(Substitute.For<ICurrentTenant>());
        var clock = Substitute.For<IClock>();
        clock.Now.Returns(new DateTime(2026, 9, 1));
        services.AddSingleton<IClock>(clock);
        services.AddLogging();
        var provider = new AbpLazyServiceProvider(services.BuildServiceProvider());
        resolver.LazyServiceProvider = provider;
        _sut.LazyServiceProvider = provider;

        GivenTranches();
    }

    private Project GivenProject(string currency = "TRY", string? donor = null,
        FxPolicy policy = FxPolicy.SpendDate, decimal? fixedRate = null)
    {
        var p = new Project(_projectId, null, null, "Proje", "PRJ-1", "açıklama", 1000m, 0m, currency);
        if (donor != null) { p.SetFxBridge(donor, policy, fixedRate); }
        _projectRepo.FindAsync(_projectId, Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(p);
        return p;
    }

    private void GivenRates(params (string from, string to, decimal rate, DateTime date)[] rates)
        => _rateRepo.GetListAsync(
                Arg.Any<Expression<Func<ExchangeRate, bool>>>(),
                Arg.Any<bool>(),
                Arg.Any<CancellationToken>())
            .Returns(ci =>
            {
                var predicate = ci.Arg<Expression<Func<ExchangeRate, bool>>>().Compile();
                return rates
                    .Select(r => new ExchangeRate(Guid.NewGuid(), r.from, r.to, r.rate, r.date))
                    .Where(predicate)
                    .ToList();
            });

    private void GivenTranches(params FundingTranche[] tranches)
        => _trancheRepo.GetListAsync(
                Arg.Any<Expression<Func<FundingTranche, bool>>>(),
                Arg.Any<bool>(),
                Arg.Any<CancellationToken>())
            .Returns(ci =>
            {
                var predicate = ci.Arg<Expression<Func<FundingTranche, bool>>>().Compile();
                return tranches.Where(predicate).ToList();
            });

    [Fact]
    public async Task Projesiz_TRY_kaydi_kursuz_damgalanir()
    {
        GivenRates();

        var stamp = await _sut.StampAsync(null, "TRY", 1000m, new DateTime(2026, 6, 1));

        stamp.BookAmount.ShouldBe(1000m);
        stamp.BookRate.ShouldBe(1m);
        stamp.DonorAmount.ShouldBeNull();
        stamp.DonorRate.ShouldBeNull();
    }

    [Fact]
    public async Task Donorsuz_projede_donor_alanlari_bos_kalir()
    {
        GivenProject();
        GivenRates();

        var stamp = await _sut.StampAsync(_projectId, "TRY", 500m, new DateTime(2026, 6, 1));

        stamp.BookAmount.ShouldBe(500m);
        stamp.DonorAmount.ShouldBeNull();
    }

    [Fact]
    public async Task Dovizli_kayit_TRY_deftere_cevrilir()
    {
        GivenProject();
        GivenRates(("EUR", "TRY", 39m, new DateTime(2026, 5, 1)));

        var stamp = await _sut.StampAsync(_projectId, "EUR", 100m, new DateTime(2026, 6, 1));

        stamp.BookRate.ShouldBe(39m);
        stamp.BookAmount.ShouldBe(3900m);
    }

    [Fact]
    public async Task Donor_karsiligi_politikaya_gore_hesaplanir()
    {
        GivenProject(donor: "EUR");
        GivenRates(
            ("TRY", "EUR", 0.025m, new DateTime(2026, 5, 1)),
            ("TRY", "EUR", 0.026m, new DateTime(2026, 6, 15)));

        // Harcama günü kuru: 01.06 tarihli kayıt 01.05 kurunu kullanır
        // (15.06 kaydın gününden SONRA, seçilmemeli).
        var stamp = await _sut.StampAsync(_projectId, "TRY", 1000m, new DateTime(2026, 6, 1));

        stamp.DonorRate.ShouldBe(0.025m);
        stamp.DonorAmount.ShouldBe(25m);
    }

    [Fact]
    public async Task Sabit_sozlesme_kuru_hic_sorgu_yapmaz()
    {
        GivenProject(donor: "EUR", policy: FxPolicy.FixedContract, fixedRate: 0.03m);
        GivenRates(("TRY", "EUR", 0.999m, new DateTime(2026, 5, 1)));

        var stamp = await _sut.StampAsync(_projectId, "TRY", 1000m, new DateTime(2026, 6, 1));

        stamp.DonorRate.ShouldBe(0.03m);
        stamp.DonorAmount.ShouldBe(30m);
    }

    [Fact]
    public async Task Dilim_kuru_son_tahsilat_gununu_kullanir()
    {
        GivenProject(donor: "EUR", policy: FxPolicy.TrancheDate);

        var tranche = new FundingTranche(Guid.NewGuid(), null, _projectId, 1, 100_000m);
        tranche.RegisterCollection(100_000m, new DateTime(2026, 3, 10), null);
        GivenTranches(tranche);

        GivenRates(
            ("TRY", "EUR", 0.030m, new DateTime(2026, 3, 1)),
            ("TRY", "EUR", 0.020m, new DateTime(2026, 5, 20)));

        // Kayıt 01.06'da ama dilim 10.03'te tahsil edilmiş → 01.03 kuru geçerli.
        var stamp = await _sut.StampAsync(_projectId, "TRY", 1000m, new DateTime(2026, 6, 1));

        stamp.DonorRate.ShouldBe(0.030m);
    }

    [Fact]
    public async Task Dilim_yoksa_harcama_gunu_kuruna_dusulur()
    {
        GivenProject(donor: "EUR", policy: FxPolicy.TrancheDate);
        GivenTranches();
        GivenRates(("TRY", "EUR", 0.020m, new DateTime(2026, 5, 20)));

        var stamp = await _sut.StampAsync(_projectId, "TRY", 1000m, new DateTime(2026, 6, 1));

        stamp.DonorRate.ShouldBe(0.020m);
    }

    /// <summary>Bu, adımın en önemli davranışı — bkz. sınıf açıklaması.</summary>
    [Fact]
    public async Task Kur_bulunamazsa_HATA_FIRLATILMAZ_donor_bos_kalir()
    {
        GivenProject(donor: "EUR");
        GivenRates();

        var stamp = await _sut.StampAsync(_projectId, "TRY", 1000m, new DateTime(2026, 6, 1));

        stamp.BookAmount.ShouldBe(1000m);
        stamp.DonorAmount.ShouldBeNull();
        stamp.DonorRate.ShouldBeNull();
    }

    /// <summary>
    /// Kurlar sayfasında yalnız ters yön girilmiş olabilir (EUR→TRY var,
    /// TRY→EUR yok). Kullanıcıyı aynı kuru iki yönde girmeye zorlamıyoruz.
    /// </summary>
    [Fact]
    public async Task Ters_yonlu_kur_cevrilerek_kullanilir()
    {
        GivenProject(donor: "EUR");
        GivenRates(("EUR", "TRY", 40m, new DateTime(2026, 5, 1)));

        var stamp = await _sut.StampAsync(_projectId, "TRY", 1000m, new DateTime(2026, 6, 1));

        stamp.DonorRate.ShouldBe(0.025m);   // 1 / 40
        stamp.DonorAmount.ShouldBe(25m);
    }

    [Fact]
    public async Task Islem_para_birimi_donor_ile_ayniysa_kur_1_olur()
    {
        GivenProject(currency: "TRY", donor: "EUR");
        GivenRates();

        var stamp = await _sut.StampAsync(_projectId, "EUR", 250m, new DateTime(2026, 6, 1));

        stamp.DonorRate.ShouldBe(1m);
        stamp.DonorAmount.ShouldBe(250m);
    }
}
