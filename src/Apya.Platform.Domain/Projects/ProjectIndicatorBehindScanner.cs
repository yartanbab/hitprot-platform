using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// PRJ-08 · Hedef tarihi geçmiş, hedefe ulaşmamış göstergeleri bulur ve duyurulacak olayı kurar.
///
/// <para>Tarama worker'dan AYRI (bkz. <see cref="ProjectEndDateReminderScanner"/>): düz servis
/// olarak doğrudan ölçülür. Tekillik burada sağlanmaz; "hedef tarihi başına bir kez" kuralı
/// bildirim tarafındadır. Yüzde, ekran ve raporla AYNI kuraldan gelir
/// (<see cref="ProjectIndicatorProgress"/>).</para>
///
/// <para>Yalnız son <see cref="LookbackDays"/> günde kaçan hedefler taranır: özellik yayına
/// girdiğinde ya da eski bir proje içeri alındığında yıllar önce kaçmış hedefler topluca
/// bildirilmesin.</para>
/// </summary>
public class ProjectIndicatorBehindScanner : ITransientDependency
{
    public const int LookbackDays = 30;

    private readonly IRepository<ProjectIndicator, Guid> _indicatorRepository;
    private readonly IRepository<ProjectIndicatorEntry, Guid> _entryRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public ProjectIndicatorBehindScanner(
        IRepository<ProjectIndicator, Guid> indicatorRepository,
        IRepository<ProjectIndicatorEntry, Guid> entryRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectMember, Guid> memberRepository,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _indicatorRepository = indicatorRepository;
        _entryRepository = entryRepository;
        _projectRepository = projectRepository;
        _memberRepository = memberRepository;
        _mtFilter = mtFilter;
    }

    /// <summary>Bir göstergenin taraması: hangi kiracıda yayınlanacağı + olayın kendisi.</summary>
    public sealed record Result(Guid? TenantId, ProjectIndicatorBehindEto Event);

    public async Task<List<Result>> ScanAsync(DateTime now)
    {
        var today = now.Date;
        var from = today.AddDays(-LookbackDays);

        // Göstergeler kiracılara dağınık: OKUMA için filtre bilinçli kapatılır.
        using (_mtFilter.Disable())
        {
            var indicators = await _indicatorRepository.GetListAsync(
                i => i.TargetDate != null && i.TargetDate < today && i.TargetDate >= from);

            if (indicators.Count == 0)
            {
                return new List<Result>();
            }

            var indicatorIds = indicators.Select(i => i.Id).ToList();
            var latestByIndicator = (await _entryRepository.GetListAsync(e => indicatorIds.Contains(e.IndicatorId)))
                .GroupBy(e => e.IndicatorId)
                .ToDictionary(
                    g => g.Key,
                    g => g.OrderByDescending(e => e.EntryDate).ThenByDescending(e => e.CreationTime).First().Value);

            var projectIds = indicators.Select(i => i.ProjectId).Distinct().ToList();
            var projects = (await _projectRepository.GetListAsync(p => projectIds.Contains(p.Id)))
                .ToDictionary(p => p.Id);
            var leadsByProject = (await _memberRepository.GetListAsync(
                    m => projectIds.Contains(m.ProjectId) && m.Role == ProjectMemberRole.Lead))
                .GroupBy(m => m.ProjectId)
                .ToDictionary(g => g.Key, g => g.Select(m => m.UserId).ToList());

            var results = new List<Result>();

            foreach (var indicator in indicators)
            {
                // Projesi silinmiş gösterge duyurulmaz.
                if (!projects.TryGetValue(indicator.ProjectId, out var project))
                {
                    continue;
                }

                var current = latestByIndicator.TryGetValue(indicator.Id, out var value) ? value : indicator.BaselineValue;
                var percent = ProjectIndicatorProgress.Percent(indicator.BaselineValue, indicator.TargetValue, current);

                if (ProjectIndicatorProgress.Status(percent, indicator.TargetDate, today) != ProjectIndicatorStatus.Behind)
                {
                    continue;
                }

                // Alıcı: proje liderleri + projeyi açan (proje bitiş hatırlatmasıyla aynı küme).
                var recipients = leadsByProject.GetValueOrDefault(project.Id, new List<Guid>()).ToList();
                if (project.CreatorId.HasValue)
                {
                    recipients.Add(project.CreatorId.Value);
                }

                results.Add(new Result(indicator.TenantId, new ProjectIndicatorBehindEto
                {
                    IndicatorId = indicator.Id,
                    ProjectId = project.Id,
                    IndicatorName = indicator.Name,
                    ProjectName = project.Name,
                    Unit = indicator.Unit,
                    TargetValue = indicator.TargetValue,
                    CurrentValue = current,
                    ProgressPercent = percent,
                    TargetDate = indicator.TargetDate!.Value,
                    RecipientIds = recipients.Where(id => id != Guid.Empty).Distinct().ToList(),
                }));
            }

            return results;
        }
    }
}
