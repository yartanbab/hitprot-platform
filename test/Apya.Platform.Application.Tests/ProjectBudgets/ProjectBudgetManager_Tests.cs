using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.ProjectBudgets;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Shouldly;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.Tests.Application.ProjectBudgets;

/// <summary>
/// Bütçe revizyonunun sözleşmesi: tutar değişimi, geçmiş kaydı ve kesinti bağı
/// AYNI işlemde olur. Biri olup diğeri olmazsa "neden değişti" sorusunun cevabı
/// kaybolur — donör denetiminde ilk sorulan şey odur.
/// </summary>
public class ProjectBudgetManager_Tests
{
    private readonly IRepository<ProjectBudgetLine, Guid> _lineRepo;
    private readonly IRepository<FundingTranche, Guid> _trancheRepo;
    private readonly IRepository<BudgetRevision, Guid> _revisionRepo;
    private readonly IRepository<Expense, Guid> _expenseRepo;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepo;
    private readonly ProjectBudgetManager _sut;

    private readonly Guid _projectId = Guid.NewGuid();

    public ProjectBudgetManager_Tests()
    {
        _lineRepo = Substitute.For<IRepository<ProjectBudgetLine, Guid>>();
        _trancheRepo = Substitute.For<IRepository<FundingTranche, Guid>>();
        _revisionRepo = Substitute.For<IRepository<BudgetRevision, Guid>>();
        _expenseRepo = Substitute.For<IRepository<Expense, Guid>>();
        _incomeRepo = Substitute.For<IRepository<IncomeEntry, Guid>>();

        _sut = new ProjectBudgetManager(_lineRepo, _trancheRepo, _revisionRepo, _expenseRepo, _incomeRepo);

        var services = new ServiceCollection();
        services.AddSingleton<IGuidGenerator>(SimpleGuidGenerator.Instance);
        services.AddSingleton<ICurrentTenant>(Substitute.For<ICurrentTenant>());
        var clock = Substitute.For<IClock>();
        clock.Now.Returns(new DateTime(2026, 9, 1, 10, 0, 0, DateTimeKind.Utc));
        services.AddSingleton<IClock>(clock);
        services.AddLogging();
        _sut.LazyServiceProvider = new AbpLazyServiceProvider(services.BuildServiceProvider());
    }

    private ProjectBudgetLine Line(string code, string name, decimal planned, decimal approved)
        => new(Guid.NewGuid(), null, _projectId, code, name, planned, approved);

    private void GivenLines(params ProjectBudgetLine[] lines)
        => _lineRepo.GetListAsync(
                Arg.Any<Expression<Func<ProjectBudgetLine, bool>>>(),
                Arg.Any<bool>(),
                Arg.Any<CancellationToken>())
            .Returns(lines.ToList());

    private void GivenRevisions(params BudgetRevision[] revisions)
        => _revisionRepo.GetListAsync(
                Arg.Any<Expression<Func<BudgetRevision, bool>>>(),
                Arg.Any<bool>(),
                Arg.Any<CancellationToken>())
            .Returns(revisions.ToList());

    [Fact]
    public async Task Revizyon_onaylanan_tutari_degistirir_sozlesme_tutarina_DOKUNMAZ()
    {
        var line = Line("1", "Personel", planned: 100_000m, approved: 100_000m);
        GivenLines(line);
        GivenRevisions();

        await _sut.ApplyRevisionAsync(
            _projectId, "Kesinti sonrası", new DateTime(2026, 9, 1),
            new Dictionary<Guid, decimal> { [line.Id] = 80_000m });

        line.ApprovedAmount.ShouldBe(80_000m);
        line.PlannedAmount.ShouldBe(100_000m);
    }

