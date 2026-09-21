using System.Collections.Generic;
using Apya.Platform.Notifications;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Tetikleyici → bildirim türü eşlemesi.
///
/// <para>Zorunluluk BURADA TANIMLANMAZ; <see cref="NotificationTypeRegistry"/>'deki
/// türün <c>Mandatory</c> bayrağından okunur. İki yerde tutulsaydı biri "kapatılamaz"
/// derken diğeri tercihi dinlemeye devam edebilirdi.</para>
/// </summary>
public static class GrantNotificationTriggerRegistry
{
    private static readonly IReadOnlyDictionary<GrantNotificationTrigger, NotificationType> Map =
        new Dictionary<GrantNotificationTrigger, NotificationType>
        {
            [GrantNotificationTrigger.RecommendationSent]        = NotificationType.GrantRecommended,
            [GrantNotificationTrigger.DocumentDeadlineNear]      = NotificationType.GrantDocumentReminder,
            [GrantNotificationTrigger.DocumentRevisionRequested] = NotificationType.GrantDocumentRevisionRequested,
            [GrantNotificationTrigger.ApplicationStageChanged]   = NotificationType.GrantApplicationStageChanged,
            [GrantNotificationTrigger.DecisionIssued]            = NotificationType.GrantDecisionIssued,
            [GrantNotificationTrigger.ReportDeadlineNear]        = NotificationType.GrantReportDue,
            [GrantNotificationTrigger.CallPublished]             = NotificationType.GrantCallPublished,
            [GrantNotificationTrigger.InterestAnswered]          = NotificationType.GrantInterestAnswered,
            [GrantNotificationTrigger.InterestReceived]          = NotificationType.GrantInterestReceived,
            [GrantNotificationTrigger.CallClosed]                = NotificationType.GrantCallClosed,
            [GrantNotificationTrigger.MeetingProposed]           = NotificationType.GrantMeetingProposed,
            [GrantNotificationTrigger.MeetingAnswered]           = NotificationType.GrantMeetingAnswered,
            [GrantNotificationTrigger.IdeaLinked]                = NotificationType.GrantIdeaLinked,
            [GrantNotificationTrigger.IdeaInvited]               = NotificationType.GrantIdeaInvited,
            [GrantNotificationTrigger.ApplicationSubmitted]      = NotificationType.GrantApplicationSubmitted,
            [GrantNotificationTrigger.ConvertedToProject]        = NotificationType.GrantConvertedToProject,
            [GrantNotificationTrigger.ConversionPending]         = NotificationType.GrantConversionPending,
            [GrantNotificationTrigger.SubmissionDeadlineNear]   = NotificationType.GrantSubmissionDeadlineNear
        };

