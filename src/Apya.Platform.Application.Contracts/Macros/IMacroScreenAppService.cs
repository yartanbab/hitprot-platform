using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Macros.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro Ekran'a (/Makro) özel veri. Ekranın panellerinin geri kalanı mevcut uçlardan gelir
/// (bildirimler, hibe "Bugün", firmanın talepleri ve başvuruları, kabuk rozetleri); burada
/// yalnız depoda karşılığı olmayan sorgular durur. Kabuk durumuna (/api/app/shell/state)
/// EKLENMEZ: o çağrı her sayfada çalışıyor.
/// </summary>
public interface IMacroScreenAppService : IApplicationService
{
    /// <summary>
    /// "Bana ait kayıtlar › Projelerim": kullanıcının ÜYESİ olduğu projeler, son değişene göre.
    /// Proje görme izni yoksa boş liste döner (hata değil).
    /// </summary>
    Task<MacroMyProjectsDto> GetMyProjectsAsync();

    /// <summary>
    /// Makro Ekran'dan başlatılan makroyu sayar (günlük toplanır). Katalogda olmayan anahtar yok
    /// sayılır: istemci ateşle-unut çağırır, sayaç tabloyu keyfi anahtarla şişirmesin.
    /// </summary>
    Task RecordUseAsync(string key);

    /// <summary>Son 30 günde makro anahtarı başına kullanım (yalnız oturumdaki kullanıcı).</summary>
    Task<Dictionary<string, int>> GetMyUsageAsync();
}
