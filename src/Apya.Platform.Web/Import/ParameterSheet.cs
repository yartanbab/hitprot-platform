using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using Apya.Platform.Web.Export;
using ClosedXML.Excel;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Import;

/// <summary>
/// Bir kaydın tek satırlık, tüm parametreli Excel karşılığı. Her alan aynı satırda hem dışa aktarılır
/// hem geri okunur. Mevcut kayıtta hücresi çıktıdakiyle aynı olan alan YORUMLANMAZ, kayıttaki değer
/// aynen kalır: çıktıda tam görünmeyen değerler (saat, gizli bağ, pasif kategori, kural öncesi veri)
/// dosya geri yüklenince bozulmaz. Çok değerli hücrelerde ayraç ters eğik çizgiyle korunur.
/// </summary>
internal abstract class ParameterSheet<TSource, TInput>
    where TSource : class
    where TInput : new()
{
    /// <param name="Keep">Hücre değişmediyse ya da sütun dosyada yoksa mevcut değeri taşır.</param>
    /// <param name="Options">Hücrede açılır liste olan değerler.</param>
    /// <param name="Allowed">Çok değerli sütunun geçerli değerleri (yalnız rehberde).</param>
    internal sealed record Field(
        string Header,
        string Hint,
        Func<TSource, object?> Export,
        Action<TSource, TInput> Keep,
        Action<ImportRow, TInput> Read,
        bool Required = false,
        IReadOnlyList<string>? Options = null,
        IReadOnlyList<string>? Allowed = null);

    private readonly string _headerPrefix;

    protected ParameterSheet(IStringLocalizer l, string headerPrefix)
    {
        L = l;
        _headerPrefix = headerPrefix;
        Yes = l["Import:Value:Yes"].Value;
        No = l["Import:Value:No"].Value;
        IdHeader = H("Id");
    }

    protected IStringLocalizer L { get; }

    protected string Yes { get; }

    protected string No { get; }

    public string IdHeader { get; }

    public IReadOnlyList<Field> Fields { get; protected set; } = [];

    protected abstract Guid IdOf(TSource source);

    /// <summary>Kimlik sütununun rehber metni.</summary>
    protected virtual string IdHint => Guide("Id");

    public IReadOnlyList<ImportColumn> Columns =>
        [new(IdHeader), .. Fields.Select(f => new ImportColumn(f.Header, f.Required, f.Options))];

    public IReadOnlyList<ExcelColumn<TSource>> ExportColumns =>
        [new(IdHeader, s => IdOf(s).ToString()), .. Fields.Select(f => new ExcelColumn<TSource>(f.Header, f.Export))];

    /// <summary>
    /// Satırı yazma modeline çevirir. Değişen hücre okunur (boşaltılan hücre alanı temizler),
    /// değişmeyen hücre ve dosyadan silinmiş sütun mevcut değeri korur.
    /// <c>Unchanged</c>: satır kaydın bugünkü hâliyle aynı, yazılmaz.
    /// </summary>
    public (TInput Input, bool Unchanged) Read(ImportRow row, TSource? current)
    {
        var input = new TInput();
        var unchanged = current != null;
        foreach (var field in Fields)
        {
            if (current != null && (!row.Has(field.Header) || SameCell(row.Value(field.Header), field.Export(current))))
            {
                field.Keep(current, input);
            }
            else
            {
                field.Read(row, input);
                unchanged = false;
            }
        }

        if (!unchanged)
        {
            Validate(row, input);
        }

        return (input, unchanged);
    }

    /// <summary>Yalnız değişen ya da yeni satırda çalışır.</summary>
    protected virtual void Validate(ImportRow row, TInput input)
    {
    }

    private static bool SameCell(object? cell, object? exported) => exported switch
    {
        null => cell == null,
        string text => text.Trim().Length == 0
            ? cell == null
            : Convert.ToString(cell, CultureInfo.InvariantCulture) == text.Trim(),
        DateTime date => ExcelImport.Date(cell) == date.Date,
        _ => ExcelImport.Decimal(cell) == Convert.ToDecimal(exported, CultureInfo.InvariantCulture)
    };

    /// <summary>Her sütunun ne istediğini anlatan sayfa; içe aktarma yalnız ilk sayfayı okur.</summary>
    public void AddGuide(XLWorkbook workbook)
    {
        var ws = workbook.AddWorksheet(L["Import:Guide:Sheet"].Value);
        string[] heads = [L["Import:Guide:Column"], L["Import:Guide:Required"], L["Import:Guide:How"], L["Import:Guide:Values"]];
        for (var c = 0; c < heads.Length; c++)
        {
            ws.Cell(1, c + 1).Value = heads[c];
            ws.Cell(1, c + 1).Style.Font.Bold = true;
            ws.Cell(1, c + 1).Style.Fill.BackgroundColor = XLColor.LightGray;
        }

        var rows = new List<(string Header, bool Required, string Hint, IReadOnlyList<string>? Values)>
        {
            (IdHeader, false, IdHint, null)
        };
        rows.AddRange(Fields.Select(f => (f.Header, f.Required, f.Hint, f.Allowed ?? f.Options)));

        for (var i = 0; i < rows.Count; i++)
        {
            ws.Cell(i + 2, 1).Value = rows[i].Header;
            ws.Cell(i + 2, 2).Value = rows[i].Required ? Yes : No;
            ws.Cell(i + 2, 3).Value = rows[i].Hint;
            ws.Cell(i + 2, 4).Value = rows[i].Values == null ? string.Empty : string.Join(", ", rows[i].Values!);
        }

        ws.SheetView.FreezeRows(1);
        ws.Column(1).Width = 32;
        ws.Column(2).Width = 10;
        ws.Column(3).Width = 70;
        ws.Column(4).Width = 70;
        ws.Columns(3, 4).Style.Alignment.WrapText = true;
    }

    protected string H(string key) => L[_headerPrefix + key].Value;

    protected string Guide(string key) => L[$"Import:Guide:{key}"].Value;

    protected static bool Same(string a, string b) => ExcelImport.Normalize(a) == ExcelImport.Normalize(b);

    // ── Sütun türleri ──

    protected Field Text(string key, Func<TSource, string?> get, Action<TInput, string?> set, bool required = false, int? maxLength = null)
    {
        var header = H(key);
        return new(header, Guide("Text"), get, (s, t) => set(t, get(s)),
            (row, t) =>
            {
                var text = row.Text(header);
                if (maxLength is { } max && text.Length > max)
                {
                    row.Errors.Add(L["Import:Error:TooLong", header, max]);
                }

                set(t, text.Length > 0 ? text : null);
            },
            Required: required);
    }

    protected Field Whole(string key, Func<TSource, int?> get, Action<TInput, int?> set)
    {
        var header = H(key);
        return new(header, Guide("Whole"), s => get(s), (s, t) => set(t, get(s)), (row, t) => set(t, ReadWhole(row, header)));
    }

    protected Field Amount(string key, Func<TSource, decimal?> get, Action<TInput, decimal?> set)
    {
        var header = H(key);
        return new(header, Guide("Amount"), s => get(s), (s, t) => set(t, get(s)),
            (row, t) =>
            {
                var value = ReadNumber(row, header);
                set(t, value == null ? null : Math.Round(value.Value, 2));
            });
    }

    /// <summary>Çıktıya yalnız tarih yazılır; hücre değişmedikçe kayıttaki saat korunur.</summary>
    protected Field Date(string key, Func<TSource, DateTime?> get, Action<TInput, DateTime?> set)
    {
        var header = H(key);
        return new(header, Guide("Date"), s => get(s)?.Date, (s, t) => set(t, get(s)),
            (row, t) =>
            {
                if (row.Text(header).Length == 0)
                {
                    set(t, null);
                    return;
                }

                var date = ExcelImport.Date(row.Value(header));
                if (date == null)
                {
                    row.Errors.Add(L["Import:Error:Date", header]);
                }

                set(t, date);
            });
    }

    protected Field YesNo(string key, Func<TSource, bool> get, Action<TInput, bool> set)
    {
        var header = H(key);
        return new(header, Guide("YesNo"), s => get(s) ? Yes : No, (s, t) => set(t, get(s)),
            (row, t) =>
            {
                var text = row.Text(header);
                if (text.Length == 0 || Same(text, No) || Same(text, bool.FalseString))
                {
                    set(t, false);
                }
                else if (Same(text, Yes) || Same(text, bool.TrueString))
                {
                    set(t, true);
                }
                else
                {
                    row.Errors.Add(L["Import:Error:YesNo", header, Yes, No]);
                }
            },
            Options: [Yes, No]);
    }

    // ── Hücre okuma ──

    protected void Require(ImportRow row, string header, string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            row.Errors.Add(L["Import:Error:Required", header]);
        }
    }

    private int? ReadWhole(ImportRow row, string header)
    {
        var value = ReadNumber(row, header);
        if (value == null)
        {
            return null;
        }

        if (value != Math.Truncate(value.Value) || value > int.MaxValue || value < int.MinValue)
        {
            row.Errors.Add(L["Import:Error:Whole", header]);
            return null;
        }

        return (int)value.Value;
    }

    protected decimal? ReadNumber(ImportRow row, string header)
    {
        if (row.Text(header).Length == 0)
        {
            return null;
        }

        var value = ExcelImport.Decimal(row.Value(header));
        if (value == null)
        {
            row.Errors.Add(L["Import:Error:Number", header]);
        }

        return value;
    }

    protected bool TryPick<T>(ImportRow row, string header, string text, IEnumerable<T> options,
        Func<T, IEnumerable<string?>> names, out T match)
    {
        var found = options.Where(o => names(o).Any(n => !string.IsNullOrEmpty(n) && Same(n!, text))).ToList();
        match = found.Count == 1 ? found[0] : default!;
        if (found.Count != 1)
        {
            row.Errors.Add(L[found.Count == 0 ? "Import:Error:NotFound" : "Import:Error:Ambiguous", header, text]);
        }

        return found.Count == 1;
    }

    // ── Çok değerli hücre ──

    protected static string? JoinEntries(IEnumerable<string> values)
    {
        var text = string.Join("; ", values.Select(Escape));
        return text.Length > 0 ? text : null;
    }

    protected static List<string> Entries(string text) => SplitCell(text, ';').Where(e => e.Length > 0).ToList();

    protected static string Escape(string value)
        => value.Replace("\\", "\\\\").Replace(";", "\\;").Replace("|", "\\|");

    private static bool IsEscapable(char ch) => ch is '\\' or ';' or '|';

    /// <summary>Ayraçtan böler; kaçışlı karakterler parçada kaçışlı kalır (iç içe bölme için). Satır sonu da liste ayracıdır.</summary>
    protected static List<string> SplitCell(string text, char separator)
    {
        var parts = new List<string>();
        var current = new StringBuilder();
        for (var i = 0; i < text.Length; i++)
        {
            var ch = text[i];
            if (ch == '\\' && i + 1 < text.Length && IsEscapable(text[i + 1]))
            {
                current.Append(ch).Append(text[++i]);
            }
            else if (ch == separator || (separator == ';' && ch is '\r' or '\n'))
            {
                parts.Add(current.ToString().Trim());
                current.Clear();
            }
            else
            {
                current.Append(ch);
            }
        }

        parts.Add(current.ToString().Trim());
        return parts;
    }

    protected static string Unescape(string value)
    {
        var result = new StringBuilder(value.Length);
        for (var i = 0; i < value.Length; i++)
        {
            if (value[i] == '\\' && i + 1 < value.Length && IsEscapable(value[i + 1]))
            {
                i++;
            }

            result.Append(value[i]);
        }

        return result.ToString();
    }
}
