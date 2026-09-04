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
/// <param name="Mandatory">
/// Kullanıcının kategori tercihi kapalı olsa bile bildirim üretilir. Yalnızca
/// kaçırılması hak kaybına yol açan olaylar için açılır (kurum kararı ve onunla
/// birlikte işleyen itiraz süresi). Tercih ekranı bu türü "kapatılamaz" gösterir.
/// </param>
public sealed record NotificationTypeInfo(
    NotificationCategory Category,
    NotificationSeverity DefaultSeverity,
    string Icon,
    string? DeepLinkTemplate,
    bool GroupSimilar,
    bool Mandatory = false);

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

            // Hibe süreci tetikleyicileri. Derin link {0} = başvuru kimliği
            // (çağrı yayınında çağrı kimliği) — sayfalar sorgu dizesiyle çalışıyor.
            [NotificationType.GrantDocumentReminder] = new(
                NotificationCategory.Grants, NotificationSeverity.High,
                "fa fa-file-circle-exclamation", "/Grants/Documents?id={0}", GroupSimilar: false),

            [NotificationType.GrantDocumentRevisionRequested] = new(
                NotificationCategory.Grants, NotificationSeverity.High,
                "fa fa-rotate-left", "/Grants/Documents?id={0}", GroupSimilar: false),

            // Aşama birden çok kez ilerleyebilir; okunmamış satır varsa sayacı artır.
            [NotificationType.GrantApplicationStageChanged] = new(
                NotificationCategory.Grants, NotificationSeverity.Normal,
                "fa fa-arrow-right-arrow-left", "/Grants/Wizard?id={0}", GroupSimilar: true),

            // Kaçırılırsa itiraz süresi kaçar: hem Critical hem Mandatory.
            [NotificationType.GrantDecisionIssued] = new(
                NotificationCategory.Grants, NotificationSeverity.Critical,
                "fa fa-gavel", "/Grants/Appeal?id={0}", GroupSimilar: false, Mandatory: true),

            [NotificationType.GrantReportDue] = new(
                NotificationCategory.Grants, NotificationSeverity.High,
                "fa fa-calendar-check", "/Grants/Implementation?id={0}", GroupSimilar: false),

            [NotificationType.GrantCallPublished] = new(
                NotificationCategory.Grants, NotificationSeverity.Normal,
                "fa fa-bullhorn", "/Grants/Detail?id={0}", GroupSimilar: false),

            // İlgi talebinin cevabı — olumlu da olumsuz da aynı sayfaya götürür:
            // "İlgi Taleplerim" listesi ikisini de gerekçesiyle gösteriyor.
            [NotificationType.GrantInterestAnswered] = new(
                NotificationCategory.Grants, NotificationSeverity.Normal,
                "fa fa-handshake", "/Grants/MyApplications", GroupSimilar: false),

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
                "fa fa-list-check", "/Feedback", GroupSimilar: false),

            // Paket süresi → "Paketim" ekranı. Bildirim tekil kayda değil kiracının kendi
            // durumuna işaret eder; şablonda {0} yoktur.
            [NotificationType.SubscriptionExpiring] = new(
                NotificationCategory.System, NotificationSeverity.High,
                "fa fa-hourglass-half", "/Subscription", GroupSimilar: false),

            [NotificationType.SubscriptionDowngraded] = new(
                NotificationCategory.System, NotificationSeverity.Critical,
                "fa fa-circle-arrow-down", "/Subscription", GroupSimilar: false)
        };

    public static NotificationTypeInfo Get(NotificationType type)
        => Map.TryGetValue(type, out var info) ? info : Fallback;

    /// <summary>
    /// Tür gerçekten kayıtlı mı? Kapsama testi bunu sorar; "kategorisi System mi" diye
    /// bakmak YANILTIR — System meşru bir kategoridir (platform bildirimleri) ve o
    /// kategoriye kayıtlı türler fallback ile aynı görünürdü.
    /// </summary>
    public static bool IsRegistered(NotificationType type) => Map.ContainsKey(type);

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
