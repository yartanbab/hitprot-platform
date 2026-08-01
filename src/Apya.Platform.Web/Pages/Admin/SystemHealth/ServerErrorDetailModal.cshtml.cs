using System.Collections.Generic;
using System.Threading.Tasks;
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

    [BindProperty(SupportsGet = true)]
    public string Url { get; set; } = string.Empty;

    [BindProperty(SupportsGet = true)]
    public int WindowDays { get; set; } = 7;

    public List<ServerErrorDetailDto> Errors { get; set; } = new();

    public ServerErrorDetailModalModel(ISystemHealthAppService systemHealthAppService)
    {
        _systemHealthAppService = systemHealthAppService;
    }

    public async Task OnGetAsync()
    {
        Errors = await _systemHealthAppService.GetServerErrorsAsync(new GetServerErrorListInput
        {
            Url = Url,
            WindowDays = WindowDays
        });
    }
}
