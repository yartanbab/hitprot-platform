using System;
using Apya.Platform.Invoices;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Göreve bağlı tek bir fatura — FinanceTab özeti için.
    ///
    /// Gider/gelir satırlarından (<see cref="TaskFinanceLineDto"/>) ayrı bir tip:
    /// faturanın numarası, vadesi ve durumu var, tek "tutar + tarih" ikilisine
    /// sığmıyor. <c>TotalAmount</c> KDV DAHİLDİR (Invoice.RecalculateTotal).
    /// </summary>
    public class TaskInvoiceLineDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "TRY";
        public InvoiceStatus Status { get; set; }
        public InvoiceDirection Direction { get; set; }
    }
}
