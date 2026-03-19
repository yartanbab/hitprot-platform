using System;
using System.Collections.Generic;

namespace Apya.Platform.Reports;

public class ProjectReportDto
{
    public string ProjectName { get; set; }
    public decimal TotalBudget { get; set; }
    public decimal SpentBudget { get; set; }
    public double UsagePercentage => TotalBudget > 0 ? (double)(SpentBudget / TotalBudget * 100) : 0;
    public long TotalSeconds { get; set; }
    public double TotalHours => TotalSeconds / 3600.0;
}

public class PersonnelEfficiencyDto
{
    public string UserName { get; set; }
    public long TotalSeconds { get; set; }
    public double TotalHours => TotalSeconds / 3600.0;
    public int TaskCount { get; set; }
}

public class DashboardReportDto
{
    public List<ProjectReportDto> Projects { get; set; } = new();
    public List<PersonnelEfficiencyDto> Personnel { get; set; } = new();
}
