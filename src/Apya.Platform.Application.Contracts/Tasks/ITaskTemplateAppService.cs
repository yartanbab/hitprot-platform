using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görev şablonları. Yeni izin TANIMLANMADI — oluşturma/silme Tasks.Create,
/// listeleme/okuma Tasks.Default kapısını kullanır. Sebep: yeni permission
/// canlıdaki rollere otomatik atanmadığı için özellik sessizce kaybolur
/// (menü kategorileri turunda aynı karar verilmişti).
/// </summary>
public interface ITaskTemplateAppService : IApplicationService
{
    Task<List<TaskTemplateListDto>> GetListAsync();

    Task<TaskTemplateDto> GetAsync(Guid id);

    /// <summary>Var olan bir görevden şablon çıkarır ("⋯ → Şablon olarak kaydet").</summary>
    Task<TaskTemplateListDto> CreateFromTaskAsync(CreateTaskTemplateFromTaskDto input);

    /// <summary>Şablondan yeni görev üretir; oluşan görevi döner.</summary>
    Task<TaskDto> ApplyAsync(ApplyTaskTemplateDto input);

    Task DeleteAsync(Guid id);
}
