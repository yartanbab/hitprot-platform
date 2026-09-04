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
    InterestAnswered = 7
}
