using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Documents;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Web.Pages.Finance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Shouldly;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization;
using Volo.Abp.DependencyInjection;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Finans çatısında "okunamadı" ≠ "yok" (ROL-06): yetkisi olmayan kaynak panelde "kayıt yok"
/// diye değil kilitli çizilir; toplam hiçbir kaynağı sessizce dışlayamaz; hiçbir finans izni
/// yoksa sayfa 403.
/// <para>
/// Test host'u AddAlwaysAllowAuthorization kullandığı için kilit yolu entegrasyon testinde
/// görünmez; sayfa modeli burada sahte app service'lerle doğrudan kurulur (host yok). İzin
/// kümesi <see cref="IAbpAuthorizationService"/> yerine geçen sahteyle verilir; yetkisiz kaynak
/// app service'in [Authorize]'ı gibi <see cref="AbpAuthorizationException"/> atar.
/// </para>
/// </summary>
public class FinanceIndexLocks_Tests
{
    private readonly IExpenseAppService _expenses = Substitute.For<IExpenseAppService>();
    private readonly IIncomeEntryAppService _incomes = Substitute.For<IIncomeEntryAppService>();
    private readonly IInvoiceAppService _invoices = Substitute.For<IInvoiceAppService>();
    private readonly ICashAccountAppService _cashAccounts = Substitute.For<ICashAccountAppService>();
    private readonly ICashMovementAppService _cashMovements = Substitute.For<ICashMovementAppService>();
    private readonly IExchangeRateAppService _rates = Substitute.For<IExchangeRateAppService>();
    private readonly IProjectAppService _projects = Substitute.For<IProjectAppService>();
    private readonly IProjectBudgetAppService _budget = Substitute.For<IProjectBudgetAppService>();
    private readonly IProjectFxAppService _fx = Substitute.For<IProjectFxAppService>();
    private readonly IDocumentMatchingAppService _matching = Substitute.For<IDocumentMatchingAppService>();
    private readonly IComplianceAppService _compliance = Substitute.For<IComplianceAppService>();
    private readonly IDeliveryPackageAppService _packages = Substitute.For<IDeliveryPackageAppService>();

    public FinanceIndexLocks_Tests()
    {
        // Varsayılan: her kaynak okunur ve boştur; test yetkisiz kaynağı Deny… ile kapatır.
        _projects.GetListAsync(Arg.Any<PagedAndSortedResultRequestDto>())
            .Returns(new PagedResultDto<ProjectDto>(0, new List<ProjectDto>()));
        _incomes.GetListAsync(Arg.Any<GetIncomeEntriesInput>())
            .Returns(new PagedResultDto<IncomeEntryDto>(0, new List<IncomeEntryDto>()));
        _expenses.GetListAsync(Arg.Any<GetExpensesInput>())
            .Returns(new PagedResultDto<ExpenseDto>(0, new List<ExpenseDto>()));
        _invoices.GetListAsync(Arg.Any<PagedAndSortedResultRequestDto>())
            .Returns(new PagedResultDto<InvoiceDto>(0, new List<InvoiceDto>()));
        _invoices.GetProjectLookupAsync().Returns(new ListResultDto<ProjectLookupDto>(new List<ProjectLookupDto>()));
        _invoices.GetCustomerLookupAsync().Returns(new ListResultDto<CustomerLookupDto>(new List<CustomerLookupDto>()));
        _cashMovements.GetListAsync(Arg.Any<GetCashMovementsInput>())
            .Returns(new PagedResultDto<CashMovementDto>(0, new List<CashMovementDto>()));
        _cashAccounts.GetListAsync(Arg.Any<GetCashAccountsInput>())
            .Returns(new PagedResultDto<CashAccountDto>(0, new List<CashAccountDto>()));
        _rates.GetListAsync(Arg.Any<GetExchangeRatesInput>())
            .Returns(new PagedResultDto<ExchangeRateDto>(0, new List<ExchangeRateDto>()));
        _budget.GetPortfolioAsync().Returns(new ProjectPortfolioDto());
    }

