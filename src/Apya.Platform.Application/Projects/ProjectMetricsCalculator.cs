using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Tasks;

namespace Apya.Platform.Application.Projects;

/// <summary>
/// ProjectDetails ekranının ihtiyaç duyduğu türetilmiş metrikleri hesaplar.
/// Tamamen saf fonksiyon: I/O yok, DI yok — birim test edilebilir.
/// </summary>
public static class ProjectMetricsCalculator
{
    public static (int score, string color, string message) CalculateAiRisk(
        ProjectDto project,
        IReadOnlyList<TaskDto> tasks,
        DateTime now)
    {
        if (tasks.Count == 0)
        {
            return (0, "secondary",
                "Projede henüz görev yok. Öngörü için görev eklemeye başlayın.");
        }

        var delayedTasks = tasks.Count(t =>
            t.DueDate.HasValue && t.DueDate.Value < now && t.Status != TaskStatus.Done);

        var criticalPending = tasks.Count(t =>
            t.Priority == TaskPriority.Critical && t.Status != TaskStatus.Done);

        var completedTasks = tasks.Count(t => t.Status == TaskStatus.Done);
        var completionRate = tasks.Count > 0 ? (double)completedTasks / tasks.Count : 0;

        var riskFactor = delayedTasks * 15 + criticalPending * 20;

        if (project.EndDate.HasValue)
        {
            var totalDays = (project.EndDate.Value - (project.StartDate ?? now)).TotalDays;
            var daysPassed = (now - (project.StartDate ?? now)).TotalDays;

            if (totalDays > 0)
            {
                var timeElapsedRate = daysPassed / totalDays;
                if (timeElapsedRate > 0.5 && completionRate < (timeElapsedRate - 0.2))
                {
                    riskFactor += 30;
                }
            }
        }

        var score = Math.Min(riskFactor, 100);

        if (score < 20)
            return (score, "success",
                "Proje planlara uygun seyrediyor. Beklenen risk minimum seviyede.");

        if (score < 60)
            return (score, "warning",
                $"Dikkat: {delayedTasks} gecikmiş ve {criticalPending} kritik görev efor kaybına yol açıyor.");

        return (score, "danger",
            $"Kritik Seviye! Gecikmeler ve daralan süre nedeniyle teslimat riski %{score} olarak öngörüldü.");
    }

    public static (int remainingDays, int totalProjectDays, int timeUsagePercent, string color, string label)
        CalculateTimeMetrics(
            ProjectDto project,
            IReadOnlyList<TaskDto> tasks,
            DateTime now)
    {
        if (!project.StartDate.HasValue || !project.EndDate.HasValue)
        {
            return (0, 0, 0, "success", "Saglam");
        }

        var totalProjectDays = (int)(project.EndDate.Value - project.StartDate.Value).TotalDays;
        var daysPassed = (int)(now - project.StartDate.Value).TotalDays;
        var remainingDays = Math.Max(0, (int)(project.EndDate.Value - now).TotalDays);

        var timeUsagePercent = totalProjectDays > 0
            ? Math.Min(100, (int)Math.Round((double)daysPassed / totalProjectDays * 100))
            : 0;

        var totalTasks = tasks.Count;
        var completedTasks = tasks.Count(t => t.Status == TaskStatus.Done);
        var completionRate = totalTasks > 0 ? (double)completedTasks / totalTasks * 100 : 0;

        if (timeUsagePercent > 80 && completionRate < 50)
            return (remainingDays, totalProjectDays, timeUsagePercent, "danger", "Kritik");

        if (timeUsagePercent > 50 && completionRate < (timeUsagePercent - 20))
            return (remainingDays, totalProjectDays, timeUsagePercent, "warning", "Dikkat");

        return (remainingDays, totalProjectDays, timeUsagePercent, "success", "Saglam");
    }

    public static decimal CalculateBudgetSpent(
        IReadOnlyList<TaskTimeLog> timeLogs,
        decimal hourlyRate)
    {
        var totalSeconds = timeLogs.Sum(x => x.SecondsSpent ?? 0);
        return (decimal)(totalSeconds / 3600.0) * hourlyRate;
    }

    public static int CalculateBudgetPercent(decimal spent, decimal totalBudget)
    {
        if (totalBudget <= 0) return 0;
        return Math.Min(100, (int)Math.Round((double)(spent / totalBudget) * 100));
    }

    public static string ResolveCurrencySymbol(string? currency) => currency switch
    {
        "USD" => "$",
        "EUR" => "€",
        _ => "₺"
    };
}
