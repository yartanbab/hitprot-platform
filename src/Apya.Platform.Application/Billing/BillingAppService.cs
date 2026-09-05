using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Billing.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;

namespace Apya.Platform.Billing;

/// <summary>
/// Host tarafı faturalama.
///
/// <para><c>RemoteService(false)</c>: tüm yüzey Razor sayfalarından kullanılıyor ve
/// yüklenen dosyalar Web sınırında doğrulanıyor. Açık bir HTTP ucu, bu servisi ayrı bir
/// saldırı yüzeyi hâline getirir ve karşılığı olan bir istemci yok.</para>
/// </summary>
[RemoteService(false)]
[Authorize(PlatformPermissions.Billing.Default)]
public class BillingAppService : PlatformAppService, IBillingAppService
{
    private readonly IRepository<SubscriptionInvoice, Guid> _repository;
    private readonly SubscriptionInvoiceManager _invoiceManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly IClock _clock;

    public BillingAppService(
        IRepository<SubscriptionInvoice, Guid> repository,
        SubscriptionInvoiceManager invoiceManager,
        ITenantRepository tenantRepository,
        IClock clock)
    {
        _repository = repository;
        _invoiceManager = invoiceManager;
        _tenantRepository = tenantRepository;
        _clock = clock;
    }

    public async Task<PagedResultDto<SubscriptionInvoiceDto>> GetListAsync(SubscriptionInvoiceFilterDto input)
    {
        var query = await GetQueryWithPaymentsAsync();

        if (input.TenantId.HasValue)
        {
            query = query.Where(i => i.TenantId == input.TenantId.Value);
        }

        if (input.Status.HasValue)
        {
            query = query.Where(i => i.Status == input.Status.Value);
        }

        if (!input.Filter.IsNullOrWhiteSpace())
        {
            var filter = input.Filter!.Trim();
            query = query.Where(i => i.Number.Contains(filter) || (i.OfficialNumber != null && i.OfficialNumber.Contains(filter)));
        }

        if (input.OnlyOverdue)
        {
            // Vade karşılaştırması VERİTABANINDA yapılır; belleğe çekip süzmek sayfalamayı
            // bozar (toplam sayı yanlış çıkar).
            var today = _clock.Now.Date;
            query = query.Where(i =>
                (i.Status == SubscriptionInvoiceStatus.Issued || i.Status == SubscriptionInvoiceStatus.PartiallyPaid)
                && i.DueDate < today);
        }

        if (input.OnlyPendingDeclaration)
        {
            query = query.Where(i => i.Payments.Any(p => p.ConfirmedAt == null));
        }

        var totalCount = await AsyncExecuter.CountAsync(query);

        var items = await AsyncExecuter.ToListAsync(
            query.OrderByDescending(i => i.IssueDate).ThenByDescending(i => i.CreationTime)
                 .Skip(input.SkipCount)
                 .Take(input.MaxResultCount));

        return new PagedResultDto<SubscriptionInvoiceDto>(totalCount, await MapListAsync(items));
    }

    public async Task<SubscriptionInvoiceDto> GetAsync(Guid id)
        => await MapAsync(await GetWithPaymentsAsync(id));

    public async Task<BillingSummaryDto> GetSummaryAsync()
    {
        var query = await GetQueryWithPaymentsAsync();
        var today = _clock.Now.Date;

        var open = await AsyncExecuter.ToListAsync(
            query.Where(i => i.Status != SubscriptionInvoiceStatus.Cancelled));

        return new BillingSummaryDto
        {
            IssuedCount = open.Count(i => i.Status == SubscriptionInvoiceStatus.Issued),
            PartiallyPaidCount = open.Count(i => i.Status == SubscriptionInvoiceStatus.PartiallyPaid),
            PaidCount = open.Count(i => i.Status == SubscriptionInvoiceStatus.Paid),
            OverdueCount = open.Count(i => i.IsOverdue(_clock.Now)),
            PendingDeclarationCount = open.Count(i => i.HasPendingDeclaration),
            OutstandingAmount = open
                .Where(i => i.Status != SubscriptionInvoiceStatus.Paid)
                .Sum(i => i.RemainingAmount)
        };
    }

