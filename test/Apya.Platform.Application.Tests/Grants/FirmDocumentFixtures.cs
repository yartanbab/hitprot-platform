using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;

namespace Apya.Platform.Tests.Application.Grants;

/// <summary>Belgeden okuma testleri için elle kurulan dosyalar (gerçek bayt, kütüphane üretmez).</summary>
public static class FirmDocumentFixtures
{
    /// <summary>Her dizi bir sayfa; her öğe bir satır. Boş dizi metinsiz sayfadır (taranmış sayfa gibi).</summary>
    public static byte[] Pdf(params string[][] pages)
    {
        var objects = new List<string>
        {
            "<< /Type /Catalog /Pages 2 0 R >>",
            $"<< /Type /Pages /Kids [{string.Join(" ", pages.Select((_, i) => $"{4 + i * 2} 0 R"))}] /Count {pages.Length} >>",
            "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
        };
        for (var i = 0; i < pages.Length; i++)
        {
            var content = string.Join("\n", pages[i].Select((t, n) => $"BT /F1 12 Tf 72 {760 - n * 24} Td ({t}) Tj ET"));
            objects.Add($"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents {5 + i * 2} 0 R >>");
            objects.Add($"<< /Length {content.Length} >>\nstream\n{content}\nendstream");
        }

        var latin1 = Encoding.Latin1;
        var pdf = new StringBuilder("%PDF-1.4\n");
        var offsets = new List<int>();
        for (var i = 0; i < objects.Count; i++)
        {
            offsets.Add(latin1.GetByteCount(pdf.ToString()));
            pdf.Append($"{i + 1} 0 obj\n{objects[i]}\nendobj\n");
        }

        var xref = latin1.GetByteCount(pdf.ToString());
        pdf.Append($"xref\n0 {objects.Count + 1}\n0000000000 65535 f \n");
        foreach (var offset in offsets) { pdf.Append($"{offset:D10} 00000 n \n"); }
        pdf.Append($"trailer\n<< /Size {objects.Count + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF");
        return latin1.GetBytes(pdf.ToString());
    }

    public static byte[] Docx(params string[] paragraphs)
    {
        using var buffer = new MemoryStream();
        using (var zip = new ZipArchive(buffer, ZipArchiveMode.Create, leaveOpen: true))
        {
            var body = string.Concat(paragraphs.Select(p => $"<w:p><w:r><w:t>{p}</w:t></w:r></w:p>"));
            using var writer = new StreamWriter(zip.CreateEntry("word/document.xml").Open());
            writer.Write("<w:document xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\">" +
                         $"<w:body>{body}</w:body></w:document>");
        }
        return buffer.ToArray();
    }
}
