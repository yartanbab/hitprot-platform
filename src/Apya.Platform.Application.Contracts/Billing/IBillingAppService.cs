using System;
using System.Threading.Tasks;
using Apya.Platform.Billing.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Billing;

/// <summary>
/// Host tarafı faturalama: fatura açma, resmî belgeyi ekleme, tahsilat kaydetme/onaylama.
///
/// <para>Kayıtlar host seviyesindedir (<c>IMultiTenant</c> DEĞİL) — sözleşme gibi, bu da
/// PARGETTO ile kiracı arasındadır. Kiracı kendi faturalarını <see cref="IMyBillingAppService"/>
/// üzerinden okur.</para>
/// </summary>
public interface IBillingAppService : IApplicationService
{
    Task<PagedResultDto<SubscriptionInvoiceDto>> GetListAsync(SubscriptionInvoiceFilterDto input);

    Task<SubscriptionInvoiceDto> GetAsync(Guid id);

    Task<BillingSummaryDto> GetSummaryAsync();

    Task<SubscriptionInvoiceDto> CreateAsync(CreateSubscriptionInvoiceDto input);

    Task<SubscriptionInvoiceDto> UpdateAsync(Guid id, UpdateSubscriptionInvoiceDto input);

    /// <summary>Resmî e-fatura belgesini ekler; öncekinin yerini alır.</summary>
    Task<SubscriptionInvoiceDto> AttachDocumentAsync(Guid id, BillingFileInput file);

    /// <summary>Host'un kaydettiği tahsilat DOĞRUDAN onaylı doğar (ekstreye bakarak giriliyor).</summary>
    Task<SubscriptionInvoiceDto> RecordPaymentAsync(Guid id, RecordPaymentDto input);

    /// <summary>Kiracının dekont beyanını onaylar; ancak onaydan sonra tutara sayılır.</summary>
    Task<SubscriptionInvoiceDto> ConfirmPaymentAsync(Guid id, Guid paymentId);

    /// <summary>Yanlış girilen tahsilatı siler.</summary>
    Task<SubscriptionInvoiceDto> RemovePaymentAsync(Guid id, Guid paymentId);

    /// <summary>Faturayı iptal eder. Onaylı tahsilatı olan fatura iptal EDİLEMEZ.</summary>
    Task<SubscriptionInvoiceDto> CancelAsync(Guid id);

    /// <summary>
    /// Fatura belgesinin DİSKTEKİ adı; belge yoksa <c>null</c>.
    /// <para>
    /// Bu ad DTO'da taşınmaz: listeye konsaydı her satırda istemciye gider ve dosya
    /// adları tahmin edilebilir bir dizine işaret ederdi. İndirme anında ayrıca okunur.
    /// </para>
    /// </summary>
    Task<string?> GetStoredDocumentNameAsync(Guid id);

    /// <summary>Dekontun diskteki adı; yoksa <c>null</c>.</summary>
    Task<string?> GetStoredReceiptNameAsync(Guid id, Guid paymentId);
}
