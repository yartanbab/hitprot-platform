using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Apya.Platform.Web.Menus;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Web.Pages.Settings;

/// <summary>
/// "Ayarlar" — kenar çubuğunun dibindeki tek yönetim kapısı.
///
/// İki bölüm: (1) her oturumlu kullanıcının kişisel arayüz tercihleri,
/// (2) eski YÖNETİM menüsünün izin-filtreli hedefleri (kabuk handoff'u
/// 2026-08-13 o bölümü kaldırdı). Hedefler SEKME DEĞİL bağlantıdır — ABP modül
/// sayfaları kendi route'larında durur, buraya gömülmez.
///
/// Sayfanın kendisinde özel izin YOK (kişisel tercihler herkese açık); yönetim
/// bağlantıları tek tek kontrol edilir, yetkisi olmayan hiç görmez.
/// </summary>
[Authorize]
public class IndexModel : AbpPageModel
{
    [BindProperty]
    public string TaskDetailUi { get; set; } = PlatformSettingDefaults.TaskDetailUi;

    /// <summary>Projeler ekranının açılış görünümü ("card" | "list").</summary>
    [BindProperty]
    public string ProjectsDefaultView { get; set; } = PlatformSettingDefaults.ProjectsDefaultView;

    /// <summary>Projeye tıklayınca sağdan açılan görev paneli etkin mi?</summary>
    [BindProperty]
    public bool ProjectsDetailPanel { get; set; } = PlatformSettingDefaults.ProjectsDetailPanel;

    /// <summary>Yeni Görev modalının açılış katmanı ("quick" | "form").</summary>
    [BindProperty]
    public string TaskCreateDefaultMode { get; set; } = PlatformSettingDefaults.TaskCreateDefaultMode;

    /// <summary>Hızlı giriş satırının işaretçi ipuçları gösterilsin mi?</summary>
    [BindProperty]
    public bool TaskCreateShowKeyboardHints { get; set; } = PlatformSettingDefaults.TaskCreateShowKeyboardHints;

    /// <summary>Yeni Görev bilgi kutusu — KİRACI seviyesi, yalnız yetkiliye gösterilir.</summary>
    [BindProperty]
    public bool TaskCreateShowInfoBanner { get; set; } = PlatformSettingDefaults.TaskCreateShowInfoBanner;

    /// <summary>
    /// Hızlı giriş bu kullanıcı için mümkün mü (paket feature'ı + izin)? Değilse katman
    /// seçimi gösterilmez — kullanıcı kapalı bir şeyi ayarlamaya çalışmasın.
    /// </summary>
    public bool QuickEntryAvailable { get; set; }

    /// <summary>Kiracı seviyesindeki ayarı düzenleyebilir mi? (PlatformPermissions.TenantSettings)</summary>
    public bool CanManageTenantSettings { get; set; }

    /// <summary>
    /// Kullanıcının erişebildiği yönetim hedefleri (boşsa bölüm hiç basılmaz).
    /// Liste artık burada kurulmuyor: kaynak PlatformNavigationResolver — aynı
    /// çözümü kenar çubuğu da okuyor, öğeler iki yüzey arasında taşınabildiği
    /// için tek kaynak şart.
    /// </summary>
    public List<NavSettingsEntry> AdminLinks { get; private set; } = new();

    private readonly ISettingManager _settingManager;
    private readonly IPermissionChecker _permission;
    private readonly Volo.Abp.Features.IFeatureChecker _featureChecker;
    private readonly PlatformNavigationResolver _navigation;

    public IndexModel(
        ISettingManager settingManager,
        IPermissionChecker permission,
        Volo.Abp.Features.IFeatureChecker featureChecker,
        PlatformNavigationResolver navigation)
    {
        _settingManager = settingManager;
        _permission = permission;
        _featureChecker = featureChecker;
        _navigation = navigation;
    }

    public async Task OnGetAsync()
    {
        // fallback: true → kullanıcı henüz seçmediyse tanımlı varsayılana ("v3") iner.
        TaskDetailUi = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.TaskDetail.Ui)
                       ?? PlatformSettingDefaults.TaskDetailUi;

