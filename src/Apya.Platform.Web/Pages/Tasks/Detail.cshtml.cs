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
    }
}
