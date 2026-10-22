using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages.Grants;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// QA 10-22 hibe denetimi · Yazma ucu yazma izni ister:
/// <list type="bullet">
/// <item>"Elle hibe gir" yeni program + çağrı oluşturur → Grants.Create (yalnız Edit yetiyordu).</item>
/// <item>Kaynak ve aşama şablonu silme → Grants.Delete.</item>
/// <item>Talebi müşteriye dönüştürmek yeni kiracı açar → kiracı yönetimi Tenants.Create.</item>
/// <item>İlgi bildirimi bir firmanındır: host bağlamında kiracısız talep açılmaz.</item>
/// </list>
/// Test barındırıcısı her izne "evet" dediği için öznitelikler yansımayla kilitlenir.
/// </summary>
public class GrantPermissionGates_Tests : PlatformWebTestBase
{
    [Theory]
    [InlineData(typeof(GrantDraftAppService), nameof(GrantDraftAppService.CreateDraftAsync), PlatformPermissions.Grants.Create)]
    [InlineData(typeof(GrantSourceAppService), nameof(GrantSourceAppService.DeleteAsync), PlatformPermissions.Grants.Delete)]
    [InlineData(typeof(GrantStageTemplateAppService), nameof(GrantStageTemplateAppService.DeleteAsync), PlatformPermissions.Grants.Delete)]
    [InlineData(typeof(GrantLeadAppService), nameof(GrantLeadAppService.ConvertToTenantAsync), TenantManagementPermissions.Tenants.Create)]
    public void Yazma_ucu_metot_duzeyi_izin_ister(Type service, string method, string policy)
    {
        var info = service.GetMethod(method, BindingFlags.Public | BindingFlags.Instance);
        info.ShouldNotBeNull($"{method} bulunamadı");

        info.GetCustomAttributes<AuthorizeAttribute>(inherit: true)
            .Select(a => a.Policy)
            .ShouldContain(policy, $"{service.Name}.{method} [Authorize({policy})] taşımıyor");
    }

    [Fact]
    public void Elle_hibe_gir_sayfasi_olusturma_izni_ister()
        => typeof(ImportModel).GetCustomAttributes<AuthorizeAttribute>(inherit: true)
            .Select(a => a.Policy)
            .ShouldContain(PlatformPermissions.Grants.Create);

    [Fact]
    public async Task Ilgi_host_baglaminda_bildirilemez()
    {
        // Web test barındırıcısı host bağlamında koşar.
        await Should.ThrowAsync<AbpAuthorizationException>(() =>
            GetRequiredService<IGrantInterestAppService>().ExpressAsync(new ExpressGrantInterestInput
            {
                GrantCallId = Guid.NewGuid(), Note = "Fikir", ProblemStatement = "Sorun"
            }));
    }
}
