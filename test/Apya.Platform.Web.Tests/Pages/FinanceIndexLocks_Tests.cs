using System;
using System.Collections.Generic;
using System.IO;
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
using Volo.Abp.MultiTenancy;
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

    /// <summary>Oturumun kiracısı (AbpPageModel.CurrentTenant): varsayılan kiracı kullanıcısı; host vakası null yapar.</summary>
    private Guid? _currentTenantId = Guid.NewGuid();

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

        var currentTenant = Substitute.For<ICurrentTenant>();
        currentTenant.Id.Returns(_ => _currentTenantId);

        var services = new ServiceCollection();
        services.AddSingleton<IAuthorizationService>(authorization);
        services.AddSingleton(localizerFactory);
        services.AddSingleton(currentTenant);

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

    private static string ReadSource(params string[] relative)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynaklar depodan okunur.
        var root = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..");
        var path = Path.Combine(root, Path.Combine(relative));

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path).Replace("\r\n", "\n");
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

    /// <summary>
    /// Proje seçiliyken de bütçe izni yoksa Budget null kalır ve Genel'in bütçe kilidi (çip) basılmalı —
    /// eskiden çip yalnız portföy kipindeydi, proje seçince bütçe bloğu açıklamasız kayboluyordu.
    /// Render testi AlwaysAllow'da bu dalı göremediği için Razor dalı kaynaktan kilitlenir.
    /// </summary>
    [Fact]
    public async Task Proje_seciliyken_butce_izni_yoksa_butce_kilidi_gorunur()
    {
        var project = new ProjectDto { Id = Guid.NewGuid(), TenantId = _currentTenantId, Name = "Kurumsal proje", Currency = "TRY" };
        _projects.GetListAsync(Arg.Any<PagedAndSortedResultRequestDto>())
            .Returns(new PagedResultDto<ProjectDto>(1, new List<ProjectDto> { project }));
        _budget.GetOverviewAsync(project.Id).ThrowsAsync(new AbpAuthorizationException());

        var page = BuildPage(PlatformPermissions.Projects.Default, PlatformPermissions.Incomes.Default);
        page.ProjectId = project.Id;
        await page.OnGetAsync();

        page.ActiveTab.ShouldBe(FinanceContext.TabOverview);
        page.SelectedProject.ShouldNotBeNull();
        page.Budget.ShouldBeNull();

        var overview = ReadSource("src", "Apya.Platform.Web", "Pages", "Finance", "_PanelOverview.cshtml");
        overview.ShouldContain("Finance:Locked:Budget");
        overview.ShouldNotContain("else if (Model.SelectedProject == null)",
            customMessage: "bütçe kilidi yalnız portföyde basılıyor; proje seçiliyken Budget null olunca hiçbir şey görünmez");
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

    /// <summary>
    /// Gelir-Gider'in kesik notu modelin kesin bayrağına bağlı (donör tarih denetimiyle aynı sinyal): eski
    /// "LedgerRows.Count &gt;= 100" sezgisi 60+60 kayıtta yanlış alarm veriyor, kalem süzgeci kesik bir
    /// kaynaktan 30 satır bırakınca notu hiç göstermiyordu. Render testi 100+ kayıt kurmadan bu dalı
    /// göremediği için Razor koşulu kaynaktan kilitlenir; bayrağın kendisi donör testlerinde.
    /// </summary>
    [Fact]
    public void Gelir_gider_kesik_notu_LedgerTruncated_bayragina_bagli()
    {
        var ledger = ReadSource("src", "Apya.Platform.Web", "Pages", "Finance", "_PanelLedger.cshtml");

        ledger.ShouldContain("@if (Model.LedgerTruncated)");
        ledger.ShouldNotContain("LedgerRows.Count >= 100");
    }

    // ─────────────────────────── Donör uygunluk denetimi (FIN-07) ───────────────────────────

    private static readonly string[] DonorGrants =
    {
        PlatformPermissions.Projects.Default, PlatformPermissions.Projects.ViewBudget,
        PlatformPermissions.Incomes.Default, PlatformPermissions.Expenses.Default
    };

    /// <summary>Hibe şablonlu proje + donör sekmesi; her kaynak okunur ve temizdir (test bozacağını bozar).</summary>
    /// <param name="projectTenantId">Projenin kiracısı; verilmezse oturumun kiracısı (kullanıcı kendi projesine bakar).</param>
    private IndexModel DonorPage(bool withDates = true, Guid? projectTenantId = null)
    {
        var project = new ProjectDto
        {
            Id = Guid.NewGuid(),
            TenantId = projectTenantId ?? _currentTenantId,
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

    /// <summary>Gelir tarafının kesiği de aynı bayrağı kurar (gider kesiğiyle simetrik).</summary>
    [Fact]
    public async Task Gelir_listesi_kesikse_tarih_denetimi_eksik()
    {
        var page = DonorPage();
        var first100 = Enumerable.Range(0, 100)
            .Select(i => new IncomeEntryDto { Id = Guid.NewGuid(), Title = "Gelir " + i, Amount = 1m, IncomeDate = new DateTime(2026, 6, 1) })
            .ToList();
        _incomes.GetListAsync(Arg.Any<GetIncomeEntriesInput>()).Returns(new PagedResultDto<IncomeEntryDto>(150, first100));

        await page.OnGetAsync();

        page.LedgerTruncated.ShouldBeTrue();
        ShouldBeUnverified(page, "Finance:Donor:Unverified:Dates:PartialTitle", "Finance:Donor:Unverified:Dates:Partial");
    }

    /// <summary>
    /// Adresteki Gelir-Gider süzgeci (tür, kalem, kasa) denetim kümesini daraltır: okunan kayıtlar temiz ve
    /// hiçbir kaynak kesik olmasa da "tarih aralığında" denemez.
    /// </summary>
    [Theory]
    [InlineData("kind")]
    [InlineData("line")]
    [InlineData("account")]
    public async Task Suzgecli_listede_tarih_denetimi_eksik(string filter)
    {
        var page = DonorPage();
        switch (filter)
        {
            case "kind": page.Kind = "gider"; break;
            case "line": page.LineId = Guid.NewGuid(); break;
            default: page.AccountId = Guid.NewGuid(); break;
        }

        await page.OnGetAsync();

        page.LedgerTruncated.ShouldBeFalse();
        ShouldBeUnverified(page, "Finance:Donor:Unverified:Dates:PartialTitle", "Finance:Donor:Unverified:Dates:Partial");
    }

    /// <summary>
    /// Host hesabıyla ("Hesabına Gir" kullanmadan) kiracının hibe projesi: proje seçici ve bütçe/kur
    /// servisleri kiracı süzgecini kapatır, belge tahtası, gelir/gider ve paketler kapatmaz → boş küme
    /// "temiz" görünür. Belge ve tarih başlıkları denetlenemedi (olumlu özet basılamaz), paketler
    /// kilitli ve hiç okunmaz.
    /// </summary>
    [Fact]
    public async Task Host_baglaminda_kiraci_projesinde_belge_ve_tarih_denetlenemedi()
    {
        _currentTenantId = null;
        var page = DonorPage(projectTenantId: Guid.NewGuid());

        await page.OnGetAsync();

        ShouldBeUnverified(page, "Finance:Donor:Unverified:Documents:Title", "Finance:Donor:Unverified:HostScope");
        ShouldBeUnverified(page, "Finance:Donor:Unverified:Dates:Title", "Finance:Donor:Unverified:HostScope");
        page.DonorPackagesLocked.ShouldBeTrue();
        await _matching.DidNotReceive().GetBoardAsync(Arg.Any<Guid>());
        await _packages.DidNotReceive().GetListAsync(Arg.Any<Guid>());
    }

    /// <summary>Host kendi projesine bakıyorsa (kiracısız) denetim her zamanki gibi koşar.</summary>
    [Fact]
    public async Task Host_kendi_projesinde_denetim_kosar()
    {
        _currentTenantId = null;
        var page = DonorPage();

        await page.OnGetAsync();

        page.EligibilityFindings.ShouldBeEmpty();
        page.DonorPackagesLocked.ShouldBeFalse();
        await _matching.Received().GetBoardAsync(Arg.Any<Guid>());
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
