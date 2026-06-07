using System;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.Prompts;

public interface IPromptAppService : IApplicationService
{
    Task<PagedResultDto<PromptDto>> GetListAsync(GetPromptsInput input);

    Task<PromptDetailDto> GetAsync(Guid id);

    Task<PromptDto> CreateAsync(CreatePromptDto input);

    Task<PromptDto> UpdateAsync(Guid id, UpdatePromptDto input);

    Task DeleteAsync(Guid id);

    /// <summary>Adds a new Draft version to an existing prompt.</summary>
    Task<PromptVersionDto> AddVersionAsync(Guid id, CreatePromptVersionDto input);

    /// <summary>Publishes a version (archiving the previously published one) and makes it active.</summary>
    Task PublishVersionAsync(Guid id, Guid versionId);
}
