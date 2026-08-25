using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Projects;

// OnGet veri çekmediği için anonim istekte patlamıyor, sessizce 200 + boş
// kabuk dönüyordu. Kardeş sayfalarla aynı taban izin; asıl AI çağrıları
// (/api/ai-task-generator/*) kendi yetkisini ayrıca uyguluyor.
[Authorize(PlatformPermissions.Projects.Default)]
public class AiTaskGeneratorModalModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    public void OnGet()
    {
    }
}
