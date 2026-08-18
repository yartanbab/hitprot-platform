using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Kural motoru belgeleri kullanıcı adına TOPLU olarak değiştirir; yanlış eşleşme
/// sessiz veri bozulmasıdır. Kuru çalıştırma ile gerçek çalıştırma aynı planı
/// üretmek zorunda — bu testler o sözleşmeyi korur.
/// </summary>
public class DocumentRuleEvaluator_Tests
{
    private static readonly Guid RuleId = Guid.NewGuid();
    private static readonly Guid FolderA = Guid.NewGuid();
    private static readonly Guid FolderB = Guid.NewGuid();
    private static readonly Guid TypeInvoice = Guid.NewGuid();

    private static DocumentRule Rule(DocumentRuleLogicalOperator op = DocumentRuleLogicalOperator.And)
        => new(RuleId, null, "Kural", DocumentRuleTrigger.Upload, op);

    private static DocumentRuleCondition Cond(
        DocumentRuleField field, DocumentRuleOperator op, string? value, int order = 1)
        => new(Guid.NewGuid(), null, RuleId, order, field, op, value);

    private static DocumentRuleAction Act(DocumentRuleActionType type, string? payload, int order = 1)
        => new(Guid.NewGuid(), null, RuleId, order, type, payload);

    private static RuleDocument Doc(
        string name = "fatura.pdf",
        Guid? folder = null,
        Guid? typeId = null,
        decimal? amount = null,
        string? period = null,
        DocumentFileStatus status = DocumentFileStatus.Final,
        Guid? workStep = null,
        DateTime? expiry = null,
        int missing = 0)
        => new(Guid.NewGuid(), name, folder ?? FolderA, typeId, amount, period, status, workStep, expiry, missing);

    /* ─── Koşul eşleşmesi ────────────────────────────────────────────── */

    [Fact]
    public void Kosulsuz_kural_hicbir_belgeye_uymaz()
    {
        // Koşulsuz kural "her şeye uy" demek olurdu — bu neredeyse her zaman kazadır.
        var plan = DocumentRuleEvaluator.Plan(
            Rule(), Array.Empty<DocumentRuleCondition>(),
            new[] { Act(DocumentRuleActionType.AddTag, "x") },
            new[] { Doc(), Doc() });

        plan.MatchedCount.ShouldBe(0);
        plan.AffectedCount.ShouldBe(0);
    }

    [Fact]
    public void And_tum_kosullar_saglanmalidir()
    {
        var conditions = new[]
        {
            Cond(DocumentRuleField.DocumentTypeId, DocumentRuleOperator.Equals, TypeInvoice.ToString(), 1),
            Cond(DocumentRuleField.Amount, DocumentRuleOperator.GreaterThan, "1000", 2),
        };

        var match = Doc(typeId: TypeInvoice, amount: 5000);
        var typeOnly = Doc(typeId: TypeInvoice, amount: 100);

        DocumentRuleEvaluator.Matches(Rule(), conditions, match).ShouldBeTrue();
        DocumentRuleEvaluator.Matches(Rule(), conditions, typeOnly).ShouldBeFalse();
    }

    [Fact]
    public void Or_herhangi_bir_kosul_yeter()
    {
        var conditions = new[]
        {
            Cond(DocumentRuleField.DocumentTypeId, DocumentRuleOperator.Equals, TypeInvoice.ToString(), 1),
            Cond(DocumentRuleField.Amount, DocumentRuleOperator.GreaterThan, "1000", 2),
        };
        var rule = Rule(DocumentRuleLogicalOperator.Or);

        DocumentRuleEvaluator.Matches(rule, conditions, Doc(typeId: TypeInvoice, amount: 10)).ShouldBeTrue();
        DocumentRuleEvaluator.Matches(rule, conditions, Doc(amount: 5000)).ShouldBeTrue();
        DocumentRuleEvaluator.Matches(rule, conditions, Doc(amount: 10)).ShouldBeFalse();
    }

    [Fact]
    public void Contains_buyuk_kucuk_harf_ayirmaz()
    {
        var conditions = new[] { Cond(DocumentRuleField.DisplayName, DocumentRuleOperator.Contains, "FATURA") };

        DocumentRuleEvaluator.Matches(Rule(), conditions, Doc("Makine Alım faturası.pdf")).ShouldBeTrue();
    }

    [Fact]
    public void IsEmpty_bos_alani_yakalar()
    {
        var conditions = new[] { Cond(DocumentRuleField.PeriodCode, DocumentRuleOperator.IsEmpty, null) };

        DocumentRuleEvaluator.Matches(Rule(), conditions, Doc(period: null)).ShouldBeTrue();
        DocumentRuleEvaluator.Matches(Rule(), conditions, Doc(period: "2026-Q2")).ShouldBeFalse();
    }

