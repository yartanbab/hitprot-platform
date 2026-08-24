using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Customers;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Storage;
using Apya.Platform.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Apya.Platform.Web.Pages.Projects;

/// <summary>
/// Proje düzenleme ekranı — üç sekme: Bilgiler · Görsel & Dosyalar · Tehlikeli bölge.
///
/// Her sekme kendi form post'unu yapar (AJAX yok): dosya yükleme akışında
/// ilerleme/hata durumu tarayıcının kendi mekanizmasıyla yönetilir ve
/// JavaScript kapalıyken de çalışır. Post sonrası aynı sekmeye dönülür.
/// </summary>
[Authorize(PlatformPermissions.Projects.Edit)]
public class EditModel : PlatformPageModel
{
    /// <summary>Kapak görseli olarak kabul edilen uzantılar — depolama beyaz listesinin alt kümesi.</summary>
    private static readonly string[] CoverExtensions = { ".png", ".jpg", ".jpeg", ".gif" };

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    /// <summary>Açılacak sekme: info | files | danger. ⋯ menüsündeki silme buraya ?tab=danger ile gelir.</summary>
    [BindProperty(SupportsGet = true)]
    public string Tab { get; set; } = "info";

    [BindProperty]
    public CreateProjectDto Project { get; set; } = new();

    [BindProperty]
    public IFormFile? CoverFile { get; set; }

    [BindProperty]
    public IFormFile? AttachmentFile { get; set; }

    [BindProperty]
    public string? AttachmentTitle { get; set; }

    /// <summary>Silme onayı: kullanıcının elle yazdığı proje kodu.</summary>
    [BindProperty]
    public string? DeleteConfirmCode { get; set; }

