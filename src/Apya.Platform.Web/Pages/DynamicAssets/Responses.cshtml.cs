using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Apya.Platform.Web.Pages.DynamicAssets;

[Authorize]
public class ResponsesModel : PageModel
{
    public Guid FormId { get; set; }

    public void OnGet(Guid formId)
    {
        FormId = formId;
    }
}
