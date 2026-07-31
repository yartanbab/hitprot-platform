namespace Apya.Platform.Settings;

public static class PlatformSettings
{
    private const string Prefix = "Platform";

    //Add your own setting names here. Example:
    //public const string MySetting1 = Prefix + ".MySetting1";

    public static class Telemetry
    {
        /// <summary>
        /// İstemci hata telemetrisi toplanıyor mu? Kapatıldığında raporlar sessizce
        /// yok sayılır — istemciye hata dönmez.
        /// </summary>
        public const string Enabled = Prefix + ".Telemetry.Enabled";

        /// <summary>
        /// Audit log ve istemci hata kayıtlarının saklanma süresi (gün).
        /// Ayarlar ekranından veya DB'den değiştirilebilir; kod değişikliği gerekmez.
        /// Geri bildirimler bu süreden ETKİLENMEZ, silinmez.
        /// </summary>
        public const string RetentionDays = Prefix + ".Telemetry.RetentionDays";
    }

    /// <summary>
    /// Geri bildirim modülü ayarları — hepsi host (Global) seviyesinde.
    /// KRİTİK: .WithProviders(Global) DefaultValueSettingValueProvider'ı zincirden
    /// çıkarır, bu yüzden okurken GetAsync&lt;T&gt;'ye AÇIK varsayılan geçilmeli.
    /// </summary>
    public static class Feedback
    {
        /// <summary>Global "Geri Bildirim" tetikleyicisi gösterilsin mi?</summary>
        public const string TriggerEnabled = Prefix + ".Feedback.TriggerEnabled";

        /// <summary>Tetikleyici konumu: "header" (varsayılan) veya "floating" (sağ-alt sabit buton).</summary>
        public const string TriggerPlacement = Prefix + ".Feedback.TriggerPlacement";

        /// <summary>Formda seçilebilen türler — virgülle ayrık enum sayısal değerleri. Boş = hepsi.</summary>
        public const string EnabledTypes = Prefix + ".Feedback.EnabledTypes";

        /// <summary>Tek dosya için en büyük boyut (MB).</summary>
        public const string MaxFileSizeMb = Prefix + ".Feedback.MaxFileSizeMb";

        /// <summary>İzin verilen dosya uzantıları — virgülle ayrık, noktalı (".png,.jpg").</summary>
        public const string AllowedFileExtensions = Prefix + ".Feedback.AllowedFileExtensions";

        /// <summary>Kullanıcı anonim gönderebilir mi?</summary>
        public const string AllowAnonymous = Prefix + ".Feedback.AllowAnonymous";
    }
}

/// <summary>Ayarların kod içinde tekrarlanmaması için varsayılanlar tek yerde.</summary>
public static class PlatformSettingDefaults
{
    public const bool   TelemetryEnabled          = true;
    public const int    TelemetryRetentionDays    = 90;

    public const bool   FeedbackTriggerEnabled    = true;
    public const string FeedbackTriggerPlacement  = "header";
    public const int    FeedbackMaxFileSizeMb     = 5;
    public const string FeedbackAllowedExtensions = ".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.log";
    public const bool   FeedbackAllowAnonymous    = true;
}
