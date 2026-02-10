using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Application.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;

namespace Apya.Platform.Web.Pages;

public class IndexModel : PlatformPageModel
{
    // Varsayılan değer atandı (new())
    public PagedResultDto<ProjectDto> ProjectList { get; set; } = new();

    private readonly IProjectAppService _projectAppService;

    public IndexModel(IProjectAppService projectAppService)
    {
        _projectAppService = projectAppService;
    }

    public void OnGet()
    {
        // Sayfa yüklenirken yapılacak işlemler
    }
}