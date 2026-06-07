using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Ai.Bindings.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.Bindings;

public interface IAiFormBindingAppService : IApplicationService
{
    Task<List<AiFormBindingDto>> GetListAsync();

    Task<AiFormBindingDto> GetAsync(Guid id);

    Task<AiFormBindingDto> CreateAsync(CreateUpdateAiFormBindingDto input);

    Task<AiFormBindingDto> UpdateAsync(Guid id, CreateUpdateAiFormBindingDto input);

    Task DeleteAsync(Guid id);

    Task<List<AiBindingLookupDto>> GetFormLookupAsync();

    Task<List<AiBindingLookupDto>> GetPromptLookupAsync();
}
