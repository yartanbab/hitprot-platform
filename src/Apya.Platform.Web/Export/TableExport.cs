using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Web.Transfer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Timing;

namespace Apya.Platform.Web.Export;

/// <summary>
/// Liste dışa aktarımının tek çıkışı. Ekran sütunlarını ve satırlarını verir; dosya biçimi burada
/// seçilir: adreste <c>format=csv</c> varsa CSV, yoksa Excel.
/// </summary>
internal static class TableExport
{
    public const string FormatQueryKey = "format";

    /// <summary>Biçim adresten, form gönderiminde (süzgeç formundaki düğme) form alanından okunur.</summary>
    public static bool IsCsv(this PageModel page)
    {
        var request = page.Request;
        var format = request.Query[FormatQueryKey].ToString();
        if (format.Length == 0 && request.HasFormContentType)
        {
            format = request.Form[FormatQueryKey].ToString();
        }

        return string.Equals(format, "csv", StringComparison.OrdinalIgnoreCase);
    }

    /// <param name="name">Dosya adı (tarih ve uzantı eklenir).</param>
    /// <param name="sheetName">Excel sayfa adı; boşsa <paramref name="name"/>.</param>
    public static FileContentResult TableFile<T>(this PageModel page, string name, IReadOnlyList<ExcelColumn<T>> columns,
        IEnumerable<T> rows, string? note = null, string? sheetName = null)
    {
        var now = page.HttpContext.RequestServices.GetRequiredService<IClock>().Now;
        var list = rows as IReadOnlyCollection<T> ?? rows.ToList();

        // Şablon seçildiyse sütun seti, sırası ve başlıkları ondan gelir; biçim adreste verilmediyse de.
        var template = TransferTemplateContext.Get(page.HttpContext);
        columns = TransferTemplateContext.Apply(template, columns);
        var csv = template != null && !page.Request.Query.ContainsKey(FormatQueryKey)
            ? template.Format == Apya.Platform.DataTransfers.DataTransferFileFormat.Csv
            : page.IsCsv();
        var fileName = ExcelTable.FileName(name, now, csv ? "csv" : "xlsx");

        // İşlem geçmişi satır sayısını buradan alır.
        TransferReport.Set(page.HttpContext, new TransferReport
        {
            FileName = fileName, Format = csv ? "csv" : "xlsx", TotalRows = list.Count, SucceededRows = list.Count
        });

        return csv
            ? page.File(ExcelTable.BuildCsv(columns, list), ExcelTable.CsvContentType, fileName)
            : page.File(ExcelTable.Build(sheetName ?? name, columns, list, note), ExcelTable.ContentType, fileName);
    }
}
