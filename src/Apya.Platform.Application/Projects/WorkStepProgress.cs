using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Projects;

/// <summary>
/// PRJ-04 · İş adımının ilerlemesinin TEK tanımı. Adıma bağlı görev varsa ilerleme onlardan
/// hesaplanır (tamamlanan / iptal edilmemiş toplam); bağlı görev yoksa elle girilen yüzde geçerlidir.
///
/// <para>Eskiden yüzde yalnız elle giriliyordu: görevler ilerlese de adım yerinde sayıyor, ya da
/// adım %100 görünürken altında açık iş kalıyordu. Zaman çizelgesi, kapsam ağacı, iş adımı listesi
/// ve teslim raporu aynı hesabı buradan okur — ekranlar ayrışmasın.</para>
///
/// <para>Sayım gizli görevleri de kapsar: dönen yalnız iki sayıdır, başlık ya da kimlik değil
/// (pano toplamlarıyla aynı karar).</para>
/// </summary>
public static class WorkStepProgress
{
    /// <summary>Bir adıma bağlı, iptal edilmemiş görev sayısı ve bunların tamamlananı.</summary>
    public readonly record struct Counts(int Total, int Done);

    public static async Task<Dictionary<Guid, Counts>> CountAsync(
        IRepository<TaskItem, Guid> taskRepository,
        IAsyncQueryableExecuter asyncExecuter,
        IReadOnlyCollection<Guid> workStepIds)
    {
        if (workStepIds.Count == 0)
        {
            return new Dictionary<Guid, Counts>();
        }

        var queryable = await taskRepository.GetQueryableAsync();
        var rows = await asyncExecuter.ToListAsync(
            queryable
                .Where(t => t.WorkStepId != null
                            && workStepIds.Contains(t.WorkStepId.Value)
                            && t.Status != TaskStatus.Cancelled)
                .GroupBy(t => t.WorkStepId!.Value)
                .Select(g => new
                {
                    StepId = g.Key,
                    Total = g.Count(),
                    Done = g.Count(t => t.Status == TaskStatus.Done)
                }));

        return rows.ToDictionary(r => r.StepId, r => new Counts(r.Total, r.Done));
    }

    /// <summary>Geçerli yüzde: bağlı görev varsa onlardan, yoksa elle girilen değer.</summary>
    public static int Effective(int manualPercent, Counts counts)
        => counts.Total > 0
            ? (int)Math.Round(counts.Done * 100.0 / counts.Total)
            : manualPercent;
}