    [Fact]
    public async Task Revizyon_onceki_ve_sonraki_tutari_kayda_gecirir()
    {
        var line = Line("1", "Personel", 100_000m, 100_000m);
        GivenLines(line);
        GivenRevisions();

        var revision = await _sut.ApplyRevisionAsync(
            _projectId, "Kesinti sonrası", new DateTime(2026, 9, 1),
            new Dictionary<Guid, decimal> { [line.Id] = 80_000m });

        revision.Lines.Count.ShouldBe(1);
        var revisionLine = revision.Lines.Single();
        revisionLine.BudgetLineId.ShouldBe(line.Id);
        revisionLine.PreviousAmount.ShouldBe(100_000m);
        revisionLine.NewAmount.ShouldBe(80_000m);
        revision.NetDelta.ShouldBe(-20_000m);
    }

    [Fact]
    public async Task Revizyon_numarasi_bir_artar()
    {
        var line = Line("1", "Personel", 100_000m, 100_000m);
        GivenLines(line);

        var existing = new BudgetRevision(Guid.NewGuid(), null, _projectId, 3, "eski", DateTime.Today);
        GivenRevisions(existing);

        var revision = await _sut.ApplyRevisionAsync(
            _projectId, "Yeni", new DateTime(2026, 9, 1),
            new Dictionary<Guid, decimal> { [line.Id] = 90_000m });

        revision.RevisionNo.ShouldBe(4);
    }

