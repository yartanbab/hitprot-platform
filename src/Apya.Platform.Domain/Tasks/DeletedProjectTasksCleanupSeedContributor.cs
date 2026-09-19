using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

/// <summary>
/// Silinmiş projelerde kalmış canlı görevleri temizler.
///
/// Proje silme, görevlerini eskiden silmiyordu (<see cref="TaskManager.DeleteByProjectAsync"/>
/// öncesi); o dönemden kalan görevler pano, takvim ve gösterge panelinde görünmeye
/// devam ediyor. Yeni silmeler artık görevleri de götürdüğü için bu katkı yalnız
/// eski veriyi toplar: ilk çalıştırmadan sonra bulacak bir şey kalmaz.
///
/// Yalnız HOST bağlamında, kiracı filtresi KAPALI çalışır: DbMigrator
/// (ApyaPlatformDbMigrationService) tohumlamayı tek sefer host bağlamında koşar,
/// kiracıları tek tek dolaşmaz — kiracı bağlamını bekleseydi kiracı görevleri hiç
/// temizlenmezdi (yerelde ölçüldü: 101 yetimin yalnız host'a ait 33'ü gitti).
/// </summary>
public class DeletedProjectTasksCleanupSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly TaskManager _taskManager;
    private readonly IDataFilter _dataFilter;
    private readonly IAsyncQueryableExecuter _asyncExecuter;

    public DeletedProjectTasksCleanupSeedContributor(
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<Project, Guid> projectRepository,
        TaskManager taskManager,
        IDataFilter dataFilter,
        IAsyncQueryableExecuter asyncExecuter)
    {
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
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
            Guid[] deletedProjectIds;

            // Silinmiş projeyi görmek için soft-delete filtresi kapalı; görevin
            // silinmemiş olması bu yüzden AÇIKÇA şart koşulur.
            using (_dataFilter.Disable<ISoftDelete>())
            {
                var tasks = await _taskRepository.GetQueryableAsync();
                var projects = await _projectRepository.GetQueryableAsync();

                deletedProjectIds = (await _asyncExecuter.ToListAsync(
                    (from task in tasks
                     join project in projects on task.ProjectId equals (Guid?)project.Id
                     where !task.IsDeleted && project.IsDeleted
                     select project.Id).Distinct())).ToArray();
            }

            foreach (var projectId in deletedProjectIds)
            {
                await _taskManager.DeleteByProjectAsync(projectId);
            }
        }
    }
}
