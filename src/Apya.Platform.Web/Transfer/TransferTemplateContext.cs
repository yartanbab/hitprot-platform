using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.DataTransfers.Dtos;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Http;

namespace Apya.Platform.Web.Transfer;

/// <summary>
/// İstekte seçilen aktarım şablonu (adreste <c>template=&lt;kimlik&gt;</c>). Şablonu erişim süzgeci
/// yükler ve isteğe bırakır; dışa aktarma çıkışı ve içe aktarma okuyucusu buradan uygular. Şablonun
/// sütun anahtarı modülün standart sütun başlığıdır; modülde artık olmayan anahtar yok sayılır.
/// </summary>
public static class TransferTemplateContext
{
    public const string QueryKey = "template";

    private const string ItemKey = "Apya.Transfer.Template";

    public static void Set(HttpContext context, DataTransferTemplateDto template) => context.Items[ItemKey] = template;

    public static DataTransferTemplateDto? Get(HttpContext context) => context.Items[ItemKey] as DataTransferTemplateDto;

    /// <summary>
    /// Dışa aktarma: şablondaki sütunlar, şablondaki sırayla ve şablondaki başlıkla. Hiçbir anahtar
    /// eşleşmiyorsa (modülün sütunları değişmiş) standart sütunlar kalır — boş dosya verilmez.
    /// </summary>
    internal static IReadOnlyList<ExcelColumn<T>> Apply<T>(DataTransferTemplateDto? template, IReadOnlyList<ExcelColumn<T>> columns)
    {
        if (template == null)
        {
            return columns;
        }

        var selected = template.Columns
            .Select(c => (Column: columns.FirstOrDefault(x => x.Header == c.Key), c.Header))
            .Where(x => x.Column != null)
            .Select(x => x.Column! with { Header = x.Header })
            .ToList();
        return selected.Count > 0 ? selected : columns;
    }

    /// <summary>
    /// İçe aktarma: standart başlık → dosyada aranacak başlık. Şablonda olmayan sütun standart
    /// başlığıyla aranmaya devam eder.
    /// </summary>
    public static IReadOnlyDictionary<string, string> Aliases(DataTransferTemplateDto? template)
        => template == null
            ? new Dictionary<string, string>()
            : template.Columns.GroupBy(c => c.Key).ToDictionary(g => g.Key, g => g.First().Header);

    /// <summary>
    /// İçe aktarma şablon dosyasının sütunları: şablondakiler, şablondaki sırayla ve başlıkla; şablonda
    /// olmayan ZORUNLU sütunlar sona eklenir (indirilen dosya her zaman içe aktarılabilir olsun).
    /// </summary>
    public static IReadOnlyList<ImportColumn> TemplateFileColumns(DataTransferTemplateDto? template, IReadOnlyList<ImportColumn> columns)
    {
        if (template == null)
        {
            return columns;
        }

        var selected = template.Columns
            .Select(c => (Column: columns.FirstOrDefault(x => x.Header == c.Key), c.Header))
            .Where(x => x.Column != null)
            .Select(x => x.Column! with { Header = x.Header })
            .ToList();
        var keys = template.Columns.Select(c => c.Key).ToHashSet(StringComparer.Ordinal);
        selected.AddRange(columns.Where(c => c.Required && !keys.Contains(c.Header)));
        return selected;
    }
}
