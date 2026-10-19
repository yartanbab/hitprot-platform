using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

/// <summary>
/// Üst görevi silinmiş ama kendisi canlı kalmış alt görevleri temizler.
///
/// Görev silme alt görevleri eskiden götürmüyordu (<see cref="TaskManager.DeleteWithSubtasksAsync"/>
/// öncesi). O dönemden kalan alt görevler hiyerarşik listede görünmez (yalnız kökler
/// listelenir) ama proje ilerlemesinde ve gecikmiş sayısında sayılır. Yeni silmeler
/// artık alt görevleri de götürdüğü için bu katkı yalnız eski veriyi toplar.
///
/// <see cref="DeletedProjectTasksCleanupSeedContributor"/> ile aynı kalıp: yalnız HOST
/// bağlamında, kiracı filtresi KAPALI çalışır — DbMigrator tohumlamayı tek sefer host
/// bağlamında koşar, kiracıları tek tek dolaşmaz.
/// </summary>
public class DeletedParentSubtasksCleanupSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly TaskManager _taskManager;
    private readonly IDataFilter _dataFilter;
    private readonly IAsyncQueryableExecuter _asyncExecuter;

    public DeletedParentSubtasksCleanupSeedContributor(
        IRepository<TaskItem, Guid> taskRepository,
        TaskManager taskManager,
        IDataFilter dataFilter,
        IAsyncQueryableExecuter asyncExecuter)
    {
        _taskRepository = taskRepository;
        _taskManager = taskManager;
        _dataFilter = dataFilter;
        _asyncExecuter = asyncExecuter;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        using (_dataFilter.Disable<IMultiTenant>())
        {
            Guid[] orphanIds;

            // Silinmiş üstü görmek için soft-delete filtresi kapalı; alt görevin
            // silinmemiş olması bu yüzden AÇIKÇA şart koşulur.
            using (_dataFilter.Disable<ISoftDelete>())
            {
                var tasks = await _taskRepository.GetQueryableAsync();

                orphanIds = (await _asyncExecuter.ToListAsync(
                    from child in tasks
                    join parent in tasks on child.ParentTaskId equals (Guid?)parent.Id
                    where !child.IsDeleted && parent.IsDeleted
                    select child.Id)).ToArray();
            }

            foreach (var orphanId in orphanIds)
            {
                await _taskManager.DeleteWithSubtasksAsync(orphanId);
            }
        }
    }
}
