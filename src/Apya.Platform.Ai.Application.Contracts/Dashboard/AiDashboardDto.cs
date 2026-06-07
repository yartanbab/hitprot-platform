using System.Collections.Generic;

namespace Apya.Platform.Ai.Dashboard;

public class AiDashboardDto
{
    public int TotalEvaluations { get; set; }
    public int Pending { get; set; }
    public int Processing { get; set; }
    public int Completed { get; set; }
    public int Failed { get; set; }

    public int ScoredCount { get; set; }
    public double? AverageScore { get; set; }

    public List<DashboardBucketDto> RiskDistribution { get; set; } = new();

    public int PromptCount { get; set; }
    public int ActiveWorkflowCount { get; set; }
    public int ProviderCount { get; set; }
}

public class DashboardBucketDto
{
    public string Label { get; set; } = string.Empty;
    public int Count { get; set; }
}
