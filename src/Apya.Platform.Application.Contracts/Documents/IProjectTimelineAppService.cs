using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Zaman cizelgesi & butce: is adimi Gantt verisi, butce-belge kapsamasi,
/// adam-gun kapasitesi ve risk kutugu.
/// </summary>
public interface IProjectTimelineAppService : IApplicationService
{
    Task<ProjectTimelineDto> GetAsync(Guid projectId);

    Task<ProjectRiskDto> CreateRiskAsync(CreateUpdateProjectRiskDto input);

    Task<ProjectRiskDto> UpdateRiskAsync(Guid id, CreateUpdateProjectRiskDto input);

    Task<ProjectRiskDto> SetRiskClosedAsync(Guid id, bool isClosed);

    Task DeleteRiskAsync(Guid id);
}
