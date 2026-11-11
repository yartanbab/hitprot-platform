using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Apya.Platform.Web.Components.TenantBadge;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using NSubstitute;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.Tenants;

/// <summary>
/// Üst çubuktaki müşteri rozeti ve açılır listesi kurumun resmî unvanını gösterir. Kiracı adı
/// unvandan türetilmiş bir anahtardır; canlıda listede "erkam-eg-t-m-gencl-k-ve-kultur-derneg"
/// gibi adlar görünüyordu.
/// </summary>
public class TenantBadgeViewComponent_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Listede_unvan_varsa_unvan_yoksa_kiraci_adi_gorunur()
    {
        var unvanli = await CreateTenantAsync("unvanli-" + Suffix(), "Erkam Eğitim Gençlik ve Kültür Derneği");
        var unvansiz = await CreateTenantAsync("UNVANSIZ-" + Suffix(), legalName: null);

        var model = await InvokeAsync();

        model.CanSwitch.ShouldBeTrue();
        model.Tenants.Single(t => t.Id == unvanli.Id).Name.ShouldBe("Erkam Eğitim Gençlik ve Kültür Derneği");
        model.Tenants.Single(t => t.Id == unvansiz.Id).Name.ShouldBe(unvansiz.Name);
    }

    [Fact]
    public async Task Rozette_gecerli_kurumun_unvani_gorunur()
    {
        var tenant = await CreateTenantAsync("rozet-" + Suffix(), "Hüdayim Derneği");

        using (GetRequiredService<ICurrentTenant>().Change(tenant.Id, tenant.Name))
        {
            (await InvokeAsync()).TenantName.ShouldBe("Hüdayim Derneği");
        }
    }

    [Fact]
    public async Task Host_baglaminda_rozet_Host_der()
    {
        (await InvokeAsync()).TenantName.ShouldBe("Host");
    }

    /// <summary>Sayfaya basılan açılır listede de unvan görünür (bileşen + görünüm birlikte).</summary>
    [Fact]
    public async Task Sayfadaki_musteri_listesi_unvani_basar()
    {
        var tenant = await CreateTenantAsync("sayfa-" + Suffix(), "İstanbul İzcileri Derneği");

        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/Tasks"));

        var names = doc.DocumentNode.SelectNodes("//span[@class='apya-tenant-switch-item-name']")
            .ShouldNotBeNull()
            .Select(n => WebUtility.HtmlDecode(n.InnerText).Trim())
            .ToList();

        names.ShouldContain("İstanbul İzcileri Derneği");
        names.ShouldNotContain(tenant.Name);
    }

    private async Task<TenantBadgeViewModel> InvokeAsync()
    {
        var permissions = Substitute.For<IPermissionChecker>();
        permissions.IsGrantedAsync(Arg.Any<string>()).Returns(true);

        var component = new TenantBadgeViewComponent(
            GetRequiredService<ICurrentTenant>(),
            Substitute.For<ICurrentUser>(),
            GetRequiredService<ITenantRepository>(),
            permissions,
            GetRequiredService<TenantDisplayNameResolver>())
        {
            ViewComponentContext = new ViewComponentContext
            {
                // ViewComponentContext.ViewData salt okunur; ViewContext'ten türetilir.
                ViewContext = new Microsoft.AspNetCore.Mvc.Rendering.ViewContext
                {
                    HttpContext = new DefaultHttpContext(),
                    ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                }
            }
        };

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var result = await component.InvokeAsync();
        await uow.CompleteAsync();

        return result.ShouldBeOfType<ViewViewComponentResult>().ViewData!.Model.ShouldBeOfType<TenantBadgeViewModel>();
    }

    private async Task<Tenant> CreateTenantAsync(string name, string? legalName)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);

        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        if (legalName != null)
        {
            await GetRequiredService<IRepository<TenantProfile, Guid>>().InsertAsync(
                new TenantProfile(Guid.NewGuid(), tenant.Id, CompanyType.Association, string.Empty, string.Empty)
                {
                    LegalName = legalName
                },
                autoSave: true);
        }

        await uow.CompleteAsync();
        return tenant;
    }

    private static string Suffix() => Guid.NewGuid().ToString("N")[..8];
}
