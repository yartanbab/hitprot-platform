using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry;
using Apya.Platform.Telemetry.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.SystemHealth;

[Authorize(PlatformPermissions.SystemHealth.Default)]
public class IndexModel : AbpPageModel
{
    /// <summary>Seçilebilir pencereler — serbest sayı kabul edilmez (audit tablosu büyük).</summary>
    public static readonly int[] AllowedWindows = { 7, 14, 30, 90 };

    private readonly ISystemHealthAppService _systemHealthAppService;

    public SystemHealthDto Health { get; set; } = default!;

    [BindProperty(SupportsGet = true)]
    public int WindowDays { get; set; } = 7;

    /// <summary>
    /// KPI kartından gelen ön-filtre: "unresolved" | "resolved" | "all".
    /// İstemci hataları tablosunun açılış durumunu belirler.
    /// </summary>
    [BindProperty(SupportsGet = true)]
    public string? ClientFilter { get; set; }

    public IndexModel(ISystemHealthAppService systemHealthAppService)
    {
        _systemHealthAppService = systemHealthAppService;
    }

    public async Task OnGetAsync()
    {
        if (!AllowedWindows.Contains(WindowDays))
        {
            WindowDays = 7;
        }

        Health = await _systemHealthAppService.GetAsync(WindowDays);
    }

    /// <summary>ClientFilter'ın #Filter_IsResolved seçeneğine karşılığı.</summary>
    public string ResolvedSelectValue => ClientFilter switch
    {
        "resolved" => "true",
        "all" => "",
        _ => "false"
    };

    public static string SourceLabel(ClientErrorSource source) => source switch
    {
        ClientErrorSource.JsError => "JS Hatası",
        ClientErrorSource.UnhandledRejection => "Promise Reddi",
        ClientErrorSource.AjaxError => "AJAX Hatası",
        _ => source.ToString()
    };
}
