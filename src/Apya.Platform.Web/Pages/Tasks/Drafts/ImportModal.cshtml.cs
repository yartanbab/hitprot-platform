using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Tasks.Drafts;

namespace Apya.Platform.Web.Pages.Tasks.Drafts;

public class ImportModalModel : AbpPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid? ProjectId { get; set; }

    [BindProperty]
    public ImportPdfViewModel PdfInput { get; set; } = null!;

    private readonly IDraftTaskAppService _draftTaskAppService;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    public ImportModalModel(
        IDraftTaskAppService draftTaskAppService,
        IUploadedFileRootFolderProvider rootFolderProvider)
    {
        _draftTaskAppService = draftTaskAppService;
        _rootFolderProvider = rootFolderProvider;
    }

    public void OnGet()
    {
        PdfInput = new ImportPdfViewModel();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (PdfInput.File == null || PdfInput.File.Length == 0)
            return BadRequest("Lütfen geçerli bir PDF dosyası seçin.");

        if (!PdfInput.File.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Sadece PDF dosyaları desteklenmektedir.");

        using var memoryStream = new MemoryStream();
        await PdfInput.File.CopyToAsync(memoryStream);
        var fileBytes = memoryStream.ToArray();

        var uploadsDir = _rootFolderProvider.GetRootFolder();

        var storedFileName = $"{Guid.NewGuid()}_{PdfInput.File.FileName}";
        var storedFilePath = Path.Combine(uploadsDir, storedFileName);
        await System.IO.File.WriteAllBytesAsync(storedFilePath, fileBytes);

        var input = new UploadPdfInput
        {
            FileBytes = fileBytes,
            FileName = PdfInput.File.FileName,
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
