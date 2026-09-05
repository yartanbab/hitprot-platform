using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Billing;

/// <summary>
/// PARGETTO'nun kiracıya kestiği faturanın TAKİP kaydı.
///
/// <para>🔴 <b>Kiracının kendi <c>Invoice</c>'ı DEĞİLDİR.</b> O entity <c>IMultiTenant</c>'tır,
/// zorunlu bir <c>ProjectId</c> ister ve kiracının kendi müşterilerine kestiği faturaları
/// tutar. Host'un geliri oraya yazılsaydı müşterinin muhasebe defterine bizim gelirimiz
/// düşerdi. Bu kayıt host seviyesindedir; kiracı kendi faturasını <see cref="TenantId"/>
/// üzerinden okur.</para>
///
/// <para><b>Resmî belge bu kayıt DEĞİL, ekindeki dosyadır.</b> Gerçek fatura e-fatura
/// sisteminde kesilir; burada tutulan şey tahsilat takibi ve müşteriye belgeyi ulaştırmaktır.
/// <see cref="Number"/> bizim iç referansımız, <see cref="OfficialNumber"/> e-faturadaki
/// numaradır ve elle girilir.</para>
///
/// <para>Tutarlar TL'dir; para birimi alanı bilerek yok (bkz. <see cref="BillingConsts"/>).</para>
///
/// <para><b>Soft-delete YOK</b> (<c>Audited</c>, <c>FullAudited</c> değil): mali belge
/// silinmez, <see cref="Cancel"/> ile iptal edilir. Yan faydası, numara üzerindeki tekil
/// indeksin filtresiz kalabilmesidir — soft-delete'li bir tabloda filtresiz UNIQUE, silinen
/// numarayı sonsuza dek rezerve eder; filtreli indeks ise ABP'nin parametreli sorgusuyla
/// okumada eşleşmez.</para>
/// </summary>
public class SubscriptionInvoice : AuditedAggregateRoot<Guid>
{
    public Guid TenantId { get; private set; }

    /// <summary>Bağlı olduğu hizmet protokolü. Protokolsüz kesilen fatura için <c>null</c>.</summary>
    public Guid? AgreementId { get; private set; }

    /// <summary>İç takip numarası — "APYA-FTR-2026-0001".</summary>
    public string Number { get; private set; }

    /// <summary>E-faturadaki resmî numara. Fatura kesilene kadar boştur.</summary>
    public string? OfficialNumber { get; private set; }

    public SubscriptionInvoiceType Type { get; private set; }

    public DateTime IssueDate { get; private set; }

    /// <summary>Vade. Varsayılanı protokol Madde 5.1: fatura + 15 takvim günü.</summary>
    public DateTime DueDate { get; private set; }

    /// <summary>KDV hariç tutar (TL).</summary>
    public decimal NetAmount { get; private set; }

    public VatMode VatMode { get; private set; }

    /// <summary>KDV oranı (%). İstisnada 0.</summary>
    public decimal VatRate { get; private set; }

    public SubscriptionInvoiceStatus Status { get; private set; }

    public string? Notes { get; private set; }

    // --- Yüklenen resmî belge ---

    /// <summary>Kullanıcının gördüğü özgün dosya adı.</summary>
    public string? FileName { get; private set; }

    /// <summary>Diskteki ad (GUID.uzantı). Dosya App_Data/uploads altındadır.</summary>
    public string? StoredFileName { get; private set; }

    public long? FileSize { get; private set; }

    public ICollection<SubscriptionPayment> Payments { get; private set; } = new List<SubscriptionPayment>();

    protected SubscriptionInvoice()
    {
        Number = string.Empty;
    }

    public SubscriptionInvoice(
        Guid id,
        Guid tenantId,
        Guid? agreementId,
        string number,
        SubscriptionInvoiceType type,
        DateTime issueDate,
        DateTime dueDate,
        decimal netAmount,
        VatMode vatMode,
        decimal vatRate,
        string? notes)
        : base(id)
    {
        TenantId = tenantId;
        AgreementId = agreementId;
        Number = Check.NotNullOrWhiteSpace(number, nameof(number), BillingConsts.MaxNumberLength);
        Type = type;
        IssueDate = issueDate;
        DueDate = dueDate;
        SetAmount(netAmount, vatMode, vatRate);
        Notes = Truncate(notes, BillingConsts.MaxNotesLength);
        Status = SubscriptionInvoiceStatus.Issued;
    }

    // --- Hesaplananlar (EF eşlemez: setter'ı yok) ---

    public decimal VatAmount => decimal.Round(NetAmount * VatRate / 100m, 2);

    public decimal TotalAmount => NetAmount + VatAmount;

    /// <summary>Onaylanmış tahsilatların toplamı. Onay bekleyen dekont SAYILMAZ.</summary>
    public decimal PaidAmount => Payments.Where(p => p.IsConfirmed).Sum(p => p.Amount);

    public decimal RemainingAmount => decimal.Round(TotalAmount - PaidAmount, 2);

    /// <summary>
    /// Vadesi geçti mi? Kolon DEĞİL, karşılaştırma — durum olarak saklansaydı her gün
    /// koşan bir işe bağımlı olurdu ve o iş bir gün koşmayınca liste yalan söylerdi.
    /// </summary>
    public bool IsOverdue(DateTime now)
        => Status is SubscriptionInvoiceStatus.Issued or SubscriptionInvoiceStatus.PartiallyPaid
           && DueDate.Date < now.Date;

    /// <summary>Kiracının onay bekleyen dekont bildirimi var mı?</summary>
    public bool HasPendingDeclaration => Payments.Any(p => !p.IsConfirmed);

    // --- Davranış ---

    public void SetAmount(decimal netAmount, VatMode vatMode, decimal vatRate)
    {
        if (netAmount < 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.BillingAmountInvalid);
        }

        NetAmount = netAmount;
        VatMode = vatMode;
        // İstisnada oran ZORLA sıfırlanır: "istisna ama %20" diye bir fatura olamaz ve
        // çağıranın iyi niyetine bırakmak, ekranda bir kutuyu unutunca yanlış tutar üretir.
        VatRate = vatMode == VatMode.TeknoparkExempt ? 0m : vatRate;
    }

    public void SetOfficialNumber(string? officialNumber)
    {
        OfficialNumber = Truncate(officialNumber, BillingConsts.MaxOfficialNumberLength);
    }

    public void SetNotes(string? notes)
    {
        Notes = Truncate(notes, BillingConsts.MaxNotesLength);
    }

    public void SetDueDate(DateTime dueDate)
    {
        DueDate = dueDate;
    }

    /// <summary>Resmî belgeyi ekler; öncekinin yerini alır.</summary>
    public void AttachDocument(string fileName, string storedFileName, long fileSize)
    {
        FileName = Truncate(Check.NotNullOrWhiteSpace(fileName, nameof(fileName)), BillingConsts.MaxFileNameLength);
        StoredFileName = Check.NotNullOrWhiteSpace(storedFileName, nameof(storedFileName), BillingConsts.MaxStoredFileNameLength);
        FileSize = fileSize;
    }

    /// <summary>
    /// Tahsilat ekler. <paramref name="confirmed"/> false ise bu, kiracının "ödedim"
    /// bildirimidir ve tutara SAYILMAZ — host onaylayana kadar fatura açık kalır.
    /// </summary>
    public SubscriptionPayment AddPayment(SubscriptionPayment payment)
    {
        if (Status == SubscriptionInvoiceStatus.Cancelled)
        {
            throw new BusinessException(PlatformDomainErrorCodes.BillingInvoiceCancelled);
        }

        Payments.Add(payment);
        RecalculateStatus();

        return payment;
    }

    public void ConfirmPayment(Guid paymentId, Guid? confirmedBy, DateTime confirmedAt)
    {
        var payment = Payments.FirstOrDefault(p => p.Id == paymentId)
                      ?? throw new BusinessException(PlatformDomainErrorCodes.BillingPaymentNotFound);

        payment.Confirm(confirmedBy, confirmedAt);
        RecalculateStatus();
    }

    public void RemovePayment(Guid paymentId)
    {
        var payment = Payments.FirstOrDefault(p => p.Id == paymentId)
                      ?? throw new BusinessException(PlatformDomainErrorCodes.BillingPaymentNotFound);

        Payments.Remove(payment);
        RecalculateStatus();
    }

    public void Cancel()
    {
        if (Payments.Any(p => p.IsConfirmed))
        {
            // Tahsil edilmiş bir faturayı iptal etmek, kasadaki parayı yok saymak olur.
            throw new BusinessException(PlatformDomainErrorCodes.BillingInvoiceHasPayment);
        }

        Status = SubscriptionInvoiceStatus.Cancelled;
    }

    /// <summary>
    /// Durum, onaylı tahsilatların toplamından TÜRETİLİR — elle set edilmez. Böylece
    /// "Ödendi" işaretli ama parası görünmeyen fatura oluşamaz.
    /// </summary>
    private void RecalculateStatus()
    {
        if (Status == SubscriptionInvoiceStatus.Cancelled)
        {
            return;
        }

        var paid = PaidAmount;

        Status = paid <= 0
            ? SubscriptionInvoiceStatus.Issued
            : paid >= TotalAmount
                ? SubscriptionInvoiceStatus.Paid
                : SubscriptionInvoiceStatus.PartiallyPaid;
    }

    private static string? Truncate(string? value, int max)
        => string.IsNullOrEmpty(value) || value.Length <= max ? value : value.Substring(0, max);
}
