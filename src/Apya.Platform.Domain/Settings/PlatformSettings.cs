namespace Apya.Platform.Settings;

public static class PlatformSettings
{
    private const string Prefix = "Platform";

    //Add your own setting names here. Example:
    //public const string MySetting1 = Prefix + ".MySetting1";

    /// <summary>
    /// Kullanıcıya özel arayüz tercihleri — host değil, her kullanıcı kendisi için ayarlar.
    /// </summary>
    public static class TaskDetail
    {
        /// <summary>
        /// Görev detayının hangi arayüzle açılacağı. Kullanıcı seviyesinde saklanır.
        ///   "v3" → en yeni ekran (VARSAYILAN): özellik sekmeleri, sağ panel, tam sayfa modu
        ///   "v2" → ortalanmış modal (Genel / Alt Görevler / Dosyalar)
        ///   "v1" → eski sağdan açılan panel (drawer)
        /// </summary>
        public const string Ui = Prefix + ".TaskDetail.Ui";
    }

    /// <summary>
    /// Uygulama kabuğu (sol menü + üst bar) tercihleri — kullanıcı seviyesinde.
    /// Yerleşim durumları (bölüm katlama, ray modu) localStorage'da yeterli;
    /// burada YALNIZ cihazlar arası taşınması gerekenler tutulur.
    /// </summary>
    public static class Shell
    {
        /// <summary>
        /// Kenar çubuğunda sabitlenen menü öğelerinin adları — virgülle ayrık
        /// (örn. "Apya.Finance.CashAccounts,Apya.Reports.Overview"). Menü ADI
        /// saklanır, etiketi değil: dil değişince veya etiket güncellenince
        /// sabitlemeler kaybolmasın.
        /// </summary>
        public const string Pins = Prefix + ".Shell.Pins";

        /// <summary>
        /// Kullanıcının kayıtlı görünümleri — JSON dizi:
        /// <c>[{"n":"Geciken işler","s":"/Tasks","q":"gecikmis=1"}]</c>
        /// Bir görünüm, ekranın FİLTRE URL'İNİN adlandırılmış anlık görüntüsüdür.
        /// Konsol filtrelerini zaten URL'e yazıp açılışta oradan okuduğu için
        /// ayrı bir şema (tablo) gerekmez ve modüle kuplaj oluşmaz.
        /// Ayar değeri sınırlı uzunlukta → adet ve ad uzunluğu kısıtlanır
        /// (bkz. PlatformSettingDefaults.ShellSavedViews*).
        /// </summary>
        public const string SavedViews = Prefix + ".Shell.SavedViews";
    }

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
    /// Giriş ekranı ayarları — host (Global) seviyesinde, oturumsuz da okunur.
    /// KRİTİK: .WithProviders(Global) DefaultValueSettingValueProvider'ı zincirden
    /// çıkarır, bu yüzden okurken GetAsync&lt;T&gt;'ye AÇIK varsayılan geçilmeli.
    /// </summary>
    public static class Account
    {
        /// <summary>
        /// Giriş ekranında kiracı (müşteri) seçici gösterilsin mi? Kapalıyken kutu hiç
        /// render edilmez; kiracı kullanıcıları yalnız host yöneticisinin
        /// impersonate akışıyla erişilir.
        /// </summary>
        public const string ShowTenantSwitch = Prefix + ".Account.ShowTenantSwitch";

        /// <summary>
        /// Giriş ekranında Google / Microsoft düğmeleri gösterilsin mi? Altyapı
        /// hazırlanana kadar kapalı; açıldığında ABP'nin yapılandırılmış harici
        /// sağlayıcıları listelenir.
        /// </summary>
        public const string ShowSocialLogin = Prefix + ".Account.ShowSocialLogin";
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
    /// <summary>Görev detay arayüzü varsayılanı: en yeni ekran (V3).</summary>
    public const string TaskDetailUi            = "v3";

    /// <summary>Geçerli görev detay arayüzü değerleri — form manipülasyonuna karşı beyaz liste.</summary>
    public static readonly string[] TaskDetailUiValues = { "v1", "v2", "v3" };

    /// <summary>
    /// Sabitlenen menü öğeleri varsayılanı — handoff'un "varsayılan: Kasa & Banka,
    /// Özet Raporlar, Başvurular" listesi. Kullanıcı iğneye ilk kez dokunduğunda
    /// kendi listesi yazılır ve bu varsayılan devreden çıkar.
    /// </summary>
    public const string ShellPins = "Apya.Finance.CashAccounts,Apya.Reports.Overview,Apya.Grants.Applications";

    /// <summary>Sabitlenebilir en fazla öğe — liste kenar çubuğunu boğmasın.</summary>
    public const int ShellPinsMax = 12;

    /// <summary>Kayıtlı görünüm varsayılanı: boş liste — hazır görünüm uydurmuyoruz.</summary>
    public const string ShellSavedViews = "[]";

    /// <summary>En fazla kayıtlı görünüm — ayar değeri sınırlı uzunlukta.</summary>
    public const int ShellSavedViewsMax = 12;

    /// <summary>Görünüm adı üst sınırı — hem UI hem ayar boyutu için.</summary>
    public const int ShellSavedViewNameMax = 40;

    /// <summary>Saklanan filtre sorgusu üst sınırı (karakter).</summary>
    public const int ShellSavedViewQueryMax = 400;

    /// <summary>Giriş ekranı kiracı seçicisi varsayılanı: KAPALI (yalnız kullanıcı girişi).</summary>
    public const bool   AccountShowTenantSwitch   = false;

    /// <summary>Google/Microsoft düğmeleri varsayılanı: KAPALI (sağlayıcı altyapısı yok).</summary>
    public const bool   AccountShowSocialLogin    = false;

    public const bool   TelemetryEnabled          = true;
    public const int    TelemetryRetentionDays    = 90;

    public const bool   FeedbackTriggerEnabled    = true;
    public const string FeedbackTriggerPlacement  = "header";
    public const int    FeedbackMaxFileSizeMb     = 5;
    public const string FeedbackAllowedExtensions = ".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.log";
    public const bool   FeedbackAllowAnonymous    = true;
}
