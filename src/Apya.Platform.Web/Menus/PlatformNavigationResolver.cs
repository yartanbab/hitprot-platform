using System;
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
/// sayfasındaki liste.
///
/// Neden contributor'da değil: aynı ağacı üç tüketici okuyor — kenar çubuğu
/// (PlatformMenuContributor), Ayarlar sayfası ve menü düzenleme ekranı. Liste
/// contributor'da kalsaydı Ayarlar tarafının kendi kopyasını tutması gerekirdi;
/// öğeler iki yüzey arasında taşınabildiği için bu kopya kaçınılmaz olarak
/// ayrışırdı.
///
/// YERLEŞİM MODELİ: koddaki ağaç bir VARSAYILANDIR. Çözüm sırasında bütün
/// düğümler tek bir havuza düzleştirilir, kullanıcının düzeni her düğüme bir üst
/// öğe (ya da iki kökten biri) atar, ağaç sıfırdan kurulur. Serbest yerleşimin
/// (öğeyi başka gruba ya da öbür sütuna taşıma) sıralamayla aynı mekanizmadan
/// çıkmasının sebebi bu: "sırala" ile "taşı" tek bir işlemdir.
///
/// Scoped + memoize: Ayarlar sayfasında hem kabuk hem sayfa modeli çözümlüyor,
/// ağaç istek başına BİR kez kurulur.
/// </summary>
public class PlatformNavigationResolver : IScopedDependency
{
    /// <summary>Ayarlar'dan kenar çubuğuna alınan bağlantıların varsayılan hedefi.</summary>
    public const string ManagementGroupName = "Apya.Management";

    /// <summary>Menü düzeninde asla taşınamayan/sıralanamayan öğe — kapının kendisi.</summary>
    public const string SettingsItemName = "Apya.Settings";

    /// <summary>Ayarlar sayfasındaki açıklama satırı — ApplicationMenuItem'da alan yok, CustomData'da taşınır.</summary>
    public const string DescriptionDataKey = "apya:desc";

    /// <summary>Kenar çubuğu sütununun kökü. Menü adı olamaz: adlar "Apya." ile başlar.</summary>
    private const string SidebarRoot = "#sidebar";

    /// <summary>Ayarlar sütununun kökü.</summary>
    private const string SettingsRoot = "#settings";

    /// <summary>
    /// Kökten itibaren izin verilen en fazla seviye. Düzenleme ekranı grubu
    /// grubun içine bıraktırmıyor; bu tavan manipüle edilmiş bir yüke karşı:
    /// aşan (ya da döngüye giren) düğüm sessizce varsayılan yerine döner.
    /// </summary>
    private const int MaxDepth = 4;

    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly IPermissionChecker _permission;
    private readonly IFeatureChecker _feature;
    private readonly ICurrentTenant _currentTenant;
    private readonly ISettingProvider _settingProvider;

    private NavResolution? _cached;

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

    /// <summary>
    /// İstek başına bir kez çözer. Sonuç YALNIZ BAŞARIDA saklanır: hatalı bir
    /// Task önbelleğe alınsaydı geçici bir izin/ayar hatası aynı isteğin üç
    /// tüketicisine de (kenar çubuğu, Ayarlar sayfası, tema başlığı) yeniden
    /// fırlatılır ve sayfa tamamen çökerdi — oysa modülün geri kalanı
    /// "bozuksa varsayılana düş" ilkesiyle yazılmış.
    /// </summary>
    public async Task<NavResolution> ResolveAsync()
    {
        return _cached ??= await ResolveCoreAsync();
    }

    /// <summary>Havuzdaki bir düğüm: öğenin kendisi + koddaki yeri.</summary>
    private sealed class PoolEntry
    {
        public required ApplicationMenuItem Item { get; init; }

        /// <summary>Kullanıcı düzeni bir şey söylemezse düşeceği üst öğe.</summary>
        public required string DefaultParent { get; init; }

        /// <summary>Koddaki sıra — düzende adı geçmeyen öğeler bu sırayı korur.</summary>
        public required int DefaultIndex { get; init; }
    }

    private async Task<NavResolution> ResolveCoreAsync()
    {
        var layout = MenuLayout.Parse(
            await _settingProvider.GetOrNullAsync(PlatformSettings.Shell.MenuLayout));

        var result = new NavResolution { Layout = layout };
        var pool = await BuildPoolAsync();
        var parentOf = ResolveParents(pool, layout);

        var sidebar = Assemble(SidebarRoot, pool, parentOf, layout);
        var settings = Assemble(SettingsRoot, pool, parentOf, layout);

        // İçi boşalan grup basılmaz — LeptonX içi boş bir bölüm başlığı basar,
        // Ayarlar sayfasında da başlıksız bir blok kalırdı. Düzenleme ekranı
        // bunları EmptyGroups'tan geri koyar.
        Prune(sidebar, inSettings: false, result.EmptyGroups);
        Prune(settings, inSettings: true, result.EmptyGroups);

        // ABP menüyü Order'a göre diziyor → istenen dizilim Order'a yazılmalı.
        AssignOrders(sidebar);

        result.Sidebar.AddRange(sidebar);
        result.SettingsLinks.AddRange(settings.Select(ToSettingsEntry));
        return result;
    }

