namespace Apya.Platform.Projects.Dtos;

/// <summary>
/// Proje detayı şeridinin canlı tazelemesi için görev sayıları — ProjectTaskProgress'in
/// tek kuralından, projenin TÜM görevleri üzerinden (liste kartıyla aynı sayılar).
/// </summary>
public class ProjectTaskSummaryDto
{
    public int Total { get; set; }
    public int Done { get; set; }
    public int CompletionPercent { get; set; }
    public int Overdue { get; set; }
    public int DueSoon { get; set; }
}
