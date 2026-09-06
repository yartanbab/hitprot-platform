namespace Apya.Platform.Agreements;

/// <summary>
/// Hizmet protokolü sabitleri: şablon sürümü, sözleşme numarası biçimi, alan uzunlukları
/// ve protokolün mali hükümlerinden gelen sayılar.
/// </summary>
public static class ServiceAgreementConsts
{
    /// <summary>
    /// Protokol şablonunun sürümü. <b>Metin değişince artır</b> — hangi sözleşmenin hangi
    /// metne dayandığı yalnız bu alandan okunur. <see cref="Apya.Platform.Consents.ConsentConsts.ServiceAgreementPolicyVersion"/>
    /// ile aynı tutulur.
    /// </summary>
    public const string TemplateVersion = "protokol-v1";

    /// <summary>Sözleşme numarasının ön eki (protokol başlığı: "APYA-PRT-{{PROTOKOL_NO}}").</summary>
    public const string NumberPrefix = "APYA-PRT-";

    /// <summary>Protokol Madde 8: onay tarihinden itibaren geçerlilik süresi (ay).</summary>
    public const int TermMonths = 12;

    /// <summary>Protokol Madde 5.1: fatura tarihinden itibaren ödeme vadesi (gün).</summary>
    public const int PaymentDueDays = 15;

    /// <summary>
    /// Protokol Madde 5.3: varsayılan başarı primi oranı (%). ERASMUS projelerinde
    /// PARGETTO'ya iki kişilik kontenjan verilmezse %15 uygulanır — bu yüzden oran
    /// sözleşmede SAKLANIR, sabit varsayılmaz.
    /// </summary>
    public const decimal DefaultSuccessFeePercent = 12m;

    // --- Alan uzunlukları ---
    public const int MaxNumberLength = 32;
    public const int MaxTemplateVersionLength = 32;
    public const int MaxContentHashLength = 64;   // SHA-256 hex
    public const int MaxApproverNameLength = 150;
    public const int MaxApproverTitleLength = 100;
    public const int MaxApproverEmailLength = 256;
    public const int MaxIpAddressLength = 64;
    public const int MaxUserAgentLength = 512;
    public const int MaxTerminationReasonLength = 1000;

    // --- Davet bağlantısı (kayıt talebindeki tek kullanımlık jeton) ---

    /// <summary>Jetonun ham bayt uzunluğu; base64url'e çevrilince ~43 karakter olur.</summary>
    public const int InviteTokenByteLength = 32;

    /// <summary>Jetonun SHA-256 hex özetinin uzunluğu.</summary>
    public const int InviteTokenHashLength = 64;

    /// <summary>Davet bağlantısının geçerlilik süresi (gün).</summary>
    public const int InviteValidDays = 30;
}
