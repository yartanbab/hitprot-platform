using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Features;
using Apya.Platform.Localization;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Microsoft.Extensions.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;
using Volo.Abp.UI.Navigation;

namespace Apya.Platform.Web.Menus;

/// <summary>
/// Gezinme hedeflerinin TEK kaynağı. Menü ağacını kurar, kullanıcının menü
/// düzenini uygular ve iki yüzeyi birden üretir: kenar çubuğu ağacı ve Ayarlar
/// sayfasındaki bağlantı listesi.
///
/// Neden contributor'da değil: aynı ağacı üç tüketici okuyor — kenar çubuğu
/// (PlatformMenuContributor), Ayarlar sayfası ve menü düzenleme ekranı. Liste
/// contributor'da kalsaydı Ayarlar tarafının kendi kopyasını tutması gerekirdi;
/// öğeler iki yüzey arasında taşınabildiği için bu kopya kaçınılmaz olarak
/// ayrışırdı.
///
/// Scoped + memoize: Ayarlar sayfasında hem kabuk hem sayfa modeli çözümlüyor,
/// ağaç istek başına BİR kez kurulur.
/// </summary>
public class PlatformNavigationResolver : IScopedDependency
{
    /// <summary>Ayarlar'dan kenar çubuğuna alınan bağlantıların toplandığı grup.</summary>
    public const string ManagementGroupName = "Apya.Management";

    /// <summary>Menü düzeninde asla taşınamayan/sıralanamayan öğe — kapının kendisi.</summary>
    public const string SettingsItemName = "Apya.Settings";

    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly IPermissionChecker _permission;
    private readonly IFeatureChecker _feature;
    private readonly ICurrentTenant _currentTenant;
    private readonly ISettingProvider _settingProvider;

    private Task<NavResolution>? _cached;

    public PlatformNavigationResolver(
        IStringLocalizer<PlatformResource> l,
        IPermissionChecker permission,
        IFeatureChecker feature,
        ICurrentTenant currentTenant,
        ISettingProvider settingProvider)
    {
        _l = l;
        _permission = permission;
        _feature = feature;
        _currentTenant = currentTenant;
        _settingProvider = settingProvider;
    }

    public Task<NavResolution> ResolveAsync()
    {
        return _cached ??= ResolveCoreAsync();
    }

    private async Task<NavResolution> ResolveCoreAsync()
    {
        var layout = MenuLayout.Parse(
            await _settingProvider.GetOrNullAsync(PlatformSettings.Shell.MenuLayout));

        var result = new NavResolution { Layout = layout };
        var roots = await BuildTreeAsync();

        // 1) Ayarlar'dan kenar çubuğuna alınanlar → "Yönetim" grubu.
        //    Grup yalnız içine bir şey taşındığında doğar; boşsa hiç basılmaz.
        var promoted = await BuildManagementGroupAsync(layout);
        if (promoted != null) { roots.Add(promoted); }

        // 2) Kenar çubuğundan Ayarlar'a inenleri ağaçtan SÖK.
        var moved = ExtractMovedLeaves(roots, layout.ToSettings);

        // 3) Tüm çocukları taşınmış grup kalmasın — LeptonX boş bölüm başlığı basar.
        PruneEmptyGroups(roots);

        // 4) Sıralama: 1. seviye + her grubun içi.
        result.Sidebar.AddRange(ApplyOrder(roots, layout.Sections));
        foreach (var item in roots) { ApplyChildOrder(item, layout); }

        // 5) Ayarlar listesi: katalogda kalanlar + kenar çubuğundan inenler.
        var settingsLinks = await BuildSettingsLinksAsync(layout, moved);
        result.SettingsLinks.AddRange(ApplyOrder(settingsLinks, layout.SettingsOrder, x => x.Name));

        return result;
    }