    [Authorize(PlatformPermissions.Billing.Manage)]
    public async Task<SubscriptionInvoiceDto> CreateAsync(CreateSubscriptionInvoiceDto input)
    {
        // Zorunlu değer tipleri DTO'da nullable: mesajı kendimiz veriyoruz.
        Check.NotNull(input.TenantId, nameof(input.TenantId));
        Check.NotNull(input.IssueDate, nameof(input.IssueDate));

        var invoice = await _invoiceManager.IssueAsync(
            input.TenantId!.Value,
            agreementId: null,
            input.Type,
            input.IssueDate!.Value.Date,
            input.NetAmount,
            input.VatMode,
            input.VatRate,
            TrimToNull(input.Notes),
            input.DueDate?.Date);

        if (!input.OfficialNumber.IsNullOrWhiteSpace())
        {
            invoice.SetOfficialNumber(input.OfficialNumber!.Trim());
            await _repository.UpdateAsync(invoice, autoSave: true);
        }

        return await MapAsync(invoice);
    }

    [Authorize(PlatformPermissions.Billing.Manage)]
    public async Task<SubscriptionInvoiceDto> UpdateAsync(Guid id, UpdateSubscriptionInvoiceDto input)
    {
        Check.NotNull(input.DueDate, nameof(input.DueDate));

        var invoice = await GetWithPaymentsAsync(id);

        invoice.SetOfficialNumber(TrimToNull(input.OfficialNumber));
        invoice.SetDueDate(input.DueDate!.Value.Date);
        invoice.SetNotes(TrimToNull(input.Notes));

        await _repository.UpdateAsync(invoice, autoSave: true);

        return await MapAsync(invoice);
    }

    [Authorize(PlatformPermissions.Billing.Manage)]
    public async Task<SubscriptionInvoiceDto> AttachDocumentAsync(Guid id, BillingFileInput file)
    {
        var invoice = await GetWithPaymentsAsync(id);

        invoice.AttachDocument(file.FileName, file.StoredFileName, file.FileSize);
        await _repository.UpdateAsync(invoice, autoSave: true);

        return await MapAsync(invoice);
    }

    [Authorize(PlatformPermissions.Billing.Manage)]
    public async Task<SubscriptionInvoiceDto> RecordPaymentAsync(Guid id, RecordPaymentDto input)
    {
        Check.NotNull(input.PaidAt, nameof(input.PaidAt));

        var invoice = await GetWithPaymentsAsync(id);

        var payment = new SubscriptionPayment(
            GuidGenerator.Create(),
            invoice.Id,
            input.PaidAt!.Value.Date,
            input.Amount,
            input.Method,
            TrimToNull(input.Reference),
            declaredByTenant: false);

        // Host ekstreye bakarak giriyor: kendi kaydı doğrudan onaylı doğar, yoksa
        // kendi girdiğini bir de onaylaması gerekirdi.
        payment.Confirm(CurrentUser.Id, _clock.Now);

        invoice.AddPayment(payment);
        await _repository.UpdateAsync(invoice, autoSave: true);

        return await MapAsync(invoice);
    }

    [Authorize(PlatformPermissions.Billing.Manage)]
    public async Task<SubscriptionInvoiceDto> ConfirmPaymentAsync(Guid id, Guid paymentId)
    {
        var invoice = await GetWithPaymentsAsync(id);

        invoice.ConfirmPayment(paymentId, CurrentUser.Id, _clock.Now);
        await _repository.UpdateAsync(invoice, autoSave: true);

        return await MapAsync(invoice);
    }

    [Authorize(PlatformPermissions.Billing.Manage)]
    public async Task<SubscriptionInvoiceDto> RemovePaymentAsync(Guid id, Guid paymentId)
    {
        var invoice = await GetWithPaymentsAsync(id);

        invoice.RemovePayment(paymentId);
        await _repository.UpdateAsync(invoice, autoSave: true);

        return await MapAsync(invoice);
    }

