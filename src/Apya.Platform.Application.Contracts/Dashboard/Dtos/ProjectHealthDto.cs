using System;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>
/// "Proje sağlığı" kartının bir satırı.
/// <para>
/// NOT: Tasarımdaki "açık risk" sayacı YOK — platformda sayılabilir risk kaydı bulunmuyor
/// (<c>ProjectAnalysis.Risks</c> AI'ın ürettiği serbest metin). Uydurmamak için alan
/// eklenmedi; risk entity'si gelirse buraya <c>OpenRisks</c> girer.
/// </para>
/// </summary>
public class ProjectHealthDto
{
    public Guid ProjectId { get; set; }

    public string Name { get; set; } = string.Empty;

    public ProjectHealthState State { get; set; }

    /// <summary>Bitişe kalan gün; bitiş tarihi yoksa null. Negatifse süre aşılmış.</summary>
    public int? DaysRemaining { get; set; }

    /// <summary>Geçen süre / toplam süre. Tarihler eksikse null.</summary>
    public decimal? TimeRatio { get; set; }

    /// <summary>
    /// Harcanan / bütçe. <c>Platform.Projects.ViewBudget</c> yetkisi yoksa ya da
    /// bütçe 0 ise null — UI o barı gizler.
    /// </summary>
    public decimal? BudgetRatio { get; set; }

    public int TasksDone { get; set; }

    public int TasksTotal { get; set; }
}
