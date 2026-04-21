using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Domain.Repositories;
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

    [UnitOfWork] // Veritabanı işlemi olacağı için transaction açıyoruz
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        Logger.LogInformation("TaskDeadlineWorker çalışıyor: Süresi yaklaşan görevler aranıyor...");

        var taskRepository = workerContext.ServiceProvider.GetRequiredService<IRepository<TaskItem, Guid>>();
        var localEventBus = workerContext.ServiceProvider.GetRequiredService<ILocalEventBus>();
        var clock = workerContext.ServiceProvider.GetRequiredService<Volo.Abp.Timing.IClock>();
        var dataFilter = workerContext.ServiceProvider.GetRequiredService<IDataFilter<IMultiTenant>>();
        var currentTenant = workerContext.ServiceProvider.GetRequiredService<ICurrentTenant>();

        var now = clock.Now;
        var limitDate = now.AddHours(48);

        List<TaskItem> dueTasks;

        // 1. Tüm tenant'lardaki görevleri okuyabilmek için filtreyi geçici olarak devre dışı bırak
        using (dataFilter.Disable())
        {
            var query = await taskRepository.GetQueryableAsync();
            dueTasks = query
                .Where(t => t.Status != Apya.Platform.Tasks.TaskStatus.Done && t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled)
                .Where(t => t.DueDate != null && t.DueDate > now && t.DueDate <= limitDate)
                .Where(t => !t.IsDeadlineWarningSent)
                .ToList();
        }

        if (!dueTasks.Any())
        {
            Logger.LogInformation("Gönderilecek yeni bir deadline uyarısı bulunamadı.");
            return;
        }

        // 2. GAP-009: Tenant izolasyonunu sağlamak için görevleri TenantId'ye göre grupla
        var taskGroups = dueTasks.GroupBy(t => t.TenantId);

        foreach (var tenantGroup in taskGroups)
        {
            // 3. Orijinal Tenant context'ine geçiş yap (Güvenlik Kalkanı)
            using (currentTenant.Change(tenantGroup.Key))
            {
                foreach (var task in tenantGroup)
                {
                    // 4. Event fırlat (Böylece event handler'lar doğru tenant context'inde çalışır)
                    await localEventBus.PublishAsync(new TaskDueSoonEto
                    {
                        TaskId = task.Id,
                        TaskTitle = task.Title,
                        AssigneeId = task.AssigneeId ?? Guid.Empty,
                        CreatorId = task.CreatorId ?? Guid.Empty,
                        DueDate = task.DueDate!.Value
                    });

                    // 5. Tekrar gitmemesi için işaretle
                    task.MarkDeadlineWarningAsSent();
                    await taskRepository.UpdateAsync(task);
                    
                    Logger.LogInformation("Görevin deadline uyarısı fırlatıldı ve işaretlendi. TaskId: {TaskId}, TenantId: {TenantId}", task.Id, tenantGroup.Key);
                }
            }
        }
    }
}
