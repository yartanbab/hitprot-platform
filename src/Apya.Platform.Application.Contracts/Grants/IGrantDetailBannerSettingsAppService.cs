using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracı hibe detayının afiş düzeni. Ayar host (Global) seviyesindedir: düzen kod
/// değişmeden değiştirilir ve bütün firmalarda aynı görünür.
/// </summary>
public interface IGrantDetailBannerSettingsAppService : IApplicationService
{
    Task<GrantDetailBannerSettingsDto> GetAsync();

    Task UpdateAsync(GrantDetailBannerSettingsDto input);
}
