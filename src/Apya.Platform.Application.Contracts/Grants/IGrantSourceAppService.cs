using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// 1a · Kaynak &amp; Kazıma Konsolu. Kaynaklar host kataloğudur — yalnız host bağlamında.
/// </summary>
public interface IGrantSourceAppService : IApplicationService
{
    /// <summary>KPI'lar + kaynak listesi + taslak kuyruğu tek yükte.</summary>
    Task<GrantSourceConsoleDto> GetConsoleAsync();

    Task<GrantSourceDto> CreateAsync(CreateUpdateGrantSourceDto input);

    Task<GrantSourceDto> UpdateAsync(Guid id, CreateUpdateGrantSourceDto input);

    Task DeleteAsync(Guid id);

    /// <summary>
    /// Etkin kaynakların tümünü tarar. Kazıyıcı bağlı değilken koşular
    /// <see cref="GrantScrapeRunStatus.Atlandi"/> olarak kaydedilir — sessizce başarısız olmaz.
    /// </summary>
    Task<GrantScrapeResultDto> ScrapeAllAsync();
}
