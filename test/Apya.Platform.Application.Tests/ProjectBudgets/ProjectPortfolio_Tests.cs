using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.Tests.Application.ProjectBudgets;

/// <summary>
/// Portföy toplamının sözleşmesi (tasarım 2d).
///
/// Buradaki üç kural para ekranına doğrudan yazıyor:
///   1) Dilimli projede "gelen para" tahsilattır, gelir kayıtları DEĞİL — ikisi
///      toplanırsa aynı para iki kez sayılır.
///   2) Farklı para birimleri TOPLANMAZ; toplam para birimi başına verilir.
///   3) Bütçesi ve kaydı olmayan proje tabloya girmez, sayılır.
/// </summary>
public class ProjectPortfolio_Tests
{
    private readonly IRepository<ProjectBudgetLine, Guid> _lineRepo = Substitute.For<IRepository<ProjectBudgetLine, Guid>>();
    private readonly IRepository<FundingTranche, Guid> _trancheRepo = Substitute.For<IRepository<FundingTranche, Guid>>();
    private readonly IRepository<TrancheDeduction, Guid> _deductionRepo = Substitute.For<IRepository<TrancheDeduction, Guid>>();
    private readonly IRepository<BudgetRevision, Guid> _revisionRepo = Substitute.For<IRepository<BudgetRevision, Guid>>();
    private readonly IRepository<Project, Guid> _projectRepo = Substitute.For<IRepository<Project, Guid>>();
    private readonly IRepository<Expense, Guid> _expenseRepo = Substitute.For<IRepository<Expense, Guid>>();
    private readonly IRepository<IncomeEntry, Guid> _incomeRepo = Substitute.For<IRepository<IncomeEntry, Guid>>();
    private readonly IRepository<TaskItem, Guid> _taskRepo = Substitute.For<IRepository<TaskItem, Guid>>();
    private readonly IRepository<ProjectCategoryDefinition, Guid> _categoryRepo = Substitute.For<IRepository<ProjectCategoryDefinition, Guid>>();

    private readonly ProjectBudgetAppService _sut;

    public ProjectPortfolio_Tests()
    {
        var manager = new ProjectBudgetManager(
            _lineRepo, _trancheRepo, _revisionRepo, _expenseRepo, _incomeRepo, _taskRepo);

        _sut = new ProjectBudgetAppService(
            _lineRepo, _trancheRepo, _deductionRepo, _revisionRepo, _projectRepo,
            _categoryRepo, _expenseRepo, _incomeRepo, _taskRepo, manager);

        var services = new ServiceCollection();
        services.AddSingleton<IGuidGenerator>(SimpleGuidGenerator.Instance);

        // Kiracı bağlamı: CurrentTenant.Id dolu → HostScope filtreye DOKUNMAZ.
        var tenant = Substitute.For<ICurrentTenant>();
        tenant.Id.Returns(Guid.NewGuid());
        services.AddSingleton(tenant);
        services.AddSingleton(Substitute.For<IDataFilter>());

        var clock = Substitute.For<IClock>();
        clock.Now.Returns(new DateTime(2026, 9, 1, 10, 0, 0, DateTimeKind.Utc));
        services.AddSingleton<IClock>(clock);
        services.AddLogging();

        _sut.LazyServiceProvider = new AbpLazyServiceProvider(services.BuildServiceProvider());

        GivenAll();
    }

    /* ─── kurulum yardımcıları ─────────────────────────────────────── */

