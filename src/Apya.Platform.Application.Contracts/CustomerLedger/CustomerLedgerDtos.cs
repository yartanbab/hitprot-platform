using System;
using System.Collections.Generic;

namespace Apya.Platform.CustomerLedger;

public class CustomerStatementLineDto
{
    public Guid Id { get; set; }
    public DateTime EntryDate { get; set; }
    public CustomerLedgerSource Source { get; set; }
    public string? Description { get; set; }
    public string Currency { get; set; } = "TRY";
    /// <summary>Borç tutarı (Debit ise dolu).</summary>
    public decimal Debit { get; set; }
    /// <summary>Alacak tutarı (Credit ise dolu).</summary>
    public decimal Credit { get; set; }
    /// <summary>O satıra kadarki yürüyen bakiye.</summary>
    public decimal RunningBalance { get; set; }
    /// <summary>İlişkili fatura/tahsilat belge no'su (varsa) — Invoice.InvoiceNumber / Payment.ReferenceNumber.</summary>
    public string? DocumentNumber { get; set; }
}

public class CustomerStatementDto
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = null!;
    public decimal TotalDebit { get; set; }
    public decimal TotalCredit { get; set; }
    /// <summary>Net bakiye (Σ Borç − Σ Alacak). Pozitif → müşteri borçlu.</summary>
    public decimal Balance { get; set; }
    /// <summary>Vadesi geçmiş, henüz tam tahsil edilmemiş satış faturası tutarı (bugün itibarıyla).</summary>
    public decimal OverdueAmount { get; set; }
    public List<CustomerStatementLineDto> Lines { get; set; } = new();
}
