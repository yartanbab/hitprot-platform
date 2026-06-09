using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Permissions;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Tasks;

namespace Apya.Platform.Projects;

/// <summary>Faz 2: Configure edilebilir kanban — kolon CRUD + sıralama + varsayılan seed.</summary>
[Authorize(PlatformPermissions.Projects.Default)]
public class BoardColumnAppService : PlatformAppService, IBoardColumnAppService
{
    private readonly IRepository<BoardColumn, Guid> _columnRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;

    public BoardColumnAppService(
        IRepository<BoardColumn, Guid> columnRepository,
        IRepository<TaskItem, Guid> taskRepository)
    {
        _columnRepository = columnRepository;
        _taskRepository = taskRepository;
    }

    public async Task<List<BoardColumnDto>> GetListByProjectAsync(Guid projectId)
    {
        var cols = await _columnRepository.GetListAsync(c => c.ProjectId == projectId);
        if (cols.Count == 0)
        {
            cols = await SeedDefaultsAsync(projectId);
        }
        return cols.OrderBy(c => c.Order).Select(ToDto).ToList();
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<BoardColumnDto> CreateAsync(CreateBoardColumnDto input)
    {
        var existing = await _columnRepository.GetListAsync(c => c.ProjectId == input.ProjectId);
        var nextOrder = existing.Count == 0 ? 0 : existing.Max(c => c.Order) + 1;

        var col = new BoardColumn(
            GuidGenerator.Create(), input.ProjectId, input.Name, nextOrder,
            input.ColorClass, statusValue: null, isSystem: false, CurrentTenant.Id);

        await _columnRepository.InsertAsync(col, autoSave: true);
        return ToDto(col);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<BoardColumnDto> UpdateAsync(Guid id, UpdateBoardColumnDto input)
    {
        var col = await _columnRepository.GetAsync(id);
        col.Update(input.Name, input.ColorClass);
        await _columnRepository.UpdateAsync(col, autoSave: true);
        return ToDto(col);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task DeleteAsync(Guid id)
    {
        var col = await _columnRepository.GetAsync(id);
        if (col.IsSystem)
        {
            throw new UserFriendlyException("Varsayılan kolonlar silinemez.");
        }

        // Özel kolondaki görevleri kolon bağından kopar → Status'a göre varsayılan kolona döner.
        var tasks = await _taskRepository.GetListAsync(t => t.BoardColumnId == id);
        foreach (var t in tasks)
        {
            t.MoveToColumn(null);
            await _taskRepository.UpdateAsync(t);
        }

        await _columnRepository.DeleteAsync(col, autoSave: true);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task ReorderAsync(Guid projectId, List<Guid> orderedColumnIds)
    {
        var cols = await _columnRepository.GetListAsync(c => c.ProjectId == projectId);
        for (var i = 0; i < orderedColumnIds.Count; i++)
        {
            var col = cols.FirstOrDefault(c => c.Id == orderedColumnIds[i]);
            if (col != null)
            {
                col.SetOrder(i);
                await _columnRepository.UpdateAsync(col);
            }
        }
    }

    [Authorize(PlatformPermissions.Tasks.ChangeStatus)]
    public async Task MoveTaskToColumnAsync(Guid taskId, Guid columnId)
    {
        var col = await _columnRepository.GetAsync(columnId);
        var task = await _taskRepository.GetAsync(taskId);

        if (col.StatusValue.HasValue)
        {
            // Sistem kolonu → Status değişir, özel kolon bağı temizlenir.
            task.ChangeStatus((Apya.Platform.Tasks.TaskStatus)col.StatusValue.Value);
            task.MoveToColumn(null);
        }
        else
        {
            // Özel kolon → görevi kolona bağla (Status değişmez).
            task.MoveToColumn(columnId);
        }

        await _taskRepository.UpdateAsync(task, autoSave: true);
    }

    private async Task<List<BoardColumn>> SeedDefaultsAsync(Guid projectId)
    {
        // Mevcut 4 sabit kanban kolonu (TaskStatus 1-4). Cancelled(0) board'da gösterilmiyor.
        var defaults = new (string name, int status, string color)[]
        {
            ("Yapılacak", 1, "secondary"),
            ("Sürüyor",   2, "warning"),
            ("Testte",    3, "info"),
            ("Tamamlandı", 4, "success"),
        };

        var list = new List<BoardColumn>();
        var order = 0;
        foreach (var d in defaults)
        {
            var col = new BoardColumn(
                GuidGenerator.Create(), projectId, d.name, order++,
                d.color, d.status, isSystem: true, CurrentTenant.Id);
            await _columnRepository.InsertAsync(col, autoSave: true);
            list.Add(col);
        }
        return list;
    }

    private static BoardColumnDto ToDto(BoardColumn c) => new()
    {
        Id = c.Id,
        ProjectId = c.ProjectId,
        Name = c.Name,
        ColorClass = c.ColorClass,
        Order = c.Order,
        StatusValue = c.StatusValue,
        IsSystem = c.IsSystem
    };
}
