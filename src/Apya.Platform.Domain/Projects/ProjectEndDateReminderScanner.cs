using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Tasks;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Projects;

/// <summary>
/// 🔴 NTF-05 · Bitişi yaklaşan projeleri bulur ve her biri için duyurulacak olayı kurar.
///
/// <para>Tarama worker'dan AYRI tutuldu: worker'ı testten elle çağırmak tuzaklı
/// (proxy + LazyServiceProvider), tarama ise düz bir servis olarak doğrudan ölçülebilir.
/// Worker yalnız buradan dönen olayları doğru kiracı bağlamında yayınlar.</para>
///
/// <para>Tekillik BURADA sağlanmaz: aynı proje her turda yeniden döner. "Eşik başına bir
/// kez" kuralı bildirim tarafında, tekillik anahtarıyla uygulanır
/// (<c>NotificationDomainEventHandler</c>).</para>
/// </summary>
public class ProjectEndDateReminderScanner : ITransientDependency
{
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly IAsyncQueryableExecuter _asyncExecuter;

    public ProjectEndDateReminderScanner(
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectMember, Guid> memberRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IDataFilter<IMultiTenant> mtFilter,
        IAsyncQueryableExecuter asyncExecuter)
    {
        _projectRepository = projectRepository;
        _memberRepository = memberRepository;
        _taskRepository = taskRepository;
        _mtFilter = mtFilter;
        _asyncExecuter = asyncExecuter;
    }

    /// <summary>Bir projenin taraması: hangi kiracıda yayınlanacağı + olayın kendisi.</summary>
    public sealed record Result(Guid? TenantId, ProjectEndingSoonEto Event);

    public async Task<List<Result>> ScanAsync(DateTime now)
    {
        var today = now.Date;
        var horizon = today.AddDays(ProjectEndDateReminder.MaxThreshold);

        // Projeler kiracılara dağınık: OKUMA için filtre bilinçli kapatılır.
        using (_mtFilter.Disable())
        {
            // Üst sınır gün SONUNA kadar: bitiş tarihi saat taşıyorsa (ör. 17:00) o gün de pencerede.
            var projects = await _projectRepository.GetListAsync(
                p => p.EndDate != null && p.EndDate >= today && p.EndDate < horizon.AddDays(1));

            if (projects.Count == 0)
            {
                return new List<Result>();
            }

            var projectIds = projects.Select(p => p.Id).ToList();

            var leadsByProject = (await _memberRepository.GetListAsync(
                    m => projectIds.Contains(m.ProjectId) && m.Role == ProjectMemberRole.Lead))
                .GroupBy(m => m.ProjectId)
                .ToDictionary(g => g.Key, g => g.Select(m => m.UserId).ToList());

            var taskQuery = await _taskRepository.GetQueryableAsync();
            var openCounts = (await _asyncExecuter.ToListAsync(
                    taskQuery
                        .Where(t => t.ProjectId != null
                                    && projectIds.Contains(t.ProjectId.Value)
                                    && t.Status != TaskStatus.Done
                                    && t.Status != TaskStatus.Cancelled)
                        .GroupBy(t => t.ProjectId!.Value)
                        .Select(g => new { ProjectId = g.Key, Count = g.Count() })))
                .ToDictionary(x => x.ProjectId, x => x.Count);

            var results = new List<Result>();

            foreach (var project in projects)
            {
                var daysRemaining = ProjectEndDateReminder.DaysRemaining(project.EndDate!.Value, now);
                var threshold = ProjectEndDateReminder.PickThreshold(daysRemaining);

                if (threshold == null)
                {
                    continue;
                }

                // Alıcı: proje liderleri + projeyi açan. Aynı kişi iki rolde olabilir.
                var recipients = leadsByProject.GetValueOrDefault(project.Id, new List<Guid>()).ToList();
                if (project.CreatorId.HasValue)
                {
                    recipients.Add(project.CreatorId.Value);
                }

                results.Add(new Result(project.TenantId, new ProjectEndingSoonEto
                {
                    ProjectId = project.Id,
                    ProjectName = project.Name,
                    EndDate = project.EndDate.Value,
                    DaysRemaining = daysRemaining,
                    Threshold = threshold.Value,
                    OpenTaskCount = openCounts.GetValueOrDefault(project.Id),
                    RecipientIds = recipients.Where(id => id != Guid.Empty).Distinct().ToList(),
                }));
            }

            return results;
        }
    }
}
