namespace Apya.Platform.Permissions;

public static class PlatformPermissions
{
    public const string GroupName = "Platform";

    // İzin grubu adları (UI kategorileri). Permission adlarıyla çakışmaması için
    // "...Group" sonekli; permission isimleri (GroupName + ".Incomes" vb.) DEĞİŞMEZ.
    public static class Groups
    {
        public const string Work       = GroupName + ".WorkGroup";       // Proje & Görev
        public const string Grants     = GroupName + ".GrantsGroup";     // Hibe
        public const string Finance    = GroupName + ".FinanceGroup";    // Finans & Muhasebe
        public const string Accounting = GroupName + ".AccountingGroup"; // Cari & Kasa
        public const string Content    = GroupName + ".ContentGroup";    // İçerik & Doküman
        public const string System     = GroupName + ".SystemGroup";     // Sistem & Entegrasyon
    }

    // --- GELİR YETKİLERİ ---
    public static class Incomes
    {
        public const string Default = GroupName + ".Incomes";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- YIL SONU DEĞERLEME YETKİLERİ ---
    public static class FxRevaluations
    {
        public const string Default = GroupName + ".FxRevaluations";
        public const string Run = Default + ".Run";
        public const string Delete = Default + ".Delete";
    }

    // --- CARİ (MÜŞTERİ) YETKİLERİ ---
    public static class Customers
    {
        public const string Default = GroupName + ".Customers";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- KASA YETKİLERİ ---
    public static class CashAccounts
    {
        public const string Default = GroupName + ".CashAccounts";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- KUR YETKİLERİ ---
    public static class ExchangeRates
    {
        public const string Default = GroupName + ".ExchangeRates";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- GİDER YETKİLERİ ---
    public static class Expenses
    {
        public const string Default = GroupName + ".Expenses";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- KASA HAREKETİ YETKİLERİ ---
    public static class CashMovements
    {
        public const string Default = GroupName + ".CashMovements";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- PROJE YETKİLERİ ---
    public static class Projects
    {
        public const string Default = GroupName + ".Projects"; // Projeleri görme yetkisi
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
        public const string ViewBudget = Default + ".ViewBudget"; // Bütçe alanını görme yetkisi (Özel)
        public const string ManageTeam = Default + ".ManageTeam"; // Projeye üye ekleme/çıkarma
        public const string UseAiFeatures = Default + ".UseAiFeatures";
        public const string ManageCategories = Default + ".ManageCategories"; // Proje kategorilerini tanımlama
    }

    // --- GÖREV (TASK) YETKİLERİ ---
    public static class Tasks
    {
        public const string Default = GroupName + ".Tasks"; // Görevleri listeleme
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit"; // İçerik düzenleme
        public const string Delete = Default + ".Delete";
        public const string Assign = Default + ".Assign"; // Başkasına görev atama
        public const string ChangeStatus = Default + ".ChangeStatus"; // Durum değiştirme (Tamamla/Geri Al)

        /// <summary>
        /// Görev oluşturma modalındaki hızlı giriş satırı (işaretçiyle yazma). Yoksa modal
        /// doğrudan sıkı form modunda açılır — oluşturma yeteneği kaybolmaz, yalnız kısayol gider.
        /// </summary>
        public const string QuickCreate = Default + ".QuickCreate";

        /// <summary>
        /// Planlama alanlarını (tahmini süre, görev tipi, sprint, üst görev) görme ve set etme.
        /// Yoksa "Daha fazla" açılırı hiç çizilmez ve bu alanlar sunucuda da yok sayılır.
        /// </summary>
        public const string ManagePlanning = Default + ".ManagePlanning";

        /// <summary>
        /// Görevi ekip dışından birine süreli link ile açma (misafir erişimi). Link üretmeyi,
        /// listelemeyi ve iptal etmeyi kapsar. Feature kapısı YOK — bkz.
        /// <c>TaskSharePermissionDataSeedContributor</c>: kapısız izin mevcut kiracılara paket
        /// akışından ulaşmaz, tavan ve grant ayrıca telafi edilir.
        /// </summary>
        public const string ShareExternally = Default + ".ShareExternally";
    }

    // --- WIKI / DOKÜMANTASYON YETKİLERİ ---
    public static class Documents
    {
        public const string Default = GroupName + ".Documents";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
        public const string ViewAccessLog = Default + ".ViewAccessLog";

        /// <summary>Belge meta verisini (tür, tutar, dönem, özel alanlar) düzenleme.</summary>
        public const string ManageMeta = Default + ".ManageMeta";

        /// <summary>Toplu taşıma/etiketleme — çok sayıda kaydı tek işlemde değiştirir.</summary>
        public const string BulkOperations = Default + ".BulkOperations";