    [Fact]
    public void Eksik_meta_sayisi_karsilastirilabilir()
    {
        var conditions = new[] { Cond(DocumentRuleField.MissingRequiredFieldCount, DocumentRuleOperator.GreaterThan, "0") };

        DocumentRuleEvaluator.Matches(Rule(), conditions, Doc(missing: 2)).ShouldBeTrue();
        DocumentRuleEvaluator.Matches(Rule(), conditions, Doc(missing: 0)).ShouldBeFalse();
    }

    [Fact]
    public void Ayristirilamayan_deger_buyuktur_saymaz()
    {
        // "abc" > "1000" sessizce true dönerse yanlış kural tetiklenir.
        var conditions = new[] { Cond(DocumentRuleField.DisplayName, DocumentRuleOperator.GreaterThan, "1000") };

        DocumentRuleEvaluator.Matches(Rule(), conditions, Doc("abc.pdf")).ShouldBeFalse();
    }

    /* ─── Plan ve etki sayısı ────────────────────────────────────────── */

    [Fact]
    public void Zaten_hedef_durumdaki_belge_etkilenmez()
    {
        var conditions = new[] { Cond(DocumentRuleField.DisplayName, DocumentRuleOperator.Contains, "fatura") };
        var actions = new[] { Act(DocumentRuleActionType.MoveToFolder, FolderB.ToString()) };

        var already = Doc("fatura.pdf", folder: FolderB);
        var needsMove = Doc("fatura.pdf", folder: FolderA);

        var plan = DocumentRuleEvaluator.Plan(Rule(), conditions, actions, new[] { already, needsMove });

        // İkisi de eşleşir ama yalnız biri değişir — "etki" sayısı şişmemeli.
        plan.MatchedCount.ShouldBe(2);
        plan.AffectedCount.ShouldBe(1);
        plan.Changes.Single().DocumentFileId.ShouldBe(needsMove.Id);
    }

    [Fact]
    public void Ayni_belgeye_birden_cok_eylem_tek_etki_sayilir()
    {
        var conditions = new[] { Cond(DocumentRuleField.DisplayName, DocumentRuleOperator.Contains, "fatura") };
        var actions = new[]
        {
            Act(DocumentRuleActionType.MoveToFolder, FolderB.ToString(), 1),
            Act(DocumentRuleActionType.SetDocumentType, TypeInvoice.ToString(), 2),
            Act(DocumentRuleActionType.AddTag, "otomatik", 3),
        };

        var plan = DocumentRuleEvaluator.Plan(Rule(), conditions, actions, new[] { Doc() });

        plan.Changes.Count.ShouldBe(3);
        plan.AffectedCount.ShouldBe(1);
    }

    [Fact]
    public void Eylemler_siraya_gore_planlanir()
    {
        var conditions = new[] { Cond(DocumentRuleField.DisplayName, DocumentRuleOperator.Contains, "fatura") };
        var actions = new[]
        {
            Act(DocumentRuleActionType.AddTag, "ikinci", 2),
            Act(DocumentRuleActionType.MoveToFolder, FolderB.ToString(), 1),
        };

        var plan = DocumentRuleEvaluator.Plan(Rule(), conditions, actions, new[] { Doc() });

        plan.Changes[0].ActionType.ShouldBe(DocumentRuleActionType.MoveToFolder);
        plan.Changes[1].ActionType.ShouldBe(DocumentRuleActionType.AddTag);
    }

    [Fact]
    public void Kuru_ve_gercek_calistirma_ayni_plani_uretir()
    {
        // Plan saf fonksiyondur: aynı girdiyle iki çağrı aynı sonucu verir.
        // Kuru çalıştırmanın gösterdiği sayı gerçekte farklı çıkamaz.
        var conditions = new[] { Cond(DocumentRuleField.Amount, DocumentRuleOperator.GreaterThan, "100") };
        var actions = new[] { Act(DocumentRuleActionType.SetStatus, "2") };
        var documents = new[] { Doc(amount: 500, status: DocumentFileStatus.Draft), Doc(amount: 50) };

        var first = DocumentRuleEvaluator.Plan(Rule(), conditions, actions, documents);
        var second = DocumentRuleEvaluator.Plan(Rule(), conditions, actions, documents);

        first.MatchedCount.ShouldBe(second.MatchedCount);
        first.AffectedCount.ShouldBe(second.AffectedCount);
        first.AffectedCount.ShouldBe(1);
    }
}
