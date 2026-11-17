using System.IO;
using System.Linq;
using Microsoft.Extensions.Logging.Abstractions;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;
using static Apya.Platform.Tests.Application.Grants.FirmDocumentFixtures;

namespace Apya.Platform.Tests.Application.Grants;

/// <summary>Kurum belgesinin metni sayfa numarasıyla okunur; metni olmayan belge "boş" döner (OCR yok).</summary>
public class FirmDocumentTextReader_Tests
{
    private readonly FirmDocumentTextReader _sut = new(NullLogger<FirmDocumentTextReader>.Instance);

    private FirmDocumentText Read(byte[] bytes, string fileName, int maxLength = FirmDataExtractionConsts.MaxTextLength)
        => _sut.Read(new MemoryStream(bytes), fileName, maxLength);

    [Fact]
    public void PDF_sayfalari_numarasiyla_okunur_metinsiz_sayfa_atlanir()
    {
        var text = Read(Pdf(["Faaliyet Raporu 2025"], [], ["Es finansman kapasitesi: 250000 TL"]), "rapor.pdf");

        text.PageCount.ShouldBe(3);
        text.IsTruncated.ShouldBeFalse();
        text.Pages.Select(p => p.Number).ShouldBe(new int?[] { 1, 3 });
        text.Pages[1].Text.ShouldContain("250000 TL");
    }

    [Fact]
    public void Word_belgesi_tek_parca_okunur_sayfasi_bilinmez()
    {
        var text = Read(Docx("Stratejik Plan", "Hedefimiz bölgesel kalkınma."), "plan.docx");

        text.PageCount.ShouldBeNull();
        text.Pages.Count.ShouldBe(1);
        text.Pages[0].Number.ShouldBeNull();
        text.Pages[0].Text.ShouldBe("Stratejik Plan\nHedefimiz bölgesel kalkınma.");
    }

    [Fact]
    public void Metni_olmayan_belge_bos_doner()
    {
        Read(Pdf([], []), "tarama.pdf").IsEmpty.ShouldBeTrue("taranmış belge: görüntü okunmaz");
    }

    [Fact]
    public void Bozuk_ve_desteklenmeyen_dosya_bos_doner()
    {
        Read(new byte[] { 1, 2, 3 }, "bozuk.pdf").IsEmpty.ShouldBeTrue();
        Read(Docx("Merhaba"), "tablo.xlsx").IsEmpty.ShouldBeTrue();
        FirmDocumentTextReader.IsSupported("Rapor.PDF").ShouldBeTrue();
        FirmDocumentTextReader.IsSupported("eski.doc").ShouldBeFalse();
    }

    [Fact]
    public void Sinir_asilinca_metin_kesilir_ve_sonraki_sayfalar_okunmaz()
    {
        var text = Read(Pdf(["AAAAAAAAAA"], ["BBBBBBBBBB"], ["CCCCCCCCCC"]), "uzun.pdf", maxLength: 15);

        text.IsTruncated.ShouldBeTrue();
        text.Pages.Select(p => p.Text).ShouldBe(new[] { "AAAAAAAAAA", "BBBBB" });
        text.PageCount.ShouldBe(3);
    }
}
