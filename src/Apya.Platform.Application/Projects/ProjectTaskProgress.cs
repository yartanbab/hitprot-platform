using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Tasks;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Projects;

/// <summary>
/// Bir projenin görev ilerlemesi — TEK tanım.
///
/// <para>Bu kural eskiden <c>ProjectAppService.EnrichProgressAndRisk</c> içinde gömülüydü
/// ve yalnız proje listesini besliyordu. Rapor da aynı soruyu soruyor ("görevlerin yüzde
/// kaçı bitti, kaçı gecikti"); kuralı orada yeniden yazmak, aynı proje için liste ile
/// raporun FARKLI yüzde göstermesine kapı açardı. İkisi de artık buradan okur.</para>
///
/// <para>Bilinçli tanımlar (liste ekranındaki davranışın aynısı, değiştirilmedi):</para>
/// <list type="bullet">
/// <item>Tamamlanma = <c>Done / TÜM görevler</c>. İptal edilen görev paydadan DÜŞMEZ.</item>
/// <item>Gecikme = açık (Done ya da Cancelled değil) ve son tarihi <c>now</c>'dan önce.</item>
/// </list>
/// </summary>
public static class ProjectTaskProgress
{
    public readonly record struct Summary(
        int Total,
        int Done,
        int InProgress,
        int InReview,
        int Todo,
        int Cancelled,
        int Overdue,
        int CompletionPercent);

    public static Summary Summarize(IReadOnlyCollection<TaskDto> tasks, DateTime now)
    {
        var total = tasks.Count;
        var done = tasks.Count(t => t.Status == TaskStatus.Done);

        var overdue = tasks.Count(t => t.Status != TaskStatus.Done
                                       && t.Status != TaskStatus.Cancelled
                                       && t.DueDate.HasValue
                                       && t.DueDate.Value < now);

        return new Summary(
            Total: total,
            Done: done,
            InProgress: tasks.Count(t => t.Status == TaskStatus.InProgress),
            InReview: tasks.Count(t => t.Status == TaskStatus.InReview),
            Todo: tasks.Count(t => t.Status == TaskStatus.Todo),
            Cancelled: tasks.Count(t => t.Status == TaskStatus.Cancelled),
            Overdue: overdue,
            CompletionPercent: total > 0 ? (int)Math.Round((double)done / total * 100) : 0);
    }
}
