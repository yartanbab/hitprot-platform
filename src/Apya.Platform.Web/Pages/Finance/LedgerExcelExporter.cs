using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ClosedXML.Excel;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// F-05 · Gelir-Gider tablosunun Excel çıktısı. Satırlar ekranda görülenin aynısıdır (aynı süzgeç,
/// aynı ₺ defter tutarı); toplamlar da ekrandaki gibi ₺ defterde alınır, işlem para birimleri toplanmaz.
/// </summary>
internal static class LedgerExcelExporter
{
    public static byte[] Build(
        IReadOnlyList<IndexModel.LedgerRow> rows,
        string title,
        IReadOnlyList<string> notes,
        string? donorCurrency,
        bool withDocuments)
    {
        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet("Gelir-Gider");

        var headers = new List<string> { "Tarih", "Tür", "Başlık", "Kategori", "Bütçe kalemi", "Kasa", "Tutar", "PB", "₺ karşılığı" };
        if (donorCurrency != null)
        {
            headers.Add($"Donör ({donorCurrency})");
        }
        if (withDocuments)
        {
            headers.Add("Belge");
        }

        ws.Cell(1, 1).Value = title;
        ws.Range(1, 1, 1, headers.Count).Merge().Style.Font.Bold = true;

        for (var i = 0; i < headers.Count; i++)
        {
            var cell = ws.Cell(2, i + 1);
            cell.Value = headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.LightGray;
        }

        var row = 3;
        foreach (var r in rows)
        {
            var col = 1;
            ws.Cell(row, col).Value = r.Date.Date;
            ws.Cell(row, col++).Style.DateFormat.Format = "dd.MM.yyyy";
            ws.Cell(row, col++).Value = r.IsInflow ? "Gelir" : "Gider";
            ws.Cell(row, col++).Value = r.Title;
            ws.Cell(row, col++).Value = r.CategoryLabel;
            ws.Cell(row, col++).Value = r.BudgetLineName ?? string.Empty;
            ws.Cell(row, col++).Value = r.CashAccountName ?? string.Empty;
            ws.Cell(row, col).Value = r.Amount;
            ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0.00";
            ws.Cell(row, col++).Value = r.Currency;
            // FIN-08 · Kuru girilmemiş dövizli kayıt: ₺ karşılığı "0" değil boş; ekrandaki "kur yok" ile aynı.
            if (r.IsBookMissing)
            {
                ws.Cell(row, col++).Value = "kur yok";
            }
            else
            {
                ws.Cell(row, col).Value = r.BookAmount;
                ws.Cell(row, col++).Style.NumberFormat.Format = "#,##0.00";
            }
            if (donorCurrency != null)
            {
                if (r.DonorAmount.HasValue)
                {
                    ws.Cell(row, col).Value = r.DonorAmount.Value;
                    ws.Cell(row, col).Style.NumberFormat.Format = "#,##0.00";
                }
                col++;
            }
            if (withDocuments)
            {
                ws.Cell(row, col).Value = r.Documents.Count;
            }
            row++;
        }

        // Toplamlar ₺ defterde (ekranın dip satırıyla aynı kural).
        var income = rows.Where(r => r.IsInflow).Sum(r => r.BookAmount);
        var expense = rows.Where(r => !r.IsInflow).Sum(r => r.BookAmount);
        row++;
        foreach (var (label, value) in new[] { ("Toplam gelir (₺)", income), ("Toplam gider (₺)", expense), ("Net (₺)", income - expense) })
        {
            ws.Cell(row, 8).Value = label;
            ws.Cell(row, 8).Style.Font.Bold = true;
            ws.Cell(row, 9).Value = value;
            ws.Cell(row, 9).Style.NumberFormat.Format = "#,##0.00";
            ws.Cell(row, 9).Style.Font.Bold = true;
            row++;
        }

        foreach (var note in notes)
        {
            row++;
            ws.Cell(row, 1).Value = note;
            ws.Cell(row, 1).Style.Font.Italic = true;
        }

        ws.Columns().AdjustToContents();
        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }
}