    private IndexModel BuildPage(params string[] granted)
    {
        // ABP'nin IsGrantedAsync / IsGrantedAnyAsync uzantıları hizmeti IAbpAuthorizationService'e
        // çevirip AuthorizeAsync(principal, null, policyName) çağırır.
        var authorization = Substitute.For<IAbpAuthorizationService>();
        authorization
            .AuthorizeAsync(Arg.Any<ClaimsPrincipal>(), Arg.Any<object?>(), Arg.Any<string>())
            .Returns(call => Task.FromResult(granted.Contains(call.ArgAt<string>(2))
                ? AuthorizationResult.Success()
                : AuthorizationResult.Failed()));

        // AbpPageModel.L → IStringLocalizerFactory.CreateDefaultOrNull() (IAbpStringLocalizerFactory):
        // anahtarı aynen döndüren yerelleştirici — testler kültürden bağımsız anahtara bakar.
        var localizer = Substitute.For<IStringLocalizer>();
        localizer[Arg.Any<string>()].Returns(call => new LocalizedString(call.Arg<string>(), call.Arg<string>()));
        var localizerFactory = Substitute.For<IStringLocalizerFactory, IAbpStringLocalizerFactory>();
        ((IAbpStringLocalizerFactory)localizerFactory).CreateDefaultOrNull().Returns(localizer);

        var services = new ServiceCollection();
        services.AddSingleton<IAuthorizationService>(authorization);
        services.AddSingleton(localizerFactory);

        return new IndexModel(
            _expenses, _incomes, _invoices, _cashAccounts, _cashMovements, _rates,
            _projects, _budget, _fx, _matching, _compliance, _packages)
        {
            LazyServiceProvider = new AbpLazyServiceProvider(services.BuildServiceProvider())
        };
    }

    private static CashAccountDto Account(string currency) => new()
    {
        Id = Guid.NewGuid(), Name = "Hesap " + currency, Currency = currency, IsActive = true
    };

    private void GivenAccounts(params (CashAccountDto Account, decimal Balance)[] accounts)
    {
        _cashAccounts.GetListAsync(Arg.Any<GetCashAccountsInput>())
            .Returns(new PagedResultDto<CashAccountDto>(accounts.Length, accounts.Select(a => a.Account).ToList()));
        foreach (var (account, balance) in accounts)
        {
            _cashMovements.GetBalanceAsync(account.Id)
                .Returns(new CashAccountBalanceDto { CashAccountId = account.Id, Currency = account.Currency, CurrentBalance = balance });
        }
    }

    // ─────────────────────────── Sayfa kapısı ───────────────────────────

    /// <summary>Stajyer/çalışan: belge ve proje izni var, finans izni yok → 403, hiçbir kaynak okunmaz.</summary>
    [Fact]
    public async Task Hic_finans_izni_yoksa_sayfa_403_doner()
    {
        var result = await BuildPage(PlatformPermissions.Projects.Default, PlatformPermissions.Documents.Default)
            .OnGetAsync();

        result.ShouldBeOfType<ForbidResult>();
        await _projects.DidNotReceive().GetListAsync(Arg.Any<PagedAndSortedResultRequestDto>());
    }

    [Fact]
    public async Task Tek_finans_izni_sayfayi_acar()
    {
        var result = await BuildPage(PlatformPermissions.CashAccounts.Default).OnGetAsync();

        result.ShouldBeOfType<PageResult>();
    }

    // ─────────────────────────── Genel sekmesi ───────────────────────────

    [Fact]
    public async Task Yalniz_butce_izniyle_son_islemler_ve_hesaplar_kilitli()
    {
        _incomes.GetListAsync(Arg.Any<GetIncomeEntriesInput>()).ThrowsAsync(new AbpAuthorizationException());
        _expenses.GetListAsync(Arg.Any<GetExpensesInput>()).ThrowsAsync(new AbpAuthorizationException());
        _invoices.GetListAsync(Arg.Any<PagedAndSortedResultRequestDto>()).ThrowsAsync(new AbpAuthorizationException());
        _cashMovements.GetListAsync(Arg.Any<GetCashMovementsInput>()).ThrowsAsync(new AbpAuthorizationException());
        _cashAccounts.GetListAsync(Arg.Any<GetCashAccountsInput>()).ThrowsAsync(new AbpAuthorizationException());

        var page = BuildPage(PlatformPermissions.Projects.Default, PlatformPermissions.Projects.ViewBudget);
        (await page.OnGetAsync()).ShouldBeOfType<PageResult>();

        page.ActiveTab.ShouldBe(FinanceContext.TabOverview);
        page.TransactionsLocked.ShouldBeTrue();
        page.TransactionsPartiallyLocked.ShouldBeFalse();
        page.AccountsLocked.ShouldBeTrue();
    }

    [Fact]
    public async Task Yalniz_gelir_izniyle_son_islemler_KISMI()
    {
        _expenses.GetListAsync(Arg.Any<GetExpensesInput>()).ThrowsAsync(new AbpAuthorizationException());
        _invoices.GetListAsync(Arg.Any<PagedAndSortedResultRequestDto>()).ThrowsAsync(new AbpAuthorizationException());
        _cashMovements.GetListAsync(Arg.Any<GetCashMovementsInput>()).ThrowsAsync(new AbpAuthorizationException());

        var page = BuildPage(PlatformPermissions.Projects.Default, PlatformPermissions.Incomes.Default);
        await page.OnGetAsync();

        page.TransactionsLocked.ShouldBeFalse();
        page.TransactionsPartiallyLocked.ShouldBeTrue();
    }

