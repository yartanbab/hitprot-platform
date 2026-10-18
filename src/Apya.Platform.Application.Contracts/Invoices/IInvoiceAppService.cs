using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Apya.Platform.Invoices.Dtos;

namespace Apya.Platform.Invoices;

public interface IInvoiceAppService : IApplicationService
{
    Task<PagedResultDto<InvoiceDto>> GetListAsync(GetInvoicesInput input);
    Task<InvoiceDto> GetAsync(Guid id);
    Task<InvoiceDto> CreateAsync(CreateInvoiceDto input);
    Task AddPaymentAsync(Guid invoiceId, decimal amount, string method, string reference, Guid? cashAccountId = null);
    Task<List<PaymentDto>> GetPaymentsAsync(Guid invoiceId);
    Task<ListResultDto<ProjectLookupDto>> GetProjectLookupAsync();
    Task<ListResultDto<CustomerLookupDto>> GetCustomerLookupAsync();

    /// <summary>
    /// FIN-05 · Alış faturasının karşılığı olan gider kaydı var mı? Satış faturasında ve gider
    /// görme izni olmayan kullanıcıda uyarı çıkmaz.
    /// </summary>
    Task<FinanceCrossCheckDto> GetExpenseCrossCheckAsync(Guid id);
}

public class PaymentDto : FullAuditedEntityDto<Guid>
{
    public Guid InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = null!;
    public string? ReferenceNumber { get; set; }
    public Guid? CashAccountId { get; set; }
}
