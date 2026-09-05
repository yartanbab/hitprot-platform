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
    /// Projeler listesi tercihleri — kullanıcı seviyesinde, TaskDetail.Ui ile aynı ray.
    /// </summary>
    public static class Projects
    {
        /// <summary>
        /// Projeler ekranının açılış görünümü. Kullanıcı seviyesinde saklanır.
        ///   "card" → kart ızgarası (VARSAYILAN)
        ///   "list" → yoğun liste
        /// Araç çubuğundaki liste ⇄ kart anahtarı bunu o cihazda ezer (localStorage);
        /// buradaki değer localStorage boşken geçerli olan varsayılandır.
        /// </summary>
        public const string DefaultView = Prefix + ".Projects.DefaultView";

        /// <summary>
        /// Projeye tıklayınca sağdan açılan görev paneli (slide-over drawer) etkin mi?
        /// Kullanıcı seviyesinde saklanır, DefaultView ile aynı ray.
        ///   "false" (VARSAYILAN) → panel açılmaz; tıklama proje detay sayfasına gider
        ///   "true"  → panel açılır (eski davranış)
        /// </summary>
        public const string DetailPanel = Prefix + ".Projects.DetailPanel";

        /// <summary>
        /// Bu kiracıda GİZLENEN sistem kategorilerinin Id listesi (virgülle ayrık).
        /// Sistem kategorileri global satırlardır — kiracı onları silemez, yalnız
        /// gizleyebilir; bu yüzden görünürlük kiracı AYARINDA tutulur.
        /// "Diğer / Genel" gizlenemez: kategorisiz projenin düşeceği yer orasıdır.
        /// Kiracı seviyesinde saklanır.
        /// </summary>
        public const string HiddenCategories = Prefix + ".Projects.HiddenCategories";
    }

    /// <summary>
    /// Görev oluşturma modalının ekstra konfigürasyonları. Bunlar YETKİ DEĞİL görünüm
    /// tercihidir: kapatmak yalnız çizimi durdurur. Yetki tarafı
    /// <c>Tasks.QuickCreate</c> / <c>Tasks.ManagePlanning</c> izinlerinde, paket tarafı
    /// <c>Platform.TaskQuickEntry</c> feature'ındadır — üçü AND'lenir.
    /// </summary>
    public static class TaskCreate
    {
        /// <summary>
        /// Modal hangi katmanla açılsın? Kullanıcı seviyesinde saklanır.
        ///   "quick" → hızlı giriş satırı (VARSAYILAN)
        ///   "form"  → doğrudan sıkı form
        /// İzin ya da feature kapalıysa bu değere bakılmaksızın "form" geçerlidir.
        /// </summary>
        public const string DefaultMode = Prefix + ".TaskCreate.DefaultMode";

        /// <summary>
        /// İşaretçi ipuçları (<c>@ # ! &gt;</c>) ve <c>⌘↵</c> rozeti gösterilsin mi?
        /// Kullanıcı seviyesinde: kısayolları ezberleyen kullanıcı satırı sadeleştirir.
        /// </summary>
        public const string ShowKeyboardHints = Prefix + ".TaskCreate.ShowKeyboardHints";

        /// <summary>
        /// Eski bilgi kutusu ("Dosya ekleme, alt görevler… görev oluştuktan sonra")
        /// gösterilsin mi? KİRACI seviyesinde: yeni kullanıcıları çok olan kiracı
        /// açık tutmak isteyebilir. Varsayılan KAPALI — yeni ekranın gerekçesi buydu.
        /// </summary>
        public const string ShowInfoBanner = Prefix + ".TaskCreate.ShowInfoBanner";
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

        /// <summary>
        /// Kullanıcının menü düzeni — JSON nesne:
        /// <c>{"sections":[..],"settingsOrder":[..],"items":{"&lt;üst&gt;":[..]}}</c>
        /// Pins ile aynı gerekçe: menü ADI saklanır, etiketi değil.
        ///
        /// Model: her öğenin bir YERİ vardır — (sütun, üst öğe, sıra).
        ///   sections      → kenar çubuğunun 1. seviyesi
        ///   settingsOrder → Ayarlar sayfasının 1. seviyesi
        ///   items         → bir grubun çocukları (sütun üstten miras alınır)
        /// Üçü birlikte hem SIRAYI hem KONUMU anlatır; "şu öğe taşındı" diye ayrı
        /// bir işaret tutulmaz — öğeyi başka gruba ya da öbür sütuna taşımak,
        /// sıralamayla aynı işlemdir.
        ///
        /// Adı hiçbir listede geçmeyen öğe KODDAKİ yerinde kalır: sonradan
        /// eklenen bir menü girişi eski bir düzen yüzünden kaybolmaz.
        /// Ayar değeri sınırlı uzunlukta → adet/uzunluk kısıtlanır
        /// (bkz. PlatformSettingDefaults.ShellMenuLayout*).
        /// </summary>
        public const string MenuLayout = Prefix + ".Shell.MenuLayout";
    }

    /// <summary>
    /// Dokümanlar modülünün kurulum durumu — KİRACI seviyesinde.
    ///
    /// Takvimin sihirbazı kullanıcı seviyesinde; burada kiracı seviyesi doğru
    /// olan: klasör şeması ve kurum paketi kiracının tamamına kurulur, ikinci
    /// kullanıcı aynı sihirbazı yeniden görmemeli.
    /// </summary>
    public static class Documents
    {
        /// <summary>"true" = ilk kurulum tamamlandı, sihirbaz bir daha açılmaz.</summary>
        public const string SetupCompleted = Prefix + ".Documents.SetupCompleted";

        /// <summary>Kurulumda seçilen klasör şeması ("workstep" | "period" | "mixed").</summary>
        public const string SetupSchema = Prefix + ".Documents.SetupSchema";
    }

    /// <summary>
    /// Takvim tercihleri — kullanıcı seviyesinde, Projects.DefaultView ile aynı ray.
    /// </summary>
    public static class Calendar
    {
        /// <summary>
        /// Günlük kapasite (saat). Gün hücresindeki yük çubuğu ve "kapasite aşımı"
        /// uyarısı buna göre hesaplanır. "0" = kapasite takibi KAPALI: çubuk çizilmez.
        /// Yük yalnız açık görevlerin tahmini süresinden toplanır.
        /// </summary>
        public const string DailyCapacityHours = Prefix + ".Calendar.DailyCapacityHours";

        /// <summary>
        /// İlk kurulum sihirbazı tamamlandı mı? "true" = bir daha gösterilmez.
        /// Kullanıcı seviyesinde; ayar ekranında GÖSTERİLMEZ (iç değer).
        /// </summary>
        public const string SetupCompleted = Prefix + ".Calendar.SetupCompleted";

        /// <summary>
        /// Takvimde açık kaynak türleri — CalendarSourceType sayıları, virgülle ayrık.
        /// Boş = hepsi açık. Kurulumda seçilir, cihazlar arası taşınır (localStorage
        /// yalnız o cihazdaki geçici tercihtir).
        /// </summary>
        public const string Sources = Prefix + ".Calendar.Sources";
    }

    /// <summary>
    /// İlk giriş tanıtım turu — kullanıcı seviyesinde görülme takibi
    /// (Calendar.SetupCompleted ile aynı ray).
    /// </summary>
    public static class Tour
    {
        /// <summary>
        /// Tanıtım turu tamamlandı veya atlandı mı? "true" = ilk açılışta bir daha
        /// gösterilmez (kullanıcı menüsünden istenildiğinde yine açılabilir).
        /// Kullanıcı seviyesinde saklanır, cihazlar arası taşınır; ayar ekranında
        /// GÖSTERİLMEZ (iç değer).
        /// </summary>
        public const string Completed = Prefix + ".Tour.Completed";
    }

    /// <summary>
    /// Zorunlu çerez bilgilendirme şeridi — kullanıcı seviyesinde onay takibi
    /// (Tour.Completed ile aynı ray).
    /// </summary>
    public static class CookieNotice
    {
        /// <summary>
        /// Şeritteki "Anladım" onayı verildi mi? "true" = şerit bir daha gösterilmez.
        /// Onay ÖNCE <c>apya_cookie_ack</c> çerezine yazılır; bu ayar giriş yapmış
        /// kullanıcı için İKİNCİ ve kalıcı dayanaktır — çerez temizlense, başka
        /// tarayıcıya geçilse ya da çerez ömrü dolsa bile şerit geri gelmez.
        /// Kullanıcı seviyesinde saklanır; ayar ekranında GÖSTERİLMEZ (iç değer).
        /// </summary>
        public const string Acknowledged = Prefix + ".CookieNotice.Acknowledged";
    }

    /// <summary>Sürüm notları ("Yenilikler") — kullanıcı seviyesinde görülme takibi.</summary>
    public static class ReleaseNotes
    {
        /// <summary>
        /// Kullanıcının en son gördüğü sürüm notu <c>Version</c>'ı (örn. "2026.08.16").
        /// Boş = hiç görmedi. Katalogdaki en yeni sürümden farklıysa ilk açılışta
        /// "Yenilikler" penceresi açılır. Kullanıcı seviyesinde saklanır (cihazlar arası taşınır).
        /// </summary>
        public const string LastSeenVersion = Prefix + ".ReleaseNotes.LastSeenVersion";
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

        /// <summary>
        /// Geri bildirim EKLERİNİN (ekran görüntüsü vb.) saklanma süresi (gün). Süre
        /// dolunca ekin dosyası ve kaydı imha edilir; geri bildirim METNİ korunur
        /// (ürün hafızası). KVKK: ekran görüntüleri kişisel veri içerebildiği için
        /// süresiz saklanmaz.
        /// </summary>
        public const string AttachmentRetentionDays = Prefix + ".Feedback.AttachmentRetentionDays";
    }

    /// <summary>
    /// Geri bildirim / hata sinyallerinin göreve dönüştürülmesi. Hepsi host seviyesindedir —
    /// görev host projesinde açılır, kaynak hangi kiracıdan gelirse gelsin.
    /// </summary>
    public static class IssueTasks
    {
        /// <summary>Görevlerin açılacağı HOST projesinin Id'si. Boşsa dönüştürme çalışmaz.</summary>
        public const string TargetProjectId = Prefix + ".IssueTasks.TargetProjectId";

        /// <summary>Otomatik açılan görevlerin varsayılan sorumlusu. Boş bırakılabilir.</summary>
        public const string DefaultAssigneeId = Prefix + ".IssueTasks.DefaultAssigneeId";

        /// <summary>Eşiği geçen sinyaller için görev otomatik açılsın mı?</summary>
        public const string AutoCreateEnabled = Prefix + ".IssueTasks.AutoCreateEnabled";

        /// <summary>Otomatik görev açılacak en düşük geri bildirim önceliği (FeedbackPriority sayısal değeri).</summary>
        public const string FeedbackMinPriority = Prefix + ".IssueTasks.FeedbackMinPriority";

        /// <summary>İstemci hatasının otomatik göreve dönüşmesi için gereken oluşum sayısı.</summary>
        public const string ClientErrorThreshold = Prefix + ".IssueTasks.ClientErrorThreshold";

        /// <summary>Sunucu hatasının otomatik göreve dönüşmesi için gereken tekrar sayısı.</summary>
        public const string ServerErrorThreshold = Prefix + ".IssueTasks.ServerErrorThreshold";

        /// <summary>Görev tamamlandığında kaynak kayıt da kapatılsın mı? (Geri bağ.)</summary>
        public const string CloseSourceOnTaskDone = Prefix + ".IssueTasks.CloseSourceOnTaskDone";
    }

    /// <summary>
    /// Paket süresi / abonelik davranışı — hepsi host (Global) seviyesinde.
    /// KRİTİK: .WithProviders(Global) DefaultValueSettingValueProvider'ı zincirden
    /// çıkarır, bu yüzden okurken GetAsync&lt;T&gt;'ye AÇIK varsayılan geçilmeli.
    /// </summary>
    public static class Subscription
    {
        /// <summary>
        /// Süresi dolan kiracı otomatik olarak Basic'e düşürülsün mü? Kapalıyken süre
        /// işleyicisi yalnız uyarı üretir, paketi DEĞİŞTİRMEZ — özelliği canlıda önce
        /// izleyip sonra açmak isteyen host için kaçış kapısı.
        /// </summary>
        public const string AutoDowngradeEnabled = Prefix + ".Subscription.AutoDowngradeEnabled";

        /// <summary>
        /// Bitiş tarihinden sonra paketin açık kalmaya devam ettiği ek süre (gün).
        /// "0" (VARSAYILAN) = ek süre yok, bitişte düşer.
        /// </summary>
        public const string GraceDays = Prefix + ".Subscription.GraceDays";

        /// <summary>
        /// "Süreniz doluyor" bildiriminin kaç gün kala gönderileceği — virgülle ayrık
        /// ("7,1"). Her eşik için dönem başına bir bildirim gider. Boş = uyarı gönderilmez.
        /// </summary>
        public const string WarningDays = Prefix + ".Subscription.WarningDays";

        // --- Yükseltme kanalı ---
        // Kiracının "Paketim" ekranındaki yükseltme çağrısının nereye gideceği. ÜÇÜ DE BOŞSA
        // ekranda hiçbir çağrı basılmaz: yapılandırılmamış bir düğme kullanıcıyı boşa çıkarır.

        /// <summary>Yükseltme talebi için satış e-postası. Boş = e-posta düğmesi gösterilmez.</summary>
        public const string UpgradeContactEmail = Prefix + ".Subscription.UpgradeContactEmail";

        /// <summary>Yükseltme talebi için telefon. Boş = telefon düğmesi gösterilmez.</summary>
        public const string UpgradeContactPhone = Prefix + ".Subscription.UpgradeContactPhone";

        /// <summary>Dış satış/fiyat sayfası adresi. Boş = bağlantı gösterilmez.</summary>
        public const string UpgradeUrl = Prefix + ".Subscription.UpgradeUrl";
    }

    /// <summary>
    /// Satış paketlerinin yıllık liste bedeli (TL, KDV hariç) — protokolün 3. maddesindeki
    /// "Yıllık Lisans/Kullanım Bedeli".
    ///
    /// <para><b>Neden ayar, neden kod sabiti değil:</b> bedel ticari bir karardır ve zamla
    /// değişir; sürüm çıkmadan güncellenebilmeli.</para>
    ///
    /// <para><b>Neden paket başına ayrı ayar:</b> tek bir "fiyat listesi" metni ayrıştırma
    /// gerektirir ve ayar ekranında tek bir kutuya sıkışırdı. Yeni bir satış paketi
    /// eklenirse buraya bir sabit daha girer — açık ve okunaklı kalır.</para>
    ///
    /// <para>Boş ya da "0" = <b>tanımlı değil</b>: sistem bedeli kendiliğinden yazmaz,
    /// host onay ekranında elle girer. Uydurulmuş bir rakamın sözleşmeye geçmesindense
    /// alanın boş kalması yeğdir.</para>
    /// </summary>
    public static class Pricing
    {
        public const string StandardPlan = Prefix + ".Pricing.StandardPlan";
        public const string CorporatePlan = Prefix + ".Pricing.CorporatePlan";
        public const string JointPlan = Prefix + ".Pricing.JointPlan";
    }
}

