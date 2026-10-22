using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// QA 10-22 hibe denetimi (G5) · Öneriyi kapatma, takibe alma ve takip notu FİRMANIN ortak kaydını değiştirir
/// (öneri firmanın tamamı için kapanır, host da durumu görür) ama yalnız görüntüleme iznine bakıyordu: salt
/// görüntüleyen bir kullanıcı danışmanın önerisini firma adına kapatabiliyordu. Artık yazma izni şart
/// (<c>GrantWritePermission</c>: host'ta Grants.Edit, kiracıda Grants.ManageApplications).
///
/// <para>Barındırıcı host'un yazma iznini (Grants.Edit) reddeder; uçlar kayda bakmadan önce izni sormalı.</para>
/// </summary>
public class GrantFirmWriteGate_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.Grants.Edit);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    [Fact]
    public async Task Yazma_izni_olmadan_oneri_ve_takip_degistirilemez()
    {
        var recommendations = GetRequiredService<IGrantRecommendationAppService>();
        var callId = Guid.NewGuid();

        await Should.ThrowAsync<AbpAuthorizationException>(() => recommendations.DismissRecommendationAsync(callId));
        await Should.ThrowAsync<AbpAuthorizationException>(() => recommendations.ToggleBookmarkAsync(callId));
        await Should.ThrowAsync<AbpAuthorizationException>(() => recommendations.SetBookmarkNoteAsync(
            new SetGrantBookmarkNoteInput { GrantCallId = callId, Note = "not" }));
    }
}
