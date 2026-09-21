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
    GrantCallPublished             = 20, // Yeni çağrı yayına alındı
    GrantInterestAnswered          = 21, // İlgi talebi karara bağlandı (başvuru açıldı / uygun değil)
    GrantInterestReceived          = 22, // Kiracı ilgi bildirdi — HOST'a gider
    GrantCallClosed                = 23, // 18b · Çağrı kapandı; yarım kalan firmaya benzer çağrılarla
    GrantMeetingProposed           = 24, // 18e · Firma ön görüşme saatleri önerdi — HOST'a gider
    GrantMeetingAnswered           = 25, // 18e · Danışman görüşmeyi onayladı ya da başka saat istedi
    GrantIdeaLinked                = 26, // 20b · Havuzdaki fikir yeni bir çağrıyla ilişkilendirildi
    GrantIdeaInvited               = 27, // 19b · Firma proje fikrini paylaşmaya davet edildi (ve hatırlatması)

    // Finans ekseni — proje bütçesi, fonlama dilimleri ve kesintiler.
    // Bu olaylar bugüne kadar sessizce gerçekleşiyordu: kalem bütçesi aşılıyor,
    // dilim vadesi geçiyor, kesinti yapılıyordu ve kimse haberdar olmuyordu.
    // Hepsi tek kayda (PROJE) işaret eder; kalem ayrıntısı gövdede taşınır —
    // bütçe ekranı zaten proje kırılımında açılıyor.
    BudgetRevisionApplied       = 28, // Bütçe revizyonu uygulandı (kalem tutarları değişti)
    BudgetUsageThresholdReached = 29, // Kalem kullanımı bir eşiği geçti (%50 / 75 / 90)
    BudgetOverrun               = 30, // Kalem onaylanan tutarı AŞTI
    FundingTrancheCollected     = 31, // Fonlama dilimi tahsil edildi
    FundingTrancheOverdue       = 32, // Planlanan tarihi geçti, hâlâ tahsil edilmedi
    TrancheDeductionAdded       = 33, // Dilime kesinti işlendi
    TrancheDisputed             = 34, // Dilim itirazlı olarak işaretlendi
    GrantApplicationSubmitted   = 35, // Firma başvuruyu kuruma gönderdi (HOST'a gider)

    // 🔴 NTF-03: Yalnız "yaklaşıyor" (TaskDueSoon) vardı; vadeyi GEÇEN görev
    // hiçbir sinyal üretmiyordu. Tekillik anahtarı görev + vade olduğu için
    // ertelenen görev yeni vadesini de geçerse ikinci kez uyarılır.
    TaskOverdue                 = 36, // Görevin vadesi geçti, hâlâ kapanmadı

    // 🔴 NTF-02: Dönüşüm sürecin en sevindirici geçişiydi ve tamamen sessizdi;
    // onaylanmış ama dönüştürülmemiş başvuru da hiç takip edilmiyordu.
    GrantConvertedToProject     = 37, // Başvuru projeye dönüştü (FİRMAYA gider)
    GrantConversionPending      = 38, // Karar onaylı, proje hâlâ kurulmadı (HOST'a gider)

    // 🔴 NTF-04: Evrakı tamam ama gönderilmemiş başvuru hiç uyarılmıyordu.
    GrantSubmissionDeadlineNear = 39  // Son tarih yaklaşıyor, başvuru hâlâ gönderilmedi
}
