using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// 4b · Eşleştirme Ağırlıkları. Skorun hangi boyutlardan oluştuğunu ayarlar.
/// Ayarlar host kataloğudur — yalnız host bağlamında.
/// </summary>
public interface IGrantMatchWeightAppService : IApplicationService
{
    /// <summary>Programın etkin ayarı: kendi satırı → küresel satır → kod varsayılanı.</summary>
    Task<GrantMatchWeightDto> GetAsync(Guid grantId);

    Task<GrantMatchWeightDto> UpdateAsync(Guid grantId, UpdateGrantMatchWeightDto input);

    /// <summary>Programın kendi satırını siler; ayar küresel varsayılana geri döner.</summary>
    Task<GrantMatchWeightDto> ResetAsync(Guid grantId);

    /// <summary>Kaydedilmemiş ağırlıkların etkisi — hiçbir şey yazmaz.</summary>
    Task<GrantWeightImpactDto> PreviewImpactAsync(Guid grantId, UpdateGrantMatchWeightDto input);

    /// <summary>Eksik Veri Kampanyası tablosu: hangi alan kaç firmada boş, kaç açık çağrıyı etkiliyor.</summary>
    Task<List<GrantMissingDataRowDto>> GetMissingDataAsync();
}
