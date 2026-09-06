using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Billing.Dtos;

/// <summary>Panelde ve kiracı ekranında görünen fatura.</summary>
public class SubscriptionInvoiceDto : EntityDto<Guid>
{
    public Guid TenantId { get; set; }

    /// <summary>Kiracının adı — host listesi kiracı başına gruplanmadan okunabilsin.</summary>
    public string TenantName { get; set; } = string.Empty;

    public string Number { get; set; } = string.Empty;

    public string? OfficialNumber { get; set; }

    public SubscriptionInvoiceType Type { get; set; }

    public DateTime IssueDate { get; set; }

    public DateTime DueDate { get; set; }

    public decimal NetAmount { get; set; }

    public VatMode VatMode { get; set; }

    public decimal VatRate { get; set; }

    public decimal VatAmount { get; set; }

    public decimal TotalAmount { get; set; }

    /// <summary>Yalnız ONAYLI tahsilatların toplamı.</summary>
    public decimal PaidAmount { get; set; }

    public decimal RemainingAmount { get; set; }

    public SubscriptionInvoiceStatus Status { get; set; }

    /// <summary>Vadesi geçti mi? Sunucuda hesaplanır — istemcinin saatine güvenilmez.</summary>
    public bool IsOverdue { get; set; }

    /// <summary>Kiracının onay bekleyen dekont bildirimi var — host'un dikkatini ister.</summary>
    public bool HasPendingDeclaration { get; set; }

    public string? Notes { get; set; }

    public string? FileName { get; set; }

    public bool HasDocument => !string.IsNullOrWhiteSpace(FileName);

    public List<SubscriptionPaymentDto> Payments { get; set; } = new();

    public DateTime CreationTime { get; set; }
}

/// <summary>Bir faturaya yapılan tahsilat.</summary>
public class SubscriptionPaymentDto : EntityDto<Guid>
{
    public DateTime PaidAt { get; set; }

    public decimal Amount { get; set; }

    public PaymentMethod Method { get; set; }

    public string? Reference { get; set; }

    public string? FileName { get; set; }

    public bool HasReceipt => !string.IsNullOrWhiteSpace(FileName);

    /// <summary>Kiracının beyanı mı? Host'un kendi kaydı ise false.</summary>
    public bool DeclaredByTenant { get; set; }

    public bool IsConfirmed { get; set; }

    public DateTime? ConfirmedAt { get; set; }
}

/// <summary>Host'un yeni fatura açması.</summary>
public class CreateSubscriptionInvoiceDto
{
    [Required(ErrorMessage = "Müşteri seçimi zorunludur.")]
    public Guid? TenantId { get; set; }

    public SubscriptionInvoiceType Type { get; set; } = SubscriptionInvoiceType.License;

    [Required(ErrorMessage = "Fatura tarihi zorunludur.")]
    public DateTime? IssueDate { get; set; }

    /// <summary>Boş bırakılırsa fatura tarihi + 15 gün (protokol Madde 5.1).</summary>
    public DateTime? DueDate { get; set; }

    [Range(0, 99_999_999, ErrorMessage = "Tutar 0 ile {2} arasında olmalıdır.")]
    public decimal NetAmount { get; set; }

    public VatMode VatMode { get; set; } = VatMode.TeknoparkExempt;

    [Range(0, 100, ErrorMessage = "KDV oranı 0 ile {2} arasında olmalıdır.")]
    public decimal VatRate { get; set; }

    [StringLength(BillingConsts.MaxOfficialNumberLength, ErrorMessage = "Resmî fatura numarası en fazla {1} karakter olabilir.")]
    public string? OfficialNumber { get; set; }

    [StringLength(BillingConsts.MaxNotesLength, ErrorMessage = "Not en fazla {1} karakter olabilir.")]
    public string? Notes { get; set; }
}

/// <summary>Host'un fatura üstbilgisini güncellemesi. Tahsilatlara dokunmaz.</summary>
public class UpdateSubscriptionInvoiceDto
{
    [StringLength(BillingConsts.MaxOfficialNumberLength, ErrorMessage = "Resmî fatura numarası en fazla {1} karakter olabilir.")]
    public string? OfficialNumber { get; set; }

    [Required(ErrorMessage = "Vade tarihi zorunludur.")]
    public DateTime? DueDate { get; set; }

    [StringLength(BillingConsts.MaxNotesLength, ErrorMessage = "Not en fazla {1} karakter olabilir.")]
    public string? Notes { get; set; }
}

/// <summary>
/// Tahsilat kaydı. Host kullandığında doğrudan ONAYLI doğar; kiracı kullandığında
/// beyandır ve host onaylayana kadar tutara sayılmaz.
/// </summary>
public class RecordPaymentDto
{
    [Required(ErrorMessage = "Ödeme tarihi zorunludur.")]
    public DateTime? PaidAt { get; set; }

    [Range(0.01, 99_999_999, ErrorMessage = "Tutar {1} ile {2} arasında olmalıdır.")]
    public decimal Amount { get; set; }

    public PaymentMethod Method { get; set; } = PaymentMethod.BankTransfer;

    [StringLength(BillingConsts.MaxReferenceLength, ErrorMessage = "Referans en fazla {1} karakter olabilir.")]
    public string? Reference { get; set; }
}

/// <summary>
/// Kiracının "ödedim" bildirimi. Dekont AYRI parametre değil, girdinin parçasıdır:
/// ABP'nin metot doğrulayıcısı <c>null</c> argümanı reddediyor ve dekont İSTEĞE BAĞLI —
/// elinde dekont olmayan (ör. otomatik ödeme talimatı) müşteri de bildirebilmeli.
/// </summary>
public class DeclarePaymentDto : RecordPaymentDto
{
    public BillingFileInput? Receipt { get; set; }
}

/// <summary>Host listesinin süzgeci.</summary>
public class SubscriptionInvoiceFilterDto : PagedResultRequestDto
{
    public Guid? TenantId { get; set; }

    public SubscriptionInvoiceStatus? Status { get; set; }

    /// <summary>Yalnız vadesi geçmiş, kapanmamış faturalar.</summary>
    public bool OnlyOverdue { get; set; }

    /// <summary>Yalnız kiracının onay bekleyen dekont bildirimi olanlar.</summary>
    public bool OnlyPendingDeclaration { get; set; }

    /// <summary>Fatura numarası, resmî numara veya kiracı adında geçen metin.</summary>
    public string? Filter { get; set; }
}

/// <summary>Panel başlığındaki rozetler.</summary>
public class BillingSummaryDto
{
    public int IssuedCount { get; set; }
    public int PartiallyPaidCount { get; set; }
    public int PaidCount { get; set; }
    public int OverdueCount { get; set; }
    public int PendingDeclarationCount { get; set; }

    /// <summary>Tahsil edilmemiş toplam (TL) — iptaller hariç.</summary>
    public decimal OutstandingAmount { get; set; }
}

/// <summary>Yüklenen dosyanın Web sınırından gelen tanımı.</summary>
public class BillingFileInput
{
    public string FileName { get; set; } = string.Empty;

    public string StoredFileName { get; set; } = string.Empty;

    public long FileSize { get; set; }
}
