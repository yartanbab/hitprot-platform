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
    /// Liste tanım tablosundan gelir; kullanıcının eklediği kategoriler de buradadır.
    /// </summary>
    public IReadOnlyList<CategoryCard> CategoryCards { get; private set; } = new List<CategoryCard>();

    public Guid? CurrentTenantId => CurrentUser.TenantId;

    private readonly IProjectAppService _projectAppService;
    private readonly IProjectCategoryAppService _projectCategoryAppService;
    private readonly ITenantAppService _tenantAppService;
    private readonly ICustomerAppService _customerAppService;
    private readonly IUploadedFileStorage _fileStorage;

    public CreateModalModel(
        IProjectAppService projectAppService,
        IProjectCategoryAppService projectCategoryAppService,
        ITenantAppService tenantAppService,
        ICustomerAppService customerAppService,
        IUploadedFileStorage fileStorage)
    {
        _projectAppService = projectAppService;
        _projectCategoryAppService = projectCategoryAppService;
        _tenantAppService = tenantAppService;
        _customerAppService = customerAppService;
        _fileStorage = fileStorage;
    }

    public async Task OnGetAsync()
    {
        await LoadCategoryCardsAsync();

        Project = new CreateProjectDto
        {
            StartDate = Clock.Now,
            EndDate = Clock.Now.AddMonths(1),
            // Varsayılan seçim: "Hibe Projesi" görünürse o, değilse listenin ilki.
            // Gizlenmiş bir kategoriyi seçili göstermek kartlarla eşleşmezdi.
            CategoryId = (CategoryCards.FirstOrDefault(c => c.SystemKey == ProjectCategory.GrantProject)
                          ?? CategoryCards.FirstOrDefault())?.Value
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

    /// <summary>
    /// Kategori kartlarını tanım tablosundan kurar.
    ///
    /// Kartın metinleri ve hangi detay alanlarını açtığı DAVRANIŞ ANAHTARINA bağlıdır:
    /// sistem kategorilerinde (Hibe / Etkinlik) hibe alanları ve hazır görev takvimi
    /// açılır, kullanıcının eklediği kategorilerde anahtar boştur ve kart "Diğer / Genel"
    /// ile aynı sade davranışı gösterir.
    /// </summary>
    private async Task LoadCategoryCardsAsync()
    {
        var categories = await _projectCategoryAppService.GetSelectableAsync();

        CategoryCards = categories.Select(c => new CategoryCard(
            c.Id,
            c.Name,
            DescriptionFor(c.SystemKey),
            c.Icon,
            c.Tone,
            HintFor(c.SystemKey, c.Name),
            c.SystemKey)).ToList();
    }

    private static string DescriptionFor(ProjectCategory? systemKey) => systemKey switch
    {
        ProjectCategory.GrantProject => "Bütçe kalemleri ve rapor takvimi",
        ProjectCategory.Event => "Geri sayım ve tedarikçi görevleri",
        ProjectCategory.Other => "Sadece ad, kod ve tarih aralığı",
        _ => "Ad, kod ve tarih aralığı"
    };

    private static string HintFor(ProjectCategory? systemKey, string name) => systemKey switch
    {
        ProjectCategory.GrantProject => "Hibe projesi seçildi — amaç, hedef kitle ve faaliyetler başvuru dosyasına gider.",
        ProjectCategory.Event => "Etkinlik seçildi — hedef kitle sorulur, faaliyet listesi gerekmez.",
        ProjectCategory.Other => "Genel proje — yalnız açıklama istenir, hibe alanları gizlendi.",
        _ => $"{name} — yalnız açıklama istenir, hibe alanları gizlendi."
    };

    /// <summary>
    /// Kategori seçim kartının görünüm verisi. <paramref name="SystemKey"/> boşsa
    /// kullanıcı kategorisidir: bağlı davranışı yoktur.
    /// </summary>
    public record CategoryCard(
        Guid Value,
        string Label,
        string Description,
        string Icon,
        string Tone,
        string Hint,
        ProjectCategory? SystemKey);
}
