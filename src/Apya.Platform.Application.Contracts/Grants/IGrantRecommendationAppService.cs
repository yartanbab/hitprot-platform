using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracı katalog yüzeyi (1d · 9a · 1e). Katalog host verisidir; kiracıya CANLI
/// hesaplanır, kalıcı değildir.
/// </summary>
public interface IGrantRecommendationAppService : IApplicationService
{
    /// <summary>Yalnız firmaya önerilen (skor >= eşik ya da host-push) açık çağrılar.</summary>
    Task<List<GrantRecommendationDto>> GetMyRecommendationsAsync();

    /// <summary>Host'un yayınladığı TÜM açık çağrılar; öneri olanlar IsRecommended ile işaretli.</summary>
    Task<List<GrantRecommendationDto>> GetOpenCallsAsync();

    /// <summary>1e · Tek çağrının detayı: uygunluk tablosu, bütçe kalemleri, süreç, uyum kırılımı.</summary>
    Task<GrantCallDetailDto> GetCallDetailAsync(Guid grantCallId);

    /// <summary>1d/9a · Takip işaretini açıp kapatır. Dönüş: yeni durum.</summary>
    Task<bool> ToggleBookmarkAsync(Guid grantCallId);
}
