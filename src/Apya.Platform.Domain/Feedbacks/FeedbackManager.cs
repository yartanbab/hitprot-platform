using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Timing;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirim iş kuralları: spam koruması, durum geçişleri ve
/// kullanıcıyı haberdar etme. AppService yalnızca yetki + DTO işi yapar.
/// </summary>
public class FeedbackManager : DomainService
{
    private readonly IRepository<Feedback, Guid> _feedbackRepository;
    private readonly NotificationManager _notificationManager;
    private readonly IClock _clock;

    public FeedbackManager(
        IRepository<Feedback, Guid> feedbackRepository,
        NotificationManager notificationManager,
        IClock clock)
    {
        _feedbackRepository = feedbackRepository;
        _notificationManager = notificationManager;
        _clock = clock;
    }

    public async Task<Feedback> CreateAsync(
        FeedbackType type,
        string subject,
        string body,
        int? rating,
        Guid submitterUserId,
        FeedbackSubmissionContext context)
    {
        if (subject.IsNullOrWhiteSpace())
        {
            throw new BusinessException(PlatformDomainErrorCodes.FeedbackSubjectRequired);
        }

        if (body.IsNullOrWhiteSpace())
        {
            throw new BusinessException(PlatformDomainErrorCodes.FeedbackBodyRequired);
        }

        await EnsureNotFloodingAsync(submitterUserId);

        var feedback = new Feedback(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            type,
            subject.Trim(),
            body.Trim(),
            rating);

        feedback.SetContext(
            context.PageUrl,
            context.PageTitle,
            context.UserAgent,
            context.ScreenResolution,
            context.AppVersion,
            context.SubmittedByUserName,
            context.BreadcrumbJson);

        if (!context.ScreenshotFileName.IsNullOrWhiteSpace())
        {
            feedback.AttachScreenshot(context.ScreenshotFileName!);
        }

        // autoSave: Id ve CreatorId'nin bildirim/deep-link için kesinleşmesi gerekiyor.
        await _feedbackRepository.InsertAsync(feedback, autoSave: true);

        // Gönderim onayı: geri bildirim vermenin karşılık bulduğunu göstermenin en ucuz yolu.
        await NotifySubmitterAsync(
            feedback,
            submitterUserId,
            NotificationType.FeedbackReceived,
            "🙏 Geri bildiriminiz alındı",
            $"\"{feedback.Subject}\" için teşekkürler. İncelenip size dönülecek.");

        return feedback;
    }

    public async Task ChangeStatusAsync(Feedback feedback, FeedbackStatus newStatus)
    {
        if (feedback.Status == newStatus)
        {
            return;
        }

        EnsureValidTransition(feedback.Status, newStatus);

        feedback.ChangeStatus(newStatus, _clock.Now);
        await _feedbackRepository.UpdateAsync(feedback);

        var message = BuildStatusMessage(feedback, newStatus);
        if (message is not null)
        {
            await NotifySubmitterAsync(
                feedback,
                feedback.CreatorId,
                NotificationType.FeedbackStatusChanged,
                message.Value.Title,
                message.Value.Body);
        }
    }

    /// <summary>
    /// Nota ekler. <paramref name="isInternal"/> false ise kullanıcıya görünür ve
    /// bildirim tetikler; true ise yalnızca yönetici tarafında kalır.
    /// </summary>
    public async Task<FeedbackComment> AddCommentAsync(
        Feedback feedback,
        string text,
        bool isInternal,
        string? authorName)
    {
        if (text.IsNullOrWhiteSpace())
        {
            throw new BusinessException(PlatformDomainErrorCodes.FeedbackCommentRequired);
        }

        var comment = new FeedbackComment(
            GuidGenerator.Create(),
            feedback.TenantId,
            feedback.Id,
            text.Trim(),
            isInternal,
            authorName);

        feedback.Comments.Add(comment);

        if (!isInternal)
        {
            feedback.MarkResponded(_clock.Now);
        }

        await _feedbackRepository.UpdateAsync(feedback);

        if (!isInternal)
        {
            await NotifySubmitterAsync(
                feedback,
                feedback.CreatorId,
                NotificationType.FeedbackResponded,
                "💬 Geri bildiriminize cevap geldi",
                $"\"{feedback.Subject}\": {Shorten(comment.Text)}");
        }

        return comment;
    }

    /// <summary>Aynı kullanıcının kısa aralıkta çok sayıda kayıt açmasını engeller.</summary>
    private async Task EnsureNotFloodingAsync(Guid userId)
    {
        var since = _clock.Now.AddMinutes(-FeedbackConsts.RateLimitWindowMinutes);
        var query = await _feedbackRepository.GetQueryableAsync();

        var recentCount = await AsyncExecuter.CountAsync(
            query.Where(f => f.CreatorId == userId && f.CreationTime >= since));

        if (recentCount >= FeedbackConsts.RateLimitMaxPerWindow)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FeedbackRateLimitExceeded)
                .WithData("limit", FeedbackConsts.RateLimitMaxPerWindow)
                .WithData("minutes", FeedbackConsts.RateLimitWindowMinutes);
        }
    }

    private static void EnsureValidTransition(FeedbackStatus current, FeedbackStatus target)
    {
        // Tek anlamlı kısıt: kapatılmış kayıt doğrudan başka bir kapanışa geçemez,
        // önce yeniden incelemeye alınır. Diğer ileri geçişler serbest.
        var isClosed = current is FeedbackStatus.Completed or FeedbackStatus.Rejected;

        if (isClosed && target != FeedbackStatus.InReview)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FeedbackInvalidStatusTransition)
                .WithData("current", current)
                .WithData("target", target);
        }
    }

    /// <summary>
    /// Bildirimi kullanıcının tenant'ına yazar. KRİTİK: host yöneticisi cevap yazdığında
    /// CurrentTenant.Id null'dur; sarmalanmazsa bildirim TenantId=null olarak kaydedilir
    /// ve kullanıcı onu hiç göremez.
    /// </summary>
    private async Task NotifySubmitterAsync(
        Feedback feedback,
        Guid? userId,
        NotificationType type,
        string title,
        string body)
    {
        if (userId is null)
        {
            return;
        }

        using (CurrentTenant.Change(feedback.TenantId))
        {
            await _notificationManager.PublishAsync(
                userId.Value,
                title,
                body,
                type,
                entityType: "Feedback",
                entityId: feedback.Id);
        }
    }

    private static (string Title, string Body)? BuildStatusMessage(Feedback feedback, FeedbackStatus status)
    {
        return status switch
        {
            FeedbackStatus.InReview => (
                "🔍 Geri bildiriminiz inceleniyor",
                $"\"{feedback.Subject}\" incelemeye alındı."),

            FeedbackStatus.Planned => (
                "🗺️ Geri bildiriminiz planlandı",
                $"\"{feedback.Subject}\" geliştirme planına alındı."),

            FeedbackStatus.Completed => (
                "✅ Geri bildiriminiz hayata geçti",
                $"\"{feedback.Subject}\" için bildirdiğiniz konu tamamlandı."),

            FeedbackStatus.Rejected => (
                "ℹ️ Geri bildiriminiz kapatıldı",
                $"\"{feedback.Subject}\" şimdilik kapsam dışında bırakıldı."),

            // New'e geri alma yönetimsel bir düzeltmedir; kullanıcıyı ilgilendirmez.
            _ => null
        };
    }

    private static string Shorten(string text)
    {
        const int limit = 160;
        return text.Length <= limit ? text : text.Substring(0, limit) + "…";
    }
}
