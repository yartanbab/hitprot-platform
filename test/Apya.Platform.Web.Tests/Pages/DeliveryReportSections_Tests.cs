using System;
using System.Collections.Generic;
using Apya.Platform.Documents;
using Apya.Platform.Web.Pages.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 🔴 S4 · Rapor çıktısında DÖRT bölüm sessizce boş kalıyordu.
///
/// <para><see cref="ReportSectionAvailability"/> Zaman çizelgesi, Gider–belge
/// eşleşmesi, Risk kütüğü ve Ekip katkısı için "verisi var" diyordu; tohumlanan
/// şablonlar bu bölümleri AÇIK getiriyordu (ör. KOSGEB ara raporu zaman çizelgesi +
/// gider eşleşmesini açar) ama exporter'ın switch'inde karşılıkları YOKTU. Kullanıcı
/// bölümü açıyor, kuruma giden PDF'te o sayfa hiç olmuyordu.</para>
///
/// <para>Ölçüt baytın kendisi değil FARK: aynı model, aynı veri, yalnız dört bölüm
/// açık/kapalı. Açıkken çıktı büyümüyorsa bölüm çizilmiyor demektir.</para>
/// </summary>
public class DeliveryReportSections_Tests
{
    /// <summary>
    /// 🔴 Exporter QuestPDF kullanıyor ve lisans AYARLANMADAN çizim yapmaz
    /// (PlatformWebModule başlangıçta ayarlıyor). Bu test web host'u ayağa
    /// kaldırmadığı için aynı ayarı kendisi yapmak zorunda.
    /// </summary>
    static DeliveryReportSections_Tests()
    {
        QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
    }

    private static readonly ReportSectionKey[] FourSections =
    {
        ReportSectionKey.Timeline,
        ReportSectionKey.ExpenseDocumentMatch,
        ReportSectionKey.Risks,
        ReportSectionKey.TeamContribution,
    };

    /// <summary>Dört bölümün verisi dolu, ortak bölümler her iki modelde aynı.</summary>
    private static DeliveryReportModel BuildModel(IEnumerable<ReportSectionKey> sections)
    {
        return new DeliveryReportModel
        {
            PackageName = "Ara rapor",
            ProjectName = "Isı Geri Kazanım",
            ProjectCode = "PRJ-R1",
            GeneratedAt = new DateTime(2026, 10, 5, 9, 0, 0),
            GeneratedBy = "test",
            Sections = new List<ReportSectionKey>(sections),

            Summary = new DeliveryReportModel.ProjectSummaryBlock
            {
                CompliancePercent = 80,
                DocumentCount = 12,
                MissingCount = 2,
                DocumentedAmount = 125_000m,
            },

            Timeline = new List<DeliveryReportModel.TimelineRow>
            {
                new() { Order = 1, Name = "Tasarım", StartDate = new DateTime(2026, 1, 1), EndDate = new DateTime(2026, 3, 1), ProgressPercent = 100 },
                new() { Order = 2, Name = "Kurulum", StartDate = new DateTime(2026, 3, 1), ProgressPercent = 40 },
            },

            BudgetCoverage = new DeliveryReportModel.BudgetCoverageBlock
            {
                TotalBudget = 500_000m,
                TotalExpense = 180_000m,
                DocumentedExpense = 125_000m,
                UndocumentedExpense = 55_000m,
                UndocumentedCount = 3,
                BudgetUsedPercent = 36,
                DocumentedPercent = 69,
            },

            Risks = new List<DeliveryReportModel.RiskRow>
            {
                new() { Title = "Tedarik gecikmesi", WorkStepName = "Kurulum", Likelihood = 4, Impact = 5, Score = 20, Mitigation = "İkinci tedarikçi" },
                new() { Title = "Kur artışı", Likelihood = 3, Impact = 3, Score = 9, IsClosed = true },
            },

            Contributors = new List<DeliveryReportModel.ContributorRow>
            {
                new() { UserName = "Ayşe Yılmaz", LoggedHours = 48m, LoggedPersonDays = 6m, SharePercent = 75, TaskCount = 7 },
                new() { UserName = "Veli Demir", LoggedHours = 16m, LoggedPersonDays = 2m, SharePercent = 25, TaskCount = 2 },
            },
        };
    }

    [Fact]
    public void Dort_bolum_acikken_cikti_gercekten_buyuyor()
    {
        var withoutFour = DeliveryPackageExporter.ToPdf(
            BuildModel(new[] { ReportSectionKey.ProjectSummary }));

        var sections = new List<ReportSectionKey> { ReportSectionKey.ProjectSummary };
        sections.AddRange(FourSections);
        var withFour = DeliveryPackageExporter.ToPdf(BuildModel(sections));

        withoutFour.Length.ShouldBeGreaterThan(0);
        withFour.Length.ShouldBeGreaterThan(withoutFour.Length,
            "dört bölüm açıkken çıktı büyümüyorsa bölümler çizilmiyor");
    }

    /// <summary>
    /// Bölümler açık ama veri yok: çıktı yine üretilebilmeli ve "veri yok" satırını
    /// basmalı. Eskiden boş bölüm hiç çizilmediği için bu fark da görünmezdi.
    /// </summary>
    [Fact]
    public void Verisi_olmayan_bolumler_cikti_uretmeyi_engellemiyor()
    {
        var sections = new List<ReportSectionKey> { ReportSectionKey.ProjectSummary };
        sections.AddRange(FourSections);

        var model = BuildModel(sections);
        model.Timeline.Clear();
        model.Risks.Clear();
        model.Contributors.Clear();
        model.BudgetCoverage = null;

        var pdf = DeliveryPackageExporter.ToPdf(model);

        pdf.Length.ShouldBeGreaterThan(0);
    }

    /// <summary>
    /// Tohumlanan şablonların açtığı bölümlerin HEPSİ çizilebilmeli. Uygunluk listesi
    /// ile exporter ayrışırsa kullanıcı sessizce eksik rapor alır — tek istisna
    /// Kilometre taşı: karşılığı olan proje varlığı yok ve uygunluk onu KAPALI tutuyor.
    /// </summary>
    [Theory]
    [InlineData(ReportSectionKey.Timeline)]
    [InlineData(ReportSectionKey.ExpenseDocumentMatch)]
    [InlineData(ReportSectionKey.Risks)]
    [InlineData(ReportSectionKey.TeamContribution)]
    public void Uygun_isaretli_her_bolum_tek_basina_da_ciziliyor(ReportSectionKey key)
    {
        ReportSectionAvailability.IsAvailable(key).ShouldBeTrue();

        var onlySummary = DeliveryPackageExporter.ToPdf(
            BuildModel(new[] { ReportSectionKey.ProjectSummary }));
        var withSection = DeliveryPackageExporter.ToPdf(
            BuildModel(new[] { ReportSectionKey.ProjectSummary, key }));

        withSection.Length.ShouldBeGreaterThan(onlySummary.Length);
    }
}
