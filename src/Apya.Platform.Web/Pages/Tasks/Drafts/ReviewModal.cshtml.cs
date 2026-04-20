using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Tasks.Drafts;

namespace Apya.Platform.Web.Pages.Tasks.Drafts;

public class ReviewModalModel : AbpPageModel
{
    [HiddenInput]
    [BindProperty(SupportsGet = true)]
    public Guid BatchId { get; set; }

    public List<DraftTaskDto> DraftTasks { get; set; } = new();

    private readonly IDraftTaskAppService _draftTaskAppService;

    public ReviewModalModel(IDraftTaskAppService draftTaskAppService)
    {
        _draftTaskAppService = draftTaskAppService;
    }

    public async Task OnGetAsync()
    {
        // BatchId ile pending taskları yükle
        DraftTasks = await _draftTaskAppService.GetPendingDraftsAsync(BatchId);
    }
}
