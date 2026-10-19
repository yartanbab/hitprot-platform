using System;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>P-09 · Ekibe eklenen kişiye "Projeye eklendiniz" bildirimi gider; bağlantı projedir.</summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectMemberAddedNotification_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public async Task Ekibe_eklenen_kisiye_bildirim_gider()
    {
        var suffix = Guid.NewGuid().ToString("N")[..6];
        var userId = Guid.NewGuid();
        var projectId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(
                new IdentityUser(userId, "ekip-" + suffix, $"ekip-{suffix}@apya.test"), autoSave: true);
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Ekip Projesi " + suffix, "EK-" + suffix[..4], "açıklama"), autoSave: true);
        });

        await WithUnitOfWorkAsync(() => GetRequiredService<IProjectMemberAppService>().AddAsync(new AddProjectMemberDto
        {
            ProjectId = projectId,
            UserId = userId,
            Role = ProjectMemberRole.Member
        }));

        var rows = await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<Notification, Guid>>()
            .GetListAsync(n => n.UserId == userId && n.Type == NotificationType.ProjectMemberAdded));
        rows.Count.ShouldBe(1);
        rows[0].EntityId.ShouldBe(projectId);
        rows[0].Body.ShouldContain("Ekip Projesi " + suffix);
    }
}
