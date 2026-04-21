using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

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

        var now = clock.Now;
        var limitDate = now.AddHours(48);

        // 1. Bitmemiş, süresi belli, henüz uyarı atılmamış ve 48 saatten az kalmış görevler
        var query = await taskRepository.GetQueryableAsync();
        var dueTasks = query
            .Where(t => t.Status != Apya.Platform.Tasks.TaskStatus.Done && t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled)
            .Where(t => t.DueDate.HasValue)
            .Where(t => t.DueDate.Value > now && t.DueDate.Value <= limitDate)
            .Where(t => !t.IsDeadlineWarningSent)
            .ToList();

        if (!dueTasks.Any())
        {
            Logger.LogInformation("Gönderilecek yeni bir deadline uyarısı bulunamadı.");
            return;
        }

        foreach (var task in dueTasks)
        {
            // 2. Event fırlat
            await localEventBus.PublishAsync(new TaskDueSoonEto
            {
                TaskId = task.Id,
                TaskTitle = task.Title,
                AssigneeId = task.AssigneeId ?? Guid.Empty,
                CreatorId = task.CreatorId ?? Guid.Empty,
                DueDate = task.DueDate!.Value
            });

            // 3. Tekrar gitmemesi için işaretle
            task.MarkDeadlineWarningAsSent();
            await taskRepository.UpdateAsync(task);
            
            Logger.LogInformation("Görevin deadline uyarısı fırlatıldı ve işaretlendi. TaskId: {TaskId}", task.Id);
        }
    }
}
