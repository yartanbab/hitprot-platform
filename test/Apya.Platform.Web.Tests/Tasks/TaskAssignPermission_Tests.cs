using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Security.Claims;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// QA 10-22 · Tasks.Assign yalnız "Ata" ucunda isteniyordu; görev oluşturma ve düzenleme formu sorumlu alanını
/// izinsiz kabul ediyordu (şablondan oluşturma da). Atama izni olmayan çalışan formdan başkasını atayabiliyor, o kişiye "Görev atandı"
/// bildirimi gidiyordu. Artık başkasını atamak Assign ister; kişi kendini atayabilir.
///
/// <para>Barındırıcı yalnız Tasks.Assign iznini reddeder.</para>
/// </summary>
public class TaskAssignPermission_Tests : PlatformWebTestBase
{
    private static readonly Guid Me = Guid.NewGuid();

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.Tasks.Assign);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    private IDisposable AsMe() => GetRequiredService<ICurrentPrincipalAccessor>().Change(new ClaimsPrincipal(
        new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, Me.ToString()),
            new Claim(AbpClaimTypes.UserName, "atama-izni-yok")
        }, "Test")));

    private async Task<(Guid ProjectId, Guid OtherUserId, Guid MyTaskId)> SeedAsync()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var code = "AS-" + Guid.NewGuid().ToString("N")[..6];
        var users = GetRequiredService<IIdentityUserRepository>();
        if (await users.FindAsync(Me) == null)
        {
            await users.InsertAsync(new IdentityUser(Me, "ben-" + code.ToLowerInvariant(), code.ToLowerInvariant() + "@ben.test"), autoSave: true);
        }
        var other = new IdentityUser(Guid.NewGuid(), "baska-" + code.ToLowerInvariant(), code.ToLowerInvariant() + "@baska.test");
        await users.InsertAsync(other, autoSave: true);

        var projectId = Guid.NewGuid();
        await GetRequiredService<IRepository<Project, Guid>>()
            .InsertAsync(new Project(projectId, null, null, "Atama " + code, code, "test"), autoSave: true);

        var task = new TaskItem(Guid.NewGuid(), "Benim görevim", projectId, startDate: DateTime.Today);
        ObjectHelper.TrySetProperty(task, t => t.CreatorId, () => Me);
        await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(task, autoSave: true);

        await uow.CompleteAsync();
        return (projectId, other.Id, task.Id);
    }

    [Fact]
    public async Task Atama_izni_olmadan_baskasini_atayarak_gorev_olusturulamaz_kendini_atayabilir()
    {
        var (projectId, otherId, _) = await SeedAsync();
        var tasks = GetRequiredService<ITaskAppService>();

        using (AsMe())
        {
            await Should.ThrowAsync<AbpAuthorizationException>(() => tasks.CreateAsync(new CreateUpdateTaskDto
            {
                Title = "Başkasına iş", ProjectId = projectId, AssigneeId = otherId, StartDate = DateTime.Today
            }));

            var own = await tasks.CreateAsync(new CreateUpdateTaskDto
            {
                Title = "Kendime iş", ProjectId = projectId, AssigneeId = Me, StartDate = DateTime.Today
            });
            own.AssigneeId.ShouldBe(Me);
        }
    }

    [Fact]
    public async Task Atama_izni_olmadan_sablondan_baskasina_gorev_acilamaz()
    {
        var (_, otherId, _) = await SeedAsync();

        using (AsMe())
        {
            // İzin, şablon aranmadan önce sorulur: şablon kimliği uydurma olsa da yanıt yetki reddidir.
            await Should.ThrowAsync<AbpAuthorizationException>(() =>
                GetRequiredService<ITaskTemplateAppService>().ApplyAsync(new ApplyTaskTemplateDto
                {
                    TemplateId = Guid.NewGuid(), AssigneeId = otherId, StartDate = DateTime.Today
                }));
        }
    }

    [Fact]
    public async Task Atama_izni_olmadan_gorev_formundan_baskasi_atanamaz()
    {
        var (projectId, otherId, myTaskId) = await SeedAsync();

        using (AsMe())
        {
            await Should.ThrowAsync<AbpAuthorizationException>(() =>
                GetRequiredService<ITaskAppService>().UpdateAsync(myTaskId, new CreateUpdateTaskDto
                {
                    Title = "Benim görevim", ProjectId = projectId, AssigneeId = otherId, StartDate = DateTime.Today
                }));
        }
    }
}
