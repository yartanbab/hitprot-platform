using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Ai.Providers.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.Providers;

public interface IAiProviderAppService : IApplicationService
{
    Task<List<AiProviderConfigDto>> GetListAsync();

    Task<AiProviderConfigDto> GetAsync(Guid id);

    Task<AiProviderConfigDto> CreateAsync(CreateUpdateAiProviderConfigDto input);

    Task<AiProviderConfigDto> UpdateAsync(Guid id, CreateUpdateAiProviderConfigDto input);

    Task DeleteAsync(Guid id);

    Task SetDefaultAsync(Guid id);
}