    [Authorize(PlatformPermissions.Billing.Manage)]
    public async Task<SubscriptionInvoiceDto> CancelAsync(Guid id)
    {
        var invoice = await GetWithPaymentsAsync(id);

        invoice.Cancel();
        await _repository.UpdateAsync(invoice, autoSave: true);

        return await MapAsync(invoice);
    }

    public async Task<string?> GetStoredDocumentNameAsync(Guid id)
        => (await GetWithPaymentsAsync(id)).StoredFileName;

    public async Task<string?> GetStoredReceiptNameAsync(Guid id, Guid paymentId)
        => (await GetWithPaymentsAsync(id)).Payments.FirstOrDefault(p => p.Id == paymentId)?.StoredFileName;

    // --- Yardımcılar ---

    /// <summary>
    /// 🔴 Tahsilatlar AÇIKÇA include edilir. <c>includeDetails</c> tek başına hiçbir şey
    /// yapmaz (<c>DefaultWithDetailsFunc</c> tanımlı değilse koleksiyon BOŞ gelir) ve
    /// tutar hesapları sessizce sıfırlanırdı.
    /// </summary>
    private async Task<IQueryable<SubscriptionInvoice>> GetQueryWithPaymentsAsync()
        => (await _repository.GetQueryableAsync()).Include(i => i.Payments);

    private async Task<SubscriptionInvoice> GetWithPaymentsAsync(Guid id)
    {
        var query = await GetQueryWithPaymentsAsync();

        return await AsyncExecuter.FirstOrDefaultAsync(query.Where(i => i.Id == id))
               ?? throw new EntityNotFoundException(typeof(SubscriptionInvoice), id);
    }

    private async Task<SubscriptionInvoiceDto> MapAsync(SubscriptionInvoice invoice)
        => (await MapListAsync(new List<SubscriptionInvoice> { invoice }))[0];

    /// <summary>
    /// Kiracı adları TEK sorguda çözülür. Satır başına <c>FindByIdAsync</c> çağırmak,
    /// yirmi beş satırlık bir sayfada yirmi beş ek gidiş-geliş demekti.
    /// </summary>
    private async Task<List<SubscriptionInvoiceDto>> MapListAsync(List<SubscriptionInvoice> invoices)
    {
        var tenantIds = invoices.Select(i => i.TenantId).Distinct().ToList();
        var tenants = await _tenantRepository.GetListAsync();
        var nameById = tenants.Where(t => tenantIds.Contains(t.Id)).ToDictionary(t => t.Id, t => t.Name);

        return invoices.Select(i => ToDto(i, nameById.GetValueOrDefault(i.TenantId, "—"), _clock.Now)).ToList();
    }

    internal static SubscriptionInvoiceDto ToDto(SubscriptionInvoice invoice, string tenantName, DateTime now)
        => new()
        {
            Id = invoice.Id,
            TenantId = invoice.TenantId,
            TenantName = tenantName,
            Number = invoice.Number,
            OfficialNumber = invoice.OfficialNumber,
            Type = invoice.Type,
            IssueDate = invoice.IssueDate,
            DueDate = invoice.DueDate,
            NetAmount = invoice.NetAmount,
            VatMode = invoice.VatMode,
            VatRate = invoice.VatRate,
            VatAmount = invoice.VatAmount,
            TotalAmount = invoice.TotalAmount,
            PaidAmount = invoice.PaidAmount,
            RemainingAmount = invoice.RemainingAmount,
            Status = invoice.Status,
            IsOverdue = invoice.IsOverdue(now),
            HasPendingDeclaration = invoice.HasPendingDeclaration,
            Notes = invoice.Notes,
            FileName = invoice.FileName,
            CreationTime = invoice.CreationTime,
            Payments = invoice.Payments
                .OrderByDescending(p => p.PaidAt)
                .Select(p => new SubscriptionPaymentDto
                {
                    Id = p.Id,
                    PaidAt = p.PaidAt,
                    Amount = p.Amount,
                    Method = p.Method,
                    Reference = p.Reference,
                    FileName = p.FileName,
                    DeclaredByTenant = p.DeclaredByTenant,
                    IsConfirmed = p.IsConfirmed,
                    ConfirmedAt = p.ConfirmedAt
                })
                .ToList()
        };

    private static string? TrimToNull(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