        /// <summary>Kurum paketi uygulama, kontrol listesi kalemi feragati ve elle bağlama.</summary>
        public const string ManageCompliance = Default + ".ManageCompliance";

        /// <summary>Teslim paketi kurma ve rapor üretme.</summary>
        public const string GenerateReports = Default + ".GenerateReports";

        /// <summary>Süreli dış paylaşım linki oluşturma/iptal etme — veriyi kurum dışına açar.</summary>
        public const string ShareExternally = Default + ".ShareExternally";

        /// <summary>Yönetim ekranı: meta şema yazma, kural motoru, alan bazlı izinler, entegrasyonlar.</summary>
        public const string Administer = Default + ".Administer";
    }

    // --- BİLDİRİM YETKİLERİ ---
    public static class Notifications
    {
        // Yalnızca görüntüleme izni var: bildirimi okumak/silmek kullanıcının kendi
        // kaydı üzerinde yaptığı iştir, ayrı izne bağlanmaz. (MarkRead/Delete alt
        // izinleri tanımlıydı ama hiçbir yerde kullanılmıyordu.)
        public const string Default = GroupName + ".Notifications";
    }

    // --- TAKVİM YETKİLERİ ---
    public static class Calendars
    {
        public const string Default = GroupName + ".Calendars";
        public const string Connect = Default + ".Connect";
    }

    // --- FATURA YETKİLERİ ---
    public static class Invoices
    {
        public const string Default = GroupName + ".Invoices";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- RAPOR YETKİLERİ ---
    public static class Reports
    {
        public const string Default = GroupName + ".Reports";
        public const string TrialBalance = Default + ".TrialBalance";
    }

    // --- RIZA / KVKK ANALİZ YETKİLERİ ---
    public static class Consents
    {
        public const string Default = GroupName + ".Consents"; // Rıza analiz panelini görüntüleme
    }

    // --- DİNAMİK VARLIK (FORM/ŞABLON) YETKİLERİ ---
    public static class DynamicAssets
    {
        public const string Default = GroupName + ".DynamicAssets";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
        public const string Publish = Default + ".Publish";                   // Formu yayınla/arşivle
        public const string ViewResponses = Default + ".ViewResponses";       // Yanıtları görüntüle/yönet
        public const string Export = Default + ".Export";                     // Yanıtları dışa aktar
        public const string ManageCategories = Default + ".ManageCategories"; // Form kategorilerini yönet
    }

    // --- TENANT AYAR YETKİLERİ (AI vb.) ---
    public static class TenantSettings
    {
        public const string Default = GroupName + ".TenantSettings";
        public const string ManageAi = Default + ".ManageAi";
    }

    // --- GERİ BİLDİRİM YÖNETİMİ (host) ---
    // NOT: Geri bildirim GÖNDERMEK izin gerektirmez — yalnızca [Authorize]. İzne bağlanırsa
    // yeni tenant'larda kapalı gelir ve kimse geri bildirim veremez; amaç tam tersi.
    // Buradaki izinler sadece yönetici panelini kapsar.
    public static class Feedbacks
    {
        public const string Default = GroupName + ".Feedbacks"; // paneli görme
        public const string Respond = Default + ".Respond";     // durum/öncelik/etiket + cevap
        public const string Assign  = Default + ".Assign";      // kayda sorumlu atama
        public const string Delete  = Default + ".Delete";
        public const string Export  = Default + ".Export";
        public const string ManageSettings = Default + ".ManageSettings"; // ayarlar ekranı
    }

    // --- GİRİŞ EKRANI (host) ---
    // Giriş ekranı yapılandırması: kiracı seçici ve sosyal giriş düğmelerinin görünürlüğü.
    // Ayarları OKUMAK izin gerektirmez — giriş sayfası oturumsuz render edilir; yalnız
    // yazmak bu izne bağlıdır.
    public static class LoginScreen
    {
        public const string Default = GroupName + ".LoginScreen";
    }

    // --- SİSTEM SAĞLIĞI / TELEMETRİ (host) ---
    public static class SystemHealth
    {
        public const string Default = GroupName + ".SystemHealth";
        public const string Resolve = Default + ".Resolve"; // istemci hatasını çözüldü işaretle
    }

    /// <summary>
    /// Geri bildirim ve hata sinyallerini göreve dönüştürme köprüsü. Host-only:
    /// görev host projesinde açılır, kaynak hangi kiracıdan gelirse gelsin.
    /// </summary>
    public static class IssueTasks
    {
        public const string Default = GroupName + ".IssueTasks"; // bağı görme + göreve dönüştürme
        public const string ManageSettings = Default + ".ManageSettings"; // hedef proje ve otomatik kural ayarları
    }

    // --- HİBE YETKİLERİ ---
    public static class Grants
    {
        public const string Default = GroupName + ".Grants";
        public const string Create = Default + ".Create";
        public const string Edit   = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }
}