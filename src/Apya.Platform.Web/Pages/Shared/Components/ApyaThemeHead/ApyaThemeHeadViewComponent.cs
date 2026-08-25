using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Web.Menus;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Components.ApyaThemeHead;

/// <summary>
/// Site-wide &lt;head&gt; enjeksiyonu (LayoutHooks.Head.Last ile her sayfaya).
/// İçerik: PWA manifest/icon/theme-color + tema FOUC (flash-of-unstyled-content)
/// engelleme. data-theme'i paint'ten ÖNCE çözer: kayıtlı tercih ('apya-theme')
/// || OS tercihi. Token'lar + LeptonX/Bootstrap köprüsü ayrı olarak global stil
/// bundle'ında (PlatformWebModule.ConfigureBundles) yüklüdür.
///
/// Ayrıca kenar çubuğunun dip bloğundaki "Ayarlar" ipucunu üretir: JS'e metin
/// gömmemek için (ApyaMobileShellL10n ile aynı desen) sunucudan JSON iner.
/// </summary>
public class ApyaThemeHeadViewComponent : AbpViewComponent
{
    /// <summary>İpucunda gösterilen en fazla hedef — dip blok tek satır kalmalı.</summary>
    private const int MaxHintItems = 4;

    private readonly PlatformNavigationResolver _navigation;

    public ApyaThemeHeadViewComponent(PlatformNavigationResolver navigation)
    {
        _navigation = navigation;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        // Hesap sayfalarında (giriş/kayıt/şifre) kenar çubuğu YOK → gezinmeyi
        // çözmek boşuna ~40 izin sorgusu demek. Kapı oturum durumu değil YOL:
        // aynı dosyadaki FOUC betiği de aynı ayrımı (isAuthPage) kullanıyor ve
        // "kabuk var mı" sorusunun doğru karşılığı budur.
        var path = Request.Path.Value ?? string.Empty;
        if (path.StartsWith("/Account/", System.StringComparison.OrdinalIgnoreCase))
        {
            return View(model: string.Empty);
        }

        var resolution = await _navigation.ResolveAsync();

        // İpucu artık sabit değil: kullanıcının Ayarlar sayfasında GERÇEKTEN
        // gördüğü ilk hedefler yazılır. Eskiden sabit "Kiracı · Kimlik · Platform ·
        // Geri bildirim" basılıyordu — yetkisi olmayan kullanıcıya da, düzenini
        // değiştirmiş kullanıcıya da yanlış bir liste gösteriyordu.
        var hint = string.Join(" · ", resolution.SettingsLinks
            .Take(MaxHintItems)
            .Select(x => x.Title));

        return View(model: hint);
    }
}
