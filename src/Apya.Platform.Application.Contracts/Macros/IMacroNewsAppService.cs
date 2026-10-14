using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Macros.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro Ekran haber akışı (şerit + "Tüm haberler"). Ayrı bir haber kaydı YOK (kullanıcı kararı
/// 2026-10-14): akış mevcut kaynaklardan türetilir — açık hibe çağrıları ("Yeni çağrı"), sürüm
/// notları ("Platform"), kullanıcının karar/itiraz sonucu bildirimleri ("Sonuç"). "Mevzuat"
/// türünün kaynağı olmadığı için yok.
/// </summary>
public interface IMacroNewsAppService : IApplicationService
{
    /// <summary>En yeni üstte, en fazla <paramref name="maxResultCount"/> (1..50) haber.</summary>
    Task<List<MacroNewsItemDto>> GetListAsync(int maxResultCount = 5);
}
