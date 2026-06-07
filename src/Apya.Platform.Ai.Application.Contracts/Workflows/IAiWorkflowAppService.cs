using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Ai.Workflows.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.Workflows;

public interface IAiWorkflowAppService : IApplicationService
{
    Task<List<AiWorkflowDto>> GetListAsync();

    Task<AiWorkflowDetailDto> GetAsync(Guid id);

    Task<AiWorkflowDto> CreateAsync(CreateUpdateAiWorkflowDto input);

    Task<AiWorkflowDto> UpdateAsync(Guid id, CreateUpdateAiWorkflowDto input);

    Task DeleteAsync(Guid id);

    Task<AiWorkflowRuleDto> AddRuleAsync(Guid id, CreateWorkflowRuleDto input);

    Task RemoveRuleAsync(Guid id, Guid ruleId);
}
