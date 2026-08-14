using System;
using System.Collections.Generic;

namespace Apya.Platform.Notifications;

/// <summary>Bir bildirim türü hakkında bilinen her şey.</summary>
/// <param name="Category">Bildirim merkezindeki üst başlık.</param>
/// <param name="DefaultSeverity">Üretici aksini söylemezse kullanılacak aciliyet.</param>
/// <param name="Icon">Satır ikonu (FontAwesome sınıfı).</param>
/// <param name="DeepLinkTemplate">Tıklanınca gidilecek adres; <c>{0}</c> varsa entityId ile doldurulur.</param>
/// <param name="GroupSimilar">
/// Aynı kayda ait okunmamış bildirim varsa yeni satır açmak yerine sayacı artır.
/// Tekrarlayabilen olaylar (yorum, durum değişikliği) için açılır; tekil olaylar
/// (atama, son tarih uyarısı) için kapalıdır — o üreticiler zaten "gönderildi"
/// bayrağı tutuyor.
/// </param>
public sealed record NotificationTypeInfo(
    NotificationCategory Category,
    NotificationSeverity DefaultSeverity,
    string Icon,
    string? DeepLinkTemplate,
    bool GroupSimilar);

/// <summary>
/// Bildirim türlerinin tek kaydı. Kategori, aciliyet, ikon ve derin link daha önce
/// üç ayrı yere dağılmıştı — event handler'daki emoji, AppService'teki switch ve
/// JS'teki sınıf adı — yeni tür eklerken üçünü de güncellemek gerekiyordu.
/// </summary>
public static class NotificationTypeRegistry
{
    private static readonly NotificationTypeInfo Fallback = new(
        NotificationCategory.System, NotificationSeverity.Normal,
        "fa fa-bell", DeepLinkTemplate: null, GroupSimilar: false);

    private static readonly IReadOnlyDictionary<NotificationType, NotificationTypeInfo> Map =
        new Dictionary<NotificationType, NotificationTypeInfo>
        {
            [NotificationType.TaskAssigned] = new(
                NotificationCategory.Tasks, NotificationSeverity.High,
                "fa fa-clipboard-list", "/Tasks/Detail/{0}", GroupSimilar: false),

            [NotificationType.TaskCommentAdded] = new(
                NotificationCategory.Tasks, NotificationSeverity.Normal,
                "fa fa-comment-dots", "/Tasks/Detail/{0}", GroupSimilar: true),

            [NotificationType.TaskDueSoon] = new(
                NotificationCategory.Tasks, NotificationSeverity.Critical,
                "fa fa-clock", "/Tasks/Detail/{0}", GroupSimilar: false),

            [NotificationType.TaskStatusChanged] = new(
                NotificationCategory.Tasks, NotificationSeverity.Normal,
                "fa fa-arrow-right-arrow-left", "/Tasks/Detail/{0}", GroupSimilar: true),

            [NotificationType.Mention] = new(
                NotificationCategory.Tasks, NotificationSeverity.High,
                "fa fa-at", "/Tasks/Detail/{0}", GroupSimilar: true),

            [NotificationType.ProjectMemberAdded] = new(
                NotificationCategory.Projects, NotificationSeverity.Normal,
                "fa fa-user-plus", "/Projects/ProjectDetails/{0}", GroupSimilar: false),

            // Aşağıdaki hedef sayfalar henüz tekil kayda odaklanmayı desteklemiyor;
            // şablonda {0} yok, ilgili listeye götürüyoruz.
            [NotificationType.DocumentExpiring] = new(
                NotificationCategory.Documents, NotificationSeverity.High,
                "fa fa-file-circle-exclamation", "/Documents", GroupSimilar: false),

            [NotificationType.GrantRecommended] = new(
                NotificationCategory.Grants, NotificationSeverity.Normal,
                "fa fa-award", "/Grants", GroupSimilar: false),

            [NotificationType.AiWorkflowTriggered] = new(
                NotificationCategory.Ai, NotificationSeverity.Info,
                "fa fa-robot", "/AiCenter/Evaluations", GroupSimilar: false),

            [NotificationType.FeedbackReceived] = new(
                NotificationCategory.Feedback, NotificationSeverity.Info,
                "fa fa-circle-check", "/Feedback", GroupSimilar: false),

            [NotificationType.FeedbackResponded] = new(
                NotificationCategory.Feedback, NotificationSeverity.Normal,
                "fa fa-reply", "/Feedback", GroupSimilar: false),

            [NotificationType.FeedbackStatusChanged] = new(
                NotificationCategory.Feedback, NotificationSeverity.Info,
                "fa fa-list-check", "/Feedback", GroupSimilar: false)
        };

    public static NotificationTypeInfo Get(NotificationType type)
        => Map.TryGetValue(type, out var info) ? info : Fallback;

    /// <summary>Tıklandığında gidilecek adres. Şablon kayda bağlıysa entityId şart.</summary>
    public static string? BuildDeepLink(NotificationType type, Guid? entityId)
    {
        var template = Get(type).DeepLinkTemplate;

        if (template == null)                return null;
        if (!template.Contains("{0}"))       return template;
        if (entityId == null)                return null;

        return string.Format(template, entityId);
    }

    /// <summary>
    /// Aynı kayda ait tekrarlayan bildirimleri tek satırda toplamak için kullanılan anahtar.
    /// Gruplama kapalı olan türlerde ve kayda bağlı olmayan bildirimlerde null döner.
    /// </summary>
    public static string? BuildGroupKey(NotificationType type, string? entityType, Guid? entityId)
        => Get(type).GroupSimilar && entityId != null
            ? $"{(int)type}:{entityType}:{entityId}"
            : null;
}
