using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Theme;

/// <summary>
/// Header toolbar tema değiştirici (LeptonX StandardToolbars.Main).
/// Buton id="ThemeToggle" → dark-mode.js delegated click handler'ı yönetir;
/// ikon senkronu (sun/moon) client tarafında yapılır. View:
/// Pages/Shared/Components/ThemeToggle/Default.cshtml
/// </summary>
public class ThemeToggleViewComponent : AbpViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View();
    }
}
