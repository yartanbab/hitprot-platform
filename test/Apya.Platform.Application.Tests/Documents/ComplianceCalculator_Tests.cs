using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Uygunluk yüzdesi ve eksik/bloke sayıları kurumsal teslimin karar sayılarıdır:
/// yanlış hesap, "hazırız" deyip eksik dosya göndermeye yol açar. Hesap saf
/// fonksiyon olduğu için DB'siz doğrulanır.
/// </summary>
public class ComplianceCalculator_Tests
{
    private static readonly Guid PackageId = Guid.NewGuid();
    private static readonly Guid TypeInvoice = Guid.NewGuid();
    private static readonly Guid TypeReport = Guid.NewGuid();

    private static readonly Guid Step1 = Guid.NewGuid();
    private static readonly Guid Step2 = Guid.NewGuid();

    private static readonly List<(Guid Id, string Name, int Order)> TwoSteps = new()
    {
        (Step1, "Kavramsal Tasarım", 1),
        (Step2, "Prototip Üretimi", 2),
    };

    private static ComplianceRequirement Requirement(
        ComplianceScope scope, Guid? typeId, bool blocking = false, int order = 1)
        => new(Guid.NewGuid(), null, PackageId, "Kalem", scope, typeId, blocking, order);

    private static ComplianceDocument Document(Guid? typeId, Guid? stepId = null, string? period = null)
        => new(Guid.NewGuid(), "belge.pdf", typeId, stepId, period);

    private static List<ComplianceItemState> NoStates() => new();

    /* ─── Kapsam açılımı ─────────────────────────────────────────────── */

    [Fact]
    public void IsAdimi_kapsamli_kalem_her_adim_icin_bir_satir_uretir()
    {
        var requirement = Requirement(ComplianceScope.WorkStep, TypeReport);

        var instances = ComplianceCalculator.ExpandScope(requirement, TwoSteps, null).ToList();

        instances.Count.ShouldBe(2);
        instances.Select(i => i.WorkStepId).ShouldBe(new Guid?[] { Step1, Step2 });
    }

    [Fact]
    public void IsAdimi_yoksa_kalem_kaybolmaz_tek_satir_uretir()
    {
        var requirement = Requirement(ComplianceScope.WorkStep, TypeReport);

        var instances = ComplianceCalculator.ExpandScope(
            requirement, new List<(Guid, string, int)>(), null).ToList();

        instances.Count.ShouldBe(1);
        instances[0].WorkStepId.ShouldBeNull();
    }

    [Fact]
    public void Donem_kapsamli_kalem_etkin_donemi_tasir()
    {
        var requirement = Requirement(ComplianceScope.Period, TypeReport);

        var instances = ComplianceCalculator.ExpandScope(requirement, TwoSteps, "2026-Q2").ToList();

        instances.Count.ShouldBe(1);
        instances[0].PeriodCode.ShouldBe("2026-Q2");
    }

    /* ─── Eşleşme ────────────────────────────────────────────────────── */

    [Fact]
    public void Tipi_olmayan_kalem_otomatik_karsilanmaz()
    {
        var requirement = Requirement(ComplianceScope.Project, typeId: null);
        var documents = new List<ComplianceDocument> { Document(TypeInvoice) };

        var evaluations = ComplianceCalculator.Evaluate(
            new[] { requirement }, TwoSteps, documents, NoStates(), null);

        evaluations.Single().Status.ShouldBe(ComplianceItemStatus.Missing);
    }

    [Fact]
    public void Yanlis_is_adimindaki_belge_kalemi_karsilamaz()
    {
        var requirement = Requirement(ComplianceScope.WorkStep, TypeReport);
        var documents = new List<ComplianceDocument> { Document(TypeReport, Step1) };

        var evaluations = ComplianceCalculator.Evaluate(
            new[] { requirement }, TwoSteps, documents, NoStates(), null);

        evaluations.Single(e => e.Instance.WorkStepId == Step1).Status.ShouldBe(ComplianceItemStatus.Satisfied);
        evaluations.Single(e => e.Instance.WorkStepId == Step2).Status.ShouldBe(ComplianceItemStatus.Missing);
    }

    [Fact]
    public void Yanlis_donemdeki_belge_kalemi_karsilamaz()
    {
        var requirement = Requirement(ComplianceScope.Period, TypeReport);
        var documents = new List<ComplianceDocument> { Document(TypeReport, period: "2026-Q1") };

        var evaluations = ComplianceCalculator.Evaluate(
            new[] { requirement }, TwoSteps, documents, NoStates(), "2026-Q2");

        evaluations.Single().Status.ShouldBe(ComplianceItemStatus.Missing);
    }

    [Fact]
    public void Elle_baglama_otomatik_eslesmeye_ustun_gelir()
    {
        var requirement = Requirement(ComplianceScope.Project, TypeReport);
        var linked = Document(TypeInvoice); // tip tutmuyor ama kullanıcı beyan etti
        var auto = Document(TypeReport);

        var state = new ComplianceItemState(Guid.NewGuid(), null, Guid.NewGuid(), requirement.Id);
        state.LinkDocument(linked.Id);

        var evaluations = ComplianceCalculator.Evaluate(
            new[] { requirement }, TwoSteps, new List<ComplianceDocument> { auto, linked },
            new List<ComplianceItemState> { state }, null);

        var item = evaluations.Single();
        item.Status.ShouldBe(ComplianceItemStatus.Satisfied);
        item.DocumentFileId.ShouldBe(linked.Id);
    }

