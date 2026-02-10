using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Volo.Abp.Domain.Repositories; // Eklendi

namespace Apya.Platform.Web.Pages;

public class ProjectDetailsModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public ProjectDto Project { get; set; } = default!; // Uyarıyı susturur
    public List<ProjectTaskDto> Tasks { get; set; } = default!; // Uyarıyı susturur

    private readonly IProjectAppService _projectAppService;
    private readonly IProjectTaskAppService _taskAppService;
    private readonly IRepository<Project, Guid> _projectRepository; // Repository eklendi

    public ProjectDetailsModel(
        IProjectAppService projectAppService,
        IProjectTaskAppService taskAppService,
        IRepository<Project, Guid> projectRepository)
    {
        _projectAppService = projectAppService;
        _taskAppService = taskAppService;
        _projectRepository = projectRepository;
    }

    public async Task OnGetAsync()
    {
        // GetAsync hatası için Repository üzerinden çekiyoruz veya AppService'e bu metodu ekliyoruz
        var project = await _projectRepository.GetAsync(Id);
        Project = ObjectMapper.Map<Project, ProjectDto>(project);

        Tasks = await _taskAppService.GetListByProjectIdAsync(Id);
    }
}