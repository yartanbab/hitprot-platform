using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Billing;

/// <summary>
/// Bir faturaya yapılan tahsilat.
///
/// <para><b>İki yoldan doğar:</b> host doğrudan kaydeder (banka ekstresine bakarak) ya da
/// kiracı dekontunu yükleyip "ödedim" der. İkincisi <see cref="IsConfirmed"/> <c>false</c>
/// başlar ve <b>tutara sayılmaz</b> — müşterinin beyanı tek başına tahsilat değildir;
/// host ekstreyle karşılaştırıp onaylar.</para>
///
/// <para><see cref="SubscriptionInvoice"/>'ın parçasıdır (aggregate root o); durum
/// hesabı hep fatura üzerinden yapılır.</para>
/// </summary>
public class SubscriptionPayment : FullAuditedEntity<Guid>
{
    public Guid InvoiceId { get; private set; }

    /// <summary>Ödemenin yapıldığı tarih (dekonttaki tarih, kaydın açıldığı tarih değil).</summary>
    public DateTime PaidAt { get; private set; }

    /// <summary>Tahsil edilen tutar (TL).</summary>
    public decimal Amount { get; private set; }

    public PaymentMethod Method { get; private set; }

    /// <summary>Dekont/işlem referansı — banka açıklaması, EFT numarası.</summary>
    public string? Reference { get; private set; }

    // --- Dekont dosyası ---

    public string? FileName { get; private set; }

    public string? StoredFileName { get; private set; }

    public long? FileSize { get; private set; }

    /// <summary>
    /// Kiracı mı bildirdi? <c>true</c> ise kayıt "ödedim" beyanıdır; host onaylayana kadar
    /// tahsilat sayılmaz. Host'un kendi kaydettiği ödeme doğrudan onaylı doğar.
    /// </summary>
    public bool DeclaredByTenant { get; private set; }

    public DateTime? ConfirmedAt { get; private set; }

    public Guid? ConfirmedBy { get; private set; }

    public bool IsConfirmed => ConfirmedAt.HasValue;

    protected SubscriptionPayment()
    {
    }

    public SubscriptionPayment(
        Guid id,
        Guid invoiceId,
        DateTime paidAt,
        decimal amount,
        PaymentMethod method,
        string? reference,
        bool declaredByTenant)
        : base(id)
    {
        if (amount <= 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.BillingAmountInvalid);
        }

        InvoiceId = invoiceId;
        PaidAt = paidAt;
        Amount = amount;
        Method = method;
        Reference = Truncate(reference, BillingConsts.MaxReferenceLength);
        DeclaredByTenant = declaredByTenant;
    }

    public void AttachReceipt(string fileName, string storedFileName, long fileSize)
    {
        FileName = Truncate(Check.NotNullOrWhiteSpace(fileName, nameof(fileName)), BillingConsts.MaxFileNameLength);
        StoredFileName = Check.NotNullOrWhiteSpace(storedFileName, nameof(storedFileName), BillingConsts.MaxStoredFileNameLength);
        FileSize = fileSize;
    }

    /// <summary>Host onayı. Tekrar çağrılırsa ilk onay anı KORUNUR.</summary>
    public void Confirm(Guid? confirmedBy, DateTime confirmedAt)
    {
        if (IsConfirmed)
        {
            return;
        }

        ConfirmedAt = confirmedAt;
        ConfirmedBy = confirmedBy;
    }

    private static string? Truncate(string? value, int max)
        => string.IsNullOrEmpty(value) || value.Length <= max ? value : value.Substring(0, max);
}
