namespace Apya.Platform.Invoices;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.CustomerLedger;
using Apya.Platform.ExchangeRates;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

/// <summary>
/// InvoiceManager — Fatura aggregate'i üzerindeki durum değiştiren işlemlerin TEK kapısı.
/// <para>
/// CreateAsync: Fatura + kalemleri oluşturur, fatura tahakkukunu (CustomerLedgerEntry) kaydeder.
/// RecordPaymentAsync: Ödemeyi kaydeder, kasa hareketi ve cari tahakkukunu oluşturur,
/// fatura durumunu (Sent/Paid) günceller.
/// </para>
/// <para>
/// Bu sınıf domain service olarak tüm cross-aggregate koordinasyonu üstlenir;
/// InvoiceAppService sadece orchestration (okuma + devir) yapar.
/// </para>
/// </summary>
public class InvoiceManager : DomainService
{
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Payment, Guid> _paymentRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<ExchangeRate, Guid> _exchangeRateRepository;
    private readonly IRepository<CustomerLedgerEntry, Guid> _customerLedgerRepository;

    public InvoiceManager(
        IRepository<Invoice, Guid> invoiceRepository,
        IRepository<Payment, Guid> paymentRepository,
        IRepository<CashAccount, Guid> cashAccountRepository,
        IRepository<CashMovement, Guid> cashMovementRepository,
        IRepository<ExchangeRate, Guid> exchangeRateRepository,
        IRepository<CustomerLedgerEntry, Guid> customerLedgerRepository)
    {
        _invoiceRepository = invoiceRepository;
        _paymentRepository = paymentRepository;
        _cashAccountRepository = cashAccountRepository;
        _cashMovementRepository = cashMovementRepository;
        _exchangeRateRepository = exchangeRateRepository;
        _customerLedgerRepository = customerLedgerRepository;
    }

    // ======================== Commands ========================

    /// <summary>
    /// Yeni fatura ve kalemleri oluşturur; müşteri varsa fatura tahakkukunu cari'ye yazar.
    /// </summary>
    public async Task<Invoice> CreateAsync(
        Guid projectId,
        string invoiceNumber,
        DateTime invoiceDate,
        DateTime dueDate,
        decimal taxRate,
        string currency,
        InvoiceDirection direction,
        Guid? customerId,
        Guid? taskId,
        IReadOnlyList<InvoiceItemDescriptor> items,
        string? notes = null)
    {
        var invoice = new Invoice(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            projectId,
            invoiceNumber,
            invoiceDate,
            dueDate,
            taxRate,
            currency,
            direction,
            customerId,
            taskId);

        invoice.SetNotes(notes);

        foreach (var item in items)
        {
            invoice.AddItem(GuidGenerator.Create(), item.Description, item.Quantity, item.UnitPrice);
        }

        await _invoiceRepository.InsertAsync(invoice, autoSave: true);

        // APYA-142c: Fatura tahakkuku — Satış: Borç (müşteri bize borçlanır),
        // Alış: Alacak (biz tedarikçiye borçlanırız).
        if (customerId.HasValue && invoice.TotalAmount > 0)
        {
            var isSales = direction == InvoiceDirection.Sales;
            await _customerLedgerRepository.InsertAsync(new CustomerLedgerEntry(
                GuidGenerator.Create(),
                customerId.Value,
                isSales ? CustomerLedgerDirection.Debit : CustomerLedgerDirection.Credit,
                invoice.TotalAmount,
                invoice.InvoiceDate,
                CustomerLedgerSource.Invoice,
                invoice.Currency,
                invoice.Id,
                invoice.ProjectId,
                (isSales ? "Satış faturası: " : "Alış faturası: ") + invoice.InvoiceNumber,
                CurrentTenant.Id), autoSave: true);
        }

        return invoice;
    }

    /// <summary>
    /// Fatura için ödeme kaydeder. İlgili kasa hareketi ve cari tahakkukunu oluşturur.
    /// Fatura durumu toplam ödemeye göre güncellenir (Sent → Paid).
    /// <para>
    /// ARCH-009: Idempotent. Boş olmayan <paramref name="reference"/> ile retry geldiğinde
    /// mevcut Payment'i bulup yeniden side-effect üretmeden döner. DB unique index (partial,
    /// reference &lt;&gt; '') belt-and-suspenders olarak race-window'u kapatır — nadir yarış
    /// durumunda <see cref="Microsoft.EntityFrameworkCore.DbUpdateException"/> UoW'u abort
    /// eder ve HTTP client retry edebilir (yeni pre-check duplicate'i yakalar).
    /// </para>
    /// </summary>
    public async Task RecordPaymentAsync(
        Guid invoiceId,
        decimal amount,
        string paymentMethod,
        string reference,
        Guid? cashAccountId)
    {
        // CORR-001: Sıfır/negatif ödeme tutarı geçersiz — yan etkiler zaten amount>0 ile korunuyordu
        // ama Payment satırı yine de oluşup payments.Sum'ı (fatura durumunu) kirletiyordu.
        // (Aşırı ödeme kasıtlı olabilir — avans/kısmi — o bilinçli olarak engellenmiyor.)
        if (amount <= 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.PaymentAmountInvalid);
        }

