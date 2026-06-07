using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.Prompts;

public interface IPromptCategoryAppService : IApplicationService
{
    Task<List<PromptCategoryDto>> GetListAsync();

    Task<PromptCategoryDto> GetAsync(Guid id);

    Task<PromptCategoryDto> CreateAsync(CreateUpdatePromptCategoryDto input);

    Task<PromptCategoryDto> UpdateAsync(Guid id, CreateUpdatePromptCategoryDto input);

    Task DeleteAsync(Guid id);
}
