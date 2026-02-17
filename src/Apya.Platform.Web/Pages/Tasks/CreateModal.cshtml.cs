using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Apya.Platform.Tasks;

namespace Apya.Platform.Web.Pages.Tasks;

public class CreateModalModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid? ProjectId { get; set; }

    [BindProperty]
    public CreateUpdateTaskDto Task { get; set; } = new();

    public List<SelectListItem> UserList { get; set; } = new();

    private readonly ITaskAppService _taskAppService;

    public CreateModalModel(ITaskAppService taskAppService)
    {
        _taskAppService = taskAppService;
    }

    public async System.Threading.Tasks.Task OnGetAsync()
    {
        Task = new CreateUpdateTaskDto
        {
            ProjectId = ProjectId,
            StartDate = DateTime.Now,
            DueDate = DateTime.Now.AddDays(7),
            Priority = TaskPriority.Medium,
            Status = Apya.Platform.Tasks.TaskStatus.Todo
        };

        var userLookup = await _taskAppService.GetUsersLookupAsync();
        UserList = userLookup.Items
            .Select(u => new SelectListItem(u.UserName, u.Id.ToString()))
            .ToList();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (ProjectId.HasValue && Task.ProjectId == null)
        {
            Task.ProjectId = ProjectId;
        }

        await _taskAppService.CreateAsync(Task);
        return NoContent();
    }
}