using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Identity;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;

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

    /// <summary>Kullanıcının erişebildiği yönetim hedefleri (boşsa bölüm hiç basılmaz).</summary>
    public List<AdminLink> AdminLinks { get; } = new();

    public record AdminLink(string Title, string Description, string Url, string Icon);

    private readonly ISettingManager _settingManager;
    private readonly IPermissionChecker _permission;
    private readonly Volo.Abp.Features.IFeatureChecker _featureChecker;

    public IndexModel(
        ISettingManager settingManager,
        IPermissionChecker permission,
        Volo.Abp.Features.IFeatureChecker featureChecker)
    {
        _settingManager = settingManager;
        _permission = permission;
        _featureChecker = featureChecker;
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

        await LoadAdminLinksAsync();
    }

    private async Task LoadAdminLinksAsync()
    {
        async Task AddIfGrantedAsync(string permissionName, AdminLink link)
        {
            if (await _permission.IsGrantedAsync(permissionName))
            {
                AdminLinks.Add(link);
            }
        }

        await AddIfGrantedAsync(TenantManagementPermissions.Tenants.Default, new AdminLink(
            L["Menu:TenantManagement"], L["Settings:Admin.Tenants.Desc"],
            "/TenantManagement/Tenants", "fa fa-building"));

        await AddIfGrantedAsync(IdentityPermissions.Users.Default, new AdminLink(
            L["Menu:IdentityUsers"], L["Settings:Admin.Users.Desc"],
            "/Identity/Users", "fa fa-users"));

        await AddIfGrantedAsync(IdentityPermissions.Roles.Default, new AdminLink(
            L["Menu:IdentityRoles"], L["Settings:Admin.Roles.Desc"],
            "/Identity/Roles", "fa fa-user-shield"));

        // ABP'nin kendi Ayar Yönetimi ekranı (e-posta vb.) — modülün menü
        // contributor'ı da bu izne bakıyor, aynı kapı kullanılır.
        await AddIfGrantedAsync(SettingManagementPermissions.Emailing, new AdminLink(
            L["Menu:SettingManagement"], L["Settings:Admin.SettingManagement.Desc"],
            "/SettingManagement", "fa fa-envelope"));

        // Paket Yönetimi + Tasarım Sistemi aynı kapıyı (Tenants.Update) kullanır —
        // yeni permission tanımlamamak için bilinçli tercih, tenant'ta görünmez.
        await AddIfGrantedAsync(TenantManagementPermissions.Tenants.Update, new AdminLink(
            L["Menu:PackageManagement"], L["Settings:Admin.Packages.Desc"],
            "/PackageManagement", "fa fa-box-open"));

        await AddIfGrantedAsync(TenantManagementPermissions.Tenants.Update, new AdminLink(
            L["Menu:DesignSystem"], L["Settings:Admin.DesignSystem.Desc"],
            "/DesignSystem", "fa fa-palette"));

        await AddIfGrantedAsync(PlatformPermissions.Feedbacks.Default, new AdminLink(
            L["Menu:FeedbackAdmin"], L["Settings:Admin.Feedback.Desc"],
            "/Admin/Feedback", "fa fa-inbox"));

        await AddIfGrantedAsync(PlatformPermissions.Feedbacks.ManageSettings, new AdminLink(
            L["Menu:FeedbackSettings"], L["Settings:Admin.FeedbackSettings.Desc"],
            "/Admin/Feedback/Settings", "fa fa-sliders"));

        await AddIfGrantedAsync(PlatformPermissions.LoginScreen.Default, new AdminLink(
            L["Menu:LoginScreen"], L["Settings:Admin.LoginScreen.Desc"],
            "/Admin/LoginScreen", "fa fa-right-to-bracket"));
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