    /* ─── Yüzde ──────────────────────────────────────────────────────── */

    [Fact]
    public void Yuzde_karsilananin_toplama_orani()
    {
        var requirements = new[]
        {
            Requirement(ComplianceScope.Project, TypeReport, order: 1),
            Requirement(ComplianceScope.Project, TypeInvoice, order: 2),
        };
        var documents = new List<ComplianceDocument> { Document(TypeReport) };

        var summary = ComplianceCalculator.Summarize(
            ComplianceCalculator.Evaluate(requirements, TwoSteps, documents, NoStates(), null));

        summary.TotalCount.ShouldBe(2);
        summary.SatisfiedCount.ShouldBe(1);
        summary.MissingCount.ShouldBe(1);
        summary.Percent.ShouldBe(50);
    }

    [Fact]
    public void Feragat_edilen_kalem_paydadan_duser()
    {
        var satisfied = Requirement(ComplianceScope.Project, TypeReport, order: 1);
        var waivedReq = Requirement(ComplianceScope.Project, TypeInvoice, order: 2);

        var state = new ComplianceItemState(Guid.NewGuid(), null, Guid.NewGuid(), waivedReq.Id);
        state.Waive("Bu projede geçerli değil");

        var summary = ComplianceCalculator.Summarize(
            ComplianceCalculator.Evaluate(
                new[] { satisfied, waivedReq }, TwoSteps,
                new List<ComplianceDocument> { Document(TypeReport) },
                new List<ComplianceItemState> { state }, null));

        summary.TotalCount.ShouldBe(2);
        summary.WaivedCount.ShouldBe(1);
        summary.SatisfiedCount.ShouldBe(1);
        summary.MissingCount.ShouldBe(0);
        // 1 karşılanan / (2 toplam - 1 feragat) = %100
        summary.Percent.ShouldBe(100);
    }

    [Fact]
    public void Hepsi_feragat_edilirse_yuzde_100()
    {
        var requirement = Requirement(ComplianceScope.Project, TypeReport);
        var state = new ComplianceItemState(Guid.NewGuid(), null, Guid.NewGuid(), requirement.Id);
        state.Waive("gerekmiyor");

        var summary = ComplianceCalculator.Summarize(
            ComplianceCalculator.Evaluate(
                new[] { requirement }, TwoSteps, new List<ComplianceDocument>(),
                new List<ComplianceItemState> { state }, null));

        summary.Percent.ShouldBe(100);
        summary.BlockingMissingCount.ShouldBe(0);
    }

    [Fact]
    public void Hic_kalem_yoksa_yuzde_100()
    {
        var summary = ComplianceCalculator.Summarize(new List<ComplianceEvaluation>());

        summary.TotalCount.ShouldBe(0);
        summary.Percent.ShouldBe(100);
    }

    /* ─── Bloke sayısı ───────────────────────────────────────────────── */

    [Fact]
    public void Bloke_sayisi_yalnizca_EKSIK_ve_bloke_kalemleri_sayar()
    {
        var requirements = new[]
        {
            Requirement(ComplianceScope.Project, TypeReport, blocking: true, order: 1),   // karşılanacak
            Requirement(ComplianceScope.Project, TypeInvoice, blocking: true, order: 2),  // eksik + bloke
            Requirement(ComplianceScope.Project, typeId: null, blocking: false, order: 3), // eksik ama bloke değil
        };

        var summary = ComplianceCalculator.Summarize(
            ComplianceCalculator.Evaluate(
                requirements, TwoSteps, new List<ComplianceDocument> { Document(TypeReport) }, NoStates(), null));

        summary.MissingCount.ShouldBe(2);
        summary.BlockingMissingCount.ShouldBe(1);
    }

    [Fact]
    public void Feragat_edilen_bloke_kalem_teslimi_bloke_etmez()
    {
        var requirement = Requirement(ComplianceScope.Project, TypeInvoice, blocking: true);
        var state = new ComplianceItemState(Guid.NewGuid(), null, Guid.NewGuid(), requirement.Id);
        state.Waive("kurum bu dönem istemiyor");

        var summary = ComplianceCalculator.Summarize(
            ComplianceCalculator.Evaluate(
                new[] { requirement }, TwoSteps, new List<ComplianceDocument>(),
                new List<ComplianceItemState> { state }, null));

        summary.BlockingMissingCount.ShouldBe(0);
    }

    /* ─── Birleştirme ────────────────────────────────────────────────── */

    [Fact]
    public void Combine_yuzdeyi_paket_ortalamasi_degil_kalem_toplami_uzerinden_hesaplar()
    {
        // 1/1 (%100) ile 1/9 (%11) paketlerinin ortalaması %55 DEĞİL, 2/10 = %20 olmalı.
        var a = new ComplianceSummary(1, 1, 0, 0, 0, 100);
        var b = new ComplianceSummary(9, 1, 0, 8, 0, 11);

        var combined = ComplianceCalculator.Combine(new[] { a, b });

        combined.TotalCount.ShouldBe(10);
        combined.SatisfiedCount.ShouldBe(2);
        combined.Percent.ShouldBe(20);
    }
}
