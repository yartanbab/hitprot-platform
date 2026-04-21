using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.SemanticKernel;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Tasks;

namespace Apya.Platform.Agentic.Plugins;

/// <summary>
/// A Semantic Kernel plugin that provides AI with abilities to interact with the Task Management module.
/// </summary>
public class TasksPlugin
{
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly Volo.Abp.Timing.IClock _clock;

    public TasksPlugin(IRepository<TaskItem, Guid> taskRepository, Volo.Abp.Timing.IClock clock)
    {
        _taskRepository = taskRepository;
        _clock = clock;
    }

    [KernelFunction, Description("Sistemdeki gecikmiş (deadline'ı geçmiş fakat henüz tamamlanmamış) tüm görevlerin bir listesini getirir.")]
    public async Task<string> GetOverdueTasksAsync()
    {
        var now = _clock.Now;
        var query = await _taskRepository.GetQueryableAsync();
        
        var overdueTasks = query
            .Where(t => t.Status != Apya.Platform.Tasks.TaskStatus.Done && t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled)
            .Where(t => t.DueDate.HasValue && t.DueDate.Value < now)
            .ToList();

        if (!overdueTasks.Any())
        {
            return "Geçikmiş (overdue) durumunda herhangi bir görev bulunmamaktadır.";
        }

        var resultTasks = overdueTasks.Select(t => new {
            t.Id,
            t.Title,
            t.DueDate,
            t.Status,
            t.Priority
        });

        return System.Text.Json.JsonSerializer.Serialize(resultTasks);
    }
    
    [KernelFunction, Description("Belirli bir başlıktaki tüm açık görevleri getirir.")]
    public async Task<string> GetOpenTasksAsync()
    {
        var query = await _taskRepository.GetQueryableAsync();
        
        var openTasks = query
            .Where(t => t.Status != Apya.Platform.Tasks.TaskStatus.Done && t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled)
            .ToList();

        if (!openTasks.Any())
        {
            return "Açık görev bulunmamaktadır.";
        }

        return System.Text.Json.JsonSerializer.Serialize(openTasks.Select(t => new { t.Id, t.Title, t.Status }));
    }
}
