using System;
using System.Collections.Generic;
using Apya.Platform.Application.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Tasks;
using Shouldly;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Tests.Application.Projects;

/// <summary>
/// QA-08 · Proje risk puanı. İptal edilen görev "gecikmiş" ve "bekleyen kritik" sayılıyordu:
/// bir işi iptal etmek riski hiç düşürmüyordu (QA turunda ölçüldü: 65 puan / Risk; doğrusu
/// 50 / Dikkat).
/// </summary>
public class ProjectMetricsCalculator_Tests
{
    private static readonly DateTime Now = new(2026, 10, 19, 10, 0, 0);

    private static TaskDto Task(TaskStatus status, DateTime? due, TaskPriority priority = TaskPriority.Medium) => new()
    {
        Id = Guid.NewGuid(),
        Status = status,
        DueDate = due,
        Priority = priority,
    };

    private static ProjectDto Project() => new() { StartDate = Now.AddDays(-5), EndDate = Now.AddDays(30) };

    [Fact]
    public void Iptal_edilen_gorev_risk_puanina_girmez()
    {
        var withCancelled = ProjectMetricsCalculator.CalculateAiRisk(Project(), new List<TaskDto>
        {
            Task(TaskStatus.Todo, Now.Date.AddDays(-1), TaskPriority.Critical), // gecikmiş + kritik: 15 + 20
            Task(TaskStatus.Cancelled, Now.Date.AddDays(-2), TaskPriority.Critical),
        }, Now);

        withCancelled.score.ShouldBe(35, "iptal edilen görev ne gecikmiş ne bekleyen kritik iştir");
    }

    [Fact]
    public void Bugun_biten_gorev_gecikmis_sayilmaz()
    {
        var risk = ProjectMetricsCalculator.CalculateAiRisk(Project(), new List<TaskDto>
        {
            Task(TaskStatus.Todo, Now.Date),
        }, Now);

        risk.score.ShouldBe(0);
    }
}
