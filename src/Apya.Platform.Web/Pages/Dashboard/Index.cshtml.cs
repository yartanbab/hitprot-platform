using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Dashboard;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Dashboard;

/// <summary>
/// Dashboard sayfası — Bento widget grid'ini host eden Razor route'u.
/// İçerik tamamen React island'da (wwwroot/js/dashboard.js).
/// </summary>
/// <remarks>
/// Kart düzeni sayfayla birlikte GÖMÜLÜ gelir. Sebep: island, düzen yanıtı
/// gelmeden hiçbir kart render etmiyor (DashboardRoot: <c>cards = layout?.cards ?? []</c>),
/// dolayısıyla 8 widget isteğinin hiçbiri başlamıyordu. Ölçümde zincir şöyleydi:
/// HTML 8ms → JS 440ms → /api/dashboard/layout 535ms → widget'lar. Düzen gömülünce
/// aradaki tur tamamen kalkıyor ve widget'lar bir gidiş-dönüş erken başlıyor.
/// <para>
/// Yalnız VARSAYILAN görünüm gömülür: aktif görünüm sekmesi kullanıcının
/// localStorage'ında yaşıyor (dashboard/layouts/viewPresets.js) ve sunucu onu
/// BİLEMEZ. Başka bir görünüm seçmiş kullanıcıda gömülü kayıt query key'iyle
/// eşleşmez, istemci normal isteğini atar — yanlış veri riski yok, yalnız
/// o kullanıcı kazanımı görmez.
/// </para>
/// <para>
/// Uç maliyeti tek indeksli okuma (UserId+ViewKey), kayıt yoksa hiç sorgu yok →
/// sayfanın ilk baytı gecikmez. Widget VERİSİ bilinçli olarak gömülmez: soğuk
/// cache'te o yol 41 ardışık sorgu ve gömmek "iskelet sonra veri"yi
/// "boş sayfa sonra her şey"e çevirirdi.
/// </para>
/// </remarks>
[Authorize]
public class IndexModel : PlatformPageModel
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly IDashboardAppService _dashboardAppService;

    public IndexModel(IDashboardAppService dashboardAppService)
    {
        _dashboardAppService = dashboardAppService;
    }

    /// <summary>Varsayılan görünümün kart düzeni, island'ın beklediği camelCase JSON.</summary>
    public string? LayoutJson { get; private set; }

    public async Task OnGetAsync()
    {
        // null → AppService kendi NormalizeViewKey'i ile varsayılana düşer; anahtarı
        // burada TEKRAR TANIMLAMIYORUZ, dönen DTO'nun ViewKey'i tek doğru kaynak.
        var layout = await _dashboardAppService.GetLayoutAsync(null!);
        LayoutJson = JsonSerializer.Serialize(layout, JsonOptions);
    }
}
