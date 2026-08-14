using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Dashboard;
using Apya.Platform.Dashboard.Dtos;
using Apya.Platform.Documents;
using Apya.Platform.DynamicAssets;
using Apya.Platform.Expenses;
using Apya.Platform.FxRevaluations;
using Apya.Platform.Grants;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Localization;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Reports;
using Apya.Platform.Tasks;
using Apya.Platform.Telemetry;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using NSubstitute;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Volo.Abp.Identity;
using Volo.Abp.Linq;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.Tests.Application.Dashboard;

/// <summary>
/// İstatistik bandının KİLİT SÖZLEŞMESİ testi.
/// <para>
/// Sözleşme: izin yoksa değer hesaplanmaz — sorgu ATILMAZ, <c>Value</c> null kalır.
/// Bu, kilitli kutucuğun sayı sızdırmamasının tek garantisidir; entegrasyon testleri
/// <c>AddAlwaysAllowAuthorization</c> kullandığı için burada birim testle doğrulanır.
/// </para>
/// </summary>
public class DashboardStatisticsProvider_Tests
{
    private readonly IPermissionChecker _permissionChecker = Substitute.For<IPermissionChecker>();
    private readonly IFeatureChecker _featureChecker = Substitute.For<IFeatureChecker>();
    private readonly IAsyncQueryableExecuter _executer = Substitute.For<IAsyncQueryableExecuter>();
    private readonly IRepository<TaskItem, Guid> _taskRepo = Substitute.For<IRepository<TaskItem, Guid>>();
    private readonly IRepository<Invoice, Guid> _invoiceRepo = Substitute.For<IRepository<Invoice, Guid>>();
    private readonly IRepository<Project, Guid> _projectRepo = Substitute.For<IRepository<Project, Guid>>();

    private DashboardStatisticsProvider BuildSut()
    {
        var clock = Substitute.For<IClock>();
        clock.Now.Returns(new DateTime(2026, 8, 14, 10, 0, 0, DateTimeKind.Utc));

        var localizer = Substitute.For<IStringLocalizer<PlatformResource>>();
        localizer[Arg.Any<string>()].Returns(ci => new LocalizedString(ci.Arg<string>(), ci.Arg<string>()));

        // Özellik (feature) bayrakları açık — kilit davranışı yalnız izne bağlı ölçülsün.
        _featureChecker.IsEnabledAsync(Arg.Any<string>()).Returns(true);

        return new DashboardStatisticsProvider(
            _taskRepo,
            Substitute.For<IRepository<Apya.Platform.Tasks.TaskComment, Guid>>(),
            _projectRepo,
            Substitute.For<IRepository<Expense, Guid>>(),
            Substitute.For<IRepository<IncomeEntry, Guid>>(),
            _invoiceRepo,
            Substitute.For<IRepository<CashAccount, Guid>>(),
            Substitute.For<IRepository<CashMovement, Guid>>(),
            Substitute.For<IRepository<CustomerLedgerEntry, Guid>>(),
            Substitute.For<IRepository<FxRevaluationSnapshot, Guid>>(),
            Substitute.For<IRepository<Notification, Guid>>(),
            Substitute.For<IRepository<Document, Guid>>(),
            Substitute.For<IRepository<AppResponse, Guid>>(),
            Substitute.For<IRepository<GrantApplication, Guid>>(),
            Substitute.For<IRepository<GrantMilestone, Guid>>(),
            Substitute.For<IRepository<GrantDisbursementTranche, Guid>>(),
            Substitute.For<IRepository<ClientError, Guid>>(),
            Substitute.For<IRepository<IdentityUser, Guid>>(),
            Substitute.For<ITrialBalanceAppService>(),
            _permissionChecker,
            _featureChecker,
            _executer,
            localizer,
            clock,
            Options.Create(new DashboardOptions()));
    }

    [Fact]
    public async Task Yetkisiz_kullanicida_finans_istatistikleri_kilitli_ve_degersiz_doner()
    {
        _permissionChecker.IsGrantedAsync(Arg.Any<string>()).Returns(false);

        var stats = await BuildSut().BuildAsync(new DashboardQueryDto());

        stats.ShouldNotBeEmpty();

        var finance = stats.Where(s => s.Group == DashboardStatGroup.Finance).ToList();
        finance.ShouldNotBeEmpty();

        foreach (var stat in finance)
        {
            stat.Locked.ShouldBeTrue($"{stat.Key} kilitli olmalıydı");
            stat.Value.ShouldBeNull($"{stat.Key} değer sızdırdı");
            stat.DeltaValue.ShouldBeNull($"{stat.Key} delta sızdırdı");
            stat.Formatted.ShouldBeEmpty();
            stat.RequiredPermission.ShouldNotBeNullOrWhiteSpace();
        }
    }

    [Fact]
    public async Task Yetki_yoksa_hicbir_sorgu_atilmaz()
    {
        _permissionChecker.IsGrantedAsync(Arg.Any<string>()).Returns(false);

        await BuildSut().BuildAsync(new DashboardQueryDto());

        // Hesaplama fonksiyonu hiç çağrılmadıysa repository'den queryable bile istenmez.
        await _taskRepo.DidNotReceive().GetQueryableAsync();
        await _invoiceRepo.DidNotReceive().GetQueryableAsync();
        await _projectRepo.DidNotReceive().GetQueryableAsync();
        _executer.ReceivedCalls().ShouldBeEmpty();
    }

    [Fact]
    public async Task Her_istatistik_bir_izin_adi_bildirir()
    {
        _permissionChecker.IsGrantedAsync(Arg.Any<string>()).Returns(false);

        var stats = await BuildSut().BuildAsync(new DashboardQueryDto());

        stats.ShouldAllBe(s => !string.IsNullOrWhiteSpace(s.RequiredPermission));
        stats.ShouldAllBe(s => !string.IsNullOrWhiteSpace(s.Key));

        // Bütçe kutucukları ViewBudget'a bağlı olmalı — özel yetki, Projects.Default değil.
        stats.Single(s => s.Key == "budget-usage")
            .RequiredPermission.ShouldBe(PlatformPermissions.Projects.ViewBudget);
    }
}
