using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Xml.Linq;
using Microsoft.Extensions.Logging;
using UglyToad.PdfPig;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Grants;

/// <summary>Belgeden okunan metin: sayfalar, belgenin sayfa sayısı ve sınırın aşılıp aşılmadığı.</summary>
public sealed record FirmDocumentText(IReadOnlyList<FirmDocumentPage> Pages, int? PageCount, bool IsTruncated)
{
    public bool IsEmpty => Pages.Count == 0;
}

/// <summary>
/// Kurum belgesinin metnini sayfa sayfa okur: metin katmanı olan PDF ve Word (.docx). Görüntü
/// okuma (OCR) YOK — taranmış belgede metin çıkmaz ve belge "okunamadı" sayılır.
/// Bozuk ya da parolalı dosyada da boş döner; ayrıntı günlüğe yazılır.
/// </summary>
public class FirmDocumentTextReader : ITransientDependency
{
    public static readonly IReadOnlyCollection<string> SupportedExtensions = [".pdf", ".docx"];

    private readonly ILogger<FirmDocumentTextReader> _logger;

    public FirmDocumentTextReader(ILogger<FirmDocumentTextReader> logger)
    {
        _logger = logger;
    }

    public static bool IsSupported(string fileName)
        => SupportedExtensions.Contains(Path.GetExtension(fileName).ToLowerInvariant());

    public FirmDocumentText Read(Stream content, string fileName, int maxLength = FirmDataExtractionConsts.MaxTextLength)
    {
        try
        {
            return Path.GetExtension(fileName).ToLowerInvariant() switch
            {
                ".pdf" => Limit(ReadPdf(content, out var pageCount), pageCount, maxLength),
                ".docx" => Limit(ReadDocx(content), null, maxLength),
                _ => Empty
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Kurum belgesinin metni okunamadı: {FileName}", fileName);
            return Empty;
        }
    }

    private static FirmDocumentText Empty => new(Array.Empty<FirmDocumentPage>(), null, false);

    private static List<FirmDocumentPage> ReadPdf(Stream content, out int pageCount)
    {
        using var copy = new MemoryStream();
        content.CopyTo(copy);
        using var document = PdfDocument.Open(copy.ToArray());
        pageCount = document.NumberOfPages;

        return document.GetPages()
            .Select(page => new FirmDocumentPage(page.Number, string.Join("\n", GrantDocumentFileInspector.PdfLines(page))))
            .ToList();
    }

    private static List<FirmDocumentPage> ReadDocx(Stream content)
    {
        using var zip = new ZipArchive(content, ZipArchiveMode.Read, leaveOpen: true);
        var body = zip.GetEntry("word/document.xml");
        if (body == null)
        {
            return new List<FirmDocumentPage>();
        }

        XNamespace w = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
        XDocument xml;
        using (var stream = body.Open())
        {
            xml = XDocument.Load(stream);
        }

        // Word sayfa bilgisi taşımaz (sayfalama görüntülenirken yapılır): tek parça metin.
        var text = string.Join("\n", xml.Descendants(w + "p")
            .Select(p => string.Concat(p.Descendants(w + "t").Select(t => t.Value))));
        return new List<FirmDocumentPage> { new(null, text) };
    }

    /// <summary>Boş sayfaları atar ve toplam metni sınıra indirir; aşan sayfa kesilir, sonrakiler okunmaz.</summary>
    private static FirmDocumentText Limit(List<FirmDocumentPage> pages, int? pageCount, int maxLength)
    {
        var kept = new List<FirmDocumentPage>();
        var used = 0;
        var truncated = false;

        foreach (var page in pages)
        {
            var text = page.Text.Trim();
            if (text.Length == 0)
            {
                continue;
            }
            if (used + text.Length > maxLength)
            {
                var room = maxLength - used;
                if (room > 0)
                {
                    kept.Add(page with { Text = text[..room] });
                }
                truncated = true;
                break;
            }
            kept.Add(page with { Text = text });
            used += text.Length;
        }

        return new FirmDocumentText(kept, pageCount, truncated);
    }
}
