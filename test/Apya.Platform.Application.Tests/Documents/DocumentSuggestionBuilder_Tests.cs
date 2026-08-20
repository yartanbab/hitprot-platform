using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Öneri üretimi.
///
/// Öneriler kullanıcıya "şunu yap" diyor; yanlış üretilirse kullanıcı yanlış
/// klasöre taşır ya da yanlış harcamaya bağlar. En kritik iki kural: zayıf
/// eşleşme öneri OLMAZ, ve aynı belge için çelişen öneriler kullanıcıya
/// birlikte gösterilmez.
/// </summary>
public class DocumentSuggestionBuilder_Tests
{
    private static readonly Guid FileId = Guid.NewGuid();
    private static readonly Guid FolderId = Guid.NewGuid();
    private static readonly Guid TypeId = Guid.NewGuid();
    private static readonly Guid ExpenseId = Guid.NewGuid();

    private static RulePlan PlanWith(params RuleChange[] changes)
        => new(Array.Empty<RuleDocument>(), changes);

    private static MatchCandidate Candidate(int score, Guid? expenseId = null)
        => new(FileId, expenseId ?? ExpenseId, score, score, score, score, new[] { "tutar tam" });

    [Fact]
    public void Kural_plani_tasima_ve_tip_eylemlerini_oneriye_cevirir()
    {
        var plan = PlanWith(
            new RuleChange(FileId, DocumentRuleActionType.MoveToFolder, FolderId.ToString()),
            new RuleChange(FileId, DocumentRuleActionType.SetDocumentType, TypeId.ToString()));

        var suggestions = DocumentSuggestionBuilder.FromRulePlan("R-01", plan);

        suggestions.Count.ShouldBe(2);
        suggestions.ShouldContain(s => s.Kind == DocumentSuggestionKind.Folder);
        suggestions.ShouldContain(s => s.Kind == DocumentSuggestionKind.DocumentType);
        suggestions.ShouldAllBe(s => s.Confidence == 100);
        suggestions.ShouldAllBe(s => s.Reason.Contains("R-01"));
    }

    /// <summary>Etiket ve durum eylemleri öneri olarak sunulmuyor — geri alması zor.</summary>
    [Fact]
    public void Etiket_ve_durum_eylemleri_oneri_uretmez()
    {
        var plan = PlanWith(
            new RuleChange(FileId, DocumentRuleActionType.AddTag, "fatura"),
            new RuleChange(FileId, DocumentRuleActionType.SetStatus, "2"));

        DocumentSuggestionBuilder.FromRulePlan("R-02", plan).ShouldBeEmpty();
    }

    [Fact]
    public void Guclu_harcama_adayi_oneri_olur()
    {
        var suggestions = DocumentSuggestionBuilder.FromMatchCandidates(
            FileId, new[] { Candidate(92) });

        var suggestion = suggestions.ShouldHaveSingleItem();
        suggestion.Kind.ShouldBe(DocumentSuggestionKind.Expense);
        suggestion.Payload.ShouldBe(ExpenseId.ToString());
        suggestion.Confidence.ShouldBe(92);
    }

    /// <summary>Zayıf aday öneri olmaz: kullanıcıyı yanlış bağlamaya davet ederdi.</summary>
    [Fact]
    public void Esik_altindaki_aday_oneri_olmaz()
    {
        var weak = DocumentSuggestionBuilder.MinExpenseConfidence - 1;

        DocumentSuggestionBuilder.FromMatchCandidates(FileId, new[] { Candidate(weak) })
            .ShouldBeEmpty();
    }

    [Fact]
    public void Birden_cok_adaydan_yalnizca_en_iyisi_onerilir()
    {
        var best = Guid.NewGuid();

        var suggestions = DocumentSuggestionBuilder.FromMatchCandidates(
            FileId, new[] { Candidate(70), Candidate(95, best), Candidate(80) });

        suggestions.ShouldHaveSingleItem().Payload.ShouldBe(best.ToString());
    }

    [Fact]
    public void Ayni_belge_ve_tur_icin_celisen_onerilerden_guveni_yuksek_kazanir()
    {
        var other = Guid.NewGuid();

        var suggestions = DocumentSuggestionBuilder.Deduplicate(new[]
        {
            new DocumentSuggestion(FileId, DocumentSuggestionKind.Folder, FolderId.ToString(), "R-01", 100),
            new DocumentSuggestion(FileId, DocumentSuggestionKind.Folder, other.ToString(), "R-02", 60),
        });

        suggestions.ShouldHaveSingleItem().Payload.ShouldBe(FolderId.ToString());
    }

    [Fact]
    public void Farkli_turdeki_oneriler_ayni_belgede_birlikte_kalir()
    {
        var suggestions = DocumentSuggestionBuilder.Deduplicate(new[]
        {
            new DocumentSuggestion(FileId, DocumentSuggestionKind.Folder, FolderId.ToString(), "R-01", 100),
            new DocumentSuggestion(FileId, DocumentSuggestionKind.DocumentType, TypeId.ToString(), "R-01", 100),
        });

        suggestions.Count.ShouldBe(2);
    }

    /// <summary>
    /// Reddetme anahtarı hedefe bağlı: aynı hedef gizlenir, BAŞKA hedef
    /// yeniden görünür. Kullanıcı "bu klasörü değil" dedi, "hiç klasör önerme" demedi.
    /// </summary>
    [Fact]
    public void Reddetme_anahtari_hedefe_baglidir()
    {
        var a = new DocumentSuggestion(FileId, DocumentSuggestionKind.Folder, FolderId.ToString(), "R-01", 100);
        var b = new DocumentSuggestion(FileId, DocumentSuggestionKind.Folder, Guid.NewGuid().ToString(), "R-02", 90);
        var sameTargetDifferentRule = a with { Reason = "R-09", Confidence = 55 };

        DocumentSuggestionBuilder.KeyOf(a).ShouldBe(DocumentSuggestionBuilder.KeyOf(sameTargetDifferentRule));
        DocumentSuggestionBuilder.KeyOf(a).ShouldNotBe(DocumentSuggestionBuilder.KeyOf(b));
    }
}