/// <summary>Ayarların kod içinde tekrarlanmaması için varsayılanlar tek yerde.</summary>
public static class PlatformSettingDefaults
{
    /// <summary>Görev detay arayüzü varsayılanı: en yeni ekran (V3).</summary>
    public const string TaskDetailUi            = "v3";

    /// <summary>Geçerli görev detay arayüzü değerleri — form manipülasyonuna karşı beyaz liste.</summary>
    public static readonly string[] TaskDetailUiValues = { "v1", "v2", "v3" };

    /// <summary>Projeler ekranı varsayılan görünümü: kart ızgarası.</summary>
    public const string ProjectsDefaultView = "card";

    /// <summary>Geçerli Projeler görünüm değerleri — form manipülasyonuna karşı beyaz liste.</summary>
    public static readonly string[] ProjectsDefaultViewValues = { "card", "list" };

    /// <summary>Proje görev paneli varsayılanı: KAPALI (şimdilik gizli; ayardan açılır).</summary>
    public const bool ProjectsDetailPanel = false;

    /// <summary>Görev oluşturma modalı varsayılan katmanı: hızlı giriş satırı.</summary>
    public const string TaskCreateDefaultMode = "quick";

    /// <summary>Geçerli katman değerleri — form manipülasyonuna karşı beyaz liste.</summary>
    public static readonly string[] TaskCreateDefaultModeValues = { "quick", "form" };

