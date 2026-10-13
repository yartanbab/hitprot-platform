using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Projects;

/// <summary>PRJ-08 · Proje göstergeleri: hedef tanımı ve ölçüm girişleri.</summary>
public interface IProjectIndicatorAppService : IApplicationService
{
    Task<List<ProjectIndicatorDto>> GetListAsync(Guid projectId);
    Task<ProjectIndicatorDto> CreateAsync(CreateUpdateProjectIndicatorDto input);
    Task<ProjectIndicatorDto> UpdateAsync(Guid id, CreateUpdateProjectIndicatorDto input);
    Task DeleteAsync(Guid id);

    Task<List<ProjectIndicatorEntryDto>> GetEntriesAsync(Guid indicatorId);
    Task<ProjectIndicatorEntryDto> AddEntryAsync(Guid indicatorId, CreateProjectIndicatorEntryDto input);
    Task DeleteEntryAsync(Guid entryId);

    /// <summary>
    /// Ölçüme kanıt olarak bağlanabilecek belgeler: göstergenin projesindeki dosyalar. Belge görme
    /// izni olmayana liste BOŞ döner.
    /// </summary>
    Task<List<ProjectIndicatorDocumentOptionDto>> GetDocumentOptionsAsync(Guid indicatorId);
}
