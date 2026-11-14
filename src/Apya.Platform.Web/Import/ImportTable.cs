using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Apya.Platform.Web.Export;
using ClosedXML.Excel;

namespace Apya.Platform.Web.Import;

/// <summary>
/// İçe aktarılan dosyanın hücre ızgarası (satır ve sütun 1 tabanlı, 1. satır başlık): Excel'in ilk
/// sayfası ya da CSV'nin tamamı. Okuyucu (<see cref="ExcelImport.Read"/>) biçimi bilmez.
/// </summary>
internal abstract class ImportTable : IDisposable
{
    public abstract int LastColumn { get; }
    public abstract int LastRow { get; }

    /// <summary>Tarih hücresi <see cref="DateTime"/>, sayı hücresi <see cref="double"/>, diğerleri metin; boşsa <c>null</c>.</summary>
    public abstract object? Value(int row, int column);

    public abstract string Text(int row, int column);

    public virtual void Dispose()
    {
    }

    /// <summary>Dosya ne Excel ne de metinse <c>null</c>.</summary>
    public static ImportTable? Open(Stream stream)
    {
        using var buffer = new MemoryStream();
        stream.CopyTo(buffer);
        var bytes = buffer.ToArray();

        // .xlsx bir zip'tir ("PK" ile başlar); öyle değilse dosya metin (CSV) olarak denenir.
        if (bytes.Length >= 2 && bytes[0] == (byte)'P' && bytes[1] == (byte)'K')
        {
            try
            {
                return new XlsxTable(new XLWorkbook(new MemoryStream(bytes)));
            }
            catch (Exception)
            {
                return null;
            }
        }

        return CsvTable.Parse(bytes);
    }

    private sealed class XlsxTable : ImportTable
    {
        private readonly XLWorkbook _workbook;
        private readonly IXLWorksheet _sheet;

        public XlsxTable(XLWorkbook workbook)
        {
            _workbook = workbook;
            _sheet = workbook.Worksheet(1);
            LastColumn = _sheet.LastColumnUsed()?.ColumnNumber() ?? 0;
            LastRow = _sheet.LastRowUsed()?.RowNumber() ?? 1;
        }

        public override int LastColumn { get; }
        public override int LastRow { get; }

        public override object? Value(int row, int column)
        {
            var cell = _sheet.Cell(row, column);
            var value = cell.Value;
            if (value.IsDateTime) return value.GetDateTime();
            if (value.IsNumber) return value.GetNumber();
            if (value.IsBoolean) return value.GetBoolean().ToString();
            var text = cell.GetString().Trim();
            return text.Length == 0 ? null : text;
        }

        public override string Text(int row, int column) => _sheet.Cell(row, column).GetString();

        public override void Dispose() => _workbook.Dispose();
    }

    /// <summary>
    /// CSV: ayraç başlık satırından anlaşılır (noktalı virgül, virgül ya da sekme), tırnaklı alan ve
    /// alan içi satır sonu desteklenir. UTF-8 değilse Türkçe Windows kodlaması (1254) denenir — Excel'in
    /// "CSV (Virgülle ayrılmış)" kaydı öyle çıkar. Bütün hücreler metindir.
    /// </summary>
    private sealed class CsvTable : ImportTable
    {
        private static readonly Encoding Utf8Strict = new UTF8Encoding(false, throwOnInvalidBytes: true);
        private static readonly char[] Separators = [ExcelTable.CsvSeparator, ',', '\t'];

        private readonly List<string[]> _records;

        private CsvTable(List<string[]> records)
        {
            _records = records;
        }

        public override int LastColumn => _records.Count == 0 ? 0 : _records[0].Length;
        public override int LastRow => Math.Max(_records.Count, 1);

        public override string Text(int row, int column)
        {
            var record = row <= _records.Count ? _records[row - 1] : [];
            return column <= record.Length ? record[column - 1] : string.Empty;
        }

        public override object? Value(int row, int column)
        {
            var text = Text(row, column).Trim();
            // Dışa aktarmanın formül korumasını geri al ("'=A1" → "=A1").
            if (text.Length > 1 && text[0] == '\'' && ExcelTable.CsvFormulaStarts.Contains(text[1]))
            {
                text = text[1..];
            }

            return text.Length == 0 ? null : text;
        }

        public static CsvTable? Parse(byte[] bytes)
        {
            // İkili dosya (resim, eski .xls…) metin değildir.
            if (bytes.Length == 0 || bytes.Any(b => b < 0x20 && b != '\t' && b != '\r' && b != '\n'))
            {
                return null;
            }

            string text;
            try
            {
                text = Utf8Strict.GetString(bytes);
            }
            catch (DecoderFallbackException)
            {
                text = CodePagesEncodingProvider.Instance.GetEncoding(1254)!.GetString(bytes);
            }

            text = text.TrimStart('﻿');
            return new CsvTable(Records(text, Separator(text)));
        }

        /// <summary>Başlık satırında (tırnak dışında) en çok geçen ayraç; hiçbiri yoksa noktalı virgül.</summary>
        private static char Separator(string text)
        {
            var counts = new int[Separators.Length];
            var quoted = false;
            foreach (var ch in text)
            {
                if (ch == '"') quoted = !quoted;
                if (quoted) continue;
                if (ch == '\n' || ch == '\r') break;

                var index = Array.IndexOf(Separators, ch);
                if (index >= 0) counts[index]++;
            }

            return Separators[Array.IndexOf(counts, counts.Max())];
        }

        private static List<string[]> Records(string text, char separator)
        {
            var records = new List<string[]>();
            var fields = new List<string>();
            var field = new StringBuilder();
            var quoted = false;

            for (var i = 0; i < text.Length; i++)
            {
                var ch = text[i];
                if (quoted)
                {
                    if (ch != '"') field.Append(ch);
                    else if (i + 1 < text.Length && text[i + 1] == '"') { field.Append('"'); i++; }
                    else quoted = false;
                }
                else if (ch == '"' && field.Length == 0)
                {
                    quoted = true;
                }
                else if (ch == separator)
                {
                    fields.Add(field.ToString());
                    field.Clear();
                }
                else if (ch == '\n' || ch == '\r')
                {
                    if (ch == '\r' && i + 1 < text.Length && text[i + 1] == '\n') i++;
                    fields.Add(field.ToString());
                    field.Clear();
                    records.Add([.. fields]);
                    fields.Clear();
                }
                else
                {
                    field.Append(ch);
                }
            }

            if (field.Length > 0 || fields.Count > 0)
            {
                fields.Add(field.ToString());
                records.Add([.. fields]);
            }

            return records;
        }
    }
}