        var invoice = await _invoiceRepository.GetAsync(invoiceId);
        var isSales = invoice.Direction == InvoiceDirection.Sales;

        // Idempotency pre-check. Original successful call'un side-effect'leri (CashMovement,
        // CustomerLedgerEntry, Invoice.Status) zaten persist edilmiş — sessizce return ile
        // caller'a aynı sonucu sunuyoruz. Boş reference = manuel giriş, idempotency dışı.
        // (GetListAsync kullanılır çünkü FirstOrDefaultAsync(predicate) bir extension method
        //  ve unit testlerde mock edilemiyor. Unique index sayesinde en fazla 1 row döner.)
        if (!string.IsNullOrWhiteSpace(reference))
        {
            var duplicates = await _paymentRepository.GetListAsync(
                p => p.InvoiceId == invoiceId && p.ReferenceNumber == reference);
            if (duplicates.Count > 0)
            {
                return;
            }
        }

        var payment = new Payment(GuidGenerator.Create(), invoiceId, amount, Clock.Now, paymentMethod)
        {
            ReferenceNumber = reference,
            CashAccountId = cashAccountId
        };
        await _paymentRepository.InsertAsync(payment, autoSave: true);

        // APYA-136: Kasa hareketi
        if (cashAccountId.HasValue && amount > 0)
        {
            await CreateCashMovementAsync(invoice, payment, cashAccountId.Value, amount, isSales);
        }

        // APYA-142c: Ödeme → cari tahakkuku (ters yön — borcu kapatır)
        if (invoice.CustomerId.HasValue && amount > 0)
        {
            await CreateCustomerLedgerEntryAsync(invoice, payment, amount, isSales);
        }

        var payments = await _paymentRepository.GetListAsync(p => p.InvoiceId == invoiceId);
        invoice.UpdateStatus(payments.Sum(p => p.Amount));
        await _invoiceRepository.UpdateAsync(invoice);
    }

    // ======================== Private Helpers ========================

    private async Task CreateCashMovementAsync(
        Invoice invoice,
        Payment payment,
        Guid cashAccountId,
        decimal amount,
        bool isSales)
    {
        var cash = await _cashAccountRepository.GetAsync(cashAccountId);

        decimal? rate = null;
        if (!string.Equals(invoice.Currency.Trim(), cash.Currency.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            // ARCH-012: DB-side ordering + LIMIT 1. Önceki kod tüm tarihli kur kayıtlarını
            // bellek-içine yüklüyor sonra client-side sort yapıyordu — TCMB yıllarca veri
            // birikince (1000+ row her currency pair için) latency + bellek darboğazı.
            // PlatformDbContext'teki composite index (TenantId, FromCurrency, ToCurrency, RateDate)
            // DB engine'in backward scan ile tek-row lookup yapmasını sağlar.
            var query = await _exchangeRateRepository.GetQueryableAsync();
            var er = await AsyncExecuter.FirstOrDefaultAsync(
                query.Where(x => x.FromCurrency == invoice.Currency && x.ToCurrency == cash.Currency)
                     .OrderByDescending(x => x.RateDate));
            rate = er?.Rate;
        }

        var cashAmount = PaymentCashConverter.ToCashCurrency(amount, invoice.Currency, cash.Currency, rate);

        await _cashMovementRepository.InsertAsync(new CashMovement(
            GuidGenerator.Create(),
            cashAccountId,
            isSales ? CashMovementDirection.In : CashMovementDirection.Out,
            cashAmount,
            Clock.Now,
            (isSales ? "Fatura tahsilatı: " : "Tedarikçi ödemesi: ") + invoice.InvoiceNumber,
            CashMovementSource.Invoice,
            payment.Id,
            CurrentTenant.Id), autoSave: true);
    }

    private async Task CreateCustomerLedgerEntryAsync(
        Invoice invoice,
        Payment payment,
        decimal amount,
        bool isSales)
    {
        await _customerLedgerRepository.InsertAsync(new CustomerLedgerEntry(
            GuidGenerator.Create(),
            invoice.CustomerId!.Value,
            isSales ? CustomerLedgerDirection.Credit : CustomerLedgerDirection.Debit,
            amount,
            Clock.Now,
            CustomerLedgerSource.Payment,
            invoice.Currency,
            payment.Id,
            invoice.ProjectId,
            (isSales ? "Tahsilat: " : "Tedarikçi ödemesi: ") + invoice.InvoiceNumber,
            CurrentTenant.Id), autoSave: true);
    }
}
