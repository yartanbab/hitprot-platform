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
}