    /// <summary>
    /// Yarısı uygulanmış revizyon, hiç uygulanmamış olandan kötüdür: geçersiz
    /// kalem varsa HİÇBİR tutar değişmemeli.
    /// </summary>
    [Fact]
    public async Task Baska_projenin_kalemi_gonderilirse_hicbir_tutar_degismez()
    {
        var line = Line("1", "Personel", 100_000m, 100_000m);
        GivenLines(line);
        GivenRevisions();

        var yabanciKalemId = Guid.NewGuid();

        var ex = await Should.ThrowAsync<BusinessException>(() => _sut.ApplyRevisionAsync(
            _projectId, "Karışık", new DateTime(2026, 9, 1),
            new Dictionary<Guid, decimal>
            {
                [line.Id] = 80_000m,
                [yabanciKalemId] = 10_000m
            }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineProjectMismatch);
        line.ApprovedAmount.ShouldBe(100_000m);
        await _revisionRepo.DidNotReceive().InsertAsync(
            Arg.Any<BudgetRevision>(), Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Bos_degisiklik_listesi_reddedilir()
    {
        GivenLines();
        GivenRevisions();

        var ex = await Should.ThrowAsync<BusinessException>(() => _sut.ApplyRevisionAsync(
            _projectId, "Boş", new DateTime(2026, 9, 1), new Dictionary<Guid, decimal>()));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetRevisionEmpty);
    }

    [Fact]
    public async Task Revizyon_kaynak_kesintiyi_kendine_baglar()
    {
        var line = Line("1", "Personel", 100_000m, 100_000m);
        GivenLines(line);
        GivenRevisions();

        var tranche = new FundingTranche(Guid.NewGuid(), null, _projectId, 1, 200_000m);
        var deduction = tranche.AddDeduction(Guid.NewGuid(), 20_000m, "Belgesiz gider", DateTime.Today);
        deduction.Resolution.ShouldBe(DeductionResolution.Open);

        var revision = await _sut.ApplyRevisionAsync(
            _projectId, "Kesinti", new DateTime(2026, 9, 1),
            new Dictionary<Guid, decimal> { [line.Id] = 80_000m },
            deduction);

        deduction.Resolution.ShouldBe(DeductionResolution.AppliedToBudget);
        deduction.BudgetRevisionId.ShouldBe(revision.Id);
    }

    [Fact]
    public async Task Bagli_kaydi_olan_kalem_silinemez()
    {
        var line = Line("1", "Personel", 100_000m, 100_000m);

        _expenseRepo.CountAsync(Arg.Any<Expression<Func<Expense, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(3);
        _incomeRepo.CountAsync(Arg.Any<Expression<Func<IncomeEntry, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(0);

        var ex = await Should.ThrowAsync<BusinessException>(() => _sut.DeleteLineAsync(line));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineInUse);
        await _lineRepo.DidNotReceive().DeleteAsync(
            Arg.Any<ProjectBudgetLine>(), Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Bagsiz_kalem_silinebilir()
    {
        var line = Line("1", "Personel", 100_000m, 100_000m);

        _expenseRepo.CountAsync(Arg.Any<Expression<Func<Expense, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(0);
        _incomeRepo.CountAsync(Arg.Any<Expression<Func<IncomeEntry, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(0);

        await _sut.DeleteLineAsync(line);

        await _lineRepo.Received(1).DeleteAsync(line, Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Ayni_kod_ayni_projede_ikinci_kez_kullanilamaz()
    {
        var mevcut = Line("1.2", "Malzeme", 50_000m, 50_000m);
        _lineRepo.FindAsync(
                Arg.Any<Expression<Func<ProjectBudgetLine, bool>>>(),
                Arg.Any<bool>(),
                Arg.Any<CancellationToken>())
            .Returns(mevcut);

        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _sut.CreateLineAsync(_projectId, "1.2", "Başka kalem", 10_000m));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineCodeAlreadyExists);
    }

    /// <summary>Kodsuz çalışan kiracılar var; boş kod tekillik kontrolüne girmez.</summary>
    [Fact]
    public async Task Bos_kod_cakisma_kontrolune_girmez()
    {
        GivenLines();

        var line = await _sut.CreateLineAsync(_projectId, "   ", "Kodsuz kalem", 10_000m);

        line.Code.ShouldBe(string.Empty);
        await _lineRepo.DidNotReceive().FindAsync(
            Arg.Any<Expression<Func<ProjectBudgetLine, bool>>>(),
            Arg.Any<bool>(),
            Arg.Any<CancellationToken>());
    }

    // ── Kayıt formunun kalem kuralı (kullanıcı kararı 2026-09-01) ──────────
    // "Projenin kalemi VARSA zorunlu." Ne koşulsuz zorunlu ne de tamamen serbest;
    // ikisi de yanlış olurdu — biri mevcut kullanıcıları kilitler, diğeri kalem
    // tablosunu boş bırakır.

    [Fact]
    public async Task Projesiz_kayitta_kalem_secilemez()
    {
        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _sut.EnsureBudgetLineIsValidAsync(projectId: null, budgetLineId: Guid.NewGuid()));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineProjectMismatch);
    }

    [Fact]
    public async Task Projesiz_kayitta_kalemsiz_gecerli()
    {
        await _sut.EnsureBudgetLineIsValidAsync(projectId: null, budgetLineId: null);
    }

    [Fact]
    public async Task Kalemi_olmayan_projede_kalem_ZORUNLU_DEGIL()
    {
        GivenLines();

        await _sut.EnsureBudgetLineIsValidAsync(_projectId, budgetLineId: null);
    }

    [Fact]
    public async Task Kalemi_olmayan_projeye_kalem_yazilamaz()
    {
        GivenLines();

        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _sut.EnsureBudgetLineIsValidAsync(_projectId, Guid.NewGuid()));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineProjectMismatch);
    }

    [Fact]
    public async Task Kalemi_olan_projede_kalem_ZORUNLU()
    {
        GivenLines(Line("1", "Personel", 100_000m, 100_000m));

        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _sut.EnsureBudgetLineIsValidAsync(_projectId, budgetLineId: null));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineRequired);
    }

    [Fact]
    public async Task Baska_projenin_kalemi_kabul_edilmez()
    {
        GivenLines(Line("1", "Personel", 100_000m, 100_000m));

        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _sut.EnsureBudgetLineIsValidAsync(_projectId, Guid.NewGuid()));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineProjectMismatch);
    }

    [Fact]
    public async Task Projenin_kendi_kalemi_kabul_edilir()
    {
        var line = Line("1", "Personel", 100_000m, 100_000m);
        GivenLines(line);

        await _sut.EnsureBudgetLineIsValidAsync(_projectId, line.Id);
    }

    [Fact]
    public async Task Onaylanan_tutar_verilmezse_sozlesme_tutari_kullanilir()
    {
        GivenLines();

        var line = await _sut.CreateLineAsync(_projectId, "2", "Hizmet", 75_000m);

        line.PlannedAmount.ShouldBe(75_000m);
        line.ApprovedAmount.ShouldBe(75_000m);
    }
}