    /// <summary>
    /// Tetikleyicinin gövdesinde kullanılabilecek değişkenler.
    ///
    /// <para>Yalnız o tetikleyicide GERÇEKTEN doldurulabilen alanlar listelenir.
    /// Ortak bir "10 değişken" listesi gösterilseydi host, aşama bildirimine
    /// <c>{itiraz_kalan_gün}</c> yazar ve metin kullanıcıya ham token olarak giderdi.</para>
    /// </summary>
    private static readonly IReadOnlyDictionary<GrantNotificationTrigger, string[]> Variables =
        new Dictionary<GrantNotificationTrigger, string[]>
        {
            [GrantNotificationTrigger.RecommendationSent] =
                ["{firma_adı}", "{çağrı_adı}", "{son_tarih}", "{kalan_gün}", "{host_notu}"],

            [GrantNotificationTrigger.DocumentDeadlineNear] =
                ["{firma_adı}", "{çağrı_adı}", "{eksik_evrak_sayısı}", "{son_tarih}", "{kalan_gün}"],

            [GrantNotificationTrigger.DocumentRevisionRequested] =
                ["{çağrı_adı}", "{evrak_adı}", "{danışman_notu}"],

            [GrantNotificationTrigger.ApplicationStageChanged] =
                ["{çağrı_adı}", "{aşama}"],

            // İtiraz penceresi TEK değişkende taşınır: onay kararında pencere yoktur ve
            // ayrı tarih/gün tokenları kalsaydı gövde "İtiraz için son gün — gün kaldı."
            // diye yarım cümleyle giderdi.
            [GrantNotificationTrigger.DecisionIssued] =
                ["{çağrı_adı}", "{karar}", "{itiraz_bilgisi}"],

            [GrantNotificationTrigger.ReportDeadlineNear] =
                ["{çağrı_adı}", "{rapor_adı}", "{son_tarih}", "{kalan_gün}"],

            [GrantNotificationTrigger.CallPublished] =
                ["{firma_adı}", "{çağrı_adı}", "{son_tarih}", "{kalan_gün}"],

            // Karar ve gerekçe AYRI tokenlar: olumlu kararda gerekçe boştur ve tek
            // tokenda birleştirilseydi gövde "Kararımız: başvuru süreci başlatıldı —"
            // diye yarım cümleyle giderdi.
            [GrantNotificationTrigger.InterestAnswered] =
                ["{çağrı_adı}", "{karar}", "{gerekçe}"],

            [GrantNotificationTrigger.InterestReceived] =
                ["{firma_adı}", "{çağrı_adı}", "{firma_notu}"],

            // Gönderim anında evrak durumu bilinir; danışman kutuyu açmadan eksik olup
            // olmadığını görsün diye tokena alındı.
            [GrantNotificationTrigger.ApplicationSubmitted] =
                ["{firma_adı}", "{çağrı_adı}", "{evrak_durumu}"],

            [GrantNotificationTrigger.CallClosed] =
                ["{çağrı_adı}", "{benzer_çağrılar}"],

            [GrantNotificationTrigger.MeetingProposed] =
                ["{firma_adı}", "{çağrı_adı}", "{önerilen_saatler}"],

            // Sonuç tek tokendadır: onayda saat, başka saat isteğinde danışmanın notu yazılır.
            [GrantNotificationTrigger.MeetingAnswered] =
                ["{çağrı_adı}", "{görüşme_sonucu}"],

            // Eşleşme yüzdesi ve danışman adı ilişkilendirme anında hesaplanır; son tarih çağrısızsa boştur.
            [GrantNotificationTrigger.IdeaLinked] =
                ["{firma_adı}", "{fikir}", "{çağrı_adı}", "{eşleşme}", "{danışman}", "{son_tarih}"],

            // Mesajı danışman gönderim başına yazar. Hatırlatmada {hatırlatma} dolar ("Hatırlatma:"), ilk gönderimde boştur.
            // Çağrısız (havuz) davette {çağrı_adı} ve {son_tarih} boştur.
            [GrantNotificationTrigger.IdeaInvited] =
                ["{hatırlatma}", "{firma_adı}", "{davet_mesajı}", "{çağrı_adı}", "{son_tarih}"],

            // Proje adı ve kodu AYRI tokenlar: kod dış sistemlere kopyalanır, ad okunur.
            [GrantNotificationTrigger.ConvertedToProject] =
                ["{çağrı_adı}", "{proje_adı}", "{proje_kodu}"],

            // {bekleyen_gün} eşiğin kendisidir; danışman kutuyu açmadan aciliyeti görür.
            [GrantNotificationTrigger.ConversionPending] =
                ["{firma_adı}", "{çağrı_adı}", "{karar_tarihi}", "{bekleyen_gün}"],

            // Eksik evrak sayısı YOK: bu tetikleyici tam da evrakı TAMAM olanlara gidiyor.
            [GrantNotificationTrigger.SubmissionDeadlineNear] =
                ["{firma_adı}", "{çağrı_adı}", "{son_tarih}", "{kalan_gün}"]
        };

    public static IReadOnlyCollection<GrantNotificationTrigger> All => (IReadOnlyCollection<GrantNotificationTrigger>)Map.Keys;

    public static NotificationType NotificationTypeOf(GrantNotificationTrigger trigger) => Map[trigger];

    public static IReadOnlyList<string> VariablesOf(GrantNotificationTrigger trigger) => Variables[trigger];

    /// <summary>Kullanıcı bu tetikleyiciyi susturamaz mı?</summary>
    public static bool IsMandatory(GrantNotificationTrigger trigger)
        => NotificationTypeRegistry.Get(Map[trigger]).Mandatory;
}
