using System;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Controllers
{
    [Authorize] // Yüklenen dosyalar kimlik doğrulamasız indirilebiliyordu.
    [Route("file")]
    public class FileController : AbpController
    {
        private readonly IWebHostEnvironment _env;

        public FileController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("get/{fileName}")]
        public IActionResult GetFile(string fileName)
        {
            // Path traversal koruması: yalnızca dosya adını al, dizin bileşenlerini at.
            var safeFileName = Path.GetFileName(fileName);
            if (string.IsNullOrEmpty(safeFileName))
                return BadRequest("Geçersiz dosya adı.");

            var path = Path.Combine(_env.ContentRootPath, "App_Data", "uploads", safeFileName);
            var uploadsRoot = Path.GetFullPath(Path.Combine(_env.ContentRootPath, "App_Data", "uploads"));
            var resolvedPath = Path.GetFullPath(path);
            if (!resolvedPath.StartsWith(uploadsRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
                return BadRequest("Geçersiz dosya adı.");

            if (!System.IO.File.Exists(path))
            {
                return NotFound();
            }

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                stream.CopyTo(memory);
            }
            memory.Position = 0;

            // Dosya tipini belirle
            string contentType = GetContentType(path);

            // "inline" demek: İndirme, tarayıcıda aç demektir.
            // Bu kısım AI'ın dosyayı okuması için de temel teşkil eder.
            System.Net.Mime.ContentDisposition cd = new System.Net.Mime.ContentDisposition
            {
                FileName = fileName,
                Inline = true
            };

            // ESKİ HATALI SATIR:
            // Response.Headers.Add("Content-Disposition", cd.ToString());

            // YENİ DOĞRU SATIR (Bunu kullanın):
            Response.Headers["Content-Disposition"] = cd.ToString();

            return File(memory, contentType);
        }

        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types.ContainsKey(ext) ? types[ext] : "application/octet-stream";
        }

        private System.Collections.Generic.Dictionary<string, string> GetMimeTypes()
        {
            return new System.Collections.Generic.Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
            };
        }
    }
}