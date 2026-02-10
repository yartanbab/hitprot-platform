using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Tasks
{
    public class CreateModalModel : AbpPageModel
    {
        [BindProperty]
        public CreateUpdateTaskDto Task { get; set; }

        public List<SelectListItem> UserList { get; set; }

        private readonly ITaskAppService _taskAppService;

        public CreateModalModel(ITaskAppService taskAppService)
        {
            _taskAppService = taskAppService;
        }

        public async Task OnGetAsync()
        {
            Task = new CreateUpdateTaskDto();

            var userLookup = await _taskAppService.GetUsersLookupAsync();

            UserList = userLookup.Items
                .Select(u => new SelectListItem(u.UserName, u.Id.ToString()))
                .ToList();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            await _taskAppService.CreateAsync(Task);
            return NoContent();
        }
    }
}