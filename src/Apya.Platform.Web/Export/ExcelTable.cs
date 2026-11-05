using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Export;

/// <summary>Excel sütunu: başlık + satırdan değer okuyan fonksiyon. Biçim boşsa değerin türüne göre seçilir.</summary>
internal sealed record ExcelColumn<T>(string Header, Func<T, object?> Value, string? Format = null);

/// <summary>Toplanan satırlar; <see cref="Truncated"/> doğruysa liste <see cref="ExcelTable.MaxRows"/>'ta kesildi.</summary>
internal sealed record ExportRows<T>(List<T> Items, bool Truncated);

/// <summary>
/// Liste ekranlarının "Excel'e aktar" çıktısı. Her ekran kendi sütunlarını verir; başlık satırı,
/// sayı/tarih biçimi, filtre ve kesilme notu burada tek yerde yaşar.
/// </summary>
internal static class ExcelTable
{
    /// <summary>Tek dosyaya yazılan en fazla satır (geri bildirim dışa aktarımıyla aynı sınır).</summary>
    public const int MaxRows = 10_000;

    /// <summary>ABP liste uçları istek başına en fazla 1000 satır verir.</summary>
    private const int PageSize = 1000;

    public const string ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static string FileName(string baseName, DateTime date) => $"{baseName}_{date:yyyy-MM-dd}.xlsx";

    /// <summary>
    /// Ekranın kullandığı sayfalı liste ucunu 1000'erli sayfalarla çağırır. Filtre, gizlilik ve ad
    /// doldurma ekrandakiyle birebir aynı kalır; en fazla <see cref="MaxRows"/> satır toplanır.
    /// </summary>
    public static async Task<ExportRows<T>> CollectAsync<T>(Func<int, int, Task<PagedResultDto<T>>> fetchPage)
    {
        var items = new List<T>();
        long total = 0;
        while (items.Count < MaxRows)
        {
            var take = Math.Min(PageSize, MaxRows - items.Count);
            var page = await fetchPage(items.Count, take);
            total = page.TotalCount;
            items.AddRange(page.Items);
            if (page.Items.Count < take || items.Count >= total)
            {
                break;
            }
        }

        return new ExportRows<T>(items, total > items.Count);
    }

    public static byte[] Build<T>(string sheetName, IReadOnlyList<ExcelColumn<T>> columns, IEnumerable<T> rows, string? note = null)
    {
        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet(SafeSheetName(sheetName));

        for (var c = 0; c < columns.Count; c++)
        {
            var cell = ws.Cell(1, c + 1);
            cell.Value = columns[c].Header;
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.LightGray;
        }

        var row = 2;
        foreach (var item in rows)
        {
            for (var c = 0; c < columns.Count; c++)
            {
                Write(ws.Cell(row, c + 1), columns[c].Value(item), columns[c].Format);
            }
            row++;
        }

        var lastRow = row - 1;
        ws.SheetView.FreezeRows(1);
        if (lastRow > 1)
        {
            ws.Range(1, 1, lastRow, columns.Count).SetAutoFilter();
        }

        // Genişlik ilk satırlardan ölçülür: 10.000 satırın hepsini ölçmek dosyayı saniyelerce geciktirir.
        ws.Columns(1, columns.Count).AdjustToContents(1, Math.Min(lastRow, 300));
        foreach (var col in ws.Columns(1, columns.Count))
        {
            if (col.Width > 60) col.Width = 60;
        }

        if (!string.IsNullOrWhiteSpace(note))
        {
            var noteCell = ws.Cell(lastRow + 2, 1);
            noteCell.Value = note;
            noteCell.Style.Font.Italic = true;
        }

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    private static void Write(IXLCell cell, object? value, string? format)
    {
        switch (value)
        {
            case null:
                return;
            case string s:
                // Değer metin olarak yazılır; "=" ile başlayan içerik formül olarak çalışmaz.
                cell.Value = s;
                return;
            case DateTime d:
                cell.Value = d;
                cell.Style.DateFormat.Format = format ?? (d.TimeOfDay == TimeSpan.Zero ? "dd.MM.yyyy" : "dd.MM.yyyy HH:mm");
                return;
            case decimal m:
                cell.Value = m;
                cell.Style.NumberFormat.Format = format ?? "#,##0.00";
                return;
            case double db:
                cell.Value = db;
                cell.Style.NumberFormat.Format = format ?? "#,##0.00";
                return;
            case int i:
                cell.Value = i;
                if (format != null) cell.Style.NumberFormat.Format = format;
                return;
            case long l:
                cell.Value = l;
                if (format != null) cell.Style.NumberFormat.Format = format;
                return;
            default:
                cell.Value = value.ToString();
                return;
        }
    }

    // Excel sayfa adı en fazla 31 karakter ve []:*?/\ içeremez.
    private static string SafeSheetName(string name)
    {
        var chars = name.ToCharArray();
        for (var i = 0; i < chars.Length; i++)
        {
            if ("[]:*?/\\".IndexOf(chars[i]) >= 0) chars[i] = ' ';
        }

        var safe = new string(chars).Trim();
        return safe.Length > 31 ? safe[..31] : safe;
    }
}