    private void GivenAll(
        List<Project>? projects = null,
        List<ProjectBudgetLine>? lines = null,
        List<FundingTranche>? tranches = null,
        List<Expense>? expenses = null,
        List<IncomeEntry>? incomes = null,
        List<TrancheDeduction>? deductions = null)
    {
        _projectRepo.GetListAsync(Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(projects ?? new List<Project>());
        _lineRepo.GetListAsync(Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(lines ?? new List<ProjectBudgetLine>());
        _trancheRepo.GetListAsync(Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(tranches ?? new List<FundingTranche>());
        _expenseRepo.GetListAsync(Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(expenses ?? new List<Expense>());
        _incomeRepo.GetListAsync(Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(incomes ?? new List<IncomeEntry>());
        _deductionRepo.GetListAsync(Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(deductions ?? new List<TrancheDeduction>());
        _categoryRepo.GetListAsync(Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(new List<ProjectCategoryDefinition>());
    }

    private static Project Proje(string name, decimal budget, string currency = "TRY")
        => new(Guid.NewGuid(), null, null, name, "PRJ", "", budget, 0m, currency);

    private static Expense Gider(Guid projectId, decimal amount)
        => new(Guid.NewGuid(), "Gider", amount, Guid.NewGuid(), new DateTime(2026, 8, 1),
               projectId: projectId);

    private static IncomeEntry Gelir(Guid projectId, decimal amount)
        => new(Guid.NewGuid(), "Gelir", amount, new DateTime(2026, 8, 1), projectId: projectId);

    /* ─── testler ─────────────────────────────────────────────────── */

    [Fact]
    public async Task Butcesiz_ve_kayitsiz_proje_tabloya_GIRMEZ_ama_sayilir()
    {
        var bos = Proje("Boş proje", 0m);
        var dolu = Proje("Bütçeli proje", 100_000m);
        GivenAll(projects: new List<Project> { bos, dolu });

        var portfolio = await _sut.GetPortfolioAsync();

        portfolio.Rows.Count.ShouldBe(1);
        portfolio.Rows.Single().Name.ShouldBe("Bütçeli proje");
        portfolio.SkippedProjectCount.ShouldBe(1);
    }

    [Fact]
    public async Task Farkli_para_birimleri_TOPLANMAZ()
    {
        var tl = Proje("TL projesi", 100_000m, "TRY");
        var eur = Proje("EUR projesi", 50_000m, "EUR");
        GivenAll(projects: new List<Project> { tl, eur });

        var portfolio = await _sut.GetPortfolioAsync();

        portfolio.IsMixedCurrency.ShouldBeTrue();
        portfolio.Totals.Count.ShouldBe(2);
        portfolio.Totals.Single(t => t.Currency == "TRY").ApprovedBudget.ShouldBe(100_000m);
        portfolio.Totals.Single(t => t.Currency == "EUR").ApprovedBudget.ShouldBe(50_000m);
    }

    [Fact]
    public async Task Tek_para_biriminde_toplam_tek_satir_doner()
    {
        GivenAll(projects: new List<Project> { Proje("A", 100_000m), Proje("B", 40_000m) });

        var portfolio = await _sut.GetPortfolioAsync();

        portfolio.IsMixedCurrency.ShouldBeFalse();
        portfolio.Totals.Single().ApprovedBudget.ShouldBe(140_000m);
        portfolio.Totals.Single().ProjectCount.ShouldBe(2);
    }

    [Fact]
    public async Task Dilimli_projede_gelen_para_TAHSILATTIR_gelir_kaydi_eklenmez()
    {
        // Aynı para hem dilim tahsilatı hem gelir kaydı olarak duruyor; toplanırsa
        // "gelen" iki katına çıkar.
        var proje = Proje("Hibe", 100_000m);
        var dilim = new FundingTranche(Guid.NewGuid(), null, proje.Id, 1, 60_000m, null, null);
        dilim.RegisterCollection(60_000m, new DateTime(2026, 8, 1), null);

        GivenAll(
            projects: new List<Project> { proje },
            tranches: new List<FundingTranche> { dilim },
            incomes: new List<IncomeEntry> { Gelir(proje.Id, 60_000m) });

        var portfolio = await _sut.GetPortfolioAsync();

        portfolio.Rows.Single().MoneyIn.ShouldBe(60_000m);
    }

    [Fact]
    public async Task Dilimsiz_projede_gelen_para_GELIR_KAYITLARIDIR()
    {
        var proje = Proje("Kurumsal", 100_000m);
        GivenAll(
            projects: new List<Project> { proje },
            incomes: new List<IncomeEntry> { Gelir(proje.Id, 25_000m) });

        var portfolio = await _sut.GetPortfolioAsync();

        portfolio.Rows.Single().MoneyIn.ShouldBe(25_000m);
    }

    [Fact]
    public async Task Nakit_riski_olan_proje_EN_USTE_gelir()
    {
        // Sağlıklı proje daha yüksek kullanım yüzdesine sahip olsa bile altta kalır.
        var saglikli = Proje("Sağlıklı", 100_000m);
        var riskli = Proje("Riskli", 100_000m);

        GivenAll(
            projects: new List<Project> { saglikli, riskli },
            expenses: new List<Expense> { Gider(saglikli.Id, 90_000m), Gider(riskli.Id, 10_000m) },
            incomes: new List<IncomeEntry> { Gelir(saglikli.Id, 95_000m) });

        var portfolio = await _sut.GetPortfolioAsync();

        // Riskli: geliri yok, harcaması var → kullanılabilir nakit negatif.
        portfolio.Rows.First().Name.ShouldBe("Riskli");
        portfolio.Rows.First().HasCashRisk.ShouldBeTrue();
        portfolio.Rows.Last().HasCashRisk.ShouldBeFalse();
    }

    [Fact]
    public async Task Kalem_varsa_onaylanan_KALEMLERDEN_gelir_proje_butcesinden_degil()
    {
        var proje = Proje("Hibe", 999_999m);
        GivenAll(
            projects: new List<Project> { proje },
            lines: new List<ProjectBudgetLine>
            {
                new(Guid.NewGuid(), null, proje.Id, "1", "Personel", 60_000m, 55_000m),
                new(Guid.NewGuid(), null, proje.Id, "2", "Hizmet", 40_000m, 40_000m)
            });

        var portfolio = await _sut.GetPortfolioAsync();

        portfolio.Rows.Single().ApprovedBudget.ShouldBe(95_000m);
    }
}
