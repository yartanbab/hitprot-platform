using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Preflight, kuruma eksik/hatalı dosya gitmesini önleyen son bariyer.
/// "Üret" düğmesinin açık/kapalı olması buradan çıkar; yanlış hesap ya teslimi
/// gereksiz bloke eder ya da eksik dosyayı sessizce geçirir.
/// </summary>
public class DeliveryPreflight_Tests
{
    private static readonly DateTime Now = new(2026, 8, 18);

    private static PreflightDocument Doc(
        string name = "belge.pdf",
        DateTime? expiry = null,
        int missingFields = 0,
        bool confidential = false)
        => new(Guid.NewGuid(), name, expiry, missingFields, confidential);

    private static PreflightResult Evaluate(
        IReadOnlyList<PreflightDocument> docs,
        int blockingMissing = 0,
        IReadOnlyList<string>? titles = null,
        bool external = false)
        => DeliveryPreflight.Evaluate(docs, blockingMissing, titles ?? Array.Empty<string>(), external, Now);

    [Fact]
    public void Temiz_paket_uretilebilir()
    {
        var result = Evaluate(new[] { Doc(), Doc() });

        result.CanGenerate.ShouldBeTrue();
        result.BlockingCount.ShouldBe(0);
        result.Issues.ShouldBeEmpty();
    }

    [Fact]
    public void Bos_paket_uretimi_bloke_eder()
    {
        var result = Evaluate(Array.Empty<PreflightDocument>());

        result.CanGenerate.ShouldBeFalse();
        result.Issues.Single().Kind.ShouldBe(PreflightIssueKind.EmptyPackage);
    }

    [Fact]
    public void Eksik_zorunlu_uygunluk_kalemi_bloke_eder_ve_adlari_listeler()
    {
        var result = Evaluate(
            new[] { Doc() },
            blockingMissing: 2,
            titles: new[] { "SGK borcu yoktur yazısı", "Dönem ara raporu" });

        result.CanGenerate.ShouldBeFalse();
        result.BlockingCount.ShouldBe(2);
        result.Issues.ShouldContain(i => i.Message.Contains("SGK borcu yoktur yazısı"));
        result.Issues.ShouldContain(i => i.Message.Contains("Dönem ara raporu"));
    }

    [Fact]
    public void Cok_sayida_eksik_kalemde_ilk_10_listelenir_kalani_ozetlenir()
    {
        var titles = Enumerable.Range(1, 14).Select(i => $"Kalem {i}").ToArray();

        var result = Evaluate(new[] { Doc() }, blockingMissing: 14, titles: titles);

        // 10 ad + 1 "ve 4 kalem daha" satırı
        result.Issues.Count(i => i.Kind == PreflightIssueKind.BlockingComplianceItem).ShouldBe(11);
        result.Issues.ShouldContain(i => i.Message.Contains("4 zorunlu kalem daha"));
    }

    [Fact]
    public void Suresi_dolmus_belge_bloke_eder()
    {
        var result = Evaluate(new[] { Doc("acme-sozlesme.pdf", expiry: Now.AddDays(-1)) });

        result.CanGenerate.ShouldBeFalse();
        result.Issues.Single().Kind.ShouldBe(PreflightIssueKind.ExpiredDocument);
        result.Issues.Single().Message.ShouldContain("acme-sozlesme.pdf");
    }

    [Fact]
    public void Gelecekte_dolacak_belge_bloke_etmez()
    {
        var result = Evaluate(new[] { Doc(expiry: Now.AddDays(30)) });

        result.CanGenerate.ShouldBeTrue();
    }

    [Fact]
    public void Bugun_dolan_belge_bloke_eder()
    {
        // Sınır: son gün artık geçerli sayılmaz — teslim gününde geçersiz belge gitmesin.
        var result = Evaluate(new[] { Doc(expiry: Now) });

        result.CanGenerate.ShouldBeFalse();
    }

    [Fact]
    public void Eksik_zorunlu_meta_alani_bloke_eder()
    {
        var result = Evaluate(new[] { Doc("fatura.pdf", missingFields: 3) });

        result.CanGenerate.ShouldBeFalse();
        var issue = result.Issues.Single();
        issue.Kind.ShouldBe(PreflightIssueKind.MissingRequiredField);
        issue.Message.ShouldContain("3 zorunlu alan");
    }

    [Fact]
    public void Gizli_alan_dis_aliciya_giderken_UYARIR_ama_bloke_etmez()
    {
        var result = Evaluate(new[] { Doc("bordro.xlsx", confidential: true) }, external: true);

        result.CanGenerate.ShouldBeTrue();
        result.WarningCount.ShouldBe(1);
        result.BlockingCount.ShouldBe(0);
        result.Issues.Single().Kind.ShouldBe(PreflightIssueKind.MaskedFieldWarning);
    }

    [Fact]
    public void Gizli_alan_ic_aliciya_giderken_uyarmaz()
    {
        var result = Evaluate(new[] { Doc(confidential: true) }, external: false);

        result.Issues.ShouldBeEmpty();
    }

    [Fact]
    public void Birden_cok_sorun_ayri_ayri_raporlanir()
    {
        var result = Evaluate(
            new[]
            {
                Doc("suresi-dolan.pdf", expiry: Now.AddDays(-5)),
                Doc("eksik-meta.pdf", missingFields: 1),
                Doc("gizli.xlsx", confidential: true),
            },
            blockingMissing: 1,
            titles: new[] { "YMM raporu" },
            external: true);

        result.CanGenerate.ShouldBeFalse();
        result.BlockingCount.ShouldBe(3);   // dolan + eksik meta + uygunluk kalemi
        result.WarningCount.ShouldBe(1);    // gizli alan
    }

    /* ─── Ek numaralandırma ──────────────────────────────────────────── */

    [Fact]
    public void Ek_numaralari_siraya_gore_yeniden_atanir()
    {
        var packageId = Guid.NewGuid();
        var items = new List<DeliveryPackageItem>
        {
            new(Guid.NewGuid(), null, packageId, Guid.NewGuid(), order: 30),
            new(Guid.NewGuid(), null, packageId, Guid.NewGuid(), order: 10),
            new(Guid.NewGuid(), null, packageId, Guid.NewGuid(), order: 20),
        };

        DeliveryPreflight.AssignAnnexNumbers(items);

        // Sıra normalize edilir (1,2,3) ve numara sıradan türer.
        items.OrderBy(i => i.Order).Select(i => i.AnnexNumber)
            .ShouldBe(new[] { "EK-1", "EK-2", "EK-3" });
        items.Select(i => i.Order).OrderBy(o => o).ShouldBe(new[] { 1, 2, 3 });
    }
}
