using System.Collections.Generic;
using Apya.Platform.Tasks;

namespace Apya.Platform.Projects.Dtos;

/// <summary>
/// ProjectDetails sayfasının ihtiyaç duyduğu view-ready veri kümesi.
/// AI risk skoru, zaman metrikleri ve bütçe tüketimi AppService tarafında hesaplanır.
/// </summary>
public class ProjectDetailDto : ProjectDto
{
    public List<TaskDto> Tasks { get; set; } = new();

    public string TenantDisplayName { get; set; } = "Platform (Host)";
    public bool IsInternalProject { get; set; } = true;
    public string CurrencySymbol { get; set; } = "₺";

    /// <summary>Proje başladıysa bitişe, başlamadıysa BAŞLANGICA kalan gün.</summary>
    public int RemainingDays { get; set; }
    public int TotalProjectDays { get; set; }
    public int TimeUsagePercent { get; set; }
    public string TimeHealthColor { get; set; } = "success";
    public string TimeHealthLabel { get; set; } = "Saglam";

    /// <summary>İleri tarihli proje (StartDate gelecekte) — henüz başlamadı.</summary>
    public bool TimeNotStarted { get; set; }

    public int BudgetPercent { get; set; }

    public int AiRiskScore { get; set; }
    public string AiRiskMessage { get; set; } = string.Empty;
    public string AiRiskColor { get; set; } = "success";
}