        ProjectsDefaultView = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.Projects.DefaultView)
                              ?? PlatformSettingDefaults.ProjectsDefaultView;

        // Boş/tanımsızsa varsayılana (KAPALI) iner; yalnız açık "true" değeri paneli açar.
        var detailPanel = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.Projects.DetailPanel);
        ProjectsDetailPanel = detailPanel == null
            ? PlatformSettingDefaults.ProjectsDetailPanel
            : detailPanel.Equals("true", System.StringComparison.OrdinalIgnoreCase);

        TaskCreateDefaultMode = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.TaskCreate.DefaultMode)
                                ?? PlatformSettingDefaults.TaskCreateDefaultMode;

        var hints = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.TaskCreate.ShowKeyboardHints);
        TaskCreateShowKeyboardHints = hints == null
            ? PlatformSettingDefaults.TaskCreateShowKeyboardHints
            : hints.Equals("true", System.StringComparison.OrdinalIgnoreCase);

        var banner = await _settingManager.GetOrNullForCurrentTenantAsync(PlatformSettings.TaskCreate.ShowInfoBanner);
        TaskCreateShowInfoBanner = banner == null
            ? PlatformSettingDefaults.TaskCreateShowInfoBanner
            : banner.Equals("true", System.StringComparison.OrdinalIgnoreCase);

        // Modaldaki kapılarla AYNI sıra: feature kapalıysa izne hiç bakılmaz.
        QuickEntryAvailable = await _featureChecker.IsEnabledAsync(PlatformFeatures.TaskQuickEntry)
                              && await _permission.IsGrantedAsync(PlatformPermissions.Tasks.QuickCreate);

        CanManageTenantSettings = await _permission.IsGrantedAsync(PlatformPermissions.TenantSettings.Default);

        // İzin filtresi ve sıra resolver'da uygulanır; kullanıcının menü
        // düzeninde kenar çubuğuna aldığı hedefler burada GÖSTERİLMEZ.
        AdminLinks = (await _navigation.ResolveAsync()).SettingsLinks;
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // Beyaz liste dışındaki her şey varsayılana çekilir (form manipülasyonuna karşı).
        var value = System.Array.IndexOf(PlatformSettingDefaults.TaskDetailUiValues, TaskDetailUi) >= 0
            ? TaskDetailUi
            : PlatformSettingDefaults.TaskDetailUi;
        await _settingManager.SetForCurrentUserAsync(PlatformSettings.TaskDetail.Ui, value);

        var projectsView = System.Array.IndexOf(PlatformSettingDefaults.ProjectsDefaultViewValues, ProjectsDefaultView) >= 0
            ? ProjectsDefaultView
            : PlatformSettingDefaults.ProjectsDefaultView;
        await _settingManager.SetForCurrentUserAsync(PlatformSettings.Projects.DefaultView, projectsView);

        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.Projects.DetailPanel,
            ProjectsDetailPanel.ToString().ToLowerInvariant());

        var taskCreateMode = System.Array.IndexOf(PlatformSettingDefaults.TaskCreateDefaultModeValues, TaskCreateDefaultMode) >= 0
            ? TaskCreateDefaultMode
            : PlatformSettingDefaults.TaskCreateDefaultMode;
        await _settingManager.SetForCurrentUserAsync(PlatformSettings.TaskCreate.DefaultMode, taskCreateMode);

        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.TaskCreate.ShowKeyboardHints,
            TaskCreateShowKeyboardHints.ToString().ToLowerInvariant());

        // KİRACI ayarı: yetkisi olmayanın POST'u yok sayılır. Alan ekranda hiç
        // basılmıyor ama gizli olması yetkilendirme değildir — sunucuda da kapalı.
        if (await _permission.IsGrantedAsync(PlatformPermissions.TenantSettings.Default))
        {
            await _settingManager.SetForCurrentTenantAsync(
                PlatformSettings.TaskCreate.ShowInfoBanner,
                TaskCreateShowInfoBanner.ToString().ToLowerInvariant());
        }

        TempData["Saved"] = true;
        return RedirectToPage();
    }
}
