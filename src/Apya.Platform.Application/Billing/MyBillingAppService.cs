using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Billing.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;

namespace Apya.Platform.Billing;

/// <summary>
/// Kiracının kendi faturaları. Salt okunur + dekont bildirimi.
///
/// <para>🔴 <b>Fatura host kaydıdır — ABP'nin kiracı filtresi bu sorguları KORUMAZ.</b>
/// Her metot <c>CurrentTenant.Id</c> ile eşleştirmeyi ELLE yapar. Filtreye güvenmek bir
/// kiracıya başkasının faturasını ve dekontunu açardı.</para>
/// </summary>
[RemoteService(false)]
[Authorize(PlatformPermissions.TenantSettings.Default)]
public class MyBillingAppService : PlatformAppService, IMyBillingAppService
{
    private readonly IRepository<SubscriptionInvoice, Guid> _repository;
    private readonly IClock _clock;

    public MyBillingAppService(
        IRepository<SubscriptionInvoice, Guid> repository,
        IClock clock)
    {
        _repository = repository;
        _clock = clock;
    }

    public async Task<List<SubscriptionInvoiceDto>> GetListAsync()
    {
        var tenantId = RequireTenant();
        var query = (await _repository.GetQueryableAsync()).Include(i => i.Payments);

        var invoices = await AsyncExecuter.ToListAsync(
            query.Where(i => i.TenantId == tenantId)
                 .OrderByDescending(i => i.IssueDate)
                 .ThenByDescending(i => i.CreationTime));

        // Kiracı adı burada gereksiz: müşteri kendi ekranında kendi adını okumaz.
        return invoices.Select(i => BillingAppService.ToDto(i, string.Empty, _clock.Now)).ToList();
    }

    public async Task<SubscriptionInvoiceDto> GetAsync(Guid id)
        => BillingAppService.ToDto(await GetOwnInvoiceAsync(id), string.Empty, _clock.Now);

    public async Task<SubscriptionInvoiceDto> DeclarePaymentAsync(Guid id, DeclarePaymentDto input)
    {
        Check.NotNull(input.PaidAt, nameof(input.PaidAt));

        var invoice = await GetOwnInvoiceAsync(id);

        var payment = new SubscriptionPayment(
            GuidGenerator.Create(),
            invoice.Id,
            input.PaidAt!.Value.Date,
            input.Amount,
            input.Method,
            string.IsNullOrWhiteSpace(input.Reference) ? null : input.Reference.Trim(),
            declaredByTenant: true);

        if (input.Receipt != null)
        {
            payment.AttachReceipt(input.Receipt.FileName, input.Receipt.StoredFileName, input.Receipt.FileSize);
        }

        // ONAYLANMADAN eklenir: müşterinin beyanı tek başına tahsilat değildir, fatura
        // host ekstreyle karşılaştırıp onaylayana kadar açık kalır.
        invoice.AddPayment(payment);
        await _repository.UpdateAsync(invoice, autoSave: true);

        return BillingAppService.ToDto(invoice, string.Empty, _clock.Now);
    }

    public async Task<string?> ResolveInvoiceDocumentAsync(Guid id)
        => (await GetOwnInvoiceAsync(id)).StoredFileName;

    /// <summary>
    /// Faturayı getirir ve ÇAĞIRAN KİRACIYA ait olduğunu doğrular. Başkasının faturası
    /// istendiğinde "bulunamadı" denir — hangi id'lerin var olduğu sızdırılmaz.
    /// </summary>
    private async Task<SubscriptionInvoice> GetOwnInvoiceAsync(Guid id)
    {
        var tenantId = RequireTenant();
        var query = (await _repository.GetQueryableAsync()).Include(i => i.Payments);

        return await AsyncExecuter.FirstOrDefaultAsync(query.Where(i => i.Id == id && i.TenantId == tenantId))
               ?? throw new EntityNotFoundException(typeof(SubscriptionInvoice), id);
    }

    /// <summary>Host bağlamında "benim faturam" diye bir şey yok.</summary>
    private Guid RequireTenant()
        => CurrentTenant.Id ?? throw new EntityNotFoundException(typeof(SubscriptionInvoice), Guid.Empty);
}
