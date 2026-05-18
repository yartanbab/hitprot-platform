using System;
using System.Collections.Generic;

namespace Apya.Platform.Reports;

public class TrialBalanceLineDto
{
    public string GroupCode { get; set; } = null!;
    public string GroupName { get; set; } = null!;
    public decimal Debit { get; set; }
    public decimal Credit { get; set; }
    /// <summary>Borç − Alacak (pozitif → borç bakiye, negatif → alacak bakiye).</summary>
    public decimal Balance => Debit - Credit;
}

public class TrialBalanceReportDto
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public List<TrialBalanceLineDto> Lines { get; set; } = new();
    public decimal TotalDebit { get; set; }
    public decimal TotalCredit { get; set; }

    /// <summary>
    /// Bu YÖNETİM (özet) mizanıdır — tam çift taraflı THP kaydı değildir, denge garantisi yoktur.
    /// Resmi Tek Düzen Hesap Planı mizanı ayrı bir faz (mali müşavir girdisiyle).
    /// </summary>
    public string Disclaimer { get; set; } =
        "Yönetim özet mizanı — resmi THP mizanı değildir, borç/alacak dengesi garanti edilmez.";
}

public class GetTrialBalanceInput
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