    // =========================================================================
    // Menü ağacı — bu blok PlatformMenuContributor'dan OLDUĞU GİBİ taşındı.
    // Değişen tek şey bağımlılıkların nereden geldiği (context.ServiceProvider
    // yerine constructor injection) ve kökün context.Menu yerine bir liste olması.
    // =========================================================================
    private async Task<List<ApplicationMenuItem>> BuildTreeAsync()
    {
        var l = _l;
        var roots = new List<ApplicationMenuItem>();

        roots.Add(new ApplicationMenuItem(
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
        if (await _permission.IsGrantedAsync(PlatformPermissions.Projects.Default))
            work.AddItem(new ApplicationMenuItem("Apya.Work.Projects", l["Menu:Projects"], icon: "fa fa-rocket", url: "/Projects", order: 1));

        // Handoff'un Panolar listesinde Gantt ve Zaman Çizelgesi de var; ikisinin de
        // bağımsız sayfası YOK (Gantt yalnız proje detay konsolunun içinde yaşıyor).
        // Olmayan ekrana menü girişi açmıyoruz — handoff'un "yalnız çalışan şeyi listele"
        // kuralı kısayol penceresi için konmuş, aynı kural menüde de geçerli.
        var boards = new ApplicationMenuItem("Apya.Work.Boards", l["Menu:Boards"], icon: "fa fa-table-columns", order: 2);
        if (await _permission.IsGrantedAsync(PlatformPermissions.Tasks.Default))
        {
            boards.AddItem(new ApplicationMenuItem("Apya.Work.Tasks", l["Menu:Tasks"], icon: "fa fa-tasks", url: "/Tasks"));
            boards.AddItem(new ApplicationMenuItem("Apya.Work.Board", l["Menu:KanbanBoard"], icon: "fa fa-columns", url: "/Board"));
        }
        if (await _permission.IsGrantedAsync(PlatformPermissions.Calendars.Default))
            boards.AddItem(new ApplicationMenuItem("Apya.Work.Calendar", l["Menu:Calendar"], icon: "fa fa-calendar-days", url: "/Calendars"));
        if (boards.Items.Count > 0) work.AddItem(boards);

        if (work.Items.Count > 0) roots.Add(work);

        // Hibe Yönetimi — kendi izin grubu (Groups.Grants) ve kendi feature'ı (Features.Grants)
        // olduğu için İş Yönetimi'nden ayrı kategori. "Başvurular" sayfası HOST'a özel
        // (GrantApplicationHostAppService.EnsureHostContext) → tenant menüsünde gösterilmez.
        var grants = new ApplicationMenuItem("Apya.Grants", l["Menu:Grants:Group"], icon: "fa fa-award", order: 3);
        if (await _permission.IsGrantedAsync(PlatformPermissions.Grants.Default))
            grants.AddItem(new ApplicationMenuItem("Apya.Grants.Calls", l["Menu:Grants:Calls"], icon: "fa fa-bullhorn", url: "/Grants"));
        if (_currentTenant.Id == null && await _permission.IsGrantedAsync(PlatformPermissions.Grants.Edit))
            grants.AddItem(new ApplicationMenuItem("Apya.Grants.Applications", l["Menu:Grants:Applications"], icon: "fa fa-file-signature", url: "/Grants/Applications"));
        if (grants.Items.Count > 0) roots.Add(grants);

        // Finans — Faz 1 sadeleştirme: yalnızca günlük işlem + hesap öğeleri kalır.
        // Raporlar tek "Raporlar" menüsünde toplandı. Kurlar bir dönem Yönetim'e
        // taşınmıştı; kabuk handoff'u (2026-08-13) onu Finans'a geri aldı — kur bir
        // finans verisi, yönetim ayarı değil.
        var finance = new ApplicationMenuItem("Apya.Finance", l["Menu:Finance"], icon: "fa fa-coins", order: 4);
        // Sıralama (kullanıcı kararı 2026-06-22): 1) Kasalar  2) Para Hareketleri.
        if (await _permission.IsGrantedAsync(PlatformPermissions.CashAccounts.Default))
            finance.AddItem(new ApplicationMenuItem("Apya.Finance.CashAccounts", l["Menu:CashAccounts"], icon: "fa fa-cash-register", url: "/CashAccounts", order: 1));
        // Para Hareketleri hub'ı (Faz 2): Gelir + Gider + Fatura tek listede toplandı.
        // Ayrı Giderler/Gelirler/Faturalar menü öğeleri kaldırıldı (sayfalar hub'dan erişilebilir).
        if (await _permission.IsGrantedAsync(PlatformPermissions.Incomes.Default)
            || await _permission.IsGrantedAsync(PlatformPermissions.Expenses.Default)
            || await _permission.IsGrantedAsync(PlatformPermissions.Invoices.Default))
            finance.AddItem(new ApplicationMenuItem("Apya.Finance.Hub", l["Menu:FinanceHub"], icon: "fa fa-right-left", url: "/Finance", order: 2));
        if (await _permission.IsGrantedAsync(PlatformPermissions.ExchangeRates.Default))
            finance.AddItem(new ApplicationMenuItem("Apya.Finance.ExchangeRates", l["Menu:ExchangeRates"], icon: "fa fa-money-bill-transfer", url: "/ExchangeRates", order: 3));
        // Cariler kullanıcı kararıyla menüden gizlendi (2026-06-22). /Customers sayfası korunur;
        // izinli kullanıcı doğrudan erişebilir. Geri açmak için aşağıyı yorumdan çıkar:
        // if (await _permission.IsGrantedAsync(PlatformPermissions.Customers.Default))
        //     finance.AddItem(new ApplicationMenuItem("Apya.Finance.Customers", l["Menu:Customers"], icon: "fa fa-id-card", url: "/Customers"));
        if (finance.Items.Count > 0) roots.Add(finance);

        // İçerik
        var content = new ApplicationMenuItem("Apya.Content", l["Menu:Content"], icon: "fa fa-folder-open", order: 6);
        if (await _permission.IsGrantedAsync(PlatformPermissions.Documents.Default))
            content.AddItem(new ApplicationMenuItem("Apya.Content.Documents", l["Menu:Documents"], icon: "fa fa-book", url: "/Documents"));
        // Webhook'lar buradan PLATFORM bölümüne taşındı (kabuk handoff'u): entegrasyon
        // yüzeyi, içerik değil.
        if (await _permission.IsGrantedAsync(PlatformPermissions.DynamicAssets.Default))
            content.AddItem(new ApplicationMenuItem("Apya.Content.DynamicAssets", l["Menu:DynamicAssets"], icon: "fa fa-file-signature", url: "/DynamicAssets"));
        if (content.Items.Count > 0) roots.Add(content);

        // AI Değerlendirme Merkezi (AI Evaluation Center) — AiAssist feature + Ai.Prompts yetkisi
        if (await _feature.IsEnabledAsync(PlatformFeatures.AiAssist))
        {
            var aiCenter = new ApplicationMenuItem(
                "Apya.AiCenter", l["Menu:AiCenter"], icon: "fa fa-robot", order: 7);
            if (await _permission.IsGrantedAsync(AiPermissions.Dashboard.View))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Dashboard", l["Menu:AiCenter:Dashboard"],
                    icon: "fa fa-gauge-high", url: "/AiCenter/Dashboard"));
            }
            if (await _permission.IsGrantedAsync(AiPermissions.Prompts.Default))
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
            if (await _permission.IsGrantedAsync(AiPermissions.Evaluations.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Evaluations", l["Menu:AiCenter:Evaluations"],
                    icon: "fa fa-clipboard-check", url: "/AiCenter/Evaluations"));
            }
            if (await _permission.IsGrantedAsync(AiPermissions.Workflows.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Workflows", l["Menu:AiCenter:Workflows"],
                    icon: "fa fa-diagram-project", url: "/AiCenter/Workflows"));
            }
            if (await _permission.IsGrantedAsync(AiPermissions.Providers.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Providers", l["Menu:AiCenter:Providers"],
                    icon: "fa fa-plug", url: "/AiCenter/Providers"));
            }
            if (await _permission.IsGrantedAsync(AiPermissions.UsageLogs.View))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.UsageLogs", l["Menu:AiCenter:UsageLogs"],
                    icon: "fa fa-receipt", url: "/AiCenter/UsageLogs"));
            }
            if (await _permission.IsGrantedAsync(AiPermissions.Reports.View))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Reports", l["Menu:AiCenter:Reports"],
                    icon: "fa fa-file-lines", url: "/AiCenter/Reports"));
            }
            // AI Ayarları: Yönetim'den AI Merkezi'ne taşındı — aynı feature kapısına bağlı
            // olduğu için AI öğeleriyle aynı kategoride olması daha tutarlı.
            if (await _permission.IsGrantedAsync(PlatformPermissions.TenantSettings.ManageAi))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Settings", l["Menu:AiSettings"],
                    icon: "fa fa-sliders", url: "/TenantManagement/AiSettings"));
            }
            if (aiCenter.Items.Count > 0) roots.Add(aiCenter);
        }

        // Raporlar — tüm rapor/çıktı sayfaları tek menüde toplandı (Finans'tan taşındı; çift menü giderildi).
        var reports = new ApplicationMenuItem("Apya.Reports", l["Menu:Reports"], icon: "fa fa-chart-pie", order: 5);
        // Alt öğe etiketi kategori adıyla aynıydı ("Raporlar & Analiz" iki kez); ayrı anahtar verildi.
        if (await _permission.IsGrantedAsync(PlatformPermissions.Reports.Default))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.Overview", l["Menu:Reports:Overview"], icon: "fa fa-gauge", url: "/Reports"));
        if (await _permission.IsGrantedAsync(PlatformPermissions.Projects.Default))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.ProjectBudget", l["Menu:ProjectBudget"], icon: "fa fa-chart-bar", url: "/Reports/ProjectBudget"));
        if (await _permission.IsGrantedAsync(PlatformPermissions.Customers.Default))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.CustomerStatement", l["Menu:CustomerStatement"], icon: "fa fa-file-lines", url: "/Reports/CustomerStatement"));
        if (await _permission.IsGrantedAsync(PlatformPermissions.Reports.TrialBalance)
            && await _feature.IsEnabledAsync(PlatformFeatures.AdvancedReports))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.TrialBalance", l["Menu:TrialBalance"], icon: "fa fa-scale-unbalanced", url: "/Reports/TrialBalance"));
        if (await _permission.IsGrantedAsync(PlatformPermissions.FxRevaluations.Default)
            && await _feature.IsEnabledAsync(PlatformFeatures.AdvancedReports))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.FxRevaluation", l["Menu:FxRevaluation"], icon: "fa fa-scale-balanced", url: "/FxRevaluations"));
        if (reports.Items.Count > 0) roots.Add(reports);

        // Platform — entegrasyon ve işletim yüzeyi. Günlük iş değil ama yönetim
        // ayarı da değil: kullanıcı buraya "çalışıyor mu / neden tetiklenmedi"
        // sorusuyla gelir, bu yüzden kenar çubuğunda kalır, Ayarlar'a inmez.
        var platform = new ApplicationMenuItem("Apya.Platform", l["Menu:Platform"], icon: "fa fa-cubes", order: 8);
        // Bildirim merkezine bugüne kadar yalnızca zil panelindeki "Tümünü gör"
        // bağlantısından ulaşılabiliyordu; geçmişi arayan kullanıcı menüde bulamıyordu.
        if (await _permission.IsGrantedAsync(PlatformPermissions.Notifications.Default))
            platform.AddItem(new ApplicationMenuItem("Apya.Platform.Notifications", l["Menu:Notifications"], icon: "fa fa-bell", url: "/Notifications"));
        if (await _permission.IsGrantedAsync(PlatformPermissions.DynamicAssets.Default))
            platform.AddItem(new ApplicationMenuItem("Apya.Platform.Webhooks", l["Menu:Webhooks"], icon: "fa fa-bolt", url: "/DynamicAssets/Webhooks"));
        if (await _permission.IsGrantedAsync(PlatformPermissions.SystemHealth.Default))
            platform.AddItem(new ApplicationMenuItem("Apya.Platform.SystemHealth", l["Menu:SystemHealth"], icon: "fa fa-heart-pulse", url: "/Admin/SystemHealth"));
        if (await _permission.IsGrantedAsync(PlatformPermissions.Consents.Default))
            platform.AddItem(new ApplicationMenuItem("Apya.Platform.Consents", l["Menu:Consents"], icon: "fa fa-shield-halved", url: "/Admin/Consent"));
        if (platform.Items.Count > 0) roots.Add(platform);

        // Yenilikler — sürüm notları geçmişi; her oturumlu kullanıcıya açık (izin kapısı yok).
        roots.Add(new ApplicationMenuItem(
            "Apya.ReleaseNotes", l["Menu:ReleaseNotes"],
            icon: "fa fa-gift", url: "/ReleaseNotes", order: 98));

        // Ayarlar — kenar çubuğunun dibindeki tek giriş. Kişisel tercihler her
        // oturumlu kullanıcıya açık olduğu için izin kapısı YOK; yönetim
        // bağlantıları sayfanın kendi içinde izinle filtrelenir.
        roots.Add(new ApplicationMenuItem(
            SettingsItemName, l["Menu:Settings"],
            icon: "fa fa-gear", url: "/Settings", order: 99));

        return roots;
    }

    // =========================================================================
    // Düzen uygulama
    // =========================================================================

    /// <summary>
    /// Ayarlar'dan kenar çubuğuna alınan bağlantıları "Yönetim" grubunda toplar.
    /// Hiçbiri alınmamışsa (varsayılan) null döner — grup basılmaz.
    /// </summary>
    private async Task<ApplicationMenuItem?> BuildManagementGroupAsync(MenuLayout layout)
    {
        if (layout.ToSidebar.Count == 0) { return null; }

        var group = new ApplicationMenuItem(
            ManagementGroupName, _l["Menu:Management"], icon: "fa fa-user-gear", order: 97);

        foreach (var definition in PlatformAdminLinks.All)
        {
            if (!layout.ToSidebar.Contains(definition.Name)) { continue; }
            if (!await _permission.IsGrantedAsync(definition.PermissionName)) { continue; }

            group.AddItem(new ApplicationMenuItem(
                definition.Name, _l[definition.TitleKey],
                icon: definition.Icon, url: definition.Url));
        }

        return group.Items.Count > 0 ? group : null;
    }

    /// <summary>
    /// Ayarlar'a indirilen YAPRAK öğeleri ağaçtan söker ve üst grubuyla birlikte
    /// döner. Grup adı listede geçse bile sökülmez: yalnız yapraklar taşınabilir.
    /// </summary>
    private List<NavSettingsLink> ExtractMovedLeaves(List<ApplicationMenuItem> roots, List<string> toSettings)
    {
        var moved = new List<NavSettingsLink>();
        if (toSettings.Count == 0) { return moved; }

        void Walk(IList<ApplicationMenuItem> siblings, ApplicationMenuItem? parent)
        {
            for (var i = siblings.Count - 1; i >= 0; i--)
            {
                var item = siblings[i];
                if (item.Items.Count > 0)
                {
                    Walk(item.Items, item);
                    continue;
                }

                // Ayarlar kapısının kendisi taşınamaz — taşınsa geri dönüş yolu kalmaz.
                if (item.Name == SettingsItemName) { continue; }
                if (!toSettings.Contains(item.Name)) { continue; }

                siblings.RemoveAt(i);
                moved.Add(new NavSettingsLink
                {
                    Name = item.Name,
                    Title = item.DisplayName,
                    // Kenar çubuğu öğelerinin açıklaması yok; Ayarlar listesindeki
                    // ikinci satır uydurulmaz, boş bırakılır.
                    Description = string.Empty,
                    Url = item.Url ?? string.Empty,
                    Icon = item.Icon ?? string.Empty,
                    IsAdminLink = false,
                    HomeGroupName = parent?.Name ?? string.Empty,
                    HomeGroupTitle = parent?.DisplayName ?? string.Empty,
                    HomeGroupIcon = parent?.Icon ?? string.Empty
                });
            }
        }

        Walk(roots, null);
        return moved;
    }

    /// <summary>
    /// Tüm çocukları Ayarlar'a taşınmış grupları düşürür. Yapılmazsa LeptonX
    /// içi boş bir bölüm başlığı basar.
    /// </summary>
    private static void PruneEmptyGroups(IList<ApplicationMenuItem> siblings)
    {
        for (var i = siblings.Count - 1; i >= 0; i--)
        {
            var item = siblings[i];
            if (item.Items.Count == 0) { continue; } // yaprak — URL'si var, dokunma

            PruneEmptyGroups(item.Items);
            if (item.Items.Count == 0 && string.IsNullOrEmpty(item.Url))
            {
                siblings.RemoveAt(i);
            }
        }
    }

    private void ApplyChildOrder(ApplicationMenuItem item, MenuLayout layout)
    {
        if (item.Items.Count == 0) { return; }

        if (layout.Items.TryGetValue(item.Name, out var order))
        {
            var sorted = ApplyOrder(item.Items.ToList(), order);
            item.Items.Clear();
            foreach (var child in sorted) { item.Items.Add(child); }
        }

        foreach (var child in item.Items) { ApplyChildOrder(child, layout); }
    }

    private static List<ApplicationMenuItem> ApplyOrder(List<ApplicationMenuItem> items, List<string> order)
    {
        var sorted = ApplyOrder(items, order, x => x.Name);

        // ABP menüyü Order'a göre sıralıyor → istenen dizilim Order'a yazılmalı,
        // yoksa listedeki sıra render'da kaybolur. "Ayarlar" her hâlükârda dipte
        // kalır: kenar çubuğunun sabit kapısı, kullanıcı düzeninin parçası değil.
        for (var i = 0; i < sorted.Count; i++)
        {
            sorted[i].Order = sorted[i].Name == SettingsItemName ? 9999 : i;
        }

        return sorted;
    }

    /// <summary>
    /// Kayıtlı sıraya göre dizer; listede olmayanlar KENDİ aralarındaki sırayı
    /// koruyarak sona eklenir. Sonradan eklenen bir menü öğesi böylece kaybolmaz.
    /// </summary>
    private static List<T> ApplyOrder<T>(List<T> items, List<string> order, System.Func<T, string> nameOf)
    {
        if (order.Count == 0) { return items; }

        var byName = items.ToLookup(nameOf);
        var sorted = new List<T>(items.Count);
        var placed = new HashSet<string>();

        foreach (var name in order)
        {
            if (!placed.Add(name)) { continue; }
            sorted.AddRange(byName[name]);
        }

        sorted.AddRange(items.Where(x => !placed.Contains(nameOf(x))));
        return sorted;
    }

    /// <summary>
    /// Ayarlar sayfasının listesi: katalogda kalan yönetim bağlantıları +
    /// kenar çubuğundan indirilen yapraklar.
    /// </summary>
    private async Task<List<NavSettingsLink>> BuildSettingsLinksAsync(MenuLayout layout, List<NavSettingsLink> moved)
    {
        var links = new List<NavSettingsLink>();

        foreach (var definition in PlatformAdminLinks.All)
        {
            // Kenar çubuğuna alınmışsa burada gösterilmez (aynı hedef iki yerde durmaz).
            if (layout.ToSidebar.Contains(definition.Name)) { continue; }
            if (!await _permission.IsGrantedAsync(definition.PermissionName)) { continue; }

            links.Add(new NavSettingsLink
            {
                Name = definition.Name,
                Title = _l[definition.TitleKey],
                Description = _l[definition.DescriptionKey],
                Url = definition.Url,
                Icon = definition.Icon,
                IsAdminLink = true,
                HomeGroupName = ManagementGroupName,
                HomeGroupTitle = _l["Menu:Management"],
                HomeGroupIcon = "fa fa-user-gear"
            });
        }

        links.AddRange(moved);
        return links;
    }
}
