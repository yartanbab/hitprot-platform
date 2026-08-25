using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.IssueTasks;
using Apya.Platform.IssueTasks.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry;
using Apya.Platform.Telemetry.Dtos;
using Apya.Platform.Web.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.SystemHealth;

/// <summary>
/// Tek bir istemci hatasının teşhis detayı. Veri zaten ClientError'da duruyordu;
/// GetClientErrorAsync servisi yazılmış ama hiçbir ekran çağırmıyordu.
/// </summary>
[Authorize(PlatformPermissions.SystemHealth.Default)]
public class ClientErrorDetailModalModel : AbpPageModel
{
    private readonly ISystemHealthAppService _systemHealthAppService;
    private readonly IIssueTaskAppService _issueTaskAppService;

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public ClientErrorDto Error { get; set; } = default!;

    /// <summary>Hatadan hemen önceki kullanıcı adımları — "nasıl tekrar ederim" sorusunun cevabı.</summary>
    public List<BreadcrumbEvent> Breadcrumb { get; set; } = new();

    /// <summary>Bu hata daha önce göreve dönüştürülmüşse bağ; yoksa null.</summary>
    public IssueTaskLinkDto? IssueTaskLink { get; set; }

    /// <summary>Köprü izni olmayan yönetici için bağ hiç sorgulanmaz (servis yetki ister).</summary>
    public bool CanCreateIssueTask { get; set; }

    public ClientErrorDetailModalModel(
        ISystemHealthAppService systemHealthAppService,
        IIssueTaskAppService issueTaskAppService)
    {
        _systemHealthAppService = systemHealthAppService;
        _issueTaskAppService = issueTaskAppService;
    }

    public async Task OnGetAsync()
    {
        Error = await _systemHealthAppService.GetClientErrorAsync(Id);
        Breadcrumb = BreadcrumbParser.Parse(Error.BreadcrumbJson);

        CanCreateIssueTask = await AuthorizationService.IsGrantedAsync(PlatformPermissions.IssueTasks.Default);
        if (CanCreateIssueTask)
        {
            IssueTaskLink = await _issueTaskAppService.GetLinkForClientErrorAsync(Id);
        }
    }

    public static string SourceLabel(ClientErrorSource source) => source switch
    {
        ClientErrorSource.JsError => "JS Hatası",
        ClientErrorSource.UnhandledRejection => "Promise Reddi",
        ClientErrorSource.AjaxError => "AJAX Hatası",
        _ => source.ToString()
    };
}
