using System;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Tasks
{
    [Authorize(PlatformPermissions.Tasks.Default)]
    public class DetailModel : AbpPageModel
    {
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        public TaskDto? Task { get; set; }

        private readonly ITaskAppService _taskAppService;

        public DetailModel(ITaskAppService taskAppService)
        {
            _taskAppService = taskAppService;
        }

        public async Task<IActionResult> OnGetAsync(Guid id)
        {
            Id = id;
            if (Id == Guid.Empty)
            {
                return RedirectToPage("/Tasks/Index");
            }

            try
            {
                Task = await _taskAppService.GetAsync(Id);
                return Page();
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "Görev detay sayfası yüklenirken hata oluştu. TaskId: {TaskId}", Id);
                return RedirectToPage("/Tasks/Index");
            }
        }

        /// <summary>
        /// "⋯ → PDF olarak dışa aktar" — görev detayının yazdırılabilir özeti.
        /// Sayfa zaten [Authorize(Tasks.Default)] taşıyor; ayrıca GetAsync kendi
        /// yetki/tenant kontrolünü yapıyor, burada ek kontrol yok.
        /// URL: /Tasks/Detail/{id}?handler=Pdf
        /// </summary>
        public async Task<IActionResult> OnGetPdfAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                return NotFound();
            }

            var task = await _taskAppService.GetAsync(id);
            var bytes = Reports.ReportExporter.TaskDetailToPdf(task, Clock.Now);

            // Dosya adı görev koduna dayanır (GRV-17.pdf); kod yoksa id'ye düşer.
            var name = task.Number > 0 ? task.Code : id.ToString("N")[..8];
            return File(bytes, "application/pdf", $"{name}.pdf");
        }
    }
}
