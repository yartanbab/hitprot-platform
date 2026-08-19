using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Projects;

/// <summary>
/// Proje iş adımları — doküman bağlam ağacının ikinci seviyesi.
/// Gantt ve kilometre taşı görünümü Faz E'de bu servisi kullanacak.
/// </summary>
public interface IProjectWorkStepAppService : IApplicationService
{
    Task<List<ProjectWorkStepDto>> GetListAsync(Guid? projectId = null);

    Task<ProjectWorkStepDto> CreateAsync(CreateUpdateProjectWorkStepDto input);

    Task<ProjectWorkStepDto> UpdateAsync(Guid id, CreateUpdateProjectWorkStepDto input);

    Task DeleteAsync(Guid id);
}
