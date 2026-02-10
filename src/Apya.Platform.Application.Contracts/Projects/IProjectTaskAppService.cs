using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Projects.Dtos;
using Volo.Abp; // Bu namespace'i eklemeyi unutma

namespace Apya.Platform.Projects;

[RemoteService(IsEnabled = true)]

public interface IProjectTaskAppService : IApplicationService
{
    // Belirli bir projeye ait görevleri getir
    Task<List<ProjectTaskDto>> GetListByProjectIdAsync(Guid projectId);

    // Yeni görev ekle
    Task<ProjectTaskDto> CreateAsync(CreateUpdateProjectTaskDto input);

    // Görevi güncelle (Tamamlandı/Tamamlanmadı vb.)
    Task<ProjectTaskDto> UpdateAsync(Guid id, CreateUpdateProjectTaskDto input);

    // Görevi sil
    Task DeleteAsync(Guid id);

    // Mevcut kodlarınızın içine şu satırı ekleyin:
    Task<List<UserLookupDto>> GetUserLookupAsync();
}