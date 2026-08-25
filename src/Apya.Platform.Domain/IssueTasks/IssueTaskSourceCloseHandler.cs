using System;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Settings;
using Apya.Platform.Telemetry;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;
using Volo.Abp.Timing;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Geri bağ: görev "Tamamlandı"ya geçtiğinde ondan doğduğu kaynağı da kapatır —
/// geri bildirim Completed olur (gönderene bildirim gider), istemci hatası çözüldü
/// işaretlenir. Döngü böylece kullanıcı tarafında da kapanır.
/// <para>
/// Kapanış bir kez yapılır (<see cref="IssueTaskLink.SourceClosedAt"/>): görev Done'dan
/// çıkıp yeniden Done'a alınırsa kullanıcıya ikinci kez "tamamlandı" bildirimi gitmez.
/// </para>
/// </summary>
public class IssueTaskSourceCloseHandler :
    ILocalEventHandler<Apya.Platform.Tasks.TaskStatusChangedEto>,
    ITransientDependency
{
    private readonly IssueTaskManager _issueTaskManager;
    private readonly IRepository<IssueTaskLink, Guid> _linkRepository;
    private readonly IRepository<Feedback, Guid> _feedbackRepository;
    private readonly IRepository<ClientError, Guid> _clientErrorRepository;
    private readonly FeedbackManager _feedbackManager;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;
    private readonly ISettingProvider _settingProvider;
    private readonly IClock _clock;

    public ILogger<IssueTaskSourceCloseHandler> Logger { get; set; }

    public IssueTaskSourceCloseHandler(
        IssueTaskManager issueTaskManager,
        IRepository<IssueTaskLink, Guid> linkRepository,
        IRepository<Feedback, Guid> feedbackRepository,
        IRepository<ClientError, Guid> clientErrorRepository,
        FeedbackManager feedbackManager,
        IDataFilter<IMultiTenant> multiTenantFilter,
        ISettingProvider settingProvider,
        IClock clock)
    {
        _issueTaskManager = issueTaskManager;
        _linkRepository = linkRepository;
        _feedbackRepository = feedbackRepository;
        _clientErrorRepository = clientErrorRepository;
        _feedbackManager = feedbackManager;
        _multiTenantFilter = multiTenantFilter;
        _settingProvider = settingProvider;
        _clock = clock;

        Logger = NullLogger<IssueTaskSourceCloseHandler>.Instance;
    }

    public async Task HandleEventAsync(Apya.Platform.Tasks.TaskStatusChangedEto eventData)
    {
        if (eventData.NewStatus != TaskStatus.Done)
        {
            return;
        }

        var link = await _issueTaskManager.FindLinkByTaskAsync(eventData.TaskId);
        if (link is null || link.SourceClosedAt is not null)
        {
            return;
        }

        // KRİTİK: bu ayar .WithProviders(Global) ile kısıtlı → varsayılan sağlayıcı
        // zincirde yok, açık varsayılan verilmezse hiç yazılmamış ayar false gelir.
        var closeSource = await _settingProvider.GetAsync(
            PlatformSettings.IssueTasks.CloseSourceOnTaskDone,
            PlatformSettingDefaults.IssueTaskCloseSourceOnTaskDone);

        if (!closeSource)
        {
            return;
        }

        switch (link.SourceType)
        {
            case IssueSourceType.Feedback:
                await CloseFeedbackAsync(link);
                break;

            case IssueSourceType.ClientError:
                await ResolveClientErrorAsync(link);
                break;

            // Sunucu hatasının kapatılacak bir kaydı yok (audit log) — yalnız bağ işaretlenir.
        }

        link.MarkSourceClosed(_clock.Now);
        await _linkRepository.UpdateAsync(link);
    }

    private async Task CloseFeedbackAsync(IssueTaskLink link)
    {
        if (link.SourceId is null)
        {
            return;
        }

        // Geri bildirim kaynağın kiracısında yaşar; görev host'ta kapandığı için
        // filtre kapatılmazsa kayıt HİÇ bulunamaz.
        using (_multiTenantFilter.Disable())
        {
            var feedback = await _feedbackRepository.FindAsync(link.SourceId.Value);
            if (feedback is null || !feedback.Status.IsOpen())
            {
                return;
            }

            // FeedbackManager zaman çizelgesine satır yazar ve gönderene bildirim gönderir
            // (doğru kiracıya — CurrentTenant.Change orada ele alınıyor).
            await _feedbackManager.ChangeStatusAsync(feedback, FeedbackStatus.Completed, actorName: "Sistem");

            Logger.LogInformation(
                "Görev tamamlandı → {FeedbackNumber} geri bildirimi kapatıldı (görev {TaskId}).",
                feedback.FeedbackNumber, link.TaskId);
        }
    }

    private async Task ResolveClientErrorAsync(IssueTaskLink link)
    {
        if (link.SourceId is null)
        {
            return;
        }

        using (_multiTenantFilter.Disable())
        {
            var error = await _clientErrorRepository.FindAsync(link.SourceId.Value);
            if (error is null || error.IsResolved)
            {
                return;
            }

            error.MarkResolved(_clock.Now);
            await _clientErrorRepository.UpdateAsync(error);

            Logger.LogInformation(
                "Görev tamamlandı → istemci hatası {Fingerprint} çözüldü işaretlendi (görev {TaskId}).",
                error.Fingerprint, link.TaskId);
        }
    }
}
