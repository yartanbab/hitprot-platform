using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Board
{
    // Kanban, Görevler'in alternatif görünümü → menüyle aynı izne bağlı.
    [Authorize(PlatformPermissions.Tasks.Default)]
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
