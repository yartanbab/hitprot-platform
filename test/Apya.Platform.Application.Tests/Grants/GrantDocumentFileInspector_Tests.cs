using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using Microsoft.Extensions.Logging.Abstractions;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Application.Grants;

/// <summary>
/// Ön kontrol gerçek dosya baytlarıyla sınanır: test PDF'leri elle kurulur
/// (metin, tam sayfa görsel, form alanı, imza sözlüğü).
/// </summary>
public class GrantDocumentFileInspector_Tests
{
    private readonly GrantDocumentFileInspector _sut = new(NullLogger<GrantDocumentFileInspector>.Instance);

    private GrantDocumentFileInspection? Inspect(byte[] bytes, string fileName) =>
        _sut.Inspect(new MemoryStream(bytes), fileName);

    [Fact]
    public void Word_ciktisi_PDF_imzasiz_ve_taranmamis_okunur()
    {
        var result = Inspect(Pdf(["Adi Soyadi: Ahmet Yilmaz", "Unvan: Genel Mudur"]), "plan.pdf");

        result.ShouldBe(new GrantDocumentFileInspection(false, false, 0));
    }

    [Fact]
    public void Doldurulmamis_yer_tutucular_sayilir_imza_ve_muhur_satiri_haric()
    {
        var result = Inspect(Pdf([
            "Adi Soyadi: ..............",
            "Tarih: ________",
            "Unvan: Genel Mudur",
            "Yetkili imza: ..............",
            "Mühür: .........."
        ]), "form.pdf");

        result!.EmptyFieldCount.ShouldBe(2);
    }

    [Fact]
    public void Turkce_harfsiz_yazilmis_imza_ve_kase_satiri_bos_alan_sayilmaz()
    {
        // Türkçe küçültmede "IMZA" noktasız "ımza" olur; bu satırlar boş alan sayılıyordu.
        var result = Inspect(Pdf([
            "Adi Soyadi: ..............",
            "Imza: ..............",
            "IMZA / KASE: ..............",
            "Muhur: .........."
        ]), "ascii.pdf");

        result!.EmptyFieldCount.ShouldBe(1);
    }

    [Fact]
    public void Tam_sayfa_gorsel_taranmis_sayilir_ve_OCR_noktalari_bos_alan_sayilmaz()
    {
        var result = Inspect(Pdf(["Adi Soyadi: .............."], fullPageImage: true), "tarama.pdf");

        result.ShouldBe(new GrantDocumentFileInspection(false, true, 0));
    }

    [Fact]
    public void Imza_sozlugu_olan_PDF_e_imzali_sayilir()
    {
        Inspect(Pdf(["Taahhutname"], signed: true), "kays.pdf")!.HasDigitalSignature.ShouldBeTrue();
    }

    [Fact]
    public void Bos_form_alani_sayilir_dolu_alan_sayilmaz()
    {
        Inspect(Pdf(["Basvuru"], formFieldValue: ""), "f.pdf")!.EmptyFieldCount.ShouldBe(1);
        Inspect(Pdf(["Basvuru"], formFieldValue: "Apya"), "f.pdf")!.EmptyFieldCount.ShouldBe(0);
    }

    [Fact]
    public void Bozuk_PDF_yuklemeyi_engellemez_null_doner()
    {
        Inspect(Encoding.ASCII.GetBytes("bu bir pdf degil"), "bozuk.pdf").ShouldBeNull();
    }

    [Fact]
    public void Gorsel_taranmis_tablo_taranmamis_arsiv_bilinmez_sayilir()
    {
        Inspect([1, 2, 3], "foto.JPG").ShouldBe(new GrantDocumentFileInspection(false, true, null));
        Inspect([1, 2, 3], "maliyet.xlsx").ShouldBe(new GrantDocumentFileInspection(false, false, null));
        Inspect([1, 2, 3], "ekler.zip").ShouldBeNull();
    }

    [Fact]
    public void Word_belgesinde_yer_tutucu_ve_imza_parcasi_okunur()
    {
        var result = Inspect(Docx(["Adı Soyadı: ..........", "Firma: Apya A.Ş.", "İmza: ........"], signed: true), "beyan.docx");

        result.ShouldBe(new GrantDocumentFileInspection(true, false, 1));
    }

    // ------------------------------------------------------------------ test dosyaları

    private static byte[] Pdf(IEnumerable<string> lines, bool fullPageImage = false, bool signed = false, string? formFieldValue = null)
    {
        var content = string.Join("\n", lines.Select((t, i) => $"BT /F1 12 Tf 72 {760 - i * 24} Td ({t}) Tj ET"));
        if (fullPageImage) { content += "\nq 595 0 0 842 0 0 cm /Im1 Do Q"; }

        var fields = new List<string>();
        if (formFieldValue != null) { fields.Add("8 0 R"); }
        if (signed) { fields.Add("9 0 R"); }

        var objects = new[]
        {
            "<< /Type /Catalog /Pages 2 0 R /AcroForm 7 0 R >>",
            "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
            "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] " +
                "/Resources << /Font << /F1 4 0 R >> /XObject << /Im1 6 0 R >> >> /Contents 5 0 R >>",
            "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
            $"<< /Length {content.Length} >>\nstream\n{content}\nendstream",
            "<< /Type /XObject /Subtype /Image /Width 1 /Height 1 /ColorSpace /DeviceGray /BitsPerComponent 8 /Length 1 >>\nstream\nÿ\nendstream",
            $"<< /Fields [{string.Join(" ", fields)}] >>",
            $"<< /FT /Tx /T (Ad) /V ({formFieldValue}) /Type /Annot /Subtype /Widget /Rect [72 500 300 520] /P 3 0 R >>",
            "<< /FT /Sig /T (Imza) /V 10 0 R /Type /Annot /Subtype /Widget /Rect [0 0 0 0] /P 3 0 R >>",
            "<< /Type /Sig /Filter /Adobe.PPKLite /SubFilter /ETSI.CAdES.detached /ByteRange [0 10 20 30] /Contents <00> >>"
        };

        var latin1 = Encoding.Latin1;
        var pdf = new StringBuilder("%PDF-1.4\n");
        var offsets = new List<int>();
        for (var i = 0; i < objects.Length; i++)
        {
            offsets.Add(latin1.GetByteCount(pdf.ToString()));
            pdf.Append($"{i + 1} 0 obj\n{objects[i]}\nendobj\n");
        }

        var xref = latin1.GetByteCount(pdf.ToString());
        pdf.Append($"xref\n0 {objects.Length + 1}\n0000000000 65535 f \n");
        foreach (var offset in offsets) { pdf.Append($"{offset:D10} 00000 n \n"); }
        pdf.Append($"trailer\n<< /Size {objects.Length + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF");
        return latin1.GetBytes(pdf.ToString());
    }

    private static byte[] Docx(IEnumerable<string> paragraphs, bool signed)
    {
        using var buffer = new MemoryStream();
        using (var zip = new ZipArchive(buffer, ZipArchiveMode.Create, leaveOpen: true))
        {
            var body = string.Concat(paragraphs.Select(p => $"<w:p><w:r><w:t>{p}</w:t></w:r></w:p>"));
            using (var writer = new StreamWriter(zip.CreateEntry("word/document.xml").Open()))
            {
                writer.Write("<w:document xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\">" +
                             $"<w:body>{body}</w:body></w:document>");
            }
            if (signed)
            {
                using var writer = new StreamWriter(zip.CreateEntry("_xmlsignatures/sig1.xml").Open());
                writer.Write("<Signature/>");
            }
        }
        return buffer.ToArray();
    }
}
