using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Projects.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Projects;

/// <summary>Faz 2: Configure edilebilir kanban — kolon CRUD + sıralama.</summary>
public interface IBoardColumnAppService : IApplicationService
{
    /// <summary>Projenin kolonlarını döndürür; hiç yoksa 4 varsayılan kolonu seed eder.</summary>
    Task<List<BoardColumnDto>> GetListByProjectAsync(Guid projectId);

    Task<BoardColumnDto> CreateAsync(CreateBoardColumnDto input);
    Task<BoardColumnDto> UpdateAsync(Guid id, UpdateBoardColumnDto input);

    /// <summary>Kolonu siler. Sistem (varsayılan) kolonu silinemez. Özel kolondaki görevler
    /// kolon bağından koparılır (Status'a göre varsayılan kolona döner).</summary>
    Task DeleteAsync(Guid id);

    /// <summary>Verilen sıraya göre kolon Order'larını günceller.</summary>
    Task ReorderAsync(Guid projectId, List<Guid> orderedColumnIds);

    /// <summary>Görevi hedef kolona taşır. Sistem kolonu → görevin Status'u değişir (kolon bağı
    /// temizlenir); özel kolon → görevin BoardColumnId'si set edilir.</summary>
    Task MoveTaskToColumnAsync(Guid taskId, Guid columnId);
}
