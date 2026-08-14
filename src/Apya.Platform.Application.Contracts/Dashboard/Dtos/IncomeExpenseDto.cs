using System;
using System.Collections.Generic;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>Gelir/gider gruplu bar grafiğinin tek ayı.</summary>
public class IncomeExpensePointDto
{
    /// <summary>Ayın ilk günü (UTC).</summary>
    public DateTime Month { get; set; }

    public decimal Income { get; set; }

    public decimal Expense { get; set; }
}

/// <summary>Gelir/gider kartının tamamı — 6 ay geriye.</summary>
public class IncomeExpenseDto
{
    public List<IncomeExpensePointDto> Points { get; set; } = new();

    public string Currency { get; set; } = "TRY";

    /// <summary>Dönem toplamı: gelir − gider.</summary>
    public decimal Net { get; set; }
}
