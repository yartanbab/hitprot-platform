using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>Host'un tüm tenant'ların başvuru pipeline'ını yönetmesi (B3/C — host ilerletir).</summary>
public interface IGrantApplicationHostAppService : IApplicationService
{
    Task<List<GrantApplicationDto>> GetListAsync();

    Task AdvanceStageAsync(AdvanceApplicationStageInput input);

    Task<GrantDisbursementTrancheDto> AddTrancheAsync(Guid applicationId, CreateUpdateTrancheDto input);
    Task UpdateTrancheAsync(Guid trancheId, CreateUpdateTrancheDto input);
    Task DeleteTrancheAsync(Guid trancheId);

    Task<GrantMilestoneDto> AddMilestoneAsync(Guid applicationId, CreateUpdateMilestoneDto input);
    Task UpdateMilestoneAsync(Guid milestoneId, CreateUpdateMilestoneDto input);
    Task DeleteMilestoneAsync(Guid milestoneId);
}
