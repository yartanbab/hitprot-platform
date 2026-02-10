using System;
using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Projects
{
    public class CreateModalModel : AbpPageModel
    {
        [BindProperty]
        public CreateProjectDto Project { get; set; }

        [BindProperty]
        public IFormFile? UploadFile { get; set; }

        private readonly IProjectAppService _projectAppService;
        private readonly IWebHostEnvironment _environment;

        public CreateModalModel(IProjectAppService projectAppService, IWebHostEnvironment environment)
        {
            _projectAppService = projectAppService;
            _environment = environment;
        }

        public void OnGet()
        {
            Project = new CreateProjectDto();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            // 1. Proje Oluþtur
            var createdProjectDto = await _projectAppService.CreateAsync(Project);

            // 2. Dosya Varsa Yükle
            if (UploadFile != null && UploadFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var storedFileName = Guid.NewGuid().ToString() + Path.GetExtension(UploadFile.FileName);
                var filePath = Path.Combine(uploadsFolder, storedFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await UploadFile.CopyToAsync(stream);
                }

                await _projectAppService.AddAttachmentAsync(
                    createdProjectDto.Id,
                    UploadFile.FileName,
                    storedFileName,
                    UploadFile.Length
                );
            }

            return NoContent();
        }
    }
}