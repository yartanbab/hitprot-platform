using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Tasks.Drafts;

namespace Apya.Platform.Web.Pages.Tasks.Drafts;

public class ImportModalModel : AbpPageModel
{
    [BindProperty]
    public ImportPdfViewModel PdfInput { get; set; }

    private readonly IDraftTaskAppService _draftTaskAppService;
    private readonly IWebHostEnvironment _env;

    public ImportModalModel(
        IDraftTaskAppService draftTaskAppService,
        IWebHostEnvironment env)
    {
        _draftTaskAppService = draftTaskAppService;
        _env = env;
    }

    public void OnGet()
    {
        PdfInput = new ImportPdfViewModel();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (PdfInput.File == null || PdfInput.File.Length == 0)
        {
            return BadRequest("Lütfen geçerli bir PDF dosyası seçin.");
        }

        if (!PdfInput.File.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Sadece PDF dosyaları desteklenmektedir.");
        }

        // 1. Dosyayı byte dizisine çevir
        using var memoryStream = new MemoryStream();
        await PdfInput.File.CopyToAsync(memoryStream);
        var fileBytes = memoryStream.ToArray();

        // 2. Dosyayı wwwroot/uploads altına kalıcı olarak kaydet
        var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsDir);

        var storedFileName = $"{Guid.NewGuid()}_{PdfInput.File.FileName}";
        var storedFilePath = Path.Combine(uploadsDir, storedFileName);

        await System.IO.File.WriteAllBytesAsync(storedFilePath, fileBytes);

        // 3. Application Service'e gönder
        var input = new UploadPdfInput
        {
            FileBytes = fileBytes,
            FileName = PdfInput.File.FileName,
            StoredFileName = storedFileName,
            StoredFilePath = storedFilePath,
            ProjectId = null // İleride UI'dan proje seçimi eklenebilir
        };

        var batchId = await _draftTaskAppService.UploadPdfForExtractionAsync(input);

        return new JsonResult(new { batchId });
    }

    public class ImportPdfViewModel
    {
        [Required]
        [Display(Name = "Proje Yönergesi veya Dosyası (PDF)")]
        public IFormFile File { get; set; }
    }
}
