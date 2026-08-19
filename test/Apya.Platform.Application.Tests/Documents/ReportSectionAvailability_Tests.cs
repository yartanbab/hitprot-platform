using System;
using System.Linq;
using Apya.Platform.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Bölüm uygunluğu şablon tohumlamasını ve UI'daki "veri henüz yok" işaretini
/// besliyor; yanlışlıkla açılan bir bölüm kuruma BOŞ sayfa gönderir, yanlışlıkla
/// kapalı kalan bölüm ise mevcut veriyi rapordan düşürür. İkisi de sessiz hata,
/// bu yüzden liste testle sabitlendi.
/// </summary>
public class ReportSectionAvailability_Tests
{
    [Theory]
    [InlineData(ReportSectionKey.CoverPage)]
    [InlineData(ReportSectionKey.ProjectSummary)]
    [InlineData(ReportSectionKey.WorkStepProgress)]
    [InlineData(ReportSectionKey.ComplianceStatus)]
    [InlineData(ReportSectionKey.MissingDocuments)]
    [InlineData(ReportSectionKey.AnnexIndex)]
    [InlineData(ReportSectionKey.AuditTrail)]
    public void Faz_C_bolumleri_uygun_olmali(ReportSectionKey key)
    {
        ReportSectionAvailability.IsAvailable(key).ShouldBeTrue();
    }

    /// <summary>
    /// Faz E bu dört bölümün verisini üretti; liste Faz C'den kalma olduğu için
    /// bir süre bayat kaldı. Geri düşerse test yakalar.
    /// </summary>
    [Theory]
    [InlineData(ReportSectionKey.Timeline)]
    [InlineData(ReportSectionKey.ExpenseDocumentMatch)]
    [InlineData(ReportSectionKey.Risks)]
    [InlineData(ReportSectionKey.TeamContribution)]
    public void Faz_E_verisi_gelen_bolumler_uygun_olmali(ReportSectionKey key)
    {
        ReportSectionAvailability.IsAvailable(key).ShouldBeTrue();
    }

    /// <summary>
    /// Kilometre taşının karşılığı bir varlık YOK. Biri bunu açarsa rapora
    /// uydurma ya da boş bir bölüm girer — kasıtlı olarak kapalı.
    /// </summary>
    [Fact]
    public void Kilometre_tasi_veri_olmadigi_icin_kapali_kalmali()
    {
        ReportSectionAvailability.IsAvailable(ReportSectionKey.Milestones).ShouldBeFalse();
    }

    /// <summary>
    /// Enum'a yeni bir bölüm eklenirse uygunluğu bilinçli olarak kararlaştırılsın
    /// diye tam sayım: bugün 12 anahtarın 11'i açık.
    /// </summary>
    [Fact]
    public void Uygun_bolum_sayisi_beklenen_olmali()
    {
        var all = Enum.GetValues<ReportSectionKey>();

        all.Length.ShouldBe(12);
        all.Count(ReportSectionAvailability.IsAvailable).ShouldBe(11);
    }
}
