using System.Collections.Generic;
using System.Threading.Tasks;
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

    /// <summary>Kullanıcının erişebildiği yönetim hedefleri (boşsa bölüm hiç basılmaz).</summary>
    public List<AdminLink> AdminLinks { get; } = new();

    public record AdminLink(string Title, string Description, string Url, string Icon);

    private readonly ISettingManager _settingManager;
    private readonly IPermissionChecker _permission;

    public IndexModel(ISettingManager settingManager, IPermissionChecker permission)
    {
        _settingManager = settingManager;
        _permission = permission;
    }

    public async Task OnGetAsync()
    {
        // fallback: true → kullanıcı henüz seçmediyse tanımlı varsayılana ("v3") iner.
        TaskDetailUi = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.TaskDetail.Ui)
                       ?? PlatformSettingDefaults.TaskDetailUi;

        ProjectsDefaultView = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.Projects.DefaultView)
                              ?? PlatformSettingDefaults.ProjectsDefaultView;

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

        TempData["Saved"] = true;
        return RedirectToPage();
    }
}
