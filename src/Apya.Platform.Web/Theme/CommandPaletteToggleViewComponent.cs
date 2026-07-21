using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Theme;

/// <summary>
/// Header toolbar komut paleti tetikleyicisi (LeptonX StandardToolbars.Main).
/// Buton id="ApyaCommandPaletteTrigger" → command-palette.js delegated click/
/// keyboard (Ctrl/Cmd+K) handler'ı yönetir. View:
/// Pages/Shared/Components/CommandPaletteToggle/Default.cshtml
/// </summary>
public class CommandPaletteToggleViewComponent : AbpViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View();
    }
}
