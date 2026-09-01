using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// 3b · Aşama Şablonu Düzenleyicisi. Şablonlar host kataloğudur — yalnız host bağlamında.
/// </summary>
public interface IGrantStageTemplateAppService : IApplicationService
{
    Task<List<GrantStageTemplateDto>> GetListAsync();

    Task<GrantStageTemplateDto> GetAsync(Guid id);

    Task<GrantStageTemplateDto> CreateAsync(CreateUpdateGrantStageTemplateDto input);

    Task<GrantStageTemplateDto> UpdateAsync(Guid id, CreateUpdateGrantStageTemplateDto input);

    /// <summary>
    /// Şablonu siler. Bir programa bağlıysa <c>Platform:Grant:StageTemplateInUse</c> ile
    /// reddeder — sessizce programların şablon bağını koparmaz.
    /// </summary>
    Task DeleteAsync(Guid id);
}
