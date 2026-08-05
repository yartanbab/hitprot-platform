using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Apya.Platform.Tasks;

namespace Apya.Platform.Web.Controllers // Or Apya.Platform.HttpApi.Controllers ? Assuming Apya.Platform.HttpApi namespace
{
    [Authorize] // Projede global fallback authorization policy YOK → açıkça gerekli.
    [Route("api/tasks/attachments")]
    public class TaskAttachmentController : AbpController
    {
        private readonly ITaskAppService _taskAppService;
        private readonly IWebHostEnvironment _env;

        public TaskAttachmentController(ITaskAppService taskAppService, IWebHostEnvironment env)
        {
            _taskAppService = taskAppService;
            _env = env;
        }

        [HttpPost("upload/{taskId}")]
        public async Task<IActionResult> UploadAttachment(Guid taskId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { error = "Geçersiz veya boş dosya." });

            // Boyut limiti: 10MB
            if (file.Length > 10 * 1024 * 1024)
                return BadRequest(new { error = "Dosya boyutu 10MB'dan büyük olamaz." });

            // Uzantı kontrolü
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv", ".zip", ".rar" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(ext))
                return BadRequest(new { error = "Bu dosya uzantısına izin verilmiyor." });

            // wwwroot DIŞINA yaz — LocalDiskUploadedFileStorage.GetRootFolder() ile aynı kök (App_Data/uploads).
            // wwwroot altındaki dosyalar static file middleware üzerinden [Authorize]'lı FileController
            // atlanarak oturumsuz servis edilebiliyordu (bkz. 928d6eb).
            var uploadsPath = Path.Combine(_env.ContentRootPath, "App_Data", "uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var storedFileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsPath, storedFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            await _taskAppService.AddAttachmentAsync(taskId, file.FileName, storedFileName, file.Length);

            return Ok(new { success = true, storedFileName, fileName = file.FileName });
        }
    }
}
