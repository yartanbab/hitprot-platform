using System;
using System.IO;
using System.Linq;
using Apya.Platform.CustomerLedger;
using Apya.Platform.ProjectFinance;
using Apya.Platform.Reports;
using ClosedXML.Excel;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Apya.Platform.Web.Pages.Reports;

/// <summary>
/// Mizan, Cari Ekstre ve Proje Bütçe raporları için Excel/PDF byte dizisi üreticisi.
/// </summary>
internal static class ReportExporter
{
    // ─── TRIAL BALANCE ────────────────────────────────────────────────────────

    public static byte[] TrialBalanceToExcel(TrialBalanceReportDto r, DateTime? from, DateTime? to)
    {
        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet("Mizan");

        var title = "Mizan (Yönetim Özeti)";
        if (from.HasValue || to.HasValue)
            title += $" — {from?.ToString("dd.MM.yyyy") ?? "..."} / {to?.ToString("dd.MM.yyyy") ?? "..."}";

        ws.Cell(1, 1).Value = title;
        ws.Range(1, 1, 1, 5).Merge().Style.Font.Bold = true;

        string[] headers = ["Kod", "Hesap Grubu", "Borç", "Alacak", "Bakiye"];
        for (int i = 0; i < headers.Length; i++)
        {
            ws.Cell(2, i + 1).Value = headers[i];
            ws.Cell(2, i + 1).Style.Font.Bold = true;
            ws.Cell(2, i + 1).Style.Fill.BackgroundColor = XLColor.LightGray;
        }

        int row = 3;
        foreach (var l in r.Lines)
        {
            ws.Cell(row, 1).Value = l.GroupCode.ToString();
            ws.Cell(row, 2).Value = l.GroupName;
            ws.Cell(row, 3).Value = l.Debit;
            ws.Cell(row, 4).Value = l.Credit;
            ws.Cell(row, 5).Value = l.Balance;
            for (int c = 3; c <= 5; c++)
                ws.Cell(row, c).Style.NumberFormat.Format = "#,##0.00";
            if (l.Balance < 0)
                ws.Cell(row, 5).Style.Font.FontColor = XLColor.Red;
            row++;
        }

        // Toplam satırı
        ws.Cell(row, 2).Value = "TOPLAM";
        ws.Cell(row, 2).Style.Font.Bold = true;
        ws.Cell(row, 3).Value = r.TotalDebit;
        ws.Cell(row, 4).Value = r.TotalCredit;
        ws.Cell(row, 5).Value = r.TotalDebit - r.TotalCredit;
        for (int c = 3; c <= 5; c++)
        {
            ws.Cell(row, c).Style.NumberFormat.Format = "#,##0.00";
            ws.Cell(row, c).Style.Font.Bold = true;
        }

        ws.Columns().AdjustToContents();
        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    // ARCH-047: DateTime.Now kaldırıldı — static class IClock inject edemez; çağıran Clock.Now geçirir.
    public static byte[] TrialBalanceToPdf(TrialBalanceReportDto r, DateTime? from, DateTime? to, DateTime? now = null)
    {
        var title = "Mizan (Yönetim Özeti)";
        if (from.HasValue || to.HasValue)
            title += $"\n{from?.ToString("dd.MM.yyyy") ?? "..."} – {to?.ToString("dd.MM.yyyy") ?? "..."}";

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1.5f, Unit.Centimetre);
                page.DefaultTextStyle(t => t.FontSize(10));

                page.Header().Text(title).Bold().FontSize(13);

                page.Content().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.ConstantColumn(50);
                        c.RelativeColumn();
                        c.ConstantColumn(90);
                        c.ConstantColumn(90);
                        c.ConstantColumn(90);
                    });

                    static IContainer HeaderCell(IContainer c) =>
                        c.Background("#e0e0e0").Padding(4).AlignCenter();
                    static IContainer DataCell(IContainer c) =>
                        c.BorderBottom(0.5f, Unit.Point).Padding(4);

                    table.Header(h =>
                    {
                        foreach (var t in new[] { "Kod", "Hesap Grubu", "Borç", "Alacak", "Bakiye" })
                            h.Cell().Element(HeaderCell).Text(t).Bold();
                    });

                    foreach (var l in r.Lines)
                    {
                        table.Cell().Element(DataCell).Text(l.GroupCode.ToString());
                        table.Cell().Element(DataCell).Text(l.GroupName);
                        table.Cell().Element(DataCell).AlignRight().Text(l.Debit.ToString("N2"));
                        table.Cell().Element(DataCell).AlignRight().Text(l.Credit.ToString("N2"));
                        var balCell = table.Cell().Element(DataCell).AlignRight();
                        balCell.Text(l.Balance.ToString("N2"))
                               .FontColor(l.Balance < 0 ? Colors.Red.Medium : Colors.Black);
                    }

                    // Toplam
                    table.Cell().ColumnSpan(2).Element(DataCell)
                         .Text("TOPLAM").Bold();
                    table.Cell().Element(DataCell).AlignRight()
                         .Text(r.TotalDebit.ToString("N2")).Bold();
                    table.Cell().Element(DataCell).AlignRight()
                         .Text(r.TotalCredit.ToString("N2")).Bold();
                    table.Cell().Element(DataCell).AlignRight()
                         .Text((r.TotalDebit - r.TotalCredit).ToString("N2")).Bold();
                });

                page.Footer().AlignRight()
                    .Text($"Oluşturma: {(now ?? DateTime.UtcNow):dd.MM.yyyy HH:mm}  |  Yönetim özeti — resmi THP mizanı değildir.")
                    .FontSize(8).Italic().FontColor(Colors.Grey.Medium);
            });
        }).GeneratePdf();
    }

    // ─── CUSTOMER STATEMENT ───────────────────────────────────────────────────

    public static byte[] CustomerStatementToExcel(CustomerStatementDto s, DateTime? from, DateTime? to)
    {
        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet("Ekstre");

        ws.Cell(1, 1).Value = $"Cari Ekstre — {s.CustomerName}";
        ws.Range(1, 1, 1, 6).Merge().Style.Font.Bold = true;

        if (from.HasValue || to.HasValue)
        {
            ws.Cell(2, 1).Value = $"Dönem: {from?.ToString("dd.MM.yyyy") ?? "..."} – {to?.ToString("dd.MM.yyyy") ?? "..."}";
            ws.Range(2, 1, 2, 6).Merge();
        }

        int headerRow = from.HasValue || to.HasValue ? 4 : 3;
        string[] headers = ["Tarih", "Kaynak", "Açıklama", "Borç", "Alacak", "Bakiye"];
        for (int i = 0; i < headers.Length; i++)
        {
            ws.Cell(headerRow, i + 1).Value = headers[i];
            ws.Cell(headerRow, i + 1).Style.Font.Bold = true;
            ws.Cell(headerRow, i + 1).Style.Fill.BackgroundColor = XLColor.LightGray;
        }

        int row = headerRow + 1;
        foreach (var l in s.Lines)
        {
            ws.Cell(row, 1).Value = l.EntryDate.ToString("dd.MM.yyyy");
            ws.Cell(row, 2).Value = SourceLabel(l.Source);
            ws.Cell(row, 3).Value = l.Description ?? "-";
            ws.Cell(row, 4).Value = l.Debit > 0 ? l.Debit : (decimal?)null;
            ws.Cell(row, 5).Value = l.Credit > 0 ? l.Credit : (decimal?)null;
            ws.Cell(row, 6).Value = l.RunningBalance;
            for (int c = 4; c <= 6; c++)
                ws.Cell(row, c).Style.NumberFormat.Format = "#,##0.00";
            row++;
        }

        ws.Cell(row, 3).Value = "TOPLAM";
        ws.Cell(row, 3).Style.Font.Bold = true;
        ws.Cell(row, 4).Value = s.TotalDebit;
        ws.Cell(row, 5).Value = s.TotalCredit;
        ws.Cell(row, 6).Value = s.Balance;
        for (int c = 4; c <= 6; c++)
        {
            ws.Cell(row, c).Style.NumberFormat.Format = "#,##0.00";
            ws.Cell(row, c).Style.Font.Bold = true;
        }

        ws.Columns().AdjustToContents();
        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    public static byte[] CustomerStatementToPdf(CustomerStatementDto s, DateTime? from, DateTime? to, DateTime? now = null)
    {
        var period = (from.HasValue || to.HasValue)
            ? $"\nDönem: {from?.ToString("dd.MM.yyyy") ?? "..."} – {to?.ToString("dd.MM.yyyy") ?? "..."}"
            : "";

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(1.5f, Unit.Centimetre);
                page.DefaultTextStyle(t => t.FontSize(10));

                page.Header().Column(col =>
                {
                    col.Item().Text($"Cari Ekstre — {s.CustomerName}").Bold().FontSize(13);
                    if (period.Length > 0)
                        col.Item().Text(period.Trim()).FontSize(9).Italic();
                    col.Item().Text(
                        $"Net Bakiye: {s.Balance:N2} ₺  |  " +
                        $"Toplam Borç: {s.TotalDebit:N2}  |  Toplam Alacak: {s.TotalCredit:N2}")
                        .FontSize(9);
                });

                page.Content().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.ConstantColumn(75);
                        c.ConstantColumn(100);
                        c.RelativeColumn();
                        c.ConstantColumn(80);
                        c.ConstantColumn(80);
                        c.ConstantColumn(90);
                    });

                    static IContainer HeaderCell(IContainer c) =>
                        c.Background("#e0e0e0").Padding(4);
                    static IContainer DataCell(IContainer c) =>
                        c.BorderBottom(0.5f, Unit.Point).Padding(4);

                    table.Header(h =>
                    {
                        foreach (var t in new[] { "Tarih", "Kaynak", "Açıklama", "Borç", "Alacak", "Bakiye" })
                            h.Cell().Element(HeaderCell).Text(t).Bold();
                    });

                    foreach (var l in s.Lines)
                    {
                        table.Cell().Element(DataCell).Text(l.EntryDate.ToString("dd.MM.yyyy"));
                        table.Cell().Element(DataCell).Text(SourceLabel(l.Source));
                        table.Cell().Element(DataCell).Text(l.Description ?? "-");
                        table.Cell().Element(DataCell).AlignRight()
                             .Text(l.Debit > 0 ? l.Debit.ToString("N2") : "");
                        table.Cell().Element(DataCell).AlignRight()
                             .Text(l.Credit > 0 ? l.Credit.ToString("N2") : "");
                        table.Cell().Element(DataCell).AlignRight()
                             .Text(l.RunningBalance.ToString("N2"))
                             .FontColor(l.RunningBalance < 0 ? Colors.Green.Medium : l.RunningBalance > 0 ? Colors.Red.Medium : Colors.Black);
                    }

                    table.Cell().ColumnSpan(3).Element(DataCell).Text("TOPLAM").Bold();
                    table.Cell().Element(DataCell).AlignRight().Text(s.TotalDebit.ToString("N2")).Bold();
                    table.Cell().Element(DataCell).AlignRight().Text(s.TotalCredit.ToString("N2")).Bold();
                    table.Cell().Element(DataCell).AlignRight().Text(s.Balance.ToString("N2")).Bold();
                });

                page.Footer().AlignRight()
                    .Text($"Oluşturma: {(now ?? DateTime.UtcNow):dd.MM.yyyy HH:mm}")
                    .FontSize(8).Italic().FontColor(Colors.Grey.Medium);
            });
        }).GeneratePdf();
    }

    // ─── PROJECT BUDGET ───────────────────────────────────────────────────────

    public static byte[] ProjectBudgetToExcel(ProjectFinanceSummaryDto s)
    {
        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet("Bütçe");

        ws.Cell(1, 1).Value = $"Proje Bütçe / K/Z — {s.ProjectName}";
        ws.Range(1, 1, 1, 4).Merge().Style.Font.Bold = true;

        // Özet
        ws.Cell(3, 1).Value = "Bütçe"; ws.Cell(3, 2).Value = s.Budget;
        ws.Cell(4, 1).Value = "Toplam Gider"; ws.Cell(4, 2).Value = s.TotalExpense;
        ws.Cell(5, 1).Value = "Toplam Gelir"; ws.Cell(5, 2).Value = s.TotalIncome;
        ws.Cell(6, 1).Value = "Net (Gelir−Gider)"; ws.Cell(6, 2).Value = s.Net;
        ws.Cell(7, 1).Value = "Kalan Bütçe"; ws.Cell(7, 2).Value = s.BudgetRemaining;
        ws.Cell(8, 1).Value = "Bütçe Kullanımı %"; ws.Cell(8, 2).Value = s.BudgetUsagePercent;

        for (int r = 3; r <= 7; r++)
            ws.Cell(r, 2).Style.NumberFormat.Format = "#,##0.00";
        for (int r = 3; r <= 8; r++)
            ws.Cell(r, 1).Style.Font.Bold = true;

        if (s.Net < 0) ws.Cell(6, 2).Style.Font.FontColor = XLColor.Red;
        if (s.OverBudget) ws.Cell(7, 2).Style.Font.FontColor = XLColor.Red;

        // Task kırılımı
        if (s.TaskBreakdown.Any(t => t.TaskId.HasValue))
        {
            int headerRow = 10;
            ws.Cell(headerRow, 1).Value = "Task Kırılımı";
            ws.Cell(headerRow, 1).Style.Font.Bold = true;

            string[] headers = ["Task", "Gider", "Gelir", "Net"];
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(headerRow + 1, i + 1).Value = headers[i];
                ws.Cell(headerRow + 1, i + 1).Style.Font.Bold = true;
                ws.Cell(headerRow + 1, i + 1).Style.Fill.BackgroundColor = XLColor.LightGray;
            }

            int row = headerRow + 2;
            foreach (var t in s.TaskBreakdown.OrderByDescending(x => x.Expense))
            {
                ws.Cell(row, 1).Value = t.TaskId.HasValue
                    ? t.TaskId.ToString()![..8] + "…"
                    : "(Proje geneli)";
                ws.Cell(row, 2).Value = t.Expense;
                ws.Cell(row, 3).Value = t.Income;
                ws.Cell(row, 4).Value = t.Income - t.Expense;
                for (int c = 2; c <= 4; c++)
                    ws.Cell(row, c).Style.NumberFormat.Format = "#,##0.00";
                row++;
            }
        }

        ws.Columns().AdjustToContents();
        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    public static byte[] ProjectBudgetToPdf(ProjectFinanceSummaryDto s, DateTime? now = null)
    {
        var barColor = s.OverBudget ? Colors.Red.Medium : (s.BudgetUsagePercent >= 80 ? Colors.Yellow.Medium : Colors.Green.Medium);

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.DefaultTextStyle(t => t.FontSize(10));

                page.Header().Text($"Proje Bütçe / K/Z — {s.ProjectName}").Bold().FontSize(13);

                page.Content().Column(col =>
                {
                    // Özet tablo
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(); c.ConstantColumn(120); });
                        static IContainer LabelCell(IContainer c) => c.Padding(4).BorderBottom(0.5f, Unit.Point);
                        static IContainer ValueCell(IContainer c) => c.Padding(4).BorderBottom(0.5f, Unit.Point);

                        void Row(string label, string value, bool bold = false)
                        {
                            var lc = table.Cell().Element(LabelCell);
                            var vc = table.Cell().Element(ValueCell);
                            if (bold) { lc.Text(label).Bold(); vc.AlignRight().Text(value).Bold(); }
                            else { lc.Text(label); vc.AlignRight().Text(value); }
                        }

                        Row("Bütçe", $"{s.Budget:N2} {s.Currency}");
                        Row("Toplam Gider", $"{s.TotalExpense:N2}");
                        Row("Toplam Gelir", $"{s.TotalIncome:N2}");
                        Row("Net (Gelir−Gider)", $"{s.Net:N2}", bold: true);
                        Row("Kalan Bütçe", $"{s.BudgetRemaining:N2}", bold: true);
                        Row("Bütçe Kullanımı", $"%{s.BudgetUsagePercent}");
                    });

                    col.Item().Height(12);

                    // Task kırılımı
                    if (s.TaskBreakdown.Any(t => t.TaskId.HasValue))
                    {
                        col.Item().Text("Task Bazlı Kırılım").Bold().FontSize(11);
                        col.Item().Height(4);
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn();
                                c.ConstantColumn(90);
                                c.ConstantColumn(90);
                                c.ConstantColumn(90);
                            });

                            static IContainer HeaderCell(IContainer c) =>
                                c.Background("#e0e0e0").Padding(4);
                            static IContainer DataCell(IContainer c) =>
                                c.BorderBottom(0.5f, Unit.Point).Padding(4);

                            table.Header(h =>
                            {
                                foreach (var t in new[] { "Task", "Gider", "Gelir", "Net" })
                                    h.Cell().Element(HeaderCell).Text(t).Bold();
                            });

                            foreach (var t in s.TaskBreakdown.OrderByDescending(x => x.Expense))
                            {
                                var net = t.Income - t.Expense;
                                table.Cell().Element(DataCell)
                                     .Text(t.TaskId.HasValue ? t.TaskId.ToString()![..8] + "…" : "(Proje geneli)");
                                table.Cell().Element(DataCell).AlignRight().Text(t.Expense.ToString("N2"));
                                table.Cell().Element(DataCell).AlignRight().Text(t.Income.ToString("N2"));
                                table.Cell().Element(DataCell).AlignRight()
                                     .Text(net.ToString("N2"))
                                     .FontColor(net < 0 ? Colors.Red.Medium : Colors.Green.Medium);
                            }
                        });
                    }
                });

                page.Footer().AlignRight()
                    .Text($"Oluşturma: {(now ?? DateTime.UtcNow):dd.MM.yyyy HH:mm}")
                    .FontSize(8).Italic().FontColor(Colors.Grey.Medium);
            });
        }).GeneratePdf();
    }

    // ─── HELPERS ──────────────────────────────────────────────────────────────

    private static string SourceLabel(CustomerLedgerSource s) => s switch
    {
        CustomerLedgerSource.Invoice => "Satış Faturası",
        CustomerLedgerSource.Payment => "Tahsilat",
        CustomerLedgerSource.Opening => "Açılış",
        _ => "Manuel"
    };
}
