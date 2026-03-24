using System;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Projects;

public class AiTaskGeneratorModalModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    public void OnGet()
    {
    }
}
