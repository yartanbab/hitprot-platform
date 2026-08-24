using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Http;
using Apya.Platform.Web.Services;
using Volo.Abp.TenantManagement;
using Volo.Abp.Application.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Customers;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Projects;

// Sayfa seviyesinde yetki YOKTU: anonim istek OnGetAsync'e kadar geliyor ve
// içerideki AppService çağrısı AbpAuthorizationException atıyordu → giriş
// ekranına 302 yerine 500. İzin, "Yeni Proje Ekle" düğmesinin göründüğü
// koşulla aynı (Index.cshtml → canCreate).
[Authorize(PlatformPermissions.Projects.Create)]
public class CreateModalModel : PlatformPageModel
{
    [BindProperty]
    public CreateProjectDto Project { get; set; } = new();

    [BindProperty]
    public IFormFile? UploadFile { get; set; }

    /// <summary>
    /// "Oluştur ve görev ekle" düğmesi bunu true yapar; yanıt Index.js'e
    /// yeni projenin görev paneline gitmesini söyler.
    /// </summary>
    [BindProperty]
    public bool GoToTasks { get; set; }

    public List<SelectListItem> Tenants { get; set; } = new();
    public List<SelectListItem> Currencies { get; set; } = new();
    public List<SelectListItem> Customers { get; set; } = new();

    /// <summary>
    /// Kategori artık açılır liste değil, seçim kartı — formun geri kalanının
    /// hangi alanları göstereceğini bu belirlediği için en görünür alan o.
    /// </summary>
    public IReadOnlyList<CategoryCard> CategoryCards { get; } = new List<CategoryCard>
    {
        new((int)ProjectCategory.GrantProject, "Hibe Projesi", "Bütçe kalemleri ve rapor takvimi",
            "fa-award", "brand",
            "Hibe projesi seçildi — amaç, hedef kitle ve faaliyetler başvuru dosyasına gider."),
        new((int)ProjectCategory.Event, "Etkinlik", "Geri sayım ve tedarikçi görevleri",
            "fa-calendar-days", "warning",
            "Etkinlik seçildi — hedef kitle sorulur, faaliyet listesi gerekmez."),
        new((int)ProjectCategory.Other, "Diğer / Genel", "Sadece ad, kod ve tarih aralığı",
            "fa-diagram-project", "neutral",
            "Genel proje — yalnız açıklama istenir, hibe alanları gizlendi.")
    };

    public Guid? CurrentTenantId => CurrentUser.TenantId;

    private readonly IProjectAppService _projectAppService;
    private readonly ITenantAppService _tenantAppService;
    private readonly ICustomerAppService _customerAppService;
    private readonly IUploadedFileStorage _fileStorage;

    public CreateModalModel(
        IProjectAppService projectAppService,
        ITenantAppService tenantAppService,
        ICustomerAppService customerAppService,
        IUploadedFileStorage fileStorage)
    {
        _projectAppService = projectAppService;
        _tenantAppService = tenantAppService;
        _customerAppService = customerAppService;
        _fileStorage = fileStorage;
    }

    public async Task OnGetAsync()
    {
        Project = new CreateProjectDto
        {
            StartDate = Clock.Now,
            EndDate = Clock.Now.AddMonths(1),
            Category = ProjectCategory.GrantProject
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

        // APYA-132: CARİLER (aktif olanlar)
        var customerResult = await _customerAppService.GetListAsync(
            new GetCustomersInput { MaxResultCount = 1000, IsActive = true });
        Customers = customerResult.Items
            .Select(c => new SelectListItem(c.Name, c.Id.ToString()))
            .ToList();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // 1. Once projeyi olusturuyoruz
        var createdProject = await _projectAppService.CreateAsync(Project);

        // 2. Dosya yukleme (Attachment)
        // SEC: dosya artik IUploadedFileStorage uzerinden yaziliyor — uzanti beyaz
        // listesi + 25 MB siniri burada uygulanir. Onceden diske dogrudan yaziliyordu.
        if (UploadFile != null && UploadFile.Length > 0)
        {
            var storedFileName = await _fileStorage.StoreAsync(UploadFile);

            await _projectAppService.AddAttachmentAsync(
                createdProject.Id,
                UploadFile.FileName,
                storedFileName,
                UploadFile.ContentType ?? "",
                UploadFile.Length);
        }

        // NoContent yerine kimlik dönüyoruz: "Oluştur ve görev ekle" akışında
        // Index.js doğrudan yeni projenin detayına gidebilsin diye.
        return new OkObjectResult(new { id = createdProject.Id, goToTasks = GoToTasks });
    }

    /// <summary>Kategori seçim kartının görünüm verisi.</summary>
    public record CategoryCard(int Value, string Label, string Description, string Icon, string Tone, string Hint);
}
