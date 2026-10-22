using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// QA 10-22 hibe denetimi (G3) · Uygulama ekranı projenin kalem bazlı harcamasını ve kalemsiz gider toplamını
/// yalnız hibe izniyle gösteriyordu; proje bütçe ekranı ise Projects.ViewBudget ister. Bütçe görme izni
/// olmayan kullanıcıya bölüm boş gelir ve <c>BudgetHidden</c> işaretlenir (ekran "bütçe yok" demez).
///
/// <para>Barındırıcı yalnız Projects.ViewBudget iznini reddeder.</para>
/// </summary>
public class GrantImplementationBudgetMask_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.Projects.ViewBudget);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    [Fact]
    public async Task Butce_Gorme_Izni_Yoksa_Gerceklesme_Gizlenir()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var currentTenant = GetRequiredService<ICurrentTenant>();
        Guid tenantId, applicationId;

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await GetRequiredService<ITenantManager>().CreateAsync("Maske-" + Guid.NewGuid().ToString("N")[..6]);
            await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var call = (await GetRequiredService<IRepository<GrantCall, Guid>>()
                .GetListAsync(c => c.Status == GrantCallStatus.Acik))[0];
            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            application.AdvanceStage(GrantApplicationStage.Odeme, 1_000_000m);

            using (currentTenant.Change(tenantId))
            {
                var project = new Apya.Platform.Projects.Project(
                    Guid.NewGuid(), tenantId, null, "Maskeli proje", "PRJ-2026-" + Random.Shared.Next(100, 999), string.Empty);
                await GetRequiredService<IRepository<Apya.Platform.Projects.Project, Guid>>().InsertAsync(project, autoSave: true);

                var line = new Apya.Platform.ProjectBudgets.ProjectBudgetLine(
                    Guid.NewGuid(), tenantId, project.Id, "Personnel", "Personel", 500_000m, 500_000m);
                await GetRequiredService<IRepository<Apya.Platform.ProjectBudgets.ProjectBudgetLine, Guid>>()
                    .InsertAsync(line, autoSave: true);

                var cash = new Apya.Platform.CashAccounts.CashAccount(Guid.NewGuid(), "Banka", tenantId: tenantId);
                await GetRequiredService<IRepository<Apya.Platform.CashAccounts.CashAccount, Guid>>().InsertAsync(cash, autoSave: true);
                await GetRequiredService<IRepository<Apya.Platform.Expenses.Expense, Guid>>().InsertAsync(
                    new Apya.Platform.Expenses.Expense(Guid.NewGuid(), "Kargo", 2_500m, cash.Id, DateTime.Today,
                        projectId: project.Id, tenantId: tenantId), autoSave: true);

                application.LinkToProject(project.Id);
            }

            await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);
            applicationId = application.Id;
            await uow.CompleteAsync();
        }

        var dto = await GetRequiredService<IGrantImplementationAppService>().GetAsync(applicationId);

        dto.HasProject.ShouldBeTrue();
        dto.BudgetHidden.ShouldBeTrue();
        dto.Budget.ShouldBeEmpty();
        dto.UnassignedExpenseCount.ShouldBe(0);
        dto.UnassignedSpentAmount.ShouldBe(0m);
    }
}
