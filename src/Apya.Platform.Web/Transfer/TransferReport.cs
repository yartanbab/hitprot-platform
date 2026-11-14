using System.IO;
using Microsoft.AspNetCore.Http;

namespace Apya.Platform.Web.Transfer;

/// <summary>
/// Aktarım ucunun işlem geçmişine bildirdiği ayrıntı (dosya adı, biçim, satır sayıları). Uç bunu
/// isteğe bırakır; kaydı <see cref="TransferAccessPageFilter"/> yazar. Bildirmeyen uç da kaydedilir,
/// yalnız sayıları boş kalır.
/// </summary>
public sealed class TransferReport
{
    private const string ItemKey = "Apya.Transfer.Report";

    public string? FileName { get; init; }
    public string? Format { get; init; }
    public int? TotalRows { get; init; }
    public int? SucceededRows { get; init; }
    public int? FailedRows { get; init; }

    public static void Set(HttpContext context, TransferReport report) => context.Items[ItemKey] = report;

    public static TransferReport? Get(HttpContext context) => context.Items[ItemKey] as TransferReport;

    /// <summary>Dosya adından biçim ("giderler.CSV" → "csv").</summary>
    public static string? FormatOf(string? fileName)
    {
        var extension = Path.GetExtension(fileName ?? string.Empty).TrimStart('.').ToLowerInvariant();
        return extension.Length == 0 ? null : extension;
    }
}
