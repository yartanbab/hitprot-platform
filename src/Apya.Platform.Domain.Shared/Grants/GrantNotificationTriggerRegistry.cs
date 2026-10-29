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
            [GrantNotificationTrigger.SubmissionDeadlineNear]   = NotificationType.GrantSubmissionDeadlineNear,
            [GrantNotificationTrigger.IdeaShared]                = NotificationType.GrantIdeaShared,
            [GrantNotificationTrigger.AppealResolved]            = NotificationType.GrantAppealResolved,
            [GrantNotificationTrigger.MessageReceived]           = NotificationType.GrantMessageReceived,
            [GrantNotificationTrigger.HandedOver]                = NotificationType.GrantHandedOver,
            [GrantNotificationTrigger.DocumentUploaded]          = NotificationType.GrantDocumentUploaded,
            [GrantNotificationTrigger.DocumentApproved]          = NotificationType.GrantDocumentApproved,
            [GrantNotificationTrigger.ManagerDigest]             = NotificationType.GrantManagerDigest
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
                ["{firma_adı}", "{çağrı_adı}", "{son_tarih}", "{kalan_gün}"],

            // Çağrı YOK (havuz fikri): {çağrı_adı} verilmez, fikir kısaltılıp tırnakla anılır.
            [GrantNotificationTrigger.IdeaShared] =
                ["{firma_adı}", "{fikir}"],

            // {sonuç} hazır bir ifadedir ("kabul edildi" / "reddedildi"): gövde cümlenin içinde kullanır.
            [GrantNotificationTrigger.AppealResolved] =
                ["{çağrı_adı}", "{sonuç}"],

            [GrantNotificationTrigger.MessageReceived] =
                ["{gönderen}", "{çağrı_adı}", "{mesaj}"],

            [GrantNotificationTrigger.HandedOver] =
                ["{devreden}", "{çağrı_adı}"],

            [GrantNotificationTrigger.DocumentUploaded] =
                ["{yükleyen}", "{evrak_adı}", "{çağrı_adı}"],

            [GrantNotificationTrigger.DocumentApproved] =
                ["{evrak_adı}", "{çağrı_adı}"],

            // {özet} iş türü (host'ta danışman) başına sayı, {liste} en uzun bekleyen işler; ikisi de tek paragraf.
            [GrantNotificationTrigger.ManagerDigest] =
                ["{toplam}", "{en_eski_gün}", "{özet}", "{liste}"]
        };

    /// <summary>Yalnız HOST'a (danışman ekibine) giden tetikleyiciler.</summary>
    private static readonly HashSet<GrantNotificationTrigger> HostOnly =
    [
        GrantNotificationTrigger.InterestReceived,
        GrantNotificationTrigger.ApplicationSubmitted,
        GrantNotificationTrigger.MeetingProposed,
        GrantNotificationTrigger.ConversionPending,
        GrantNotificationTrigger.IdeaShared
    ];

    /// <summary>İki tarafa da (firma ve danışman) gidebilen tetikleyiciler; kalanı yalnız firmaya gider.</summary>
    private static readonly HashSet<GrantNotificationTrigger> BothSides =
    [
        GrantNotificationTrigger.ApplicationStageChanged,
        GrantNotificationTrigger.DecisionIssued,
        GrantNotificationTrigger.SubmissionDeadlineNear,
        GrantNotificationTrigger.MessageReceived,
        GrantNotificationTrigger.HandedOver,
        GrantNotificationTrigger.DocumentUploaded
    ];

    private static readonly GrantNotificationAudience[] FirmAudiences =
        [GrantNotificationAudience.FirmaKullanicisi, GrantNotificationAudience.FirmaYoneticisi];

    private static readonly GrantNotificationAudience[] HostAudiences =
        [GrantNotificationAudience.Danisman, GrantNotificationAudience.HostYoneticisi];

    /// <summary>
    /// Arkasında yapılması beklenen bir iş olan tetikleyiciler ve işi yapacak taraf. <c>null</c> = taraf kayda
    /// göre değişir (sıra devri: sıra kimdeyse). Listede olmayan tetikleyici yalnız haber verir, yükseltilmez.
    /// </summary>
    private static readonly Dictionary<GrantNotificationTrigger, GrantPartyRole?> ActionTriggers = new()
    {
        [GrantNotificationTrigger.DocumentRevisionRequested] = GrantPartyRole.Firma,
        [GrantNotificationTrigger.RecommendationSent] = GrantPartyRole.Firma,
        [GrantNotificationTrigger.DocumentUploaded] = GrantPartyRole.Danisman,
        [GrantNotificationTrigger.InterestReceived] = GrantPartyRole.Danisman,
        [GrantNotificationTrigger.MeetingProposed] = GrantPartyRole.Danisman,
        [GrantNotificationTrigger.IdeaShared] = GrantPartyRole.Danisman,
        [GrantNotificationTrigger.ApplicationSubmitted] = GrantPartyRole.Danisman,
        [GrantNotificationTrigger.HandedOver] = null
    };

    public static IReadOnlyCollection<GrantNotificationTrigger> All => (IReadOnlyCollection<GrantNotificationTrigger>)Map.Keys;

    /// <summary>Beklenen iş yapılmazsa yükseltilebilen tetikleyici mi?</summary>
    public static bool IsEscalatable(GrantNotificationTrigger trigger) => ActionTriggers.ContainsKey(trigger);

    /// <summary>
    /// Yükseltmenin gidebileceği kitleler. Genel = işi bekleyen taraf (hatırlatma); yönetici = o tarafın
    /// yöneticisi; Danışman = firma işi yapmazsa karşı taraf bilgilendirilir. Danışmanın işi firmaya yükseltilmez.
    /// </summary>
    public static IReadOnlyList<GrantNotificationAudience> EscalationAudiencesOf(GrantNotificationTrigger trigger)
    {
        if (!ActionTriggers.TryGetValue(trigger, out var side))
        {
            return [];
        }

        return side switch
        {
            GrantPartyRole.Firma => [GrantNotificationAudience.Genel, GrantNotificationAudience.FirmaYoneticisi, GrantNotificationAudience.Danisman],
            GrantPartyRole.Danisman => [GrantNotificationAudience.Genel, GrantNotificationAudience.HostYoneticisi],
            _ => [GrantNotificationAudience.Genel, GrantNotificationAudience.FirmaYoneticisi, GrantNotificationAudience.Danisman, GrantNotificationAudience.HostYoneticisi]
        };
    }

    /// <summary>
    /// Yükseltme metninde kullanılabilecek değişkenler. İlk bildirimin değişkenleri (danışman notu, mesaj, saatler)
    /// burada YOK: yükseltme işçisi yalnız kayıttan okunabilenleri doldurur.
    /// </summary>
    public static IReadOnlyList<string> EscalationVariablesOf(GrantNotificationTrigger trigger) => trigger switch
    {
        GrantNotificationTrigger.DocumentRevisionRequested or GrantNotificationTrigger.DocumentUploaded =>
            ["{firma_adı}", "{çağrı_adı}", "{evrak_adı}", "{bekleyen_gün}"],
        GrantNotificationTrigger.IdeaShared => ["{firma_adı}", "{fikir}", "{bekleyen_gün}"],
        GrantNotificationTrigger.HandedOver => ["{firma_adı}", "{çağrı_adı}", "{sıradaki_taraf}", "{bekleyen_gün}"],
        _ => ["{firma_adı}", "{çağrı_adı}", "{bekleyen_gün}"]
    };

    /// <summary>
    /// Tetikleyicinin ulaştığı rol kitleleri (Genel hariç). Ulaşmadığı role şablon çoğaltılamaz:
    /// yalnız danışmana giden bir tetikleyiciye firma metni yazmak hiçbir yere gitmeyen bir metin olurdu.
    /// </summary>
    public static IReadOnlyList<GrantNotificationAudience> AudiencesOf(GrantNotificationTrigger trigger)
        => trigger == GrantNotificationTrigger.ManagerDigest
            ? [GrantNotificationAudience.FirmaYoneticisi, GrantNotificationAudience.HostYoneticisi]
            : HostOnly.Contains(trigger) ? HostAudiences
            : BothSides.Contains(trigger) ? [.. FirmAudiences, .. HostAudiences]
            : FirmAudiences;

    public static NotificationType NotificationTypeOf(GrantNotificationTrigger trigger) => Map[trigger];

    public static IReadOnlyList<string> VariablesOf(GrantNotificationTrigger trigger) => Variables[trigger];

    /// <summary>Kullanıcı bu tetikleyiciyi susturamaz mı?</summary>
    public static bool IsMandatory(GrantNotificationTrigger trigger)
        => NotificationTypeRegistry.Get(Map[trigger]).Mandatory;
}
