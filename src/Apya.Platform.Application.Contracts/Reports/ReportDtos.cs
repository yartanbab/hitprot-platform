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
}

public class PersonnelEfficiencyDto
{
    public string UserName { get; set; }
    public long TotalSeconds { get; set; }
    public double TotalHours => TotalSeconds / 3600.0;
    public int TaskCount { get; set; }
    public double CapacityPercent { get; set; } = 0; // % kapasite kullanimi
    public bool IsOverloaded => CapacityPercent > 100;
}

public class DashboardReportDto
{
    public List<ProjectReportDto> Projects { get; set; } = new();
    public List<PersonnelEfficiencyDto> Personnel { get; set; } = new();
}
