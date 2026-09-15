namespace Apya.Platform.Grants;

/// <summary>
/// 18d · Hibe Yolculuğum — firmanın bir çağrıyla ilişkisinin şu anki hâli. Cümle sunucuda
/// kurulmaz; istemci türe göre yerelleştirir (Bugün ekranıyla aynı sözleşme).
/// </summary>
public enum GrantJourneyItemKind
{
    /// <summary>İlgi bildirildi, karar bekleniyor.</summary>
    InterestPending = 0,

    /// <summary>Danışman uygun bulmadı; gerekçe firmaya iletildi.</summary>
    InterestRejected = 1,

    /// <summary>Firma ilgisini geri çekti.</summary>
    InterestWithdrawn = 2,

    /// <summary>Başvuru hazırlanıyor (form/evrak).</summary>
    ApplicationOpen = 3,

    /// <summary>Başvuru gönderildi; kurum inceliyor.</summary>
    ApplicationWithInstitution = 4,

    /// <summary>Kurum reddetti; itiraz penceresi açık ya da kapanmış.</summary>
    ApplicationRejected = 5,

    /// <summary>Başvuru projeye dönüştü.</summary>
    Project = 6,

    /// <summary>Destek süreci tamamlandı (ödeme aşaması, projeye bağlanmadı).</summary>
    Completed = 7,

    /// <summary>Çağrı kapandı; başvuru gönderilmemişti ya da talep yanıtlanmamıştı.</summary>
    CallClosed = 8,

    /// <summary>19a · Çağrısız proje fikri Fikir Havuzu'nda; uygun çağrı açılınca danışman ilişkilendirir.</summary>
    IdeaPooled = 9
}
