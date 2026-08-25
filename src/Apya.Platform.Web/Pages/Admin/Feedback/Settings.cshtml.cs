using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.IssueTasks;
using Apya.Platform.IssueTasks.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.Feedback;

/// <summary>
/// Geri bildirim modülü yapılandırması. Tüm değerler ABP Setting olarak saklanır —
/// hiçbiri koda gömülü değildir.
/// </summary>
[Authorize(PlatformPermissions.Feedbacks.ManageSettings)]
public class SettingsModel : AbpPageModel
{
    private readonly IFeedbackSettingsAppService _settingsAppService;
    private readonly IIssueTaskAppService _issueTaskAppService;

    [BindProperty]
    public FeedbackSettingsDto Settings { get; set; } = new();

    /// <summary>Çoklu seçim kutusundan gelen tür değerleri.</summary>
    [BindProperty]
    public List<int> SelectedTypes { get; set; } = new();

    /// <summary>Geri bildirim/hata kayıtlarının göreve dönüştürülme kuralları.</summary>
    [BindProperty]
    public IssueTaskSettingsDto IssueTasks { get; set; } = new();

    public List<SelectListItem> ProjectList { get; set; } = new();
    public List<SelectListItem> AssigneeList { get; set; } = new();

    /// <summary>
    /// Köprü ayarları ayrı bir izne bağlı: geri bildirim ayarlarını yönetebilen ama
    /// göreve dönüştürme yetkisi olmayan kullanıcı bu bölümü hiç görmez (servis
    /// çağrısı da yapılmaz — aksi halde sayfanın tamamı 403 olurdu).
    /// </summary>
    public bool CanManageIssueTasks { get; set; }

    public SettingsModel(
        IFeedbackSettingsAppService settingsAppService,
        IIssueTaskAppService issueTaskAppService)
    {
        _settingsAppService = settingsAppService;
        _issueTaskAppService = issueTaskAppService;
    }

    public async Task OnGetAsync()
    {
        Settings = await _settingsAppService.GetAsync();
        SelectedTypes = Settings.EnabledTypes.Select(t => (int)t).ToList();

        CanManageIssueTasks = await AuthorizationService.IsGrantedAsync(PlatformPermissions.IssueTasks.ManageSettings);
        if (CanManageIssueTasks)
        {
            IssueTasks = await _issueTaskAppService.GetSettingsAsync();
            await BuildIssueTaskListsAsync();
        }
    }

    public async Task<IActionResult> OnPostAsync()
    {
        Settings.EnabledTypes = SelectedTypes
            .Where(v => Enum.IsDefined(typeof(FeedbackType), v))
            .Select(v => (FeedbackType)v)
            .ToList();

        await _settingsAppService.UpdateAsync(Settings);

        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.IssueTasks.ManageSettings))
        {
            await _issueTaskAppService.UpdateSettingsAsync(IssueTasks);
        }

        // Ayar değişikliği anında görünür olsun diye tam sayfa yenilemesi yapılır.
        return RedirectToPage();
    }

    private async Task BuildIssueTaskListsAsync()
    {
        var target = await _issueTaskAppService.GetTargetAsync();

        // Boş seçenek: hedef proje seçilmemişse dönüştürme kapalıdır, bu geçerli bir durum.
        ProjectList = new List<SelectListItem> { new("(seçilmedi — dönüştürme kapalı)", "") };
        ProjectList.AddRange(target.Projects.Select(p => new SelectListItem(
            string.IsNullOrWhiteSpace(p.Code) ? p.Name : $"{p.Code} · {p.Name}",
            p.Id.ToString())));

        AssigneeList = new List<SelectListItem> { new("(atanmasın)", "") };
        AssigneeList.AddRange(target.Assignees.Select(a => new SelectListItem(
            string.IsNullOrWhiteSpace(a.Name) ? (a.UserName ?? "-") : a.Name!,
            a.Id.ToString())));
    }
}
