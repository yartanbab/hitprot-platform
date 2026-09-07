using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Apya.Platform.Web.Pages.Reports;

/// <summary>
/// "Özet Raporlar" ekranı KALDIRILDI (2026-09-07) — Genel Bakış ile aynı işi
/// yapan ikinci bir ekrandı. Geriye yalnız bu yönlendirme kaldı: eski yer
/// imleri ve sabitlenmiş kısayollar 404 görmesin.
/// <para>
/// Ekranın Genel Bakış'ta karşılığı olmayan tek içeriği personel eforuydu;
/// o da "Efor dağılımı" kartına ve "logged-hours" istatistiğine taşındı.
/// Gerekçenin tamamı PlatformNavigationResolver'da.
/// </para>
/// <para>
/// İzin kapısı YOK: hedef sayfa (/Dashboard) kendi iznini zaten uyguluyor,
/// buraya bir [Authorize] koymak yalnız yönlendirmeden önce ikinci bir 403
/// üretirdi. Aynı gerekçe /Board yönlendirmesinde de yazılı.
/// </para>
/// </summary>
public class IndexModel : PageModel
{
    public IActionResult OnGet() => RedirectToPagePermanent("/Dashboard/Index");
}