    public ProjectDto Current { get; set; } = new();
    public List<ProjectAttachmentDto> Attachments { get; set; } = new();
    public List<SelectListItem> Customers { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();

    public bool CanViewBudget { get; set; }
    public bool CanDelete { get; set; }

    private readonly IProjectAppService _projectAppService;
    private readonly ICustomerAppService _customerAppService;
    private readonly IUploadedFileStorage _fileStorage;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    public EditModel(
        IProjectAppService projectAppService,
        ICustomerAppService customerAppService,
        IUploadedFileStorage fileStorage,
        IUploadedFileRootFolderProvider rootFolderProvider)
    {
        _projectAppService = projectAppService;
        _customerAppService = customerAppService;
        _fileStorage = fileStorage;
        _rootFolderProvider = rootFolderProvider;
    }

    public async Task<IActionResult> OnGetAsync()
    {
        await LoadAsync();

        Project = new CreateProjectDto
        {
            Name = Current.Name,
            Code = Current.Code,
            Description = Current.Description,
            Purpose = Current.Purpose,
            Duration = Current.Duration,
            TargetAudience = Current.TargetAudience,
            Activities = Current.Activities,
            StartDate = Current.StartDate,
            EndDate = Current.EndDate,
            GrantId = Current.GrantId,
            CustomerId = Current.CustomerId,
            Category = Current.Category,
            TotalBudget = Current.TotalBudget,
            HourlyRate = Current.HourlyRate,
            Currency = Current.Currency
        };

        return Page();
    }

    // ─────────────────────────────────────────────── BİLGİLER
    public async Task<IActionResult> OnPostAsync()
    {
        await LoadAsync();

        if (!ModelState.IsValid)
        {
            Tab = "info";
            return Page();
        }

        // Formda GÖSTERİLMEYEN alanlar mevcut değerlerinden korunur; aksi hâlde
        // her kayıtta sıfırlanırlardı (bütçe yetkisi olmayan kullanıcı bütçeyi
        // silerdi, hibe bağlantısı kopardı).
        Project.GrantId = Current.GrantId;
        Project.HourlyRate = Current.HourlyRate;
        Project.Currency = Current.Currency;
        if (!CanViewBudget)
        {
            Project.TotalBudget = Current.TotalBudget;
        }

        await _projectAppService.UpdateAsync(Id, Project);

        TempData["Saved"] = true;
        return RedirectToPage(new { id = Id, tab = "info" });
    }

    // ─────────────────────────────────────────────── KAPAK GÖRSELİ
    public async Task<IActionResult> OnPostUploadCoverAsync()
    {
        await LoadAsync();

        if (CoverFile == null || CoverFile.Length == 0)
        {
            ModelState.AddModelError(string.Empty, "Bir görsel seçin.");
            Tab = "files";
            return Page();
        }

        var ext = Path.GetExtension(CoverFile.FileName).ToLowerInvariant();
        if (!CoverExtensions.Contains(ext))
        {
            ModelState.AddModelError(string.Empty, "Kapak görseli yalnız PNG, JPG veya GIF olabilir.");
            Tab = "files";
            return Page();
        }

        var storedFileName = await _fileStorage.StoreAsync(CoverFile);
        var replaced = await _projectAppService.SetCoverImageAsync(Id, storedFileName);
        DeletePhysicalFile(replaced);

        TempData["Saved"] = true;
        return RedirectToPage(new { id = Id, tab = "files" });
    }

    public async Task<IActionResult> OnPostRemoveCoverAsync()
    {
        var removed = await _projectAppService.RemoveCoverImageAsync(Id);
        DeletePhysicalFile(removed);

        TempData["Saved"] = true;
        return RedirectToPage(new { id = Id, tab = "files" });
    }

    // ─────────────────────────────────────────────── DOSYALAR
    public async Task<IActionResult> OnPostUploadAttachmentAsync()
    {
        await LoadAsync();

        if (AttachmentFile == null || AttachmentFile.Length == 0)
        {
            ModelState.AddModelError(string.Empty, "Bir dosya seçin.");
            Tab = "files";
            return Page();
        }

        var storedFileName = await _fileStorage.StoreAsync(AttachmentFile);
        await _projectAppService.AddAttachmentAsync(
            Id,
            AttachmentFile.FileName,
            storedFileName,
            AttachmentFile.ContentType ?? "",
            AttachmentFile.Length,
            AttachmentTitle);

        TempData["Saved"] = true;
        return RedirectToPage(new { id = Id, tab = "files" });
    }

    public async Task<IActionResult> OnPostDeleteAttachmentAsync(Guid attachmentId)
    {
        var storedFileName = await _projectAppService.DeleteAttachmentAsync(attachmentId);
        DeletePhysicalFile(storedFileName);

        TempData["Saved"] = true;
        return RedirectToPage(new { id = Id, tab = "files" });
    }

    // ─────────────────────────────────────────────── TEHLİKELİ BÖLGE
    public async Task<IActionResult> OnPostDeleteProjectAsync()
    {
        await LoadAsync();

        if (!CanDelete)
        {
            return Forbid();
        }

        // Silme yalnız proje KODU birebir yazıldığında geçerli. İstemci tarafındaki
        // kontrol yalnız kolaylık; asıl kapı burası.
        if (!string.Equals(DeleteConfirmCode?.Trim(), Current.Code, StringComparison.Ordinal))
        {
            ModelState.AddModelError(string.Empty,
                "Proje kodu eşleşmedi. Silmek için kodu birebir yazın: " + Current.Code);
            Tab = "danger";
            return Page();
        }

        await _projectAppService.DeleteAsync(Id);

        return RedirectToPage("/Projects/Index");
    }

    // ─────────────────────────────────────────────── ORTAK
    private async Task LoadAsync()
    {
        Current = await _projectAppService.GetAsync(Id);
        Attachments = await _projectAppService.GetAttachmentsAsync(Id);

        CanViewBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget);
        CanDelete = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.Delete);

        var customerResult = await _customerAppService.GetListAsync(
            new GetCustomersInput { MaxResultCount = 1000, IsActive = true });
        Customers = customerResult.Items
            .Select(c => new SelectListItem(c.Name, c.Id.ToString()))
            .ToList();

        Categories = new List<SelectListItem>
        {
            new SelectListItem("Diğer / Genel", ((int)ProjectCategory.Other).ToString()),
            new SelectListItem("Hibe Projesi", ((int)ProjectCategory.GrantProject).ToString()),
            new SelectListItem("Etkinlik", ((int)ProjectCategory.Event).ToString())
        };

        if (Tab != "files" && Tab != "danger")
        {
            Tab = "info";
        }
    }

    /// <summary>
    /// Diskteki dosyayı siler. Kayıt zaten silindiği için burada hata fırlatmak
    /// kullanıcıya yanlış izlenim verirdi — dosya yoksa sessizce geçilir.
    /// </summary>
    private void DeletePhysicalFile(string? storedFileName)
    {
        if (string.IsNullOrWhiteSpace(storedFileName))
        {
            return;
        }

        var path = _rootFolderProvider.ResolveSafePath(storedFileName);
        if (path != null && System.IO.File.Exists(path))
        {
            System.IO.File.Delete(path);
        }
    }
}
