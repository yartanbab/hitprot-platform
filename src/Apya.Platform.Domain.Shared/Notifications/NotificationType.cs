namespace Apya.Platform.Notifications;

public enum NotificationType
{
    TaskAssigned        = 1,
    TaskCommentAdded    = 2,
    TaskDueSoon         = 3,
    TaskStatusChanged   = 4,
    ProjectMemberAdded  = 5,
    Mention             = 6,
    AiWorkflowTriggered = 7,
    DocumentExpiring    = 8,
    GrantRecommended    = 9,
    FeedbackReceived      = 10, // Gönderim onayı — kullanıcıya teşekkür
    FeedbackResponded     = 11, // Yönetici kullanıcıya görünen cevap yazdı
    FeedbackStatusChanged = 12, // Geri bildirimin durumu değişti

    SubscriptionExpiring   = 13, // Paket süresi dolmak üzere
    SubscriptionDowngraded = 14, // Süre doldu, kiracı Basic pakete indirildi

    // Hibe süreci — her tetikleyici ayrı tür: ikon, derin link ve aciliyet farklı.
    // Hepsi tek 'GrantRecommended' türüyle gitseydi evrak hatırlatması 'hibe önerisi'
    // ikonuyla çıkar ve katalog sayfasına götürürdü.
    GrantDocumentReminder          = 15, // Eksik evrak — son tarihe 7 / 3 / 1 gün
    GrantDocumentRevisionRequested = 16, // Danışman evrakta revizyon istedi
    GrantApplicationStageChanged   = 17, // Başvuru bir sonraki aşamaya geçti
    GrantDecisionIssued            = 18, // Kurum kararı girildi (red ise itiraz süresi)
    GrantReportDue                 = 19, // Ara/sonuç raporu — teslime 30 / 14 / 3 gün
    GrantCallPublished             = 20  // Yeni çağrı yayına alındı
}
