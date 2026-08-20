using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using Apya.Platform.Web.Tour;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Settings;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Components.ProductTour;

/// <summary>Tur penceresine geçen veri.</summary>
public sealed record ProductTourViewModel(IReadOnlyList<TourSlide> Slides, string PdfUrl);

/// <summary>
/// İlk giriş tanıtım turu — <c>LayoutHooks.Body.Last</c> ile her sayfaya eklenir
/// (ReleaseNotes / CookieNotice ile aynı desen). Kullanıcı turu tamamlamadıysa
/// (veya <c>?tur=1</c> ile açıkça istediyse) modal render edilir; aksi halde
/// HİÇBİR ŞEY basılmaz — turu görmüş kullanıcı her sayfada bu işaretlemenin
/// yükünü taşımaz.
///
/// <para>
/// Görülme, kullanıcı ayarında saklanır
/// (<see cref="PlatformSettings.Tour.Completed"/>) — cihazlar arası taşınır ve
/// yeni bir tablo/migration gerektirmez.
/// </para>
/// </summary>
public class ProductTourViewComponent : AbpViewComponent
{
    private readonly ISettingProvider _settingProvider;
    private readonly ICurrentUser _currentUser;

    public ProductTourViewComponent(ISettingProvider settingProvider, ICurrentUser currentUser)
    {
        _settingProvider = settingProvider;
        _currentUser = currentUser;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        if (!_currentUser.IsAuthenticated)
        {
            return Content(string.Empty);
        }

        // Kullanıcı menüsündeki "Tanıtım turu" bağlantısı ?tur=1 ile gelir; turu
        // bitirmiş kullanıcı için de render edilmesini sağlayan tek durum budur.
        var requested = Request.Query.TryGetValue("tur", out var flag) && flag == "1";

        if (!requested && await _settingProvider.IsTrueAsync(PlatformSettings.Tour.Completed))
        {
            return Content(string.Empty);
        }

        return View(new ProductTourViewModel(TourSlideCatalog.All, TourSlideCatalog.PdfPath));
    }
}
