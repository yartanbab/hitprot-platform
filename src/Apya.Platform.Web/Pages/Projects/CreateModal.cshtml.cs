using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http; // IFormFile (Dosya yükleme) için gerekli kütüphane
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;

namespace Apya.Platform.Web.Pages.Projects;

public class CreateModalModel : PlatformPageModel
{
    [BindProperty]
    public CreateProjectDto Project { get; set; } = new();

    // KÝLÝT NOKTA: HTML tarafýnýn aradýðý eksik özellik buraya eklendi
    [BindProperty]
    public IFormFile? UploadFile { get; set; }

    private readonly IProjectAppService _projectAppService;

    public CreateModalModel(IProjectAppService projectAppService)
    {
        _projectAppService = projectAppService;
    }

    public void OnGet()
    {
        Project = new CreateProjectDto();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // 1. Önce projeyi oluþturuyoruz
        var createdProject = await _projectAppService.CreateAsync(Project);

        // 2. Eðer kullanýcý bir dosya seçmiþse, bunu iþlemek için gereken altyapý
        if (UploadFile != null && UploadFile.Length > 0)
        {
            // Ýlerleyen adýmlarda buraya gerçek dosya kaydetme (Attachment) mantýðýný yazacaðýz.
            // Þimdilik sadece modelin hata vermemesi için deðiþkeni tanýmlamýþ olduk.
        }

        return NoContent();
    }
}




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
    // [BindProperty(SupportsGet = true)] özelliði GET isteðiyle gelen parametreyi KESÝN yakalar
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
        // 1. Yeni form oluþturulurken ProjectId'yi doðrudan modelin içine GÖMÜYORUZ.
        Task = new CreateUpdateTaskDto
        {
            ProjectId = ProjectId, // GET ile gelen ID'yi DTO'ya veriyoruz
            StartDate = DateTime.Now,
            DueDate = DateTime.Now.AddDays(7),
            Priority = TaskPriority.Medium,
            Status = Apya.Platform.Tasks.TaskStatus.Todo
        };

        // 2. Kullanýcý listesini doldur
        var userLookup = await _taskAppService.GetUsersLookupAsync();
        UserList = userLookup.Items
            .Select(u => new SelectListItem(u.UserName, u.Id.ToString()))
            .ToList();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // 3. POST iþlemi sýrasýnda (Kaydet'e basýldýðýnda) ID'nin kaybolma ihtimaline karþý son güvenlik kilidi:
        if (ProjectId.HasValue && Task.ProjectId == null)
        {
            Task.ProjectId = ProjectId;
        }

        // Görevi kaydet
        await _taskAppService.CreateAsync(Task);
        return NoContent();
    }
}



