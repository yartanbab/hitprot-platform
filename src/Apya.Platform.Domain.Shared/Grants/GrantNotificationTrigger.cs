namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Hibe sürecinde bildirim üreten olaylar.
///
/// <para>Her tetikleyicinin karşılığında gerçekten ateşlenen bir kod noktası vardır;
/// karşılığı olmayan tetikleyici tanımlanmaz — host şablonunu düzenler ama hiçbir
/// şey göndermez, bu da ekranı yanıltıcı yapar.</para>
///
/// <para>Tasarımdaki "haftalık hibe bülteni" tetikleyicisi BURADA YOK: bülten
/// aboneliği kamu yüzeyiyle (1g / 5b) geliyor, o yüzey henüz kurulmadı.</para>
/// </summary>
public enum GrantNotificationTrigger
{
    /// <summary>Host bir çağrıyı firmalara önerdi.</summary>
    RecommendationSent = 0,

    /// <summary>Son başvuru tarihine 7 / 3 / 1 gün kaldı ve zorunlu evrak eksik.</summary>
    DocumentDeadlineNear = 1,

    /// <summary>Danışman bir evrakta revizyon istedi.</summary>
    DocumentRevisionRequested = 2,

    /// <summary>Başvuru bir sonraki aşamaya geçti.</summary>
    ApplicationStageChanged = 3,

    /// <summary>Kurum kararı girildi. Red ise gövde itiraz süresini taşır.</summary>
    DecisionIssued = 4,

    /// <summary>Rapor teslimine 30 / 14 / 3 gün kaldı.</summary>
    ReportDeadlineNear = 5,

    /// <summary>Yeni çağrı yayına alındı; uygunluk eşiğini geçen firmalara gider.</summary>
    CallPublished = 6,

    /// <summary>
    /// Host, kiracının ilgi talebini karara bağladı. Başvuru süreci başlatıldıysa
    /// gövde bunu duyurur; uygun bulunmadıysa gerekçeyi taşır.
    /// </summary>
    InterestAnswered = 7,

    /// <summary>
    /// Kiracı bir çağrıya ilgi bildirdi. 🔴 Tek HOST'A giden tetikleyici: alıcı
    /// firma değil danışman ekibidir, kutuyu kimsenin açmasını beklemeyelim diye.
    /// </summary>
    InterestReceived = 8,

    /// <summary>
    /// 18b · Host çağrıyı kapattı. Talebi yanıtlanmamış ya da başvurusu gönderilmemiş firmalara
    /// gider; gövde profile uyan açık çağrıları taşır.
    /// </summary>
    CallClosed = 9,

    /// <summary>18e · Firma ön görüşme için üç saat önerdi. HOST'a gider.</summary>
    MeetingProposed = 10,

    /// <summary>18e · Danışman saatlerden birini onayladı ya da başka saat istedi. Firmaya gider.</summary>
    MeetingAnswered = 11,

    /// <summary>20b · Danışman havuzdaki fikri yeni bir çağrıyla ilişkilendirdi. Fikrin sahibi firmaya gider.</summary>
    IdeaLinked = 12,

    /// <summary>
    /// 19b · Danışman firmayı proje fikrini paylaşmaya davet etti (elle gönderim). Yanıtlamayan firmaya aynı şablon
    /// bir kez hatırlatma olarak gider.
    /// </summary>
    IdeaInvited = 13,

    /// <summary>
    /// 2d · Firma başvuruyu kuruma gönderdi. 🔴 HOST'a gider: huninin en kritik anıydı
    /// ve hiçbir bildirim üretmiyordu, danışman ancak listeyi elle açarsa görüyordu.
    /// </summary>
    ApplicationSubmitted = 14,

    /// <summary>
    /// 2e · Başvuru projeye dönüştürüldü. Firmaya gider — sürecin en sevindirici
    /// geçişi ("hibeniz projeye döndü") tamamen sessizdi.
    /// </summary>
    ConvertedToProject = 15,

    /// <summary>
    /// 🔴 NTF-02: Karar ONAYLI ama başvuru hâlâ projeye dönüştürülmedi. HOST'a gider:
    /// dönüşüm danışman eylemidir. Para bağlanmış başvuru süresiz askıda kalabiliyordu.
    /// </summary>
    ConversionPending = 16
}
