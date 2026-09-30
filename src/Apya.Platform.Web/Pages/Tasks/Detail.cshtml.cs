using System;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Pages.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Web.Pages.Tasks
{
    [Authorize(PlatformPermissions.Tasks.Default)]
    public class DetailModel : AbpPageModel
    {
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        public TaskDto? Task { get; set; }

        /// <summary>
        /// TSK-23: görev yok (404) ya da gizli (403) — sessiz yönlendirme yerine ne olduğunu söyleyen
        /// sayfa içi durum + doğru durum kodu; null ise ada bağlanır. Görünüm hata sayfası / erişim
        /// reddiyle aynı (_EmptyState Page varyantı); ada karşılığı TaskDetailRootV3 (aynı metin anahtarları).
        /// </summary>
        public EmptyStateModel? Unavailable { get; private set; }

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
            catch (EntityNotFoundException)
            {
                // Silinmiş görev / eski bildirim bağlantısı. GET salt okur → yakalamak güvenli.
                return ShowUnavailable(StatusCodes.Status404NotFound, "fa-magnifying-glass",
                    L["Tasks:Detail:NotFound:Title"].Value, L["Tasks:Detail:NotFound:Body"].Value);
            }
            catch (BusinessException ex) when (ex.Code is PlatformDomainErrorCodes.TaskViewPrivateDenied
                                                   or PlatformDomainErrorCodes.TaskViewImpersonationDenied)
            {
                return ShowUnavailable(StatusCodes.Status403Forbidden, "fa-lock",
                    L["Tasks:Detail:Forbidden:Title"].Value, this.UserMessage(ex));
            }
            catch (Exception ex)
            {
                // Beklenmedik hatada eski davranış (mesajsız listeye dönüş) korunur — kapsam dışı.
                Logger.LogWarning(ex, "Görev detay sayfası yüklenirken hata oluştu. TaskId: {TaskId}", Id);
                return RedirectToPage("/Tasks/Index");
            }
        }

        private IActionResult ShowUnavailable(int statusCode, string icon, string title, string? description)
        {
            Response.StatusCode = statusCode;
            Unavailable = new EmptyStateModel
            {
                Variant = EmptyStateVariant.Page,
                CssClass = "is-denied",
                Kind = statusCode == StatusCodes.Status404NotFound ? "task-not-found" : "task-forbidden",
                Icon = icon,
                Title = title,
                Description = description,
                ActionText = L["Tasks:Detail:BackToList"].Value,
                ActionUrl = "/Tasks",
                ActionIcon = "fa-arrow-left"
            };
            return Page();
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
