using System;
using System.Collections.Generic;

namespace Apya.Platform.Reports;

public class ProjectReportDto
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; }
    public string ProjectCode { get; set; } = string.Empty;
    public string Currency { get; set; } = "TRY";
    public string CurrencySymbol { get; set; } = "\u20BA";
    public decimal TotalBudget { get; set; }
    public decimal SpentBudget { get; set; }
    public double UsagePercentage => TotalBudget > 0 ? (double)(SpentBudget / TotalBudget * 100) : 0;
    public long TotalSeconds { get; set; }
    public double TotalHours => TotalSeconds / 3600.0;

    // Zaman Metrikleri
    public int RemainingDays { get; set; } = 0;
    public int TimeUsagePercent { get; set; } = 0;
    public string TimeHealthColor { get; set; } = "success";

    // Dosya
    public bool HasAttachments { get; set; } = false;

    // Butce Forecast (Tahmin)
    public int TotalProjectDays { get; set; } = 0;
    public int DaysPassed { get; set; } = 0;
    public decimal DailyBurnRate { get; set; } = 0; // Gunluk harcama hizi
    public int EstimatedBudgetExhaustionDay { get; set; } = 0; // Tahmini butce tukenme gunu

    // Tarihler
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    // Tenant
    public string TenantName { get; set; } = string.Empty;
}

public class PersonnelEfficiencyDto
{
    public string UserName { get; set; }
    public long TotalSeconds { get; set; }
    public double TotalHours => TotalSeconds / 3600.0;
    public int TaskCount { get; set; }
    public double CapacityPercent { get; set; } = 0;
    public bool IsOverloaded => CapacityPercent > 100;
}

public class TenantRoiDto
{
    public Guid TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public int ProjectCount { get; set; }
    public decimal TotalBudget { get; set; }
    public decimal TotalSpent { get; set; }
    public decimal Profit => TotalBudget - TotalSpent;
    public double RoiPercent => TotalBudget > 0 ? (double)(Profit / TotalBudget * 100) : 0;
    public double TotalHours { get; set; }
}

public class DashboardReportDto
{
    public List<ProjectReportDto> Projects { get; set; } = new();
    public List<PersonnelEfficiencyDto> Personnel { get; set; } = new();
    public List<TenantRoiDto> TenantRoi { get; set; } = new();
}
