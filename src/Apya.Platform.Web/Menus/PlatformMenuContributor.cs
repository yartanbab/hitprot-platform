using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Features;
using Apya.Platform.Localization;
using Apya.Platform.Permissions;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Volo.Abp.UI.Navigation;

namespace Apya.Platform.Web.Menus;

public class PlatformMenuContributor : IMenuContributor
{
    public async Task ConfigureMenuAsync(MenuConfigurationContext context)
    {
        if (context.Menu.Name == StandardMenus.Main)
        {
            await ConfigureMainMenuAsync(context);
        }
        else if (context.Menu.Name == StandardMenus.User)
        {
            ConfigureUserMenu(context);
        }
    }

    // Sağ üst avatar menüsüne kişisel "Genel Ayarlar" linki. Yalnız oturumlu kullanıcı
    // bu menüyü görür → ayrı izin gerekmez.
    private void ConfigureUserMenu(MenuConfigurationContext context)
    {
        var l = context.GetLocalizer<PlatformResource>();
        context.Menu.AddItem(new ApplicationMenuItem(
            "Apya.Account.Settings",
            l["Menu:GeneralSettings"],
            icon: "fa fa-sliders",
            url: "/Settings",
            order: 100));
    }

    private async Task ConfigureMainMenuAsync(MenuConfigurationContext context)
    {
        var l = context.GetLocalizer<PlatformResource>();
        var permission = context.ServiceProvider.GetRequiredService<IPermissionChecker>();
        var feature = context.ServiceProvider.GetRequiredService<IFeatureChecker>();
        var currentTenant = context.ServiceProvider.GetRequiredService<ICurrentTenant>();

        context.Menu.AddItem(new ApplicationMenuItem(
            "Apya.Dashboard", l["Menu:Dashboard"], icon: "fa fa-chart-line", url: "/Dashboard", order: 1));

        // İşler
        // NOT: eskiden burada ayrı bir "Ana Sayfa" (PlatformMenus.Home, url "~/") öğesi de vardı —
        // "Projeler" ile aynı (bozuk) "/" URL'sine gidiyordu, hedef tasarımda da yok; kaldırıldı.
        //
        // Kabuk handoff'u (2026-08-13): bölüm iki maddeye iner — "Projeler" yaprak kalır,
        // görünüm ekranları "Panolar" alt grubunda toplanır. Panolar proje bağımsız
        // kapsayıcı görünümlerdir (tüm projelerdeki görevler), bu yüzden Projeler'in
        // altında değil kardeşi olarak durur.
        var work = new ApplicationMenuItem("Apya.Work", l["Menu:Work"], icon: "fa fa-briefcase", order: 2);
        if (await permission.IsGrantedAsync(PlatformPermissions.Projects.Default))
            work.AddItem(new ApplicationMenuItem("Apya.Work.Projects", l["Menu:Projects"], icon: "fa fa-rocket", url: "/Projects", order: 1));

        // Handoff'un Panolar listesinde Gantt ve Zaman Çizelgesi de var; ikisinin de
        // bağımsız sayfası YOK (Gantt yalnız proje detay konsolunun içinde yaşıyor).
        // Olmayan ekrana menü girişi açmıyoruz — handoff'un "yalnız çalışan şeyi listele"
        // kuralı kısayol penceresi için konmuş, aynı kural menüde de geçerli.
        var boards = new ApplicationMenuItem("Apya.Work.Boards", l["Menu:Boards"], icon: "fa fa-table-columns", order: 2);
        if (await permission.IsGrantedAsync(PlatformPermissions.Tasks.Default))
        {
            boards.AddItem(new ApplicationMenuItem("Apya.Work.Tasks", l["Menu:Tasks"], icon: "fa fa-tasks", url: "/Tasks"));
            boards.AddItem(new ApplicationMenuItem("Apya.Work.Board", l["Menu:KanbanBoard"], icon: "fa fa-columns", url: "/Board"));
        }
        if (await permission.IsGrantedAsync(PlatformPermissions.Calendars.Default))
            boards.AddItem(new ApplicationMenuItem("Apya.Work.Calendar", l["Menu:Calendar"], icon: "fa fa-calendar-days", url: "/Calendars"));
        if (boards.Items.Count > 0) work.AddItem(boards);

        if (work.Items.Count > 0) context.Menu.AddItem(work);

        // Hibe Yönetimi — kendi izin grubu (Groups.Grants) ve kendi feature'ı (Features.Grants)
        // olduğu için İş Yönetimi'nden ayrı kategori. "Başvurular" sayfası HOST'a özel
        // (GrantApplicationHostAppService.EnsureHostContext) → tenant menüsünde gösterilmez.
        var grants = new ApplicationMenuItem("Apya.Grants", l["Menu:Grants:Group"], icon: "fa fa-award", order: 3);
        if (await permission.IsGrantedAsync(PlatformPermissions.Grants.Default))
            grants.AddItem(new ApplicationMenuItem("Apya.Grants.Calls", l["Menu:Grants:Calls"], icon: "fa fa-bullhorn", url: "/Grants"));
        if (currentTenant.Id == null && await permission.IsGrantedAsync(PlatformPermissions.Grants.Edit))
            grants.AddItem(new ApplicationMenuItem("Apya.Grants.Applications", l["Menu:Grants:Applications"], icon: "fa fa-file-signature", url: "/Grants/Applications"));
        if (grants.Items.Count > 0) context.Menu.AddItem(grants);

        // Finans — Faz 1 sadeleştirme: yalnızca günlük işlem + hesap öğeleri kalır.
        // Raporlar tek "Raporlar" menüsünde toplandı. Kurlar bir dönem Yönetim'e
        // taşınmıştı; kabuk handoff'u (2026-08-13) onu Finans'a geri aldı — kur bir
        // finans verisi, yönetim ayarı değil.
        var finance = new ApplicationMenuItem("Apya.Finance", l["Menu:Finance"], icon: "fa fa-coins", order: 4);
        // Sıralama (kullanıcı kararı 2026-06-22): 1) Kasalar  2) Para Hareketleri.
        if (await permission.IsGrantedAsync(PlatformPermissions.CashAccounts.Default))
            finance.AddItem(new ApplicationMenuItem("Apya.Finance.CashAccounts", l["Menu:CashAccounts"], icon: "fa fa-cash-register", url: "/CashAccounts", order: 1));
        // Para Hareketleri hub'ı (Faz 2): Gelir + Gider + Fatura tek listede toplandı.
        // Ayrı Giderler/Gelirler/Faturalar menü öğeleri kaldırıldı (sayfalar hub'dan erişilebilir).
        if (await permission.IsGrantedAsync(PlatformPermissions.Incomes.Default)
            || await permission.IsGrantedAsync(PlatformPermissions.Expenses.Default)
            || await permission.IsGrantedAsync(PlatformPermissions.Invoices.Default))
            finance.AddItem(new ApplicationMenuItem("Apya.Finance.Hub", l["Menu:FinanceHub"], icon: "fa fa-right-left", url: "/Finance", order: 2));
        if (await permission.IsGrantedAsync(PlatformPermissions.ExchangeRates.Default))
            finance.AddItem(new ApplicationMenuItem("Apya.Finance.ExchangeRates", l["Menu:ExchangeRates"], icon: "fa fa-money-bill-transfer", url: "/ExchangeRates", order: 3));
        // Cariler kullanıcı kararıyla menüden gizlendi (2026-06-22). /Customers sayfası korunur;
        // izinli kullanıcı doğrudan erişebilir. Geri açmak için aşağıyı yorumdan çıkar:
        // if (await permission.IsGrantedAsync(PlatformPermissions.Customers.Default))
        //     finance.AddItem(new ApplicationMenuItem("Apya.Finance.Customers", l["Menu:Customers"], icon: "fa fa-id-card", url: "/Customers"));
        if (finance.Items.Count > 0) context.Menu.AddItem(finance);

        // İçerik
        var content = new ApplicationMenuItem("Apya.Content", l["Menu:Content"], icon: "fa fa-folder-open", order: 6);
        if (await permission.IsGrantedAsync(PlatformPermissions.Documents.Default))
            content.AddItem(new ApplicationMenuItem("Apya.Content.Documents", l["Menu:Documents"], icon: "fa fa-book", url: "/Documents"));
        // Webhook'lar buradan PLATFORM bölümüne taşındı (kabuk handoff'u): entegrasyon
        // yüzeyi, içerik değil.
        if (await permission.IsGrantedAsync(PlatformPermissions.DynamicAssets.Default))
            content.AddItem(new ApplicationMenuItem("Apya.Content.DynamicAssets", l["Menu:DynamicAssets"], icon: "fa fa-file-signature", url: "/DynamicAssets"));
        if (content.Items.Count > 0) context.Menu.AddItem(content);

        // AI Değerlendirme Merkezi (AI Evaluation Center) — AiAssist feature + Ai.Prompts yetkisi
        if (await feature.IsEnabledAsync(PlatformFeatures.AiAssist))
        {
            var aiCenter = new ApplicationMenuItem(
                "Apya.AiCenter", l["Menu:AiCenter"], icon: "fa fa-robot", order: 7);
            if (await permission.IsGrantedAsync(AiPermissions.Dashboard.View))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Dashboard", l["Menu:AiCenter:Dashboard"],
                    icon: "fa fa-gauge-high", url: "/AiCenter/Dashboard"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Prompts.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Prompts", l["Menu:AiCenter:Prompts"],
                    icon: "fa fa-wand-magic-sparkles", url: "/AiCenter/Prompts"));
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.PromptCategories", l["Menu:AiCenter:PromptCategories"],
                    icon: "fa fa-folder-tree", url: "/AiCenter/PromptCategories"));
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Bindings", l["Menu:AiCenter:Bindings"],
                    icon: "fa fa-link", url: "/AiCenter/Bindings"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Evaluations.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Evaluations", l["Menu:AiCenter:Evaluations"],
                    icon: "fa fa-clipboard-check", url: "/AiCenter/Evaluations"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Workflows.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Workflows", l["Menu:AiCenter:Workflows"],
                    icon: "fa fa-diagram-project", url: "/AiCenter/Workflows"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Providers.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Providers", l["Menu:AiCenter:Providers"],
                    icon: "fa fa-plug", url: "/AiCenter/Providers"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.UsageLogs.View))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.UsageLogs", l["Menu:AiCenter:UsageLogs"],
                    icon: "fa fa-receipt", url: "/AiCenter/UsageLogs"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Reports.View))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Reports", l["Menu:AiCenter:Reports"],
                    icon: "fa fa-file-lines", url: "/AiCenter/Reports"));
            }
            // AI Ayarları: Yönetim'den AI Merkezi'ne taşındı — aynı feature kapısına bağlı
            // olduğu için AI öğeleriyle aynı kategoride olması daha tutarlı.
            if (await permission.IsGrantedAsync(PlatformPermissions.TenantSettings.ManageAi))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Settings", l["Menu:AiSettings"],
                    icon: "fa fa-sliders", url: "/TenantManagement/AiSettings"));
            }
            if (aiCenter.Items.Count > 0) context.Menu.AddItem(aiCenter);
        }

        // Raporlar — tüm rapor/çıktı sayfaları tek menüde toplandı (Finans'tan taşındı; çift menü giderildi).
        var reports = new ApplicationMenuItem("Apya.Reports", l["Menu:Reports"], icon: "fa fa-chart-pie", order: 5);
        // Alt öğe etiketi kategori adıyla aynıydı ("Raporlar & Analiz" iki kez); ayrı anahtar verildi.
        if (await permission.IsGrantedAsync(PlatformPermissions.Reports.Default))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.Overview", l["Menu:Reports:Overview"], icon: "fa fa-gauge", url: "/Reports"));
        if (await permission.IsGrantedAsync(PlatformPermissions.Projects.Default))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.ProjectBudget", l["Menu:ProjectBudget"], icon: "fa fa-chart-bar", url: "/Reports/ProjectBudget"));
        if (await permission.IsGrantedAsync(PlatformPermissions.Customers.Default))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.CustomerStatement", l["Menu:CustomerStatement"], icon: "fa fa-file-lines", url: "/Reports/CustomerStatement"));
        if (await permission.IsGrantedAsync(PlatformPermissions.Reports.TrialBalance)
            && await feature.IsEnabledAsync(PlatformFeatures.AdvancedReports))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.TrialBalance", l["Menu:TrialBalance"], icon: "fa fa-scale-unbalanced", url: "/Reports/TrialBalance"));
        if (await permission.IsGrantedAsync(PlatformPermissions.FxRevaluations.Default)
            && await feature.IsEnabledAsync(PlatformFeatures.AdvancedReports))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.FxRevaluation", l["Menu:FxRevaluation"], icon: "fa fa-scale-balanced", url: "/FxRevaluations"));
        if (reports.Items.Count > 0) context.Menu.AddItem(reports);

        // Platform — entegrasyon ve işletim yüzeyi. Günlük iş değil ama yönetim
        // ayarı da değil: kullanıcı buraya "çalışıyor mu / neden tetiklenmedi"
        // sorusuyla gelir, bu yüzden kenar çubuğunda kalır, Ayarlar'a inmez.
        var platform = new ApplicationMenuItem("Apya.Platform", l["Menu:Platform"], icon: "fa fa-cubes", order: 8);
        // Bildirim merkezine bugüne kadar yalnızca zil panelindeki "Tümünü gör"
        // bağlantısından ulaşılabiliyordu; geçmişi arayan kullanıcı menüde bulamıyordu.
        if (await permission.IsGrantedAsync(PlatformPermissions.Notifications.Default))
            platform.AddItem(new ApplicationMenuItem("Apya.Platform.Notifications", l["Menu:Notifications"], icon: "fa fa-bell", url: "/Notifications"));
        if (await permission.IsGrantedAsync(PlatformPermissions.DynamicAssets.Default))
            platform.AddItem(new ApplicationMenuItem("Apya.Platform.Webhooks", l["Menu:Webhooks"], icon: "fa fa-bolt", url: "/DynamicAssets/Webhooks"));
        if (await permission.IsGrantedAsync(PlatformPermissions.SystemHealth.Default))
            platform.AddItem(new ApplicationMenuItem("Apya.Platform.SystemHealth", l["Menu:SystemHealth"], icon: "fa fa-heart-pulse", url: "/Admin/SystemHealth"));
        if (platform.Items.Count > 0) context.Menu.AddItem(platform);

        // ── YÖNETİM bölümü kaldırıldı ─────────────────────────────────────────
        // Kabuk handoff'u (2026-08-13): 7 maddelik YÖNETİM bölümü günlük işi
        // boğuyordu. Hepsi tek "Ayarlar" girişine indi; hedefler /Settings
        // sayfasındaki izin-filtreli bağlantı listesinden açılır (sekme YOK,
        // ABP modül sayfaları kendi route'larında durmaya devam eder).
        //   Kurlar        → FİNANS
        //   Sistem Sağlığı → PLATFORM
        //   Kiracı · Kimlik · Ayar Yönetimi · Paket · Tasarım Sistemi ·
        //   Geri Bildirim · Giriş Ekranı → /Settings
        //
        // TenantManagement/Identity/SettingManagement öğelerini bu gruba KENDİ
        // contributor'ları ekliyor ve onlar bizden ÖNCE çalışıyor (bu yüzden
        // eskiden SetSubItemOrder ile sıralayabiliyorduk). Grubu burada düşürmek
        // hepsini birden düşürür.
        //
        // GetAdministration() DEĞİL GetMenuItemOrNull(): ilki öğe yoksa
        // AbpException fırlatıyor ve grup kaldırıldıktan sonra bir daha geri
        // gelmiyor (menü nesnesi her istekte sıfırdan kurulmuyor). Fırlatan
        // sürümle 8 sayfa render'ı 500 veriyordu — test paketi yakaladı.
        var administration = context.Menu.GetMenuItemOrNull(
            DefaultMenuNames.Application.Main.Administration);
        if (administration != null)
        {
            context.Menu.Items.Remove(administration);
        }

        // Ayarlar — kenar çubuğunun dibindeki tek giriş. Kişisel tercihler her
        // oturumlu kullanıcıya açık olduğu için izin kapısı YOK; yönetim
        // bağlantıları sayfanın kendi içinde izinle filtrelenir.
        context.Menu.AddItem(new ApplicationMenuItem(
            "Apya.Settings", l["Menu:Settings"],
            icon: "fa fa-gear", url: "/Settings", order: 99));
    }
}
