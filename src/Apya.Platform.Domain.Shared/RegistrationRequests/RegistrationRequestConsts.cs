namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kayıt talebi sabitleri: alan uzunlukları ve oturumsuz formun kötüye kullanım
/// sınırları.
/// <para>
/// Uzunluklar <see cref="Apya.Platform.Tenants.TenantProfile"/> ile UYUMLU seçildi —
/// talep onaylanınca bu değerler doğrudan profile taşınacak; talep tarafı daha geniş
/// olsaydı taşıma sırasında sessiz kırpma yaşanırdı.
/// </para>
/// </summary>
public static class RegistrationRequestConsts
{
    // --- Yetkili kişi ---
    public const int MaxFullNameLength = 150;
    public const int MaxAuthorizedTitleLength = 100;
    public const int MaxEmailLength = 256;
    public const int MaxPhoneLength = 32;

    // --- Kurum ---
    public const int MaxCompanyNameLength = 200;
    public const int MaxTaxNumberLength = 50;      // TenantProfile.TaxNumber ile aynı
    public const int MaxTaxOfficeLength = 100;
    public const int MaxAddressLength = 500;
    public const int MaxCorporateEmailLength = 256; // TenantProfile.CorporateEmail ile aynı

    // --- Operasyonel iletişim ---
    public const int MaxOperationalContactNameLength = 150;
    public const int MaxOperationalContactPhoneLength = 32;

    // --- Diğer ---
    public const int MaxMessageLength = 2000;
    public const int MaxAdminNoteLength = 2000;
    public const int MaxIpAddressLength = 64;
    public const int MaxUserAgentLength = 512;

    /// <summary>Formun KVKK aydınlatma onayında kullanılacak kaynak etiketi.</summary>
    public const string ConsentSourceRef = "account/registration-request";

    /// <summary>Aynı IP'den bu pencerede kabul edilecek en fazla talep sayısı.</summary>
    public const int RateLimitMaxRequests = 3;

    /// <summary>Kötüye kullanım sayacının penceresi (saat).</summary>
    public const int RateLimitWindowHours = 1;
}
