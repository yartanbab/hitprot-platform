using System;
using System.Collections.Generic;
using System.Text;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Pages.Reports;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Görev detayı PDF dışa aktarımı (⋯ → "PDF olarak dışa aktar").
/// QuestPDF çıktısını gerçekten üretip üretmediğini ve opsiyonel bölümlerin
/// veri yokken PATLAMADIĞINI doğrular — PDF motoru boş koleksiyonlarda
/// sessizce çökebiliyor, bu yüzden her bölüm ayrı senaryo olarak sınanır.
/// </summary>
public class TaskPdfExport_Tests
{
    /// <summary>
    /// QuestPDF, lisans tipi seçilmeden GeneratePdf çağrılırsa exception atar.
    /// Üretimde bunu PlatformWebModule.OnApplicationInitialization ayarlıyor; birim
    /// testi modülü çalıştırmadığı için aynı ön koşulu burada kuruyoruz (aynı değer).
    /// </summary>
    static TaskPdfExport_Tests()
    {
        QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
    }

    private static TaskDto MinimalTask() => new()
    {
        Id = Guid.NewGuid(),
        Number = 17,
        Title = "Sözleşme taslağını hazırla",
        Status = Apya.Platform.Tasks.TaskStatus.InProgress,
        Priority = TaskPriority.High,
        StartDate = new DateTime(2026, 8, 1),
    };

    /// <summary>PDF dosya imzası: her geçerli PDF "%PDF-" ile başlar.</summary>
    private static void ShouldBePdf(byte[] bytes)
    {
        bytes.ShouldNotBeNull();
        bytes.Length.ShouldBeGreaterThan(500, "PDF gövdesi anlamlı büyüklükte olmalı");
        Encoding.ASCII.GetString(bytes, 0, 5).ShouldBe("%PDF-");
    }

    [Fact]
    public void Minimal_gorev_icin_gecerli_PDF_uretir()
    {
        var bytes = ReportExporter.TaskDetailToPdf(MinimalTask());
        ShouldBePdf(bytes);
    }

    [Fact]
    public void Aciklama_alt_gorev_yorum_ek_yokken_patlamaz()
    {
        // Tüm opsiyonel koleksiyonlar boş — hiçbir başlık basılmamalı ama üretim sürmeli.
        var t = MinimalTask();
        t.Description = string.Empty;
        t.SubTasks.Clear();
        t.Comments.Clear();
        t.Attachments.Clear();
        t.Tags.Clear();

        ShouldBePdf(ReportExporter.TaskDetailToPdf(t));
    }

    [Fact]
    public void Tum_bolumler_dolu_iken_gecerli_PDF_uretir()
    {
        var t = MinimalTask();
        t.Description = "Karşı tarafın hukuk ekibiyle paylaşılacak ilk taslak.";
        t.DueDate = new DateTime(2026, 8, 19);
        t.CompletedDate = new DateTime(2026, 8, 20);
        t.AssigneeName = "Yakup B.";
        t.ProjectName = "Kurumsal Portal";
        t.ParentTaskTitle = "Sözleşme süreci";
        t.EstimatedHours = 8m;
        t.SpentHours = 5.5m;
        t.TaskType = "Analiz";
        t.Sprint = "S-42";
        t.Tags = new List<TagDto>
        {
            new() { Id = Guid.NewGuid(), Name = "hukuk" },
            new() { Id = Guid.NewGuid(), Name = "acil" },
        };
        t.SubTasks = new List<TaskDto>
        {
            new() { Id = Guid.NewGuid(), Number = 18, Title = "Şablonu getir", Status = Apya.Platform.Tasks.TaskStatus.Done },
            new() { Id = Guid.NewGuid(), Number = 19, Title = "Maddeleri gözden geçir", Status = Apya.Platform.Tasks.TaskStatus.Todo },
        };
        t.Attachments = new List<TaskAttachmentDto>
        {
            new() { Id = Guid.NewGuid(), FileName = "taslak-v1.docx" },
        };
        t.Comments = new List<TaskCommentDto>
        {
            new() { Id = Guid.NewGuid(), AuthorName = "Ayşe K.", Text = "3. madde netleşmeli.", CreationTime = new DateTime(2026, 8, 12, 9, 30, 0) },
        };

        ShouldBePdf(ReportExporter.TaskDetailToPdf(t));
    }

    [Fact]
    public void Turkce_karakterler_ve_uzun_metin_uretimi_bozmaz()
    {
        var t = MinimalTask();
        t.Title = "Çğıöşü ĞİÖŞÜ — özel karakterli başlık";
        t.Description = string.Concat(new string('ş', 200), " ", new string('ğ', 200));

        ShouldBePdf(ReportExporter.TaskDetailToPdf(t));
    }

    [Fact]
    public void Kod_uretilmemis_gorevde_de_calisir()
    {
        // Number = 0 -> Code "GRV-—" döner; başlık yine basılabilmeli.
        var t = MinimalTask();
        t.Number = 0;

        ShouldBePdf(ReportExporter.TaskDetailToPdf(t));
    }
}
