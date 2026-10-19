using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Security.Claims;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// QA-23 · Kullanıcı kararı (2026-10-19): Geçmiş sekmesi ABP denetim kaydından doldurulur. Görev değişiklikleri
/// AbpEntityChanges'e zaten yazılıyordu ama hiçbir uç dışarı vermiyordu; sekme "değişiklik günlüğü henüz
/// yayınlanmadı" diyordu. <c>GetHistoryAsync</c> kim/ne zaman/eski → yeni değeri okunur biçimde döndürür.
/// </summary>
public class TaskHistory_Tests : PlatformWebTestBase
{
    private async Task<(Guid TaskId, Guid AssigneeId)> SeedAsync()
    {
        var code = "QA23-" + Guid.NewGuid().ToString("N")[..6];
        var taskId = Guid.NewGuid();
        var assignee = new IdentityUser(Guid.NewGuid(), "qa23-" + code.ToLowerInvariant(), code.ToLowerInvariant() + "@test.local")
        {
            Name = "Selin",
            Surname = "Ak"
        };

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var projectId = Guid.NewGuid();
        await GetRequiredService<IRepository<Project, Guid>>()
            .InsertAsync(new Project(projectId, null, null, "Geçmiş " + code, code, "test"), autoSave: true);
        await GetRequiredService<IRepository<TaskItem, Guid>>()
            .InsertAsync(new TaskItem(taskId, "Geçmiş görevi", projectId: projectId, startDate: DateTime.Today), autoSave: true);
        await GetRequiredService<IIdentityUserRepository>().InsertAsync(assignee, autoSave: true);
        await uow.CompleteAsync();
        return (taskId, assignee.Id);
    }

    /// <summary>Değişikliği yapan kişi olarak oturum açıp denetim kapsamı içinde çalıştırır.</summary>
    private async Task AsUserAsync(IdentityUser user, Func<Task> action)
    {
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, user.Id.ToString()),
            new Claim(AbpClaimTypes.UserName, user.UserName)
        }, "Test"));

        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(principal))
        using (var scope = GetRequiredService<IAuditingManager>().BeginScope())
        {
            await action();
            await scope.SaveAsync();
        }
    }

    [Fact]
    public async Task Durum_Ve_Sorumlu_Degisikligi_Kim_Ve_Eski_Yeni_Degerle_Gecmiste()
    {
        var (taskId, assigneeId) = await SeedAsync();
        var tasks = GetRequiredService<ITaskAppService>();
        var assignee = await GetRequiredService<IIdentityUserRepository>().GetAsync(assigneeId);

        await AsUserAsync(assignee, () => tasks.UpdateStatusAsync(taskId, TaskStatus.InProgress));
        await AsUserAsync(assignee, async () =>
        {
            using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
            var repo = GetRequiredService<IRepository<TaskItem, Guid>>();
            var task = await repo.GetAsync(taskId);
            task.AssignTo(assigneeId);
            await repo.UpdateAsync(task, autoSave: true);
            await uow.CompleteAsync();
        });

        var history = await tasks.GetHistoryAsync(taskId);

        var status = history.SelectMany(e => e.Changes).Single(c => c.Field == "Durum");
        status.OldValue.ShouldBe("Yapılacak");
        status.NewValue.ShouldBe("Sürüyor");

        var owner = history.SelectMany(e => e.Changes).Single(c => c.Field == "Sorumlu");
        owner.OldValue.ShouldBeNull();
        owner.NewValue.ShouldBe("Selin Ak", "kimlik değil kişi adı gösterilir");

        history.ShouldAllBe(e => e.ChangedBy == "Selin Ak");
        history.First().ChangeTime.ShouldBeGreaterThanOrEqualTo(history.Last().ChangeTime, "en yeni önce");
        history.SelectMany(e => e.Changes).ShouldNotContain(c => c.Field == "ConcurrencyStamp" || c.Field == "LastModificationTime",
            "teknik alanlar gösterilmez");
    }

    [Fact]
    public async Task Degisikligi_Olmayan_Gorevin_Gecmisi_Bos()
    {
        var (taskId, _) = await SeedAsync();

        (await GetRequiredService<ITaskAppService>().GetHistoryAsync(taskId)).ShouldBeEmpty();
    }
}
