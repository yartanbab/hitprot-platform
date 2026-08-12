using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Theme;

/// <summary>
/// Header toolbar kenar çubuğu modu seçici — sabit / dinamik / kapalı.
/// SoT &lt;html data-sidebar&gt; ((yok) | collapsed | hidden), kalıcılık
/// localStorage('apya-sidebar-mode'); pre-paint uygulaması ApyaThemeHead'de.
/// Kontrolün header'da olması ZORUNLU: temanın kendi düğmesi (.menu-collapse-icon)
/// sidebar'ın İÇİNDE ve "hidden" modda erişilemez hale gelir.
/// View: Pages/Shared/Components/SidebarMode/Default.cshtml
/// </summary>
public class SidebarModeViewComponent : AbpViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View();
    }
}
