using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using ClosedXML.Excel;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Import;

/// <summary>Şablon sütunu. <see cref="Options"/> doluysa şablonda açılır liste olur.</summary>
public sealed record ImportColumn(string Header, bool Required = false, IReadOnlyList<string>? Options = null);

/// <summary>Dosyadan okunan tek satır: hücre değerleri başlığa göre, hatalar satıra göre.</summary>
public sealed class ImportRow
{
    private readonly Dictionary<string, object?> _cells;

    public ImportRow(int number, Dictionary<string, object?> cells)
    {
        Number = number;
        _cells = cells;
    }

    /// <summary>Excel'deki satır numarası (başlık 1. satır).</summary>
    public int Number { get; }

    public List<string> Errors { get; } = new();

    public object? Value(string header) => _cells.TryGetValue(header, out var v) ? v : null;

    public string Text(string header) => Value(header) switch
    {
        null => string.Empty,
        DateTime d => d.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture),
        double n => n.ToString(CultureInfo.InvariantCulture),
        var v => v.ToString()!.Trim()
    };
}

/// <summary>Okunan sayfa. <see cref="Headers"/> şablonun sütun sırasıdır (önizleme tablosu bunu basar).</summary>
public sealed record ImportSheet(List<string> Headers, List<ImportRow> Rows, List<string> Errors);

/// <summary>Pencerenin okuduğu JSON: önizleme, kayıt hatası ya da tamamlandı.</summary>
internal static class ImportResponse
{
    public static object Preview(ImportSheet sheet, IStringLocalizer l)
    {
        var failed = sheet.Rows.Count(r => r.Errors.Count > 0);
        var ok = sheet.Errors.Count == 0 && failed == 0;
        var message = sheet.Errors.Count > 0 ? string.Join(" ", sheet.Errors)
            : ok ? l["Import:Ready", sheet.Rows.Count].Value
            : l["Import:HasErrors", sheet.Rows.Count, failed].Value;
        return new
        {
            ok,
            done = false,
            message,
            headers = sheet.Headers,
            rows = sheet.Rows.Select(r => new { number = r.Number, values = sheet.Headers.Select(r.Text), errors = r.Errors })
        };
    }

    public static object Failed(string message) => new { ok = false, done = false, message };

    public static object Done(string message) => new { ok = true, done = true, message };
}

/// <summary>
/// Liste ekranlarının "Excel'den içe aktar" akışı: şablon üretimi ve dosya okuma. Kayıt kuralları
/// burada DEĞİL — her ekran satırı kendi DTO'suna çevirir ve mevcut oluşturma servisinden geçirir.
/// </summary>
internal static class ExcelImport
{
    /// <summary>Tek dosyada içe aktarılacak en fazla satır; hepsi tek işlemde yazılır.</summary>
    public const int MaxRows = 1000;

    private static readonly CultureInfo Tr = CultureInfo.GetCultureInfo("tr-TR");

    public static byte[] Template(string sheetName, string optionsSheetName, IReadOnlyList<ImportColumn> columns)
    {
        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet(SafeSheetName(sheetName));
        IXLWorksheet? options = null;

        for (var c = 0; c < columns.Count; c++)
        {
            var column = columns[c];
            var cell = ws.Cell(1, c + 1);
            cell.Value = column.Required ? column.Header + " *" : column.Header;
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.LightGray;

            if (column.Options is { Count: > 0 })
            {
                options ??= wb.AddWorksheet(SafeSheetName(optionsSheetName));
                var oc = options.LastColumnUsed()?.ColumnNumber() + 1 ?? 1;
                options.Cell(1, oc).Value = column.Header;
                options.Cell(1, oc).Style.Font.Bold = true;
                for (var i = 0; i < column.Options.Count; i++)
                {
                    options.Cell(i + 2, oc).Value = column.Options[i];
                }

                var list = options.Range(2, oc, column.Options.Count + 1, oc);
                ws.Range(2, c + 1, MaxRows + 1, c + 1).CreateDataValidation().List(list, true);
            }
        }

        ws.SheetView.FreezeRows(1);
        ws.Columns(1, columns.Count).Width = 20;
        options?.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        wb.SaveAs(stream);
        return stream.ToArray();
    }

