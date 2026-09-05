using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Apya.Platform.Web.Pages.Board
{
    /// <summary>
    /// Kanban'ın müstakil sayfası KALDIRILDI (2026-09-06) — Kart Panosu artık
    /// Görevler konsolunun bir sekmesi ve menü oraya götürüyor. Geriye yalnız
    /// bu yönlendirme kaldı: eski yer imleri ve dış bağlantılar 404 görmesin.
    ///
    /// İzin kapısı YOK: hedef sayfa (/Tasks) kendi iznini zaten uyguluyor,
    /// buraya bir [Authorize] koymak yalnız yönlendirmeden önce ikinci bir
    /// 403 üretirdi.
    /// </summary>
    public class IndexModel : PageModel
    {
        public IActionResult OnGet()
            => RedirectToPagePermanent("/Tasks/Index", new { view = "kanban" });
    }
}