    /// <summary>İşaretçi/kısayol ipuçları varsayılanı: AÇIK (ekranın öğrenilmesi buna bağlı).</summary>
    public const bool TaskCreateShowKeyboardHints = true;

    /// <summary>Eski bilgi kutusu varsayılanı: KAPALI — yeni ekranın çıkış noktası buydu.</summary>
    public const bool TaskCreateShowInfoBanner = false;

    /// <summary>
    /// Günlük kapasite varsayılanı: 8 saat. Kullanıcı ilk kurulumda 4/6/8 veya
    /// "kapalı" (0) seçer; 0 seçilirse kapasite çubukları hiç çizilmez.
    /// </summary>
    public const string CalendarDailyCapacityHours = "8";

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

    /// <summary>
    /// Menü düzeni varsayılanı: BOŞ — "kullanıcı hiç dokunmadı" demek. Boşken
    /// menü koda gömülü hâliyle basılır; kullanıcı ilk kaydettiğinde JSON yazılır.
    /// </summary>
    public const string ShellMenuLayout = "";

    /// <summary>Menü düzeni JSON'unun ham uzunluk sınırı — manipüle edilmiş istek ayarı şişirmesin.</summary>
    public const int ShellMenuLayoutMaxChars = 8000;

    /// <summary>Bir düzen listesindeki en fazla menü adı (sections / settingsOrder / items değeri).</summary>
    public const int ShellMenuLayoutListMax = 60;

