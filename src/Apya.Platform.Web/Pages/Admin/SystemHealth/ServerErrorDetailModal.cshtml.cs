using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.IssueTasks;
using Apya.Platform.IssueTasks.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry;
using Apya.Platform.Telemetry.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.SystemHealth;

/// <summary>
/// "En Çok Hata Veren Sayfalar" satırından açılır: o URL'in pencere içindeki
/// tek tek sunucu hataları. Kaynak AbpAuditLogs — yeni tablo yok.
/// </summary>
[Authorize(PlatformPermissions.SystemHealth.Default)]
public class ServerErrorDetailModalModel : AbpPageModel
{
    private readonly ISystemHealthAppService _systemHealthAppService;
    private readonly IIssueTaskAppService _issueTaskAppService;

    [BindProperty(SupportsGet = true)]
    public string Url { get; set; } = string.Empty;

    [BindProperty(SupportsGet = true)]
    public int WindowDays { get; set; } = 7;

    public List<ServerErrorDetailDto> Errors { get; set; } = new();

    /// <summary>Bu adresteki arıza daha önce göreve dönüştürülmüşse bağ; yoksa null.</summary>
    public IssueTaskLinkDto? IssueTaskLink { get; set; }

    /// <summary>Köprü izni olmayan yönetici için bağ hiç sorgulanmaz (servis yetki ister).</summary>
    public bool CanCreateIssueTask { get; set; }

    public ServerErrorDetailModalModel(
        ISystemHealthAppService systemHealthAppService,
        IIssueTaskAppService issueTaskAppService)
    {
        _systemHealthAppService = systemHealthAppService;
        _issueTaskAppService = issueTaskAppService;
    }

    public async Task OnGetAsync()
    {
        Errors = await _systemHealthAppService.GetServerErrorsAsync(new GetServerErrorListInput
        {
            Url = Url,
            WindowDays = WindowDays
        });

        CanCreateIssueTask = await AuthorizationService.IsGrantedAsync(PlatformPermissions.IssueTasks.Default);
        if (CanCreateIssueTask && Errors.Count > 0)
        {
            IssueTaskLink = await _issueTaskAppService.GetLinkForServerErrorAsync(Url, WindowDays);
        }
    }
}
