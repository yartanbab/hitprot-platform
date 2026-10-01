using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Dashboard;
using Apya.Platform.Dashboard.Dtos;
using Apya.Platform.Expenses;
using Apya.Platform.Grants;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using NSubstitute;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Xunit;

namespace Apya.Platform.Tests.Application.Dashboard;

/// <summary>
/// Genel Bakış finans kartlarının KİLİT SÖZLEŞMESİ (SHL-15, ROL-06): yetki yoksa "boş" değil
/// kilitli sonuç döner ve sorgu HİÇ atılmaz — boş kuyruk / hareketsiz dönem ile "görme yetkiniz
/// yok" ayırt edilsin, kilitli kart sayı sızdırmasın.
/// <para>
/// Entegrasyon testleri <c>AddAlwaysAllowAuthorization</c> altında koştuğu için kilit yolunu hiç
/// göremez; burada izin kümesi <see cref="IAbpAuthorizationService"/> yerine geçen sahteyle
/// verilir (<see cref="DashboardStatisticsProvider_Tests"/> ile aynı gerekçe).
/// </para>
/// </summary>
public class DashboardFinanceCardLock_Tests
{
    private readonly IRepository<Invoice, Guid> _invoiceRepo = Substitute.For<IRepository<Invoice, Guid>>();
    private readonly IRepository<IncomeEntry, Guid> _incomeRepo = Substitute.For<IRepository<IncomeEntry, Guid>>();
    private readonly IRepository<Expense, Guid> _expenseRepo = Substitute.For<IRepository<Expense, Guid>>();
    private readonly IRepository<Project, Guid> _projectRepo = Substitute.For<IRepository<Project, Guid>>();
    private readonly IRepository<IdentityUser, Guid> _userRepo = Substitute.For<IRepository<IdentityUser, Guid>>();

    private DashboardAppService BuildSut(params string[] granted)
    {
        // ABP'nin IsGrantedAsync uzantısı hizmeti IAbpAuthorizationService'e çevirip
        // AuthorizeAsync(principal, null, policyName) çağırır.
        var authorization = Substitute.For<IAbpAuthorizationService>();
        authorization
            .AuthorizeAsync(Arg.Any<ClaimsPrincipal>(), Arg.Any<object?>(), Arg.Any<string>())
            .Returns(call => Task.FromResult(granted.Contains(call.ArgAt<string>(2))
                ? AuthorizationResult.Success()
                : AuthorizationResult.Failed()));

        var services = new ServiceCollection();
        services.AddSingleton<IAuthorizationService>(authorization);

        var sut = new DashboardAppService(
            Substitute.For<IRepository<TaskItem, Guid>>(),
            Substitute.For<IRepository<TaskDependency, Guid>>(),
            Substitute.For<IRepository<TaskTimeLog, Guid>>(),
            _projectRepo,
            _invoiceRepo,
            _expenseRepo,
            _incomeRepo,
            Substitute.For<IRepository<GrantMilestone, Guid>>(),
            Substitute.For<IRepository<GrantDisbursementTranche, Guid>>(),
            Substitute.For<IRepository<DashboardLayout, Guid>>(),
            _userRepo,
            // İstatistik sağlayıcısı bu iki metotta kullanılmıyor. Bilinçli null: ileride bu
            // yollara istatistik eklenirse test sessizce geçmesin, NRE ile düşsün.
            null!,
            Options.Create(new DashboardOptions()));

        sut.LazyServiceProvider = new AbpLazyServiceProvider(services.BuildServiceProvider());
        return sut;
    }

    [Fact]
    public async Task Fatura_izni_yoksa_onay_kuyrugu_kilitli_ve_sorgusuz_doner()
    {
        var result = await BuildSut(PlatformPermissions.Incomes.Default, PlatformPermissions.Expenses.Default)
            .GetPendingApprovalsAsync();

        result.Locked.ShouldBeTrue();
        result.Items.ShouldBeEmpty();
        await _invoiceRepo.DidNotReceive().GetQueryableAsync();
        await _userRepo.DidNotReceive().GetQueryableAsync();
    }

    /// <summary>
    /// Kart net = gelir − gider gösterir: iki izinden biri eksikse eksik seri 0 sayılıp net
    /// uydurulurdu → kilit. Para birimi bile çözülmez (proje sorgusu da yok).
    /// </summary>
    [Theory]
    [InlineData(false, false)]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public async Task Gelir_ya_da_gider_izni_eksikse_kart_kilitli_ve_sorgusuz_doner(bool canSeeIncome, bool canSeeExpense)
    {
        var granted = new[]
        {
            canSeeIncome ? PlatformPermissions.Incomes.Default : null,
            canSeeExpense ? PlatformPermissions.Expenses.Default : null,
            PlatformPermissions.Invoices.Default
        }.Where(p => p != null).Cast<string>().ToArray();

        var result = await BuildSut(granted).GetIncomeExpenseAsync(new DashboardQueryDto());

        result.Locked.ShouldBeTrue();
        result.Points.ShouldBeEmpty();
        await _incomeRepo.DidNotReceive().GetQueryableAsync();
        await _expenseRepo.DidNotReceive().GetQueryableAsync();
        await _projectRepo.DidNotReceive().GetQueryableAsync();
    }
}
