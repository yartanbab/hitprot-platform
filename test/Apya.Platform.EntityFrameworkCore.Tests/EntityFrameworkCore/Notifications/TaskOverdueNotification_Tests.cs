using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// 🔴 NTF-03 · SÖZLEŞME: geciken görev artık sessiz değil, ama tekrar da etmiyor.
///
/// <para><see cref="TaskDeadlineWorker"/> saatte bir koşar ve gecikme koşulu
/// bir kez doğru olduktan sonra kalıcı olarak doğru kalır. Normal
/// <c>PublishAsync</c> kullanılsaydı kullanıcı aynı gecikmeyi her saat yeniden
/// alırdı. Tekillik anahtarı GÖREV + VADE'dir: vade ertelenip yeniden geçilirse
/// yeni bir uyarı üretilir — istenen davranış budur.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskOverdueNotification_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ILocalEventBus _eventBus;
    private readonly IRepository<Notification, Guid> _notifications;

    public TaskOverdueNotification_Tests()
    {
        _eventBus      = GetRequiredService<ILocalEventBus>();
        _notifications = GetRequiredService<IRepository<Notification, Guid>>();
    }

    private Task PublishAsync(Guid taskId, Guid assigneeId, DateTime dueDate, int daysOverdue = 3)
        => WithUnitOfWorkAsync(() => _eventBus.PublishAsync(new TaskOverdueEto
        {
            TaskId = taskId,
            TaskTitle = "Sözleşme taslağını gönder",
            AssigneeId = assigneeId,
            DueDate = dueDate,
            DaysOverdue = daysOverdue
        }));

    [Fact]
    public async Task Ayni_Vade_Icin_Tek_Satir_Uretilir()
    {
        var taskId  = Guid.NewGuid();
        var userId  = Guid.NewGuid();
        var dueDate = new DateTime(2026, 9, 18, 17, 0, 0, DateTimeKind.Utc);

        await PublishAsync(taskId, userId, dueDate);
        await PublishAsync(taskId, userId, dueDate);
        await PublishAsync(taskId, userId, dueDate);

        var rows = await _notifications.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(1, "worker saatte bir koşuyor; aynı gecikme tekrar bildirilmemeli");
        rows[0].Type.ShouldBe(NotificationType.TaskOverdue);
        rows[0].EntityId.ShouldBe(taskId);
        rows[0].Body.ShouldContain("3");
    }

    [Fact]
    public async Task Vade_Ertelenip_Yeniden_Gecilirse_Ikinci_Uyari_Cikar()
    {
        var taskId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        await PublishAsync(taskId, userId, new DateTime(2026, 9, 18, 17, 0, 0, DateTimeKind.Utc));
        await PublishAsync(taskId, userId, new DateTime(2026, 10, 20, 17, 0, 0, DateTimeKind.Utc));

        var rows = await _notifications.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(2, "yeni vade ayrı bir gecikmedir; hafıza vadeyi de kapsamalı");
    }

    /// <summary>
    /// Atanmamış görev için alıcı yoktur. Guid.Empty geçirilseydi var olmayan bir
    /// kullanıcıya satır açılır ve kimsenin görmediği bildirim tabloyu şişirirdi.
    /// </summary>
    [Fact]
    public async Task Atanmamis_Gorev_Icin_Satir_Acilmaz()
    {
        var taskId = Guid.NewGuid();

        await PublishAsync(taskId, Guid.Empty, new DateTime(2026, 9, 18, 17, 0, 0, DateTimeKind.Utc));

        var rows = await _notifications.GetListAsync(n => n.EntityId == taskId);

        rows.ShouldBeEmpty();
    }
}