    /// <summary>
    /// İlk sayfayı okur. Başlıklar şablondaki adla eşleşir ("*" ve büyük/küçük harf yok sayılır);
    /// zorunlu olmayan sütun dosyada hiç olmayabilir. Tamamen boş satırlar atlanır.
    /// </summary>
    public static ImportSheet Read(Stream stream, IReadOnlyList<ImportColumn> columns, IStringLocalizer l)
    {
        var headers = columns.Select(c => c.Header).ToList();
        var rows = new List<ImportRow>();
        var errors = new List<string>();

        XLWorkbook wb;
        try
        {
            wb = new XLWorkbook(stream);
        }
        catch (Exception)
        {
            errors.Add(l["Import:Error:NotExcel"]);
            return new ImportSheet(headers, rows, errors);
        }

        using (wb)
        {
            var ws = wb.Worksheet(1);
            var lastColumn = ws.LastColumnUsed()?.ColumnNumber() ?? 0;
            var positions = new Dictionary<string, int>();
            for (var c = 1; c <= lastColumn; c++)
            {
                var header = Normalize(ws.Cell(1, c).GetString());
                var match = columns.FirstOrDefault(x => Normalize(x.Header) == header);
                if (match != null && !positions.ContainsKey(match.Header))
                {
                    positions[match.Header] = c;
                }
            }

            foreach (var missing in columns.Where(x => x.Required && !positions.ContainsKey(x.Header)))
            {
                errors.Add(l["Import:Error:MissingColumn", missing.Header]);
            }

            if (errors.Count > 0)
            {
                return new ImportSheet(headers, rows, errors);
            }

            var lastRow = ws.LastRowUsed()?.RowNumber() ?? 1;
            for (var r = 2; r <= lastRow; r++)
            {
                var cells = positions.ToDictionary(p => p.Key, p => CellValue(ws.Cell(r, p.Value)));
                if (cells.Values.All(v => v == null))
                {
                    continue;
                }

                if (rows.Count == MaxRows)
                {
                    errors.Add(l["Import:Error:TooManyRows", MaxRows]);
                    return new ImportSheet(headers, new List<ImportRow>(), errors);
                }

                rows.Add(new ImportRow(r, cells));
            }
        }

        if (rows.Count == 0)
        {
            errors.Add(l["Import:Error:NoRows"]);
        }

        return new ImportSheet(headers, rows, errors);
    }

    /// <summary>
    /// Sayı hücresi ya da metin. Virgüllü ("1.234,56") ve yalnız binlik noktalı ("1.500") metin
    /// Türkçe okunur — "1.500" 1,5 değil bin beş yüzdür; diğerleri ("1234.56") noktalı ondalık.
    /// </summary>
    public static decimal? Decimal(object? value)
    {
        switch (value)
        {
            case double d:
                return (decimal)d;
            case string s:
                s = s.Replace(" ", string.Empty);
                var style = NumberStyles.Number;
                var turkish = s.Contains(',') || Regex.IsMatch(s, @"^-?\d{1,3}(\.\d{3})+$");
                return decimal.TryParse(s, style, turkish ? Tr : CultureInfo.InvariantCulture, out var n) ? n : null;
            default:
                return null;
        }
    }

    /// <summary>Tarih hücresi ya da metin (gg.aa.yyyy veya yyyy-aa-gg).</summary>
    public static DateTime? Date(object? value) => value switch
    {
        DateTime d => d.Date,
        string s when DateTime.TryParseExact(s, new[] { "d.M.yyyy", "yyyy-M-d", "d/M/yyyy" },
            CultureInfo.InvariantCulture, DateTimeStyles.None, out var d) => d,
        _ => null
    };

    /// <summary>Ad eşleşmesinde büyük/küçük harf Türkçe kurala göre yok sayılır.</summary>
    public static string Normalize(string text) => text.Replace("*", string.Empty).Trim().ToUpper(Tr);

    private static object? CellValue(IXLCell cell)
    {
        var value = cell.Value;
        if (value.IsDateTime) return value.GetDateTime();
        if (value.IsNumber) return value.GetNumber();
        if (value.IsBoolean) return value.GetBoolean().ToString();
        var text = cell.GetString().Trim();
        return text.Length == 0 ? null : text;
    }

    private static string SafeSheetName(string name)
    {
        var invalid = new[] { ':', '\\', '/', '?', '*', '[', ']' };
        var safe = new string(name.Select(ch => invalid.Contains(ch) ? ' ' : ch).ToArray()).Trim();
        return safe.Length > 31 ? safe[..31] : safe;
    }
}
