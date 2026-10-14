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
}
