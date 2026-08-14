using System.Collections.Generic;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>Sayısal özet şeridi (5 kart). Yetkisi olmayan alanlar null döner, sıfır DEĞİL.</summary>
public class DashboardSummaryDto
{
    /// <summary>Seçili aralıkta son tarihi olan, kapanmamış görev sayısı.</summary>
    public int DueThisPeriod { get; set; }

    /// <summary>Bunların bu hafta içinde olanı — özet kartındaki pill.</summary>
    public int DueThisWeek { get; set; }

    /// <summary>Son tarihi geçmiş, kapanmamış görev sayısı.</summary>
    public int Overdue { get; set; }

    /// <summary>Geciken görevlerin en eskisinin kaç gündür geciktiği; hiç yoksa null.</summary>
    public int? OldestOverdueDays { get; set; }

    /// <summary>Geciken görevlerin yayıldığı proje sayısı.</summary>
    public int OverdueProjectCount { get; set; }

    public int Blocked { get; set; }

    /// <summary>Tıkanan işlerin ortalama bekleme süresi (gün).</summary>
    public decimal BlockedAvgIdleDays { get; set; }

    /// <summary>Taslak fatura sayısı. <c>Platform.Invoices</c> yoksa null.</summary>
    public int? PendingApprovals { get; set; }

    /// <summary>Taslak faturaların toplam tutarı. <c>Platform.Invoices</c> yoksa null.</summary>
    public decimal? PendingApprovalAmount { get; set; }

    /// <summary>Taslak faturaların ortalama bekleme süresi (saat). Yetki yoksa null.</summary>
    public decimal? PendingApprovalAvgAgeHours { get; set; }

    /// <summary>Harcanan / toplam bütçe. <c>Platform.Projects.ViewBudget</c> yoksa null.</summary>
    public decimal? BudgetUsedRatio { get; set; }

    public decimal? BudgetSpent { get; set; }

    public decimal? BudgetTotal { get; set; }

    /// <summary>"Bu ay teslim" kartının taşan alan grafiği — aralık boyunca günlük teslim sayısı.</summary>
    public List<int> DueTrend { get; set; } = new();

    /// <summary>Tenant'ın baskın para birimi (en çok projede kullanılan); yoksa "TRY".</summary>
    public string Currency { get; set; } = "TRY";
}
