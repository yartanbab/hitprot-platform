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

/// <summary>
/// Gelir/gider kartının tamamı — 6 ay geriye.
/// <para>
/// KİLİT SÖZLEŞMESİ: kart net = gelir − gider gösterir; <c>Platform.Incomes</c> VE
/// <c>Platform.Expenses</c> ikisi de gerekir — tek seriyle net uydurulur. Kilitliyken sorgu
/// atılmaz, <see cref="Points"/> boştur, <see cref="Currency"/>/<see cref="Net"/> anlamsızdır;
/// kart "kayıtlı hareket yok" DEĞİL "görme yetkiniz yok" çizer.
/// </para>
/// </summary>
public class IncomeExpenseDto
{
    public List<IncomeExpensePointDto> Points { get; set; } = new();

    public string Currency { get; set; } = "TRY";

    /// <summary>Dönem toplamı: gelir − gider.</summary>
    public decimal Net { get; set; }

    /// <summary>İki izinden biri yoksa true (ad <see cref="DashboardStatDto.Locked"/> ile aynı).</summary>
    public bool Locked { get; set; }
}
