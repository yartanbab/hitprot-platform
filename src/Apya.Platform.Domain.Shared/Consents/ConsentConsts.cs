namespace Apya.Platform.Consents;

/// <summary>
/// Rıza omurgası sabitleri: alan uzunlukları ve güncel politika sürümleri.
/// Politika metni değişince ilgili sürüm artırılır; eski onaylar tarihsel kalır
/// (yeni sürüm için yeniden onay istenebilir).
/// </summary>
public static class ConsentConsts
{
    public const int MaxSubjectIdLength = 128;
    public const int MaxPolicyVersionLength = 32;
    public const int MaxAcceptedCategoriesLength = 512;
    public const int MaxIpAddressLength = 64;
    public const int MaxUserAgentLength = 512;
    public const int MaxSourceRefLength = 256;

    /// <summary>Çerez bilgilendirme metninin güncel sürümü.</summary>
    public const string CookiePolicyVersion = "cookie-v1";

    /// <summary>Form KVKK aydınlatma metninin güncel sürümü.</summary>
    public const string KvkkPolicyVersion = "kvkk-v1";

    /// <summary>
    /// Hizmet protokolünün güncel sürümü. <b>Protokol metni değişince BURASI da
    /// artırılmalı</b> — rıza kaydı hangi metne onay verildiğini yalnız bu alanla
    /// gösterir; sürüm sabit kalırsa eski onaylar yeni metne verilmiş görünür.
    /// Şablonun kendi sürümüyle aynı tutulur: <c>ServiceAgreementConsts.TemplateVersion</c>.
    /// </summary>
    public const string ServiceAgreementPolicyVersion = "protokol-v1";

    /// <summary>Oturumsuz ziyaretçiyi tanımlayan çerezin adı (rıza tekrarını önler).</summary>
    public const string AnonymousIdCookieName = "apya_cid";

    /// <summary>Çerez şeridinin tekrar gösterilmemesi için kullanılan çerez adı.</summary>
    public const string CookieNoticeAckCookieName = "apya_cookie_ack";
}
