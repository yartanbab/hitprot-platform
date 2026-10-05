using System;
using System.Collections.Generic;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Tests.Application.Projects;

/// <summary>
/// RPT-02 · Görev ilerlemesinin TEK tanımı. Proje listesi ve rapor aynı fonksiyondan
/// okur; bu testler tanımın kendisini kilitler ki biri "düzeltirken" iki ekranı
/// ayrıştırmasın.
/// </summary>
public class ProjectTaskProgress_Tests
{
    private static readonly DateTime Now = new(2026, 10, 5, 12, 0, 0);

    private static TaskDto Task(TaskStatus status, DateTime? due = null) => new()
    {
        Id = Guid.NewGuid(),
        Status = status,
        DueDate = due,
    };

    [Fact]
    public void Durum_dagilimi_sayilir()
    {
        var summary = ProjectTaskProgress.Summarize(new List<TaskDto>
        {
            Task(TaskStatus.Done), Task(TaskStatus.Done),
            Task(TaskStatus.InProgress),
            Task(TaskStatus.InReview),
            Task(TaskStatus.Todo), Task(TaskStatus.Todo), Task(TaskStatus.Todo),
            Task(TaskStatus.Cancelled),
        }, Now);

        summary.Total.ShouldBe(8);
        summary.Done.ShouldBe(2);
        summary.InProgress.ShouldBe(1);
        summary.InReview.ShouldBe(1);
        summary.Todo.ShouldBe(3);
        summary.Cancelled.ShouldBe(1);
    }

    /// <summary>
    /// 🔴 İptal edilen görev paydadan DÜŞMEZ. Bu, proje listesinin yıllardır gösterdiği
    /// yüzdenin tanımı; rapor için "daha doğru" bir payda seçmek aynı proje için iki
    /// farklı yüzde üretirdi.
    /// </summary>
    [Fact]
    public void Tamamlanma_orani_tum_gorevlere_bolunur_iptal_dahil()
    {
        var summary = ProjectTaskProgress.Summarize(new List<TaskDto>
        {
            Task(TaskStatus.Done), Task(TaskStatus.Done),
            Task(TaskStatus.Todo),
            Task(TaskStatus.Cancelled),
        }, Now);

        summary.CompletionPercent.ShouldBe(50, "2 / 4 — iptal edilen payda içinde");
    }

    [Fact]
    public void Gecikme_yalniz_acik_ve_tarihi_gecmis_gorevdir()
    {
        var yesterday = Now.AddDays(-1);
        var tomorrow = Now.AddDays(1);

        var summary = ProjectTaskProgress.Summarize(new List<TaskDto>
        {
            Task(TaskStatus.Todo, yesterday),        // gecikmiş
            Task(TaskStatus.InProgress, yesterday),  // gecikmiş
            Task(TaskStatus.InReview, yesterday),    // gecikmiş: kontrol aşaması da açık sayılır
            Task(TaskStatus.Done, yesterday),        // bitmiş → gecikme değil
            Task(TaskStatus.Cancelled, yesterday),   // iptal → gecikme değil
            Task(TaskStatus.Todo, tomorrow),         // henüz vakti var
            Task(TaskStatus.Todo),                   // tarihi yok
        }, Now);

        summary.Overdue.ShouldBe(3);
    }

    [Fact]
    public void Gorevsiz_projede_her_sey_sifir()
    {
        var summary = ProjectTaskProgress.Summarize(new List<TaskDto>(), Now);

        summary.Total.ShouldBe(0);
        summary.CompletionPercent.ShouldBe(0, "sıfıra bölme yok");
        summary.Overdue.ShouldBe(0);
    }
}
