using System;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>
/// "Bende bekleyen kararlar" kuyruğunun bir satırı — kaynak: taslak (Draft) faturalar.
/// Onay iş akışı eklenene kadar tek tür <see cref="DashboardApprovalType.Invoice"/>'dır.
/// </summary>
public class PendingApprovalDto
{
    public Guid Id { get; set; }

    public DashboardApprovalType Type { get; set; }

    public string Title { get; set; } = string.Empty;

    /// <summary>Kaydı oluşturan kullanıcı; bulunamazsa boş string.</summary>
    public string RequesterName { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "TRY";

    /// <summary>Oluşturulduğundan bu yana geçen saat.</summary>
    public int AgeHours { get; set; }

    /// <summary>"İncele →" linkinin gideceği sayfa. Dashboard'da satır içi onay yok.</summary>
    public string TargetUrl { get; set; } = string.Empty;
}
