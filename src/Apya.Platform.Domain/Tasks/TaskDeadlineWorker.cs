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
    /// <summary>
    /// 🔴 NTF-03: Gecikme taraması ne kadar geriye bakar.
    ///
    /// <para>Sınırsız olsaydı özellik canlıya çıktığı gün, yıllardır açık duran
    /// TÜM gecikmiş görevler tek turda bildirilir ve kullanıcının kutusu tarihsel
    /// yığınla dolardı. Bu pencere yalnız İLK turu sınırlar: normal işleyişte görev
    /// vadeyi geçtiği gün yakalanır ve tekillik anahtarı sayesinde bir kez uyarılır.</para>
    /// </summary>
    private const int OverdueLookbackDays = 30;

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
        var overdueFloor = now.AddDays(-OverdueLookbackDays);

        List<TaskItem> dueTasks;
        List<TaskItem> overdueTasks;

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

            // 🔴 NTF-03: Vadesi GEÇMİŞ görevler. Bu dal IsDeadlineWarningSent
            // bayrağına BAKMAZ ve onu YAZMAZ — bayrak "yaklaşıyor" uyarısının
            // hafızasıdır; paylaşılsaydı 48 saat uyarısını alan görev gecikince
            // sessiz kalırdı. Tekillik görev+vade anahtarıyla bildirim tarafında.
            // 🔴 NTF-11: Atanmamış görev de taranır. Alıcı kümesi atanan + görevi açan
            // olduğu için atanmamış görev sahibine ulaşır; eskiden tamamen sessizdi.
            overdueTasks = await taskRepository.GetListAsync(t =>
                t.Status != Apya.Platform.Tasks.TaskStatus.Done &&
                t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled &&
                t.DueDate != null &&
                t.DueDate <= now &&
                t.DueDate > overdueFloor);
        }

        if (!dueTasks.Any() && !overdueTasks.Any())
        {
            Logger.LogInformation("Gönderilecek yeni bir deadline uyarısı bulunamadı.");
            return;
        }

        // GAP-009: Tenant izolasyonu — olayları doğru tenant context'inde yayınla
        var taskGroups = dueTasks.GroupBy(t => t.TenantId);

        foreach (var tenantGroup in taskGroups)
        {
            try
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
            catch (Exception ex)
            {
                Logger.LogError(ex, "TenantId={TenantId}: Deadline uyarıları işlenirken hata oluştu. Sonraki tenant'a geçiliyor.",
                    tenantGroup.Key);
            }
        }

        foreach (var tenantGroup in overdueTasks.GroupBy(t => t.TenantId))
        {
            try
            {
                using (currentTenant.Change(tenantGroup.Key))
                {
                    foreach (var task in tenantGroup)
                    {
                        await localEventBus.PublishAsync(new TaskOverdueEto
                        {
                            TaskId = task.Id,
                            TaskTitle = task.Title,
                            AssigneeId = task.AssigneeId ?? Guid.Empty,
                            CreatorId = task.CreatorId ?? Guid.Empty,
                            DueDate = task.DueDate!.Value,
                            // Aynı gün geçen vade "0 gün önce" diye okunmasın: en az 1.
                            DaysOverdue = Math.Max(1, (int)(now - task.DueDate!.Value).TotalDays)
                        });
                    }

                    Logger.LogInformation(
                        "TenantId={TenantId}: {Count} gecikmiş görev tarandı.",
                        tenantGroup.Key, tenantGroup.Count());
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "TenantId={TenantId}: Gecikme uyarıları işlenirken hata oluştu. Sonraki tenant'a geçiliyor.",
                    tenantGroup.Key);
            }
        }
    }
}
