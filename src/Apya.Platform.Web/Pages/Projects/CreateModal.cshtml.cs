using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Volo.Abp.TenantManagement;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;

namespace Apya.Platform.Web.Pages.Projects;

public class CreateModalModel : PlatformPageModel
{
    [BindProperty]
    public CreateProjectDto Project { get; set; } = new();

    [BindProperty]
    public IFormFile? UploadFile { get; set; }

    public List<SelectListItem> Tenants { get; set; } = new();
    public List<SelectListItem> Currencies { get; set; } = new();
    
    public Guid? CurrentTenantId => CurrentUser.TenantId;

    private readonly IProjectAppService _projectAppService;
    private readonly ITenantAppService _tenantAppService;
    private readonly IWebHostEnvironment _environment;

    public CreateModalModel(
        IProjectAppService projectAppService, 
        ITenantAppService tenantAppService,
        IWebHostEnvironment environment)
    {
        _projectAppService = projectAppService;
        _tenantAppService = tenantAppService;
        _environment = environment;
    }

    public async Task OnGetAsync()
    {
        Project = new CreateProjectDto
        {
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddMonths(1)
        };

        if (!CurrentUser.TenantId.HasValue)
        {
            var tenantResult = await _tenantAppService.GetListAsync(new GetTenantsInput { MaxResultCount = 1000 });
            Tenants = tenantResult.Items
                .Select(t => new SelectListItem(t.Name, t.Id.ToString()))
                .ToList();
        }

        // PARA BİRİMLERİ
        Currencies = new List<SelectListItem>
        {
            new SelectListItem("₺ (TL)", "TRY"),
            new SelectListItem("$ (USD)", "USD"),
            new SelectListItem("€ (EUR)", "EUR")
        };
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // 1. Once projeyi olusturuyoruz
        var createdProject = await _projectAppService.CreateAsync(Project);

        // 2. Dosya yukleme (Attachment)
        if (UploadFile != null && UploadFile.Length > 0)
        {
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder)) 
                Directory.CreateDirectory(uploadsFolder);

            var storedFileName = Guid.NewGuid().ToString() + Path.GetExtension(UploadFile.FileName);
            var filePath = Path.Combine(uploadsFolder, storedFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await UploadFile.CopyToAsync(stream);
            }

            // ProjectAppService icindeki AddAttachmentAsync metodunu cagiriyoruz
            await _projectAppService.AddAttachmentAsync(
                createdProject.Id, 
                UploadFile.FileName, 
                storedFileName, 
                UploadFile.Length);
        }

        return NoContent();
    }
}
