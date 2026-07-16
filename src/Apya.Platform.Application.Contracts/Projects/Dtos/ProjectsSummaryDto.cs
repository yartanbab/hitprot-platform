namespace Apya.Platform.Projects.Dtos;

/// <summary>
/// Projeler listesi üstündeki KPI şeridi için tüm (sayfalanmamış) proje setinin özeti.
/// </summary>
public class ProjectsSummaryDto
{
    public int TotalCount { get; set; }
    /// <summary>Planlama aşamasında olmayan projeler (Aktif + Risk).</summary>
    public int ActiveCount { get; set; }
    public int AtRiskCount { get; set; }
    public int AverageProgressPercent { get; set; }
    /// <summary>Bütçeyi görme yetkisi yoksa 0 döner.</summary>
    public decimal TotalBudget { get; set; }
}
