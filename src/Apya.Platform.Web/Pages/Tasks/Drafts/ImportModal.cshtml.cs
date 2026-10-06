using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Storage;
using Apya.Platform.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Tasks.Drafts;

namespace Apya.Platform.Web.Pages.Tasks.Drafts;

/// <summary>
/// 🔴 Bu sayfa yetki işareti taşımıyordu ve dosyayı, yetkiyi denetleyen servis çağrısından ÖNCE
/// diske yazıyordu: oturumsuz ziyaretçi formu (ve doğrulama jetonunu) alıp sunucu diskine dosya
/// bırakabiliyordu. Kapı, çağırdığı servisle aynı izin (<see cref="AiPermissions.Drafts"/>).
/// </summary>
[Authorize(AiPermissions.Drafts.Default)]
public class ImportModalModel : AbpPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid? ProjectId { get; set; }

    [BindProperty]
    public ImportPdfViewModel PdfInput { get; set; } = null!;

    private readonly IDraftTaskAppService _draftTaskAppService;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;
    private readonly IUploadedFileStorage _fileStorage;

    public ImportModalModel(
        IDraftTaskAppService draftTaskAppService,
        IUploadedFileRootFolderProvider rootFolderProvider,
        IUploadedFileStorage fileStorage)
    {
        _draftTaskAppService = draftTaskAppService;
        _rootFolderProvider = rootFolderProvider;
        _fileStorage = fileStorage;
    }

    public void OnGet()
    {
        PdfInput = new ImportPdfViewModel();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (PdfInput.File == null || PdfInput.File.Length == 0)
            return BadRequest("Lütfen geçerli bir PDF dosyası seçin.");

        // İstemcinin gönderdiği ad yalnız GÖSTERİM içindir: yol parçaları atılır ve saklanan yolun
        // kurulmasında KULLANILMAZ. Eskiden saklanan ad "{guid}_{istemci adı}" idi; addaki "../"
        // dosyayı yükleme klasörünün dışına çıkarıyordu.
        var displayName = Path.GetFileName(PdfInput.File.FileName);
        if (!displayName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Sadece PDF dosyaları desteklenmektedir.");

        using var memoryStream = new MemoryStream();
        await PdfInput.File.CopyToAsync(memoryStream);
        var fileBytes = memoryStream.ToArray();

        // Diğer bütün yüklemelerle aynı depo: ad sunucuda üretilir, uzantı listesi ve boyut sınırı orada.
        var storedFileName = await _fileStorage.StoreAsync(PdfInput.File);
        var storedFilePath = Path.Combine(_rootFolderProvider.GetRootFolder(), storedFileName);

        var input = new UploadPdfInput
        {
            FileBytes = fileBytes,
            FileName = displayName,
            StoredFileName = storedFileName,
            StoredFilePath = storedFilePath,
            ProjectId = ProjectId  // APYA-117 follow-up: now bound from query string
        };

        var batchId = await _draftTaskAppService.UploadPdfForExtractionAsync(input);
        return new JsonResult(new { batchId });
    }

    public class ImportPdfViewModel
    {
        [Required]
        [Display(Name = "Proje Yönergesi veya Dosyası (PDF)")]
        public IFormFile File { get; set; } = null!;
    }
}