    /// <summary>
    /// Bütün gezinme hedeflerini tek havuza düzleştirir: koddaki kenar çubuğu
    /// ağacı + yönetim bağlantıları + (boş doğan) "Yönetim" grubu. Çocuk
    /// listeleri BOŞALTILIR; ağaç sonra yerleşime göre yeniden kurulur.
    /// </summary>
    private async Task<Dictionary<string, PoolEntry>> BuildPoolAsync()
    {
        var pool = new Dictionary<string, PoolEntry>(StringComparer.Ordinal);
        var sequence = 0;

        void Collect(IEnumerable<ApplicationMenuItem> items, string parent)
        {
            foreach (var item in items)
            {
                var children = item.Items.ToList();
                item.Items.Clear();

                // Ad havuzun ANAHTARI: aynı adla ikinci bir öğe gelirse ilkini
                // ezmek onu menüden tamamen düşürür ve çocuklarını yanlış
                // kategoriye iliştirir. İlk kayıt korunur; çocuklar yine aynı
                // ad altında toplanır (mevcut öğeye eklenirler).
                if (!pool.ContainsKey(item.Name))
                {
                    pool[item.Name] = new PoolEntry
                    {
                        Item = item,
                        DefaultParent = parent,
                        DefaultIndex = sequence++
                    };
                }

                Collect(children, item.Name);
            }
        }

        Collect(await BuildTreeAsync(), SidebarRoot);

        // "Yönetim" grubu havuzda hep vardır ama BOŞ doğar: kullanıcı bir yönetim
        // bağlantısını kenar çubuğuna aldığında burası onun varsayılan hedefi
        // olur. İçine bir şey girmezse ayıklanır ve menüde hiç görünmez.
        pool[ManagementGroupName] = new PoolEntry
        {
            Item = new ApplicationMenuItem(
                ManagementGroupName, _l["Menu:Management"], icon: "fa fa-user-gear"),
            DefaultParent = SidebarRoot,
            DefaultIndex = sequence++
        };

        foreach (var definition in PlatformAdminLinks.All)
        {
            if (!await _permission.IsGrantedAsync(definition.PermissionName)) { continue; }

            var item = new ApplicationMenuItem(
                definition.Name, _l[definition.TitleKey],
                icon: definition.Icon, url: definition.Url);
            item.WithCustomData(DescriptionDataKey, _l[definition.DescriptionKey].Value);

            pool[definition.Name] = new PoolEntry
            {
                Item = item,
                // Yönetim hedeflerinin varsayılan yeri Ayarlar sayfası.
                DefaultParent = SettingsRoot,
                DefaultIndex = sequence++
            };
        }

        return pool;
    }

    /// <summary>
    /// Her düğüme bir üst öğe atar: önce koddaki varsayılan, sonra kullanıcının
    /// düzeni. Tanınmayan ad, yaprağın altına yerleştirme, döngü ve fazla
    /// derinlik sessizce yok sayılır — düğüm varsayılan yerinde kalır.
    /// </summary>
    private static Dictionary<string, string> ResolveParents(
        Dictionary<string, PoolEntry> pool, MenuLayout layout)
    {
        var parentOf = pool.ToDictionary(
            kv => kv.Key, kv => kv.Value.DefaultParent, StringComparer.Ordinal);

        void Place(IEnumerable<string> names, string parent)
        {
            foreach (var name in names)
            {
                // Ayarlar kapısı taşınamaz: taşınsaydı kullanıcının düzeni geri
                // alacağı ekran kaybolurdu.
                if (name == SettingsItemName || !pool.ContainsKey(name)) { continue; }
                parentOf[name] = parent;
            }
        }

        Place(layout.Sections, SidebarRoot);
        Place(layout.SettingsOrder, SettingsRoot);

        foreach (var pair in layout.Items)
        {
            // Üst öğe var olan bir GRUP olmalı; yaprağın altına öğe konmaz.
            if (!pool.TryGetValue(pair.Key, out var parent) || !IsGroup(parent.Item)) { continue; }
            Place(pair.Value, pair.Key);
        }

        foreach (var name in pool.Keys.ToList())
        {
            if (!ReachesRoot(name, parentOf))
            {
                parentOf[name] = pool[name].DefaultParent;
            }
        }

        return parentOf;
    }

    /// <summary>Düğüm iki kökten birine <see cref="MaxDepth"/> adımda ulaşıyor mu?</summary>
    private static bool ReachesRoot(string name, Dictionary<string, string> parentOf)
    {
        var current = name;
        for (var depth = 0; depth < MaxDepth; depth++)
        {
            if (!parentOf.TryGetValue(current, out var parent)) { return false; }
            if (parent == SidebarRoot || parent == SettingsRoot) { return true; }
            if (parent == name) { return false; } // kendi kendinin atası
            current = parent;
        }
        return false; // döngü ya da fazla derin
    }

