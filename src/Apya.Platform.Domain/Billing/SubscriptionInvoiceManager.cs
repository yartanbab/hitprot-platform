using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Timing;

namespace Apya.Platform.Billing;

/// <summary>
/// Fatura iş kuralları: numara üretimi ve faturanın açılması. Durum hesabı entity'nin
/// kendisindedir (tahsilatlardan türetilir), buraya taşınmaz.
/// </summary>
public class SubscriptionInvoiceManager : DomainService
{
    private readonly IRepository<SubscriptionInvoice, Guid> _repository;
    private readonly IClock _clock;

    public SubscriptionInvoiceManager(
        IRepository<SubscriptionInvoice, Guid> repository,
        IClock clock)
    {
        _repository = repository;
        _clock = clock;
    }

    /// <summary>
    /// Yeni fatura açar. <paramref name="dueDate"/> verilmezse protokol Madde 5.1'e göre
    /// fatura tarihi + 15 takvim günü.
    /// </summary>
    public async Task<SubscriptionInvoice> IssueAsync(
        Guid tenantId,
        Guid? agreementId,
        SubscriptionInvoiceType type,
        DateTime issueDate,
        decimal netAmount,
        VatMode vatMode,
        decimal vatRate,
        string? notes = null,
        DateTime? dueDate = null)
    {
        var invoice = new SubscriptionInvoice(
            GuidGenerator.Create(),
            tenantId,
            agreementId,
            await GenerateNumberAsync(issueDate),
            type,
            issueDate,
            dueDate ?? issueDate.AddDays(BillingConsts.DefaultDueDays),
            netAmount,
            vatMode,
            vatRate,
            notes);

        return await _repository.InsertAsync(invoice, autoSave: true);
    }

    /// <summary>
    /// "APYA-FTR-2026-0001" — yıl içinde sıralı. Sayaç o yılın kayıt sayısından türetilir;
    /// numarada TEKİL indeks var, aynı anda iki fatura açılırsa ikincisi veritabanı
    /// tarafından reddedilir ve sessizce mükerrer numara üretilmez.
    /// <para>
    /// Bu numara İÇ referanstır; resmî fatura numarası e-fatura sisteminden gelir ve
    /// <see cref="SubscriptionInvoice.OfficialNumber"/> alanına elle girilir.
    /// </para>
    /// </summary>
    private async Task<string> GenerateNumberAsync(DateTime issueDate)
    {
        var year = issueDate.Year;
        var query = await _repository.GetQueryableAsync();

        var countThisYear = await AsyncExecuter.CountAsync(query.Where(i => i.IssueDate.Year == year));

        return $"{BillingConsts.NumberPrefix}{year}-{(countThisYear + 1).ToString("D4", CultureInfo.InvariantCulture)}";
    }
}
