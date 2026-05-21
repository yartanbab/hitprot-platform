using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus;
using Volo.Abp.Guids;
using Volo.Abp.Timing;

namespace Apya.Platform.Tasks;

/// <summary>
/// APYA-121 - Tasks bounded context owns task creation.
/// Listens for DraftApprovedEto from the AI bounded context and creates a real TaskItem.
/// This decouples AI draft approval from Tasks domain logic.
/// </summary>
public class DraftApprovedEventHandler : ILocalEventHandler<DraftApprovedEto>, ITransientDependency
{
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IClock _clock;
    private readonly ILogger<DraftApprovedEventHandler> _logger;

    public DraftApprovedEventHandler(
        IRepository<TaskItem, Guid> taskRepository,
        IGuidGenerator guidGenerator,
        IClock clock,
        ILogger<DraftApprovedEventHandler> logger)
    {
        _taskRepository = taskRepository;
        _guidGenerator = guidGenerator;
        _clock = clock;
        _logger = logger;
    }

    public async Task HandleEventAsync(DraftApprovedEto eventData)
    {
        var task = new TaskItem(
            id: _guidGenerator.Create(),
            title: eventData.Title,
            projectId: eventData.ProjectId,
            parentTaskId: null,
            description: eventData.Description,
            startDate: _clock.Now,
            dueDate: null,
            priority: eventData.Priority,
            assigneeId: null,
            isPrivate: false,
            tenantId: eventData.TenantId
        );

        await _taskRepository.InsertAsync(task);

        _logger.LogInformation(
            "TaskItem {TaskId} created from approved draft {DraftId} (batch {BatchId}).",
            task.Id, eventData.DraftId, eventData.ImportBatchId);
    }
}
