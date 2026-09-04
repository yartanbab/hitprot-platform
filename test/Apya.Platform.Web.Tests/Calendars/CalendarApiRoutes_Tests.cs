using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Calendars;

/// <summary>
/// Takvim island'ının ÇAĞIRDIĞI yolların gerçekten üretildiğini bağlar.
/// <para>
/// Yollar ABP'nin konvansiyonundan doğar (metot adı → HTTP fiili + kebab-case yol,
/// "id" parametresi eylem adından ÖNCE segment olur). İstemci bu şekli elle yazar;
/// konvansiyon değişirse ya da metot yeniden adlandırılırsa derleme de birim test
/// de SUSAR, kullanıcı yalnız 404 görür. Bu test o sessiz kırılmayı yakalar.
/// </para>
/// </summary>
public class CalendarApiRoutes_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Island_in_cagirdigi_takvim_yollari_uretiliyor()
    {
        var definition = await GetResponseAsStringAsync("/api/abp/api-definition");

        // Hesap bağlama: adres SUNUCUDAN alınır (istemcide sabit yazılmaz).
        definition.ShouldContain("api/app/calendar/auth-url");

        // Hesap eylemleri — senkron drawer'ındaki iki düğme.
        definition.ShouldContain("api/app/calendar/{id}/disconnect-account");
        definition.ShouldContain("api/app/calendar/{id}/force-sync");

        // Zaten kullanılan uçlar; birlikte kırılmadıklarını görmek için.
        definition.ShouldContain("api/app/calendar/sync-settings");
        definition.ShouldContain("api/app/calendar/sync-rules");
    }
}
