using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Threading;
using Volo.Abp.Uow;
using Volo.Abp.Data;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

public class TaskDeadlineWorker : AsyncPeriodicBackgroundWorkerBase
{
    public TaskDeadlineWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        // 1 saatte bir kontrol et (Test için daha kısa tutulabilir)
        Timer.Period = 60 * 60 * 1000; // 60 dakika (milisaniye cinsinden)
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        Logger.LogInformation("TaskDeadlineWorker çalışıyor: Süresi yaklaşan görevler aranıyor...");

        var taskRepository = workerContext.ServiceProvider.GetRequiredService<ITaskItemRepository>();
        var localEventBus = workerContext.ServiceProvider.GetRequiredService<ILocalEventBus>();
        var clock = workerContext.ServiceProvider.GetRequiredService<Volo.Abp.Timing.IClock>();
        var dataFilter = workerContext.ServiceProvider.GetRequiredService<IDataFilter<IMultiTenant>>();
        var currentTenant = workerContext.ServiceProvider.GetRequiredService<ICurrentTenant>();

        var now = clock.Now;
        var limitDate = now.AddHours(48);

        List<TaskItem> dueTasks;

        // Tüm tenant'lardaki görevleri okuyabilmek için filtreyi geçici olarak devre dışı bırak
        using (dataFilter.Disable())
        {
            dueTasks = await taskRepository.GetListAsync(t =>
                t.Status != Apya.Platform.Tasks.TaskStatus.Done &&
                t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled &&
                t.DueDate != null &&
                t.DueDate > now &&
                t.DueDate <= limitDate &&
                !t.IsDeadlineWarningSent);
        }

        if (!dueTasks.Any())
        {
            Logger.LogInformation("Gönderilecek yeni bir deadline uyarısı bulunamadı.");
            return;
        }

        // GAP-009: Tenant izolasyonu — olayları doğru tenant context'inde yayınla
        var taskGroups = dueTasks.GroupBy(t => t.TenantId);

        foreach (var tenantGroup in taskGroups)
        {
            using (currentTenant.Change(tenantGroup.Key))
            {
                var groupIds = new List<Guid>();

                foreach (var task in tenantGroup)
                {
                    await localEventBus.PublishAsync(new TaskDueSoonEto
                    {
                        TaskId = task.Id,
                        TaskTitle = task.Title,
                        AssigneeId = task.AssigneeId ?? Guid.Empty,
                        CreatorId = task.CreatorId ?? Guid.Empty,
                        DueDate = task.DueDate!.Value
                    });

                    groupIds.Add(task.Id);
                }

                // Tek bir SQL UPDATE — N×UpdateAsync yerine
                await taskRepository.BulkMarkDeadlineWarningSentAsync(groupIds);

                Logger.LogInformation(
                    "TenantId={TenantId}: {Count} görev için deadline uyarısı gönderildi.",
                    tenantGroup.Key, groupIds.Count);
            }
        }
    }
}
