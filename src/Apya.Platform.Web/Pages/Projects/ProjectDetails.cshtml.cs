using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Projects;

public class ProjectDetailsModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public ProjectDto? Project { get; set; }
    public List<TaskDto> Tasks { get; set; } = new();

    private readonly IProjectAppService _projectAppService;
    private readonly ITaskAppService _taskAppService;

    public ProjectDetailsModel(IProjectAppService projectAppService, ITaskAppService taskAppService)
    {
        _projectAppService = projectAppService;
        _taskAppService = taskAppService;
    }

    public async Task OnGetAsync()
    {
        // Proje bilgilerini çekiyoruz
        Project = await _projectAppService.GetAsync(Id);

        // Bu projeye ait görevleri çekiyoruz (Zengin Task modülünden)
        // Not: GetListAsync metodunuzun filtreleme parametrelerine göre burayı düzenleyebilirsiniz
        var taskResult = await _taskAppService.GetListAsync(new GetTasksInput { ProjectId = Id });
        Tasks = taskResult.Items.ToList();
    }
}

