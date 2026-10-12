using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.ExchangeRates;
using Apya.Platform.FxRevaluations;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// FIN-03: kasalar arası transfer, kuru gider/gelir kasa yoluyla AYNI kapıdan çözer
/// (<c>FxRateResolver.ResolveByDateAsync</c>): transfer gününe kadarki en güncel kur,
/// yoksa ters yönde girilmiş kur.
///
/// <para>Eskiden transfer kendi aramasını yapıyordu: tarihe bakmadan en son kuru alıyor
/// (geriye tarihli transfer bugünün kuruyla yazılıyordu) ve yalnız EUR→TRY girilmişken
/// TRY→EUR transferi "kur yok" diye reddediyordu.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class CashTransferRate_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Tenant = Guid.Parse("55550000-cccc-4000-8000-000000000303");

    private readonly CashTransferManager _transferManager;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<ExchangeRate, Guid> _rateRepository;
    private readonly ICurrentTenant _currentTenant;

    public CashTransferRate_Tests()
    {
        _transferManager = GetRequiredService<CashTransferManager>();
        _cashAccountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _rateRepository = GetRequiredService<IRepository<ExchangeRate, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateCashAccountAsync(string currency)
    {
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                var account = new CashAccount(id, "Kasa " + currency, currency: currency, tenantId: Tenant);
                await _cashAccountRepository.InsertAsync(account, autoSave: true);
            }
        });
        return id;
    }

    private async Task AddRateAsync(string from, string to, decimal rate, DateTime date)
    {
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                await _rateRepository.InsertAsync(
                    new ExchangeRate(Guid.NewGuid(), from, to, rate, date, tenantId: Tenant),
                    autoSave: true);
            }
        });
    }

    private async Task<CashTransferResult> TransferAsync(Guid from, Guid to, decimal amount, DateTime date)
    {
        CashTransferResult result = null!;
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                result = await _transferManager.TransferAsync(from, to, amount, date, null);
            }
        });
        return result;
    }

    [Fact]
    public async Task Geriye_tarihli_transfer_o_gunun_kuruyla_yazilir()
    {
        // Para birimi çifti teste özgü: koleksiyon aynı veritabanını paylaşıyor.
        var from = await CreateCashAccountAsync("GBP");
        var to = await CreateCashAccountAsync("TRY");
        await AddRateAsync("GBP", "TRY", 40m, new DateTime(2026, 3, 1));
        await AddRateAsync("GBP", "TRY", 50m, new DateTime(2026, 6, 1));

        var result = await TransferAsync(from, to, 100m, new DateTime(2026, 3, 15));

        result.RateApplied.ShouldBe(40m);
        result.ConvertedAmount.ShouldBe(4000m);
    }

    [Fact]
    public async Task Yalniz_ters_yonde_kur_varsa_transfer_onu_kullanir()
    {
        var from = await CreateCashAccountAsync("TRY");
        var to = await CreateCashAccountAsync("CHF");
        await AddRateAsync("CHF", "TRY", 40m, new DateTime(2026, 3, 1));

        var result = await TransferAsync(from, to, 4000m, new DateTime(2026, 3, 15));

        result.RateApplied.ShouldBe(0.025m);
        result.ConvertedAmount.ShouldBe(100m);
    }

    [Fact]
    public async Task Transfer_gunune_kadar_kur_yoksa_reddedilir()
    {
        var from = await CreateCashAccountAsync("SEK");
        var to = await CreateCashAccountAsync("TRY");
        // Kur yalnız transferden SONRAKİ bir güne girilmiş: o gün bilinmiyordu.
        await AddRateAsync("SEK", "TRY", 3m, new DateTime(2026, 6, 1));

        var ex = await Should.ThrowAsync<BusinessException>(
            () => TransferAsync(from, to, 100m, new DateTime(2026, 3, 15)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.CashMovementTransferRateMissing);
    }

    [Fact]
    public async Task Ayni_para_biriminde_kur_aranmaz()
    {
        var from = await CreateCashAccountAsync("NOK");
        var to = await CreateCashAccountAsync("NOK");

        var result = await TransferAsync(from, to, 250m, new DateTime(2026, 3, 15));

        result.RateApplied.ShouldBeNull();
        result.ConvertedAmount.ShouldBe(250m);
    }

    /// <summary>Kur değerleme de aynı kapıdan: yalnız ters yönde girilmiş kur değerlemeye girer.</summary>
    [Fact]
    public async Task Kur_degerleme_ters_yonde_girilmis_kuru_kullanir()
    {
        // Kasa DKK; yalnız TRY→DKK girilmiş (1 TRY = 0,2 DKK → 1 DKK = 5 TRY).
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                await _cashAccountRepository.InsertAsync(
                    new CashAccount(id, "Kasa DKK", currency: "DKK", openingBalance: 100m, tenantId: Tenant),
                    autoSave: true);
            }
        });
        await AddRateAsync("TRY", "DKK", 0.2m, new DateTime(2026, 3, 1));

        FxRevaluationSnapshotDto snapshot = null!;
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                snapshot = await GetRequiredService<IFxRevaluationAppService>()
                    .RunAsync(new RunFxRevaluationDto { AsOfDate = new DateTime(2026, 3, 31) });
            }
        });

        var line = snapshot.Lines.Single(l => l.CashAccountId == id);
        line.Rate.ShouldBe(5m);
        line.TryValue.ShouldBe(500m);
    }
}
