using System;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Belge eşleştirme uçları gider satırlarını (başlık, tutar, tedarikçi) döndürür ama yalnız belge
/// görme iznini istiyordu. Ürün kararı (2026-10-12): gider görme izni (Expenses.Default) şart.
///
/// <para>Barındırıcı yalnız gider görme iznini reddedecek şekilde kurulur.</para>
/// </summary>
public class DocumentMatchingExpensePermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var denyExpenses = new DenyPermissionsAuthorizationService(PlatformPermissions.Expenses.Default);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(denyExpenses));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(denyExpenses));
    }

    [Fact]
    public async Task Gider_gorme_izni_olmayan_eslestirme_uclarini_okuyamaz()
    {
        var matching = GetRequiredService<IDocumentMatchingAppService>();
        var anyId = Guid.NewGuid();

        await Should.ThrowAsync<AbpAuthorizationException>(() => matching.GetBoardAsync(anyId));
        await Should.ThrowAsync<AbpAuthorizationException>(() => matching.GetCandidatesAsync(anyId));
        await Should.ThrowAsync<AbpAuthorizationException>(() => matching.GetMatchesAsync(anyId));
    }
}
