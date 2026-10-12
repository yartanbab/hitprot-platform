using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Customers;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.ChoiceSources;
using Apya.Platform.Invoices;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Proje, cari ve görev adları ilgili görüntüleme izni olmayan kullanıcıya verilmez (ürün kararı,
/// 2026-10-13). Fatura ekranının seçim listeleri yalnız fatura iznine, form seçenek kaynakları yalnız
/// oturuma bakıyordu.
///
/// <para>Barındırıcı proje, cari ve görev görme izinlerini reddedecek şekilde kurulur. İzinli
/// kullanıcının listeyi almaya devam ettiği <c>FormChoiceSources_Tests</c> ve
/// <c>FinancePanels_Tests</c>'te ölçülüyor.</para>
/// </summary>
public class NameLookupPermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var deny = new DenyPermissionsAuthorizationService(
            PlatformPermissions.Projects.Default,
            PlatformPermissions.Customers.Default,
            PlatformPermissions.Tasks.Default);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    private IDisposable SignedIn() => GetRequiredService<ICurrentPrincipalAccessor>().Change(
        new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new Claim(AbpClaimTypes.UserName, "ad-goremeyen")
        }, "Test")));

    private async Task<Guid> SeedAsync()
    {
        var projectId = Guid.NewGuid();
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
            new Project(projectId, null, null, "Sızmaması gereken proje", "NLP-" + Guid.NewGuid().ToString("N")[..8], ""),
            autoSave: true);
        await GetRequiredService<IRepository<Customer, Guid>>().InsertAsync(
            new Customer(Guid.NewGuid(), "Sızmaması gereken cari"), autoSave: true);
        await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(
            new TaskItem(Guid.NewGuid(), "Sızmaması gereken görev", projectId: projectId, now: DateTime.Now),
            autoSave: true);
        await uow.CompleteAsync();
        return projectId;
    }

    [Fact]
    public async Task Fatura_secim_listeleri_izinsiz_ad_vermez()
    {
        await SeedAsync();
        var invoices = GetRequiredService<IInvoiceAppService>();

        using (SignedIn())
        {
            (await invoices.GetProjectLookupAsync()).Items.ShouldBeEmpty();
            (await invoices.GetCustomerLookupAsync()).Items.ShouldBeEmpty();
        }
    }

    [Fact]
    public async Task Form_secenek_kaynaklari_izinsiz_proje_ve_gorev_adi_vermez()
    {
        var projectId = await SeedAsync();
        var sources = GetRequiredService<IEnumerable<IFormChoiceSource>>().ToList();

        using (SignedIn())
        {
            var projects = sources.Single(s => s.Key == FormChoiceSources.TenantProjects);
            var tasks = sources.Single(s => s.Key == FormChoiceSources.TenantProjectTasks);

            (await projects.GetAsync(parentValue: null)).ShouldBeEmpty();
            (await tasks.GetAsync(projectId.ToString())).ShouldBeEmpty();
        }
    }
}
