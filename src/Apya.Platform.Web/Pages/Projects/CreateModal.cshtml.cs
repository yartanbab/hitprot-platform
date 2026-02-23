using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Http;
using Volo.Abp.TenantManagement; // Müþterileri çekmek için gerekli
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;

namespace Apya.Platform.Web.Pages.Projects;

public class CreateModalModel : PlatformPageModel
{
    [BindProperty]
    public CreateProjectDto Project { get; set; } = new();

    [BindProperty]
    public IFormFile? UploadFile { get; set; }

    // EKLENDÝ: Arayüzdeki Müþteri Dropdown'ý için liste
    public List<SelectListItem> Tenants { get; set; } = new();

    private readonly IProjectAppService _projectAppService;
    private readonly ITenantAppService _tenantAppService; // EKLENDÝ: Müþteri Servisi

    // Constructor güncellendi
    public CreateModalModel(IProjectAppService projectAppService, ITenantAppService tenantAppService)
    {
        _projectAppService = projectAppService;
        _tenantAppService = tenantAppService;
    }

    // DÝKKAT: Veritabanýndan veri çekeceðimiz için 'void OnGet' yerine 'async Task OnGetAsync' yaptýk!
    public async Task OnGetAsync()
    {
        // Tarihlere varsayýlan deðerleri atýyoruz
        Project = new CreateProjectDto
        {
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddMonths(1)
        };

        // EKLENDÝ: Sadece Platform yetkilisi (Host) ise Müþterileri listele
        if (!CurrentUser.TenantId.HasValue)
        {
            var tenantResult = await _tenantAppService.GetListAsync(new GetTenantsInput { MaxResultCount = 1000 });
            Tenants = tenantResult.Items
                .Select(t => new SelectListItem(t.Name, t.Id.ToString()))
                .ToList();
        }
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // 1. Önce projeyi oluþturuyoruz
        var createdProject = await _projectAppService.CreateAsync(Project);

        // 2. Eðer kullanýcý bir dosya seçmiþse, bunu iþlemek için gereken altyapý
        if (UploadFile != null && UploadFile.Length > 0)
        {
            // Ýlerleyen adýmlarda buraya gerçek dosya kaydetme (Attachment) mantýðýný yazacaðýz.
        }

        return NoContent();
    }
}