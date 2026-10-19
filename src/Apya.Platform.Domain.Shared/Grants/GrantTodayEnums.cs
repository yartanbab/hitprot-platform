namespace Apya.Platform.Grants;

/// <summary>
/// 11a/11b · "Bugün" ekranındaki bir işin türü. Cümle sunucuda kurulmaz: tür + sayı döner,
/// metni ve bağlantıyı istemci kurar.
/// </summary>
public enum GrantTodayItemKind
{
    /// <summary>Zorunlu evrak eksik. Kiracıda firmanın yükleyeceği, host'ta danışmanın yükleyeceği evrak.</summary>
    UploadDocuments = 0,

    /// <summary>Başvuru formunda boş alan var (kiracı).</summary>
    CompleteForm = 1,

    /// <summary>Kurum reddetti, itiraz süresi açık. Kiracıda "itiraz dosyanızı tamamlayın", host'ta "dilekçeyi bitir".</summary>
    AppealDeadline = 2,

    /// <summary>Rapor teslimi yaklaşıyor; bölümleri henüz tamam değil.</summary>
    ReportDue = 3,

    /// <summary>Evrak ve form tamam, dosya kuruma gönderilmeyi bekliyor (host).</summary>
    SubmitPackage = 4,

    /// <summary>Top firmada: firmanın yükleyeceği evrak eksik (host).</summary>
    WaitingOnFirm = 5,

    /// <summary>Kamu testinden gelen talep görüşme saati önerdi (host).</summary>
    LeadMeeting = 6,

    /// <summary>Taslak çağrı yayına alınmayı bekliyor; zorunlu alanlar eksik olabilir (host).</summary>
    DraftCallPublish = 7,

    /// <summary>Karara bağlanmamış ilgi talepleri var (host).</summary>
    InterestReview = 8,

    /// <summary>Dosya gönderildi, kurum inceliyor (host "Kurumda" sekmesi).</summary>
    WaitingOnInstitution = 9,

    /// <summary>Uygulama dönemi: ödeme diliminin vadesi yaklaşıyor ya da geçti, dilim ödenmedi (host).</summary>
    TrancheDue = 10,

    /// <summary>H-03 · Başvurunun son mesajı karşı taraftan; yanıt bekleniyor (iki taraf).</summary>
    MessageAwaitingReply = 11
}

/// <summary>Bir işin şu an kimde olduğu — host'taki üç sekme, kiracıdaki "sizde / danışmanınızda" ayrımı.</summary>
public enum GrantTodayOwner
{
    /// <summary>Ekranı açan kişide (kiracıda firma, host'ta danışman ekibi).</summary>
    Me = 0,

    /// <summary>Firmada bekliyor (host görünümü).</summary>
    Firm = 1,

    /// <summary>Kurumda; beklemekten başka yapılacak yok.</summary>
    Institution = 2
}
