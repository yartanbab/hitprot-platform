using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Macros;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Macros;

/// <summary>
/// "Projelerim" proje görme iznine bağlı: izni olmayan kullanıcı, üyesi olduğu projeyi de görmez —
/// liste boş döner (hata değil; ekranın geri kalanı çalışmaya devam eder).
/// Barındırıcı yalnız <c>Projects.Default</c>'u reddedecek şekilde kurulur.
/// </summary>
public class MacroScreenPermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var denyProjects = new DenyPermissionsAuthorizationService(PlatformPermissions.Projects.Default);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(denyProjects));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(denyProjects));
    }

    [Fact]
    public async Task Proje_gorme_izni_olmayan_uyesi_oldugu_projeyi_de_gormez()
    {
        var userId = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var project = new Project(Guid.NewGuid(), null, null, "İzinsiz üyelik", "MKR-IZN", "Makro izin testi");
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);
            await GetRequiredService<IRepository<ProjectMember, Guid>>().InsertAsync(
                new ProjectMember(Guid.NewGuid(), project.Id, userId, ProjectMemberRole.Member, null), autoSave: true);
            await uow.CompleteAsync();
        }

        var principal = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, userId.ToString()),
            new(AbpClaimTypes.UserName, "izinsiz")
        }, "Test"));

        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(principal))
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var result = await GetRequiredService<IMacroScreenAppService>().GetMyProjectsAsync();

            result.TotalCount.ShouldBe(0);
            result.Items.ShouldBeEmpty();
            await uow.CompleteAsync();
        }
    }
}
