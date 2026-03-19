using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Invoices;

public class Payment : FullAuditedEntity<Guid>
{
    public Guid InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } // Örn: Havale, Kredi Kartı
    public string ReferenceNumber { get; set; }

    public Payment() { }

    public Payment(Guid id, Guid invoiceId, decimal amount, DateTime paymentDate, string method) : base(id)
    {
        InvoiceId = invoiceId;
        Amount = amount;
        PaymentDate = paymentDate;
        PaymentMethod = method;
    }
}
