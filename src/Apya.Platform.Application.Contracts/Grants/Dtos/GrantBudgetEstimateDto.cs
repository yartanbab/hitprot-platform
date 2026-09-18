using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>1e · Bütçe hesaplayıcısının girdisi: yalnız kalem türü ve tutar. Oran, limit ve tavan katalogdan okunur.</summary>
public class EstimateGrantBudgetInput
{
    public Guid GrantCallId { get; set; }

    public List<GrantBudgetAmountDto> Lines { get; set; } = new();
}

public class GrantBudgetAmountDto
{
    public GrantCostItemKind Kind { get; set; }

    [Range(0, 999_999_999_999.99)]
    public decimal Amount { get; set; }
}

/// <summary>Sihirbazla aynı <c>GrantBudgetCalculator</c> sonucu; hiçbir şey kaydedilmez.</summary>
public class GrantBudgetEstimateDto
{
    public List<GrantBudgetEstimateLineDto> Lines { get; set; } = new();
    public decimal TotalProject { get; set; }
    public decimal TotalSupport { get; set; }
    public decimal OwnContribution { get; set; }
    public bool CapApplied { get; set; }
}

public class GrantBudgetEstimateLineDto
{
    public GrantCostItemKind Kind { get; set; }
    public decimal SupportAmount { get; set; }

    /// <summary>Destek, kalemin limitine kırpıldı mı.</summary>
    public bool LimitApplied { get; set; }
}
