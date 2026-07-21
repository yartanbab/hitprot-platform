using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Components.ApyaThemeHead;

/// <summary>
/// Site-wide &lt;head&gt; enjeksiyonu (LayoutHooks.Head.Last ile her sayfaya).
/// İçerik: PWA manifest/icon/theme-color + tema FOUC (flash-of-unstyled-content)
/// engelleme. data-theme'i paint'ten ÖNCE çözer: kayıtlı tercih ('apya-theme')
/// || OS tercihi. Token'lar + LeptonX/Bootstrap köprüsü ayrı olarak global stil
/// bundle'ında (PlatformWebModule.ConfigureBundles) yüklüdür.
/// </summary>
public class ApyaThemeHeadViewComponent : AbpViewComponent
{
    public IViewComponentResult Invoke()
    {
        return View();
    }
}