    /// <summary>items sözlüğündeki en fazla grup anahtarı.</summary>
    public const int ShellMenuLayoutGroupMax = 40;

    /// <summary>Tek bir menü adının en fazla uzunluğu (örn. "Apya.Finance.CashAccounts").</summary>
    public const int ShellMenuLayoutNameMax = 128;

    /// <summary>
    /// Kullanıcının kendi kurduğu kategori/kısayol adlarının ön eki. Koddaki
    /// menü adlarıyla çakışmasın diye ayrı ad alanı; ALT ÇİZGİ İÇEREMEZ çünkü
    /// LeptonX id'yi `MenuItem_Apya_User_ab12` diye basıyor ve
    /// apya-sidebar-shell.js `_` → `.` çevirisiyle geri okuyor.
    /// </summary>
    public const string ShellMenuLayoutCustomPrefix = "Apya.User.";

    /// <summary>En fazla kaç özel kategori kurulabilir.</summary>
    public const int ShellMenuLayoutCustomGroupMax = 10;

    /// <summary>En fazla kaç özel kısayol eklenebilir.</summary>
    public const int ShellMenuLayoutCustomLinkMax = 20;

    /// <summary>Özel kategori/kısayol başlığı üst sınırı — kenar çubuğu dar.</summary>
    public const int ShellMenuLayoutTitleMax = 40;

