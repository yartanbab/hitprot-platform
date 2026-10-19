using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Drafts;

/// <summary>
/// N-09 · Belgeden görev çıkarma bitince işi BAŞLATANA kalıcı bildirim (zil, balon, push). Sonuç yalnız açık
/// sayfaya SignalR'la gidiyordu: kullanıcı sayfadan ayrıldıysa ya da iş 60 sn'yi aştıysa (sayfa "zaman aşımı"
/// deyip vazgeçiyordu) taslaklar sessizce bekliyordu.
///
/// <para>Bir parti için ÖMÜRDE BİR KEZ: iş hata verince arka plan kuyruğu yeniden dener ve her denemede
/// "başarısız" yayınlanır; kullanıcı aynı hatayı tekrar tekrar almasın.</para>
/// </summary>
public class AiDraftBatchNotificationHandler : ILocalEventHandler<DraftBatchStatusChangedEto>, ITransientDependency
{
    private readonly NotificationManager _notificationManager;
    private readonly ICurrentTenant _currentTenant;

    public AiDraftBatchNotificationHandler(NotificationManager notificationManager, ICurrentTenant currentTenant)
    {
        _notificationManager = notificationManager;
        _currentTenant = currentTenant;
    }

    public async Task HandleEventAsync(DraftBatchStatusChangedEto eventData)
    {
        if (eventData.UserId is not { } userId)
        {
            return;
        }

        NotificationType type;
        string title;
        string body;
        switch (eventData.NewStatus)
        {
            case DraftBatchStatus.ReadyForReview:
                type = NotificationType.AiDraftsReady;
                title = "Görev taslakları hazır";
                body = $"Yapay zekâ belgeden {eventData.TotalItems} görev taslağı çıkardı; onayınızı bekliyor.";
                break;
            case DraftBatchStatus.Failed:
            case DraftBatchStatus.Abandoned:
                type = NotificationType.AiDraftsFailed;
                title = "Görev taslağı çıkarılamadı";
                body = eventData.ErrorMessage ?? "Belgeden görev çıkarılamadı.";
                break;
            default:
                return;
        }

        using (_currentTenant.Change(eventData.TenantId))
        {
            await _notificationManager.PublishOnceAsync(
                userId, $"{(int)type}:DraftBatch:{eventData.BatchId}", title, body, type,
                entityType: "DraftBatch", entityId: eventData.BatchId);
        }
    }
}
