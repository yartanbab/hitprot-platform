using System;
using System.Collections.Generic;
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
    private readonly IRepository<FeedbackActivity, Guid> _activityRepository;
    private readonly IRepository<FeedbackAttachment, Guid> _attachmentRepository;
    private readonly IFeedbackNumberGenerator _numberGenerator;
    private readonly NotificationManager _notificationManager;
    private readonly IClock _clock;

    public FeedbackManager(
        IRepository<Feedback, Guid> feedbackRepository,
        IRepository<FeedbackActivity, Guid> activityRepository,
        IRepository<FeedbackAttachment, Guid> attachmentRepository,
        IFeedbackNumberGenerator numberGenerator,
        NotificationManager notificationManager,
        IClock clock)
    {
        _feedbackRepository = feedbackRepository;
        _activityRepository = activityRepository;
        _attachmentRepository = attachmentRepository;
        _numberGenerator = numberGenerator;
        _notificationManager = notificationManager;
        _clock = clock;
    }

    public async Task<Feedback> CreateAsync(
        FeedbackType type,
        string subject,
        string body,
        int? rating,
        Guid submitterUserId,
        FeedbackSubmissionContext context,
        FeedbackPriority? severity = null,
        string? detailsJson = null,
        bool isAnonymous = false,
        bool allowContact = false)
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
            rating)
        {
            FeedbackNumber    = await _numberGenerator.NextAsync(),
            Severity          = severity,
            DetailsJson       = detailsJson,
            IsAnonymous       = isAnonymous,
            AllowContact      = allowContact,
            ModuleCode        = context.ModuleCode,
            ComponentCode     = context.ComponentCode,
            ActionCode        = context.ActionCode,
            RelatedEntityType = context.RelatedEntityType,
            RelatedEntityId   = context.RelatedEntityId,
            LastClientErrorId = context.LastClientErrorId
        };

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

        await LogActivityAsync(
            feedback, FeedbackActivityType.Created,
            newValue: feedback.FeedbackNumber,
            actorName: context.SubmittedByUserName);

        // Gönderim onayı: geri bildirim vermenin karşılık bulduğunu göstermenin en ucuz yolu.
        await NotifySubmitterAsync(
            feedback,
            submitterUserId,
            NotificationType.FeedbackReceived,
            "🙏 Geri bildiriminiz alındı",
            $"Bildiriminiz {feedback.FeedbackNumber} numarasıyla alındı. Gelişmeleri \"Geri Bildirimlerim\" sayfasından takip edebilirsiniz.");

        return feedback;
    }

    public async Task ChangeStatusAsync(Feedback feedback, FeedbackStatus newStatus, string? actorName = null)
    {
        if (feedback.Status == newStatus)
        {
            return;
        }

        EnsureValidTransition(feedback.Status, newStatus);

        var oldStatus = feedback.Status;
        feedback.ChangeStatus(newStatus, _clock.Now);
        await _feedbackRepository.UpdateAsync(feedback);

        await LogActivityAsync(
            feedback, FeedbackActivityType.StatusChanged,
            oldValue: oldStatus.ToString(),
            newValue: newStatus.ToString(),
            actorName: actorName);

        // Bildirim kirliliği önlemi: iç durum değişse de kullanıcıya GÖRÜNEN durum
        // aynıysa (ör. InDevelopment→Testing, ikisi de "Geliştiriliyor") bildirim gitmez.
        if (oldStatus.ToUserStatus() == newStatus.ToUserStatus())
        {
            return;
        }

        var message = BuildStatusMessage(feedback, newStatus.ToUserStatus());
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

    public async Task AssignAsync(Feedback feedback, Guid? userId, string? userName, string? actorName = null)
    {
        if (feedback.AssignedUserId == userId)
        {
            return;
        }

        var oldName = feedback.AssignedUserName;
        feedback.Assign(userId, userName);
        await _feedbackRepository.UpdateAsync(feedback);

        await LogActivityAsync(
            feedback, FeedbackActivityType.Assigned,
            oldValue: oldName,
            newValue: feedback.AssignedUserName,
            actorName: actorName,
            isInternal: true);
    }

    public async Task SetPriorityAsync(Feedback feedback, FeedbackPriority priority, string? actorName = null)
    {
        if (feedback.Priority == priority)
        {
            return;
        }

        var old = feedback.Priority;
        feedback.Priority = priority;
        await _feedbackRepository.UpdateAsync(feedback);

        await LogActivityAsync(
            feedback, FeedbackActivityType.PriorityChanged,
            oldValue: old.ToString(),
            newValue: priority.ToString(),
            actorName: actorName,
            isInternal: true);
    }

    public async Task SetImpactAsync(Feedback feedback, FeedbackImpact? impact, string? actorName = null)
    {
        if (feedback.Impact == impact)
        {
            return;
        }

        var old = feedback.Impact;
        feedback.Impact = impact;
        await _feedbackRepository.UpdateAsync(feedback);

        await LogActivityAsync(
            feedback, FeedbackActivityType.ImpactChanged,
            oldValue: old?.ToString(),
            newValue: impact?.ToString(),
            actorName: actorName,
            isInternal: true);
    }

    public async Task SetTagsAsync(Feedback feedback, string? tags, string? actorName = null)
    {
        var normalized = tags.IsNullOrWhiteSpace() ? null : tags!.Trim();
        if (feedback.AdminTags == normalized)
        {
            return;
        }

        var old = feedback.AdminTags;
        feedback.AdminTags = normalized;
        await _feedbackRepository.UpdateAsync(feedback);

        await LogActivityAsync(
            feedback, FeedbackActivityType.TagsChanged,
            oldValue: old,
            newValue: normalized,
            actorName: actorName,
            isInternal: true);
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

        await LogActivityAsync(
            feedback, FeedbackActivityType.CommentAdded,
            note: Shorten(comment.Text),
            actorName: authorName,
            isInternal: isInternal);

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

    /// <summary>
    /// Önceden yüklenmiş dosyaları kayda bağlar (gönderim akışının parçası).
    /// Sayı sınırı DTO'da doğrulanır; burada yalnızca kayıt + tek activity satırı.
    /// </summary>
    public async Task AttachFilesAsync(
        Feedback feedback,
        IEnumerable<(string FileName, string StoredFileName, string? ContentType, long SizeBytes)> files,
        string? actorName = null)
    {
        var count = 0;
        foreach (var file in files)
        {
            await _attachmentRepository.InsertAsync(new FeedbackAttachment(
                GuidGenerator.Create(),
                feedback.TenantId,
                feedback.Id,
                file.FileName,
                file.StoredFileName,
                file.ContentType,
                file.SizeBytes));
            count++;
        }

        if (count > 0)
        {
            await LogActivityAsync(
                feedback, FeedbackActivityType.AttachmentAdded,
                newValue: count.ToString(),
                actorName: actorName);
        }
    }

    /// <summary>
    /// Kullanıcının kendi kaydına ek açıklaması. Admin cevabından farkı:
    /// LastRespondedAt'e DOKUNMAZ (o "yönetici cevapladı" göstergesidir) ve kayıt
    /// "Ek bilgi bekleniyor" durumundaysa sessizce yeniden incelemeye alınır —
    /// kullanıcı kendi aksiyonu için bildirim ALMAZ.
    /// </summary>
    public async Task<FeedbackComment> AddUserCommentAsync(Feedback feedback, string text, string? authorName)
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
            isInternal: false,
            authorName);

        feedback.Comments.Add(comment);

        if (feedback.Status == FeedbackStatus.NeedsInfo)
        {
            var oldStatus = feedback.Status;
            feedback.ChangeStatus(FeedbackStatus.InReview, _clock.Now);

            await LogActivityAsync(
                feedback, FeedbackActivityType.StatusChanged,
                oldValue: oldStatus.ToString(),
                newValue: FeedbackStatus.InReview.ToString(),
                note: "Kullanıcı ek bilgi verdi",
                actorName: authorName);
        }

        await _feedbackRepository.UpdateAsync(feedback);

        await LogActivityAsync(
            feedback, FeedbackActivityType.UserCommented,
            note: Shorten(comment.Text),
            actorName: authorName);

        return comment;
    }

    /// <summary>Zaman çizelgesine satır ekler — append-only, silinmez/güncellenmez.</summary>
    private async Task LogActivityAsync(
        Feedback feedback,
        FeedbackActivityType type,
        string? oldValue = null,
        string? newValue = null,
        string? note = null,
        string? actorName = null,
        bool isInternal = false)
    {
        await _activityRepository.InsertAsync(new FeedbackActivity(
            GuidGenerator.Create(),
            feedback.TenantId,
            feedback.Id,
            type,
            oldValue,
            newValue,
            note,
            actorName,
            isInternal));
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
        // önce yeniden incelemeye alınır. Açık durumlar arası geçişler serbest.
        // İstisna: Completed → Released (tamamlanan işin yayına çıkması) doğal akıştır.
        if (current == FeedbackStatus.Completed && target == FeedbackStatus.Released)
        {
            return;
        }

        if (!current.IsOpen() && target != FeedbackStatus.InReview)
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

    private static (string Title, string Body)? BuildStatusMessage(Feedback feedback, FeedbackUserStatus userStatus)
    {
        return userStatus switch
        {
            FeedbackUserStatus.InReview => (
                "🔍 Geri bildiriminiz inceleniyor",
                $"{feedback.FeedbackNumber} — \"{feedback.Subject}\" incelemeye alındı."),

            FeedbackUserStatus.NeedsInfo => (
                "❓ Ek bilginize ihtiyaç var",
                $"{feedback.FeedbackNumber} — \"{feedback.Subject}\" için sorularımız var. Lütfen \"Geri Bildirimlerim\" sayfasından cevaplayın."),

            FeedbackUserStatus.Planned => (
                "🗺️ Geri bildiriminiz planlandı",
                $"{feedback.FeedbackNumber} — \"{feedback.Subject}\" geliştirme planına alındı."),

            FeedbackUserStatus.InProgress => (
                "🔧 Geri bildiriminiz geliştiriliyor",
                $"{feedback.FeedbackNumber} — \"{feedback.Subject}\" üzerinde çalışılıyor."),

            FeedbackUserStatus.Completed => (
                "✅ Geri bildiriminiz tamamlandı",
                $"{feedback.FeedbackNumber} — \"{feedback.Subject}\" için bildirdiğiniz konu tamamlandı."),

            FeedbackUserStatus.Released => (
                "🚀 Geri bildiriminiz yayında",
                $"{feedback.FeedbackNumber} — \"{feedback.Subject}\" ile ilgili geliştirme yayına alındı."),

            FeedbackUserStatus.Closed => (
                "ℹ️ Geri bildiriminiz kapatıldı",
                $"{feedback.FeedbackNumber} — \"{feedback.Subject}\" şimdilik kapsam dışında bırakıldı."),

            // Received'a geri dönüş yönetimsel düzeltmedir; kullanıcıyı ilgilendirmez.
            _ => null
        };
    }

    private static string Shorten(string text)
    {
        const int limit = 160;
        return text.Length <= limit ? text : text.Substring(0, limit) + "…";
    }
}
