using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 2d · Başvuru detayı (danışman görünümü). HOST-ONLY: danışmanlık süresi ve
/// başarı primi ücretlendirme verisidir, kiracıya kapalıdır.
/// </summary>
public interface IGrantApplicationDetailAppService : IApplicationService
{
    Task<GrantApplicationDetailDto> GetAsync(Guid applicationId);
    Task<GrantApplicationDetailDto> AddConsultingLogAsync(AddGrantConsultingLogInput input);
    Task<GrantApplicationDetailDto> SetSuccessFeeAsync(SetGrantSuccessFeeInput input);

    /// <summary>Şablondaki bir sonraki adıma geçirir ("Aşama İlerlet").</summary>
    Task<GrantApplicationDetailDto> AdvanceToNextStepAsync(Guid applicationId);
}
