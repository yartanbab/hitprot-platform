using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Theme;

/// <summary>
/// Header toolbar yoğunluk (density) değiştirici — compact / cozy / comfortable.
/// Buton id="DensityToggle" → density-toggle.js delegated click handler'ı yönetir;
/// SoT <html data-density>, kalıcılık localStorage('apya-density'). Pre-paint
/// uygulaması ApyaThemeHead'de zaten vardı, değiştiren UI yoktu. View:
/// Pages/Shared/Components/DensityToggle/Default.cshtml
/// </summary>
public class DensityToggleViewComponent : AbpViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View();
    }
}
