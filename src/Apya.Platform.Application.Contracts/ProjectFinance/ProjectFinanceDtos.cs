using System;
using System.Collections.Generic;

namespace Apya.Platform.ProjectFinance;

public class ProjectFinanceSummaryDto
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = null!;
    public string Currency { get; set; } = "TRY";

    public decimal Budget { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal TotalIncome { get; set; }

    /// <summary>Gelir − Gider (proje net sonucu).</summary>
    public decimal Net => TotalIncome - TotalExpense;

    /// <summary>Bütçe − Gider (kalan harcanabilir).</summary>
    public decimal BudgetRemaining => Budget - TotalExpense;

    public bool OverBudget => Budget > 0 && TotalExpense > Budget;

    /// <summary>Bütçe kullanım yüzdesi (Gider/Bütçe).</summary>
    public int BudgetUsagePercent => Budget > 0
        ? (int)System.Math.Round(TotalExpense / Budget * 100m)
        : 0;

    public List<ProjectFinanceTaskLineDto> TaskBreakdown { get; set; } = new();
}

public class ProjectFinanceTaskLineDto
{
    public Guid? TaskId { get; set; }
    public decimal Expense { get; set; }
    public decimal Income { get; set; }
}
