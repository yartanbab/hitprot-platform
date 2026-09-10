using System;
using System.Collections.Generic;

namespace Apya.Platform.Expenses;

/// <summary>
/// /Tasks Finans paneli (birleşik sekme sistemi PR-3b, tasarım 2b/3c):
/// giderler proje gruplu, ara toplamlar SUNUCUDA (GROUP BY — istemcide
/// toplama yok), "Genel gider" (bağımsız: ProjectId boş) ayrı grup ve hiçbir
/// bütçeye sayılmaz. Toplamlar PARA BİRİMİ BAŞINA — kur uydurulmaz (portföy
/// özetiyle aynı karar; tek PB'li veride zaten tek satır görünür).
/// </summary>
public class ExpenseProjectGroupsDto
{
    /// <summary>Ada göre sıralı proje grupları; Genel gider EN SONDA.</summary>
    public List<ExpenseProjectGroupDto> Groups { get; set; } = new();

    /// <summary>Koyu bant: süzülmüş kümenin para birimi başına genel toplamı.</summary>
    public List<ExpenseCurrencyTotalDto> GrandTotals { get; set; } = new();

    /// <summary>Satır sınırı aşıldı — gruplarda görünen satır sayısı TotalCount'tan
    /// az olabilir (toplamlar yine TÜM kümeden, DB'de hesaplanır).</summary>
    public bool RowsTruncated { get; set; }
}

public class ExpenseProjectGroupDto
{
    /// <summary>BOŞ = Genel gider havuzu (bağımsız kayıtlar).</summary>
    public Guid? ProjectId { get; set; }

    public string ProjectName { get; set; } = string.Empty;
    public string? ProjectCode { get; set; }

    /// <summary>Gruptaki TÜM kayıt sayısı (satır sınırından bağımsız).</summary>
    public int TotalCount { get; set; }

    public List<ExpenseCurrencyTotalDto> Totals { get; set; } = new();
    public List<ExpenseGroupRowDto> Rows { get; set; } = new();
}

public class ExpenseCurrencyTotalDto
{
    public string Currency { get; set; } = "TRY";
    public decimal Total { get; set; }
    public int Count { get; set; }
}

public class ExpenseGroupRowDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public DateTime ExpenseDate { get; set; }
    public ExpenseCategory Category { get; set; }

    public Guid? TaskId { get; set; }

    /// <summary>Gizli ve görünmez görevde BOŞ — başlık gizlilik süzgecinden geçer.</summary>
    public string? TaskTitle { get; set; }
}
