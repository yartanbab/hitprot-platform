using System;
using System.Collections.Generic;
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

    public static bool IsCsv(this PageModel page)
        => string.Equals(page.Request.Query[FormatQueryKey], "csv", StringComparison.OrdinalIgnoreCase);

    /// <param name="name">Dosya adı (tarih ve uzantı eklenir).</param>
    /// <param name="sheetName">Excel sayfa adı; boşsa <paramref name="name"/>.</param>
    public static FileContentResult TableFile<T>(this PageModel page, string name, IReadOnlyList<ExcelColumn<T>> columns,
        IEnumerable<T> rows, string? note = null, string? sheetName = null)
    {
        var now = page.HttpContext.RequestServices.GetRequiredService<IClock>().Now;
        return page.IsCsv()
            ? page.File(ExcelTable.BuildCsv(columns, rows), ExcelTable.CsvContentType, ExcelTable.FileName(name, now, "csv"))
            : page.File(ExcelTable.Build(sheetName ?? name, columns, rows, note), ExcelTable.ContentType, ExcelTable.FileName(name, now));
    }
}
