namespace Apya.Platform.Features;

/// <summary>
/// Tenant-bazında açılıp kapatılabilen platform özellikleri.
/// Permission'lardan farkı: feature, tenant'ın "satın aldığı" özellikleri kontrol eder
/// (örn: AI eklentisi, çoklu para birimi desteği). Permission ise kullanıcının yetkisini kontrol eder.
/// </summary>
public static class PlatformFeatures
{
    public const string GroupName = "Platform";

    /// <summary>AI yardımcı (öneri, görev üretimi vs.) bu tenant için aktif mi?</summary>
    public const string AiAssist = GroupName + ".AiAssist";

    /// <summary>TRY dışında para birimi (USD, EUR) desteği aktif mi?</summary>
    public const string MultiCurrency = GroupName + ".MultiCurrency";

    /// <summary>Mizan, FX değerleme gibi gelişmiş finansal raporlar aktif mi?</summary>
    public const string AdvancedReports = GroupName + ".AdvancedReports";

    // ── Paket (edition) yetenek kapıları ──────────────────────────────────────
    // Yeni capability feature'ları paket tavanı içindir. HOST'u ve paket atanmamış
    // eski tenant'ları bozmamak için defaultValue = "true" (paketler düşük tier'larda
    // KAPATIR). Permission'lar bu feature'lara RequireFeatures ile bağlıdır.

    /// <summary>Hibe (Grant) yönetimi modülü.</summary>
    public const string Grants = GroupName + ".Grants";

    /// <summary>Finans & muhasebe (gelir/gider/fatura/kasa/cari) modülü.</summary>
    public const string Finance = GroupName + ".Finance";

    /// <summary>Doküman yönetimi modülü.</summary>
    public const string Documents = GroupName + ".Documents";

    /// <summary>Form / dinamik varlık (DynamicAssets) modülü.</summary>
    public const string Forms = GroupName + ".Forms";

    /// <summary>Takvim entegrasyonu (Google/Outlook) modülü.</summary>
    public const string Calendar = GroupName + ".Calendar";

    // ── Sayısal limitler (paket kotaları) ─────────────────────────────────────

    /// <summary>Tenant'ın oluşturabileceği maksimum kullanıcı sayısı.</summary>
    public const string MaxUsers = GroupName + ".MaxUsers";

    /// <summary>Tenant'ın oluşturabileceği maksimum proje sayısı.</summary>
    public const string MaxProjects = GroupName + ".MaxProjects";
}