    /// <summary>Özel kısayolun hedef yolu üst sınırı (ShellSavedViewQueryMax ile aynı ray).</summary>
    public const int ShellMenuLayoutUrlMax = 200;

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

    /// <summary>Geri bildirim ekleri varsayılan saklama süresi: 180 gün (6 ay).</summary>
    public const int    FeedbackAttachmentRetentionDays = 180;

    /// <summary>Ek saklama süresi alt/üst sınırı — form manipülasyonuna karşı clamp.</summary>
    public const int    FeedbackAttachmentRetentionMinDays = 30;
    public const int    FeedbackAttachmentRetentionMaxDays = 3650;

    /// <summary>Otomatik görev açma varsayılanı: KAPALI — eşikler ayarlanmadan görev üretmesin.</summary>
    public const bool   IssueTaskAutoCreateEnabled = false;

    /// <summary>Otomatik göreve dönüşen en düşük geri bildirim önceliği: Kritik (FeedbackPriority.Critical).</summary>
    public const int    IssueTaskFeedbackMinPriority = 4;

    /// <summary>Görev tamamlanınca kaynağı kapatma varsayılanı: AÇIK — döngü kapansın.</summary>
    public const bool   IssueTaskCloseSourceOnTaskDone = true;

    /// <summary>Otomatik düşürme varsayılanı: AÇIK. Aboneliği olmayan kiracı zaten süresiz sayılır.</summary>
    public const bool   SubscriptionAutoDowngradeEnabled = true;

    /// <summary>Ek süre varsayılanı: 0 gün — bitiş tarihinde düşer.</summary>
    public const int    SubscriptionGraceDays = 0;

    /// <summary>Ek süre üst sınırı — form manipülasyonuna karşı clamp.</summary>
    public const int    SubscriptionGraceMaxDays = 90;

    /// <summary>Uyarı eşikleri varsayılanı: 7 ve 1 gün kala.</summary>
    public const string SubscriptionWarningDays = "7,1";
}