    [Fact]
    public async Task Tum_kaynaklar_okununca_kilit_yok()
    {
        var page = BuildPage(
            PlatformPermissions.Incomes.Default, PlatformPermissions.Expenses.Default,
            PlatformPermissions.Invoices.Default, PlatformPermissions.CashAccounts.Default);
        await page.OnGetAsync();

        page.TransactionsLocked.ShouldBeFalse();
        page.TransactionsPartiallyLocked.ShouldBeFalse();
        page.AccountsLocked.ShouldBeFalse();
        page.RatesLocked.ShouldBeFalse();
    }

    // ─────────────────────────── Kasa sekmesi ───────────────────────────

    /// <summary>Liste CashAccounts, bakiye CashMovements ister: bakiye okunamazsa hesaplar kilitli.</summary>
    [Fact]
    public async Task Bakiye_izni_yoksa_hesaplar_kilitli()
    {
        var tl = Account("TRY");
        GivenAccounts((tl, 100m));
        _cashMovements.GetBalanceAsync(Arg.Any<Guid>()).ThrowsAsync(new AbpAuthorizationException());

        var page = BuildPage(PlatformPermissions.CashAccounts.Default);
        page.Tab = FinanceContext.TabCash;
        await page.OnGetAsync();

        page.ActiveTab.ShouldBe(FinanceContext.TabCash);
        page.AccountsLocked.ShouldBeTrue();
        page.Accounts.ShouldBeEmpty();
    }

    /// <summary>Kur okunamazsa toplam "₺0" DEĞİL: ₺ hesaplar yine toplanır, panel bunu açıkça söyler.</summary>
    [Fact]
    public async Task Kur_izni_yoksa_TL_hesaplar_yine_toplanir()
    {
        GivenAccounts((Account("TRY"), 100m), (Account("USD"), 50m));
        _rates.GetListAsync(Arg.Any<GetExchangeRatesInput>()).ThrowsAsync(new AbpAuthorizationException());

        var page = BuildPage(PlatformPermissions.CashAccounts.Default);
        page.Tab = FinanceContext.TabCash;
        await page.OnGetAsync();

        page.AccountsLocked.ShouldBeFalse();
        page.RatesLocked.ShouldBeTrue();
        page.TotalBalanceTry.ShouldBe(100m);
    }

    // ─────────────────────────── Gelir-Gider sekmesi ───────────────────────────

    [Fact]
    public async Task Gider_izni_yoksa_gider_tarafi_kilitli()
    {
        _expenses.GetListAsync(Arg.Any<GetExpensesInput>()).ThrowsAsync(new AbpAuthorizationException());

        var page = BuildPage(PlatformPermissions.Incomes.Default);
        page.Tab = FinanceContext.TabLedger;
        await page.OnGetAsync();

        page.ActiveTab.ShouldBe(FinanceContext.TabLedger);
        page.IncomesLocked.ShouldBeFalse();
        page.ExpensesLocked.ShouldBeTrue();
    }

    // ─────────────────────────── Donör uygunluk denetimi (FIN-07) ───────────────────────────

    private static readonly string[] DonorGrants =
    {
        PlatformPermissions.Projects.Default, PlatformPermissions.Projects.ViewBudget,
        PlatformPermissions.Incomes.Default, PlatformPermissions.Expenses.Default
    };

    /// <summary>Hibe şablonlu proje + donör sekmesi; her kaynak okunur ve temizdir (test bozacağını bozar).</summary>
    private IndexModel DonorPage(bool withDates = true)
    {
        var project = new ProjectDto
        {
            Id = Guid.NewGuid(),
            Name = "Hibe projesi",
            Currency = "TRY",
            CategorySystemKey = ProjectCategory.GrantProject,
            StartDate = withDates ? new DateTime(2026, 1, 1) : null,
            EndDate = withDates ? new DateTime(2026, 12, 31) : null
        };
        _projects.GetListAsync(Arg.Any<PagedAndSortedResultRequestDto>())
            .Returns(new PagedResultDto<ProjectDto>(1, new List<ProjectDto> { project }));
        _budget.GetLinesAsync(project.Id).Returns(new List<ProjectBudgetLineDto>());
        _fx.GetPolicyAsync(project.Id).Returns(new ProjectFxPolicyDto { ProjectId = project.Id, DonorCurrency = "EUR" });
        _fx.GetBridgeAsync(project.Id).Returns(new ProjectFxBridgeDto
        {
            Policy = new ProjectFxPolicyDto { ProjectId = project.Id, DonorCurrency = "EUR" }
        });
        _matching.GetBoardAsync(project.Id).Returns(new MatchingBoardDto { ProjectId = project.Id });
        _packages.GetListAsync(project.Id).Returns(new List<DeliveryPackageDto>());

        var page = BuildPage(DonorGrants);
        page.ProjectId = project.Id;
        page.Tab = FinanceContext.TabDonor;
        return page;
    }

