using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Apya.Platform.Invoices.Dtos;

namespace Apya.Platform.Invoices;

public interface IInvoiceAppService : IApplicationService
{
    Task<PagedResultDto<InvoiceDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    Task<InvoiceDto> GetAsync(Guid id);
    Task<InvoiceDto> CreateAsync(CreateInvoiceDto input);
    Task AddPaymentAsync(Guid invoiceId, decimal amount, string method, string reference);
    Task<List<PaymentDto>> GetPaymentsAsync(Guid invoiceId);
}

public class PaymentDto : FullAuditedEntityDto<Guid>
{
    public Guid InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; }
    public string ReferenceNumber { get; set; }
}
