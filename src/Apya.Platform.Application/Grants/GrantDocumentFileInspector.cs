using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using Microsoft.Extensions.Logging;
using UglyToad.PdfPig;
using UglyToad.PdfPig.AcroForms;
using UglyToad.PdfPig.AcroForms.Fields;
using UglyToad.PdfPig.Tokens;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Grants;

/// <summary>
/// Yüklenen hibe evrakından imza/kaşe ve boş alan ön kontrolü için ham bilgiyi çıkarır.
/// Yapay zekâ ya da dış servis kullanmaz; yalnız dosyanın yapısına bakar:
/// <list type="bullet">
/// <item>E-imza: değeri dolu PDF imza alanı ya da Word'ün imza parçası. İmzanın GEÇERLİLİĞİ
/// (sertifika zinciri) denetlenmez; yalnız var olup olmadığına bakılır.</item>
/// <item>Taranmış mı: sayfanın en az yarısını kaplayan görsel. Islak imza ve kaşe ancak
/// böyle bir kopyada görünebilir; Word'den basılmış PDF'te görünemez.</item>
/// <item>Boş alan: doldurulmamış PDF form alanı ve "Adı Soyadı: ........" gibi yer tutucu satırı.</item>
/// </list>
/// Okunamayan dosyada (bozuk, parolalı) null döner: ön kontrol yüklemeyi asla engellemez.
/// </summary>
public class GrantDocumentFileInspector : ITransientDependency
{
    private static readonly HashSet<string> ImageExtensions = [".png", ".jpg", ".jpeg", ".gif"];
    private static readonly HashSet<string> OtherOfficeExtensions = [".doc", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv"];

    // Etiket + iki nokta + yalnız nokta/alt çizgi: "Adı Soyadı: ............"
    private static readonly Regex PlaceholderLine = new(@"^(?<label>[^:]{2,80}):(?<rest>[\s._…]*)$", RegexOptions.Compiled);

    private readonly ILogger<GrantDocumentFileInspector> _logger;

    public GrantDocumentFileInspector(ILogger<GrantDocumentFileInspector> logger)
    {
        _logger = logger;
    }

    public GrantDocumentFileInspection? Inspect(Stream content, string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        try
        {
            if (extension == ".pdf") { return InspectPdf(ReadAll(content)); }
            if (extension == ".docx") { return InspectDocx(content); }
            if (ImageExtensions.Contains(extension)) { return new GrantDocumentFileInspection(false, true, null); }

            // Elektronik tablo / eski Word: içi okunmuyor, ama taranmış kopya olmadığı kesin.
            if (OtherOfficeExtensions.Contains(extension)) { return new GrantDocumentFileInspection(false, false, null); }

            return null; // zip, rar: içinde ne olduğu bilinmez
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Hibe evrakı ön kontrolü okunamadı: {FileName}", fileName);
            return null;
        }
    }

    private static GrantDocumentFileInspection InspectPdf(byte[] bytes)
    {
        using var document = PdfDocument.Open(bytes);
        var hasSignature = false;
        var looksScanned = false;
        var emptyCount = 0;

        foreach (var page in document.GetPages())
        {
            var pageArea = page.Width * page.Height;
            var scannedPage = pageArea > 0 && page.GetImages()
                .Any(i => Math.Abs(i.Bounds.Width * i.Bounds.Height) >= pageArea * 0.5);
            looksScanned |= scannedPage;

            // Taranmış sayfanın metin katmanı (OCR) elle doldurulmuş alanı nokta diye okur.
            if (!scannedPage) { emptyCount += CountPlaceholders(PdfLines(page)); }
        }

        if (document.TryGetForm(out var form))
        {
            // İmzalanmış alanın /V değeri imza sözlüğüdür; boş imza kutusunda /V yoktur.
            // Dosyada sahipsiz kalmış imza nesnesi (eski sürümden artık) sayılmaz.
            hasSignature = form.GetFields().OfType<AcroSignatureField>()
                .Any(f => f.Dictionary.ContainsKey(NameToken.V));

            emptyCount += form.GetFields().OfType<AcroTextField>()
                .Count(f => !f.Flags.HasFlag(AcroTextFieldFlags.ReadOnly) && string.IsNullOrWhiteSpace(f.Value));
        }

        return new GrantDocumentFileInspection(hasSignature, looksScanned, emptyCount);
    }

    /// <summary>Sözcükleri taban çizgisine göre satırlara toplar (PdfPig satır vermez).</summary>
    private static IEnumerable<string> PdfLines(UglyToad.PdfPig.Content.Page page)
    {
        var words = page.GetWords()
            .OrderByDescending(w => w.BoundingBox.Bottom).ThenBy(w => w.BoundingBox.Left).ToList();

        var line = new List<UglyToad.PdfPig.Content.Word>();
        foreach (var word in words)
        {
            if (line.Count > 0 && Math.Abs(line[0].BoundingBox.Bottom - word.BoundingBox.Bottom) > 2)
            {
                yield return string.Join(" ", line.OrderBy(w => w.BoundingBox.Left).Select(w => w.Text));
                line.Clear();
            }
            line.Add(word);
        }
        if (line.Count > 0) { yield return string.Join(" ", line.OrderBy(w => w.BoundingBox.Left).Select(w => w.Text)); }
    }

    private static GrantDocumentFileInspection InspectDocx(Stream content)
    {
        using var zip = new ZipArchive(content, ZipArchiveMode.Read, leaveOpen: true);
        var hasSignature = zip.Entries.Any(e => e.FullName.StartsWith("_xmlsignatures/", StringComparison.OrdinalIgnoreCase));

        var body = zip.GetEntry("word/document.xml");
        if (body == null) { return new GrantDocumentFileInspection(hasSignature, false, null); }

        XNamespace w = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
        XDocument xml;
        using (var stream = body.Open()) { xml = XDocument.Load(stream); }

        var lines = xml.Descendants(w + "p")
            .Select(p => string.Concat(p.Descendants(w + "t").Select(t => t.Value)));

        // Word'ün içine yapıştırılmış taranmış sayfa nadir; görsel aranmaz.
        return new GrantDocumentFileInspection(hasSignature, false, CountPlaceholders(lines));
    }

    internal static int CountPlaceholders(IEnumerable<string> lines)
    {
        var count = 0;
        foreach (var line in lines)
        {
            var match = PlaceholderLine.Match(line.Trim());
            if (!match.Success || match.Groups["rest"].Value.Count(c => c != ' ' && !char.IsWhiteSpace(c)) < 3)
            {
                continue;
            }

            // İmza/kaşe satırı boş alan değil; onu imza denetimi söyler.
            if (GrantDocumentSignatureRules.MentionsSignatureOrStamp(match.Groups["label"].Value)) { continue; }

            count++;
        }
        return count;
    }

    private static byte[] ReadAll(Stream content)
    {
        using var copy = new MemoryStream();
        content.CopyTo(copy);
        return copy.ToArray();
    }
}
