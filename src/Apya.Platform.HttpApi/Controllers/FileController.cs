using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Controllers
{
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
            var path = Path.Combine(_env.WebRootPath, "uploads", fileName);

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