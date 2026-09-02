using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 2e · Onaylanan başvuruyu projeye dönüştürür. HOST-ONLY: sözleşme imzalandıktan
/// sonra danışman yürütür. Başvuru kapanmaz, projeye bağlanır.
/// </summary>
public interface IGrantApplicationConversionAppService : IApplicationService
{
    Task<GrantConversionPreviewDto> GetPreviewAsync(Guid applicationId);
    Task<GrantConversionResultDto> ConvertAsync(ConvertGrantApplicationInput input);
}
