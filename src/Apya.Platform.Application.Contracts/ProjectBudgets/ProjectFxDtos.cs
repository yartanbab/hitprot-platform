using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.ProjectBudgets.Dtos;

public class ProjectFxPolicyDto
{
    public Guid ProjectId { get; set; }

    /// <summary>Projenin kendi (işlem) para birimi.</summary>
    public string ProjectCurrency { get; set; } = "TRY";

    /// <summary>Boşsa proje tek defterlidir.</summary>
    public string? DonorCurrency { get; set; }

    public FxPolicy Policy { get; set; }

    public decimal? FixedDonorRate { get; set; }

    public bool HasDonorLedger => !string.IsNullOrWhiteSpace(DonorCurrency);
}

public class UpdateProjectFxPolicyDto
{
    [MaxLength(3)]
    public string? DonorCurrency { get; set; }

    public FxPolicy Policy { get; set; }

    [Range(0, 999999)]
    public decimal? FixedDonorRate { get; set; }
}

/// <summary>Kur köprüsü ekranındaki mutabakat tablosunun bir satırı.</summary>
public class FxReconciliationRowDto
{
    public DateTime Date { get; set; }
    public bool IsInflow { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? CashAccountName { get; set; }

    public string Currency { get; set; } = "TRY";
    public decimal Amount { get; set; }

    public decimal BookAmount { get; set; }
    public decimal BookRate { get; set; }
    public decimal? DonorAmount { get; set; }
    public decimal? DonorRate { get; set; }
    public bool RateLocked { get; set; }

    /// <summary>Donör karşılığı hesaplanamamış kayıt — kur eksik demektir.</summary>
    public bool DonorMissing => DonorAmount == null;
}

/// <summary>
/// "Kur köprüsü" sekmesinin tek veri kaynağı: üç defter özeti + politika +
/// mutabakat satırları.
/// </summary>
public class ProjectFxBridgeDto
{
    public ProjectFxPolicyDto Policy { get; set; } = new();

    /// <summary>Donör defteri: gelen − harcanan, donör PB'sinde.</summary>
    public decimal DonorIncome { get; set; }
    public decimal DonorExpense { get; set; }
    public decimal DonorNet => DonorIncome - DonorExpense;

    /// <summary>Yasal defter (₺).</summary>
    public decimal BookIncome { get; set; }
    public decimal BookExpense { get; set; }
    public decimal BookNet => BookIncome - BookExpense;

    /// <summary>İşlem para biriminde (kasa gerçeği) — para birimi başına.</summary>
    public Dictionary<string, decimal> NetByCurrency { get; set; } = new();

    /// <summary>Donör karşılığı hesaplanamamış kayıt sayısı (kur eksik).</summary>
    public int MissingDonorRateCount { get; set; }

    /// <summary>Politika değişirse yeniden hesaplanacak kayıt sayısı.</summary>
    public int LockedRecordCount { get; set; }

    public List<FxReconciliationRowDto> Rows { get; set; } = new();
}

/// <summary>Toplu yeniden hesaplama sonucu.</summary>
public class FxRecalculationResultDto
{
    public int UpdatedExpenseCount { get; set; }
    public int UpdatedIncomeCount { get; set; }
    public int StillMissingRateCount { get; set; }
    public int Total => UpdatedExpenseCount + UpdatedIncomeCount;
}