    /// <summary>Bir üst öğenin çocuklarını sıralı kurar ve altlarını doldurur.</summary>
    private static List<ApplicationMenuItem> Assemble(
        string parent,
        Dictionary<string, PoolEntry> pool,
        Dictionary<string, string> parentOf,
        MenuLayout layout)
    {
        var children = pool
            .Where(kv => parentOf[kv.Key] == parent)
            .OrderBy(kv => kv.Value.DefaultIndex)
            .Select(kv => kv.Value.Item)
            .ToList();

        var order =
            parent == SidebarRoot ? layout.Sections :
            parent == SettingsRoot ? layout.SettingsOrder :
            layout.Items.TryGetValue(parent, out var explicitOrder) ? explicitOrder : new List<string>();

        var ordered = ApplyOrder(children, order, x => x.Name);

        foreach (var child in ordered)
        {
            foreach (var grandChild in Assemble(child.Name, pool, parentOf, layout))
            {
                child.AddItem(grandChild);
            }
        }

        return ordered;
    }

    /// <summary>URL'si olmayan öğe gruptur — çocuğu kalmasa bile grup olarak kalır.</summary>
    private static bool IsGroup(ApplicationMenuItem item)
    {
        return string.IsNullOrEmpty(item.Url);
    }

    private static void Prune(IList<ApplicationMenuItem> siblings, bool inSettings, List<NavEmptyGroup> removed)
    {
        for (var i = siblings.Count - 1; i >= 0; i--)
        {
            var item = siblings[i];
            if (!IsGroup(item)) { continue; }

            // Önce içeri: iç grup boşalınca dıştaki de boşalabilir.
            Prune(item.Items, inSettings, removed);
            if (item.Items.Count > 0) { continue; }

            siblings.RemoveAt(i);
            removed.Add(new NavEmptyGroup
            {
                Name = item.Name,
                Title = item.DisplayName,
                Icon = item.Icon ?? string.Empty,
                InSettings = inSettings
            });
        }
    }

    private static void AssignOrders(IList<ApplicationMenuItem> siblings)
    {
        for (var i = 0; i < siblings.Count; i++)
        {
            // "Ayarlar" her hâlükârda dipte: kenar çubuğunun sabit kapısı,
            // kullanıcı düzeninin parçası değil.
            siblings[i].Order = siblings[i].Name == SettingsItemName ? 9999 : i;
            AssignOrders(siblings[i].Items);
        }
    }

    /// <summary>Katalogdan gelen adlar — <see cref="NavSettingsEntry.IsAdminLink"/> için.</summary>
    private static readonly HashSet<string> AdminLinkNames =
        PlatformAdminLinks.All.Select(x => x.Name).ToHashSet(StringComparer.Ordinal);

    private static NavSettingsEntry ToSettingsEntry(ApplicationMenuItem item)
    {
        var entry = new NavSettingsEntry
        {
            Name = item.Name,
            Title = item.DisplayName,
            Url = item.Url ?? string.Empty,
            Icon = item.Icon ?? string.Empty,
            IsGroup = IsGroup(item),
            IsAdminLink = AdminLinkNames.Contains(item.Name),
            Description = item.CustomData.TryGetValue(DescriptionDataKey, out var description)
                ? description?.ToString() ?? string.Empty
                // Kenar çubuğundan inen öğelerin açıklaması yok; uydurmuyoruz.
                : string.Empty
        };

        foreach (var child in item.Items)
        {
            entry.Children.Add(ToSettingsEntry(child));
        }

        return entry;
    }

    /// <summary>
    /// Kayıtlı sıraya göre dizer; listede olmayanlar KENDİ aralarındaki sırayı
    /// koruyarak sona eklenir. Sonradan eklenen bir menü öğesi böylece kaybolmaz.
    /// </summary>
    private static List<T> ApplyOrder<T>(List<T> items, List<string> order, Func<T, string> nameOf)
    {
        if (order.Count == 0) { return items; }

        var byName = items.ToLookup(nameOf);
        var sorted = new List<T>(items.Count);
        var placed = new HashSet<string>(StringComparer.Ordinal);

        foreach (var name in order)
        {
            if (!placed.Add(name)) { continue; }
            sorted.AddRange(byName[name]);
        }

        sorted.AddRange(items.Where(x => !placed.Contains(nameOf(x))));
        return sorted;
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

        // Order'a göre sırala. Bloklar kodda konu konu yazılmış (Raporlar,
        // AI Merkezi'nden SONRA geliyor) ama görünen sırayı `order:` değerleri
        // anlatır. Eskiden menüyü ABP Order'a göre diziyordu; havuz artık
        // ekleme sırasını (DefaultIndex) esas aldığı için sıralama BURADA
        // yapılmazsa `order:` argümanları sessizce ölür ve "Raporlar" 5.
        // sıradan 7. sıraya kayar.
        return roots.OrderBy(x => x.Order).ToList();
    }}