    private static void ShouldBeUnverified(IndexModel page, string titleKey, string detailKey)
    {
        var row = page.EligibilityFindings.SingleOrDefault(f => f.Title == titleKey && f.Detail == detailKey);
        row.ShouldNotBeNull($"'{titleKey}' / '{detailKey}' denetlenemedi satırı yok");
        row.Unverified.ShouldBeTrue();
        row.Count.ShouldBe(0);
        row.Amount.ShouldBe(0m);
    }

    /// <summary>
    /// Asıl canlı vaka: Basic pakette Documents kapalı → tahta okunamaz. "Bulgu yok" DEĞİL,
    /// "Belge denetimi yapılamadı"; liste dolu olduğu için olumlu cümle basılamaz. Paketler de kilitli.
    /// </summary>
    [Fact]
    public async Task Belge_tahtasi_okunamazsa_belge_denetimi_yapilamadi_ve_paketler_kilitli()
    {
        var page = DonorPage();
        _matching.GetBoardAsync(Arg.Any<Guid>()).ThrowsAsync(new AbpAuthorizationException());
        _packages.GetListAsync(Arg.Any<Guid>()).ThrowsAsync(new AbpAuthorizationException());

        await page.OnGetAsync();

        page.ActiveTab.ShouldBe(FinanceContext.TabDonor);
        ShouldBeUnverified(page, "Finance:Donor:Unverified:Documents:Title", "Finance:Donor:Unverified:Documents:Detail");
        page.EligibilityFindings.ShouldNotBeEmpty();
        page.DonorPackagesLocked.ShouldBeTrue();
    }

    [Fact]
    public async Task Gider_okunamazsa_tarih_denetimi_yapilamadi()
    {
        var page = DonorPage();
        _expenses.GetListAsync(Arg.Any<GetExpensesInput>()).ThrowsAsync(new AbpAuthorizationException());

        await page.OnGetAsync();

        ShouldBeUnverified(page, "Finance:Donor:Unverified:Dates:Title", "Finance:Donor:Unverified:Dates:NoAccess");
    }

    /// <summary>
    /// Kaynak başına 100 kayıt, tarih azalan: başlangıçtan ÖNCEKİ en eski kayıtlar tam da kesilen
    /// kısım → okunan 100 temiz olsa da "aralıkta" denemez.
    /// </summary>
    [Fact]
    public async Task Gider_listesi_kesikse_tarih_denetimi_eksik()
    {
        var page = DonorPage();
        var first100 = Enumerable.Range(0, 100)
            .Select(i => new ExpenseDto { Id = Guid.NewGuid(), Title = "Gider " + i, Amount = 1m, ExpenseDate = new DateTime(2026, 6, 1) })
            .ToList();
        _expenses.GetListAsync(Arg.Any<GetExpensesInput>()).Returns(new PagedResultDto<ExpenseDto>(150, first100));

        await page.OnGetAsync();

        page.LedgerTruncated.ShouldBeTrue();
        ShouldBeUnverified(page, "Finance:Donor:Unverified:Dates:PartialTitle", "Finance:Donor:Unverified:Dates:Partial");
    }

    [Fact]
    public async Task Tarihsiz_projede_tarih_denetimi_yapilamadi()
    {
        var page = DonorPage(withDates: false);

        await page.OnGetAsync();

        ShouldBeUnverified(page, "Finance:Donor:Unverified:Dates:Title", "Finance:Donor:Unverified:Dates:NoProjectDates");
    }

    /// <summary>Her başlık gerçekten koştu ve temiz → liste boş (panelin olumlu özeti bu yolda basılır).</summary>
    [Fact]
    public async Task Her_sey_okunur_ve_temizse_bulgu_yok()
    {
        var page = DonorPage();

        await page.OnGetAsync();

        page.EligibilityFindings.ShouldBeEmpty();
        page.DonorPackagesLocked.ShouldBeFalse();
        page.LedgerTruncated.ShouldBeFalse();
    }
}
