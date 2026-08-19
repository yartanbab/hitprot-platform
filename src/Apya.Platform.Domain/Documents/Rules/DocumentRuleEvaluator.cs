using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Apya.Platform.Documents;

/// <summary>Kural değerlendirmesi için belgenin okunabilir hali.</summary>
public sealed record RuleDocument(
    Guid Id,
    string DisplayName,
    Guid FolderId,
    Guid? DocumentTypeId,
    decimal? Amount,
    string? PeriodCode,
    DocumentFileStatus Status,
    Guid? WorkStepId,
    DateTime? ExpiryDate,
    int MissingRequiredFieldCount);

/// <summary>Bir belgeye uygulanacak tek değişiklik.</summary>
public sealed record RuleChange(
    Guid DocumentFileId,
    DocumentRuleActionType ActionType,
    string? Payload);

/// <summary>
/// Kural çalıştırmasının planı. <see cref="Changes"/> uygulanmadıkça HİÇBİR
/// yazma olmaz — kuru çalıştırma bu planı üretip atar, gerçek çalıştırma uygular.
/// </summary>
public sealed record RulePlan(
    IReadOnlyList<RuleDocument> Matched,
    IReadOnlyList<RuleChange> Changes)
{
    public int MatchedCount => Matched.Count;

    /// <summary>Gerçekten DEĞİŞECEK belge sayısı — eşleşen ama zaten hedef durumda olanlar sayılmaz.</summary>
    public int AffectedCount => Changes.Select(c => c.DocumentFileId).Distinct().Count();
}

/// <summary>
/// Kural motorunun çekirdeği: koşul eşleşmesi ve eylem planı.
///
/// Saf fonksiyon — veri erişimi, saat, rastgelelik yok. Kuru çalıştırma ile
/// gerçek çalıştırma AYNI kodu kullanır; aralarındaki tek fark planın
/// uygulanıp uygulanmamasıdır. Böylece "kuru çalıştırmada gördüğüm sayı
/// gerçekte farklı çıktı" durumu yapısal olarak imkânsızdır.
/// </summary>
public static class DocumentRuleEvaluator
{
    public static RulePlan Plan(
        DocumentRule rule,
        IReadOnlyList<DocumentRuleCondition> conditions,
        IReadOnlyList<DocumentRuleAction> actions,
        IReadOnlyList<RuleDocument> documents)
    {
        var matched = documents.Where(d => Matches(rule, conditions, d)).ToList();

        var changes = new List<RuleChange>();
        foreach (var document in matched)
        {
            foreach (var action in actions.OrderBy(a => a.Order))
            {
                // Zaten hedef durumdaki belgeye dokunmayız: hem gereksiz yazma,
                // hem de "etki" sayısını şişirip kullanıcıyı yanıltırdı.
                if (IsNoOp(action, document))
                {
                    continue;
                }

                changes.Add(new RuleChange(document.Id, action.ActionType, action.Payload));
            }
        }

        return new RulePlan(matched, changes);
    }

    public static bool Matches(
        DocumentRule rule,
        IReadOnlyList<DocumentRuleCondition> conditions,
        RuleDocument document)
    {
        if (conditions.Count == 0)
        {
            // Koşulsuz kural TÜM belgelere uyar — bu neredeyse her zaman kazadır.
            return false;
        }

        var ordered = conditions.OrderBy(c => c.Order).ToList();

        return rule.LogicalOperator == DocumentRuleLogicalOperator.And
            ? ordered.All(c => Evaluate(c, document))
            : ordered.Any(c => Evaluate(c, document));
    }

    private static bool Evaluate(DocumentRuleCondition condition, RuleDocument document)
    {
        var actual = ReadField(condition.Field, document);

        return condition.Operator switch
        {
            DocumentRuleOperator.IsEmpty => string.IsNullOrWhiteSpace(actual),
            DocumentRuleOperator.IsNotEmpty => !string.IsNullOrWhiteSpace(actual),
            DocumentRuleOperator.Equals => Same(actual, condition.CompareValue),
            DocumentRuleOperator.NotEquals => !Same(actual, condition.CompareValue),
            DocumentRuleOperator.Contains =>
                actual != null && condition.CompareValue != null
                && actual.Contains(condition.CompareValue, StringComparison.OrdinalIgnoreCase),
            DocumentRuleOperator.GreaterThan => CompareNumeric(actual, condition.CompareValue) > 0,
            DocumentRuleOperator.LessThan => CompareNumeric(actual, condition.CompareValue) < 0,
            _ => false,
        };
    }

    private static string? ReadField(DocumentRuleField field, RuleDocument d) => field switch
    {
        DocumentRuleField.DisplayName => d.DisplayName,
        DocumentRuleField.DocumentTypeId => d.DocumentTypeId?.ToString(),
        DocumentRuleField.Amount => d.Amount?.ToString(CultureInfo.InvariantCulture),
        DocumentRuleField.PeriodCode => d.PeriodCode,
        DocumentRuleField.Status => ((int)d.Status).ToString(CultureInfo.InvariantCulture),
        DocumentRuleField.WorkStepId => d.WorkStepId?.ToString(),
        DocumentRuleField.ExpiryDate => d.ExpiryDate?.ToString("O"),
        DocumentRuleField.FolderId => d.FolderId.ToString(),
        DocumentRuleField.MissingRequiredFieldCount => d.MissingRequiredFieldCount.ToString(CultureInfo.InvariantCulture),
        _ => null,
    };

    private static bool Same(string? a, string? b)
        => string.Equals(a?.Trim(), b?.Trim(), StringComparison.OrdinalIgnoreCase);

    /// <summary>
    /// Sayısal ve tarihsel karşılaştırma. Ayrıştırılamayan değer 0 döner
    /// (eşleşmez) — sessizce "büyüktür" saymak yanlış kural tetiklerdi.
    /// </summary>
    private static int CompareNumeric(string? actual, string? expected)
    {
        if (actual == null || expected == null)
        {
            return 0;
        }

        if (decimal.TryParse(actual, NumberStyles.Any, CultureInfo.InvariantCulture, out var a)
            && decimal.TryParse(expected, NumberStyles.Any, CultureInfo.InvariantCulture, out var b))
        {
            return a.CompareTo(b);
        }

        if (DateTime.TryParse(actual, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var da)
            && DateTime.TryParse(expected, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var db))
        {
            return da.CompareTo(db);
        }

        return 0;
    }

    /// <summary>Belge zaten eylemin hedeflediği durumdaysa true.</summary>
    private static bool IsNoOp(DocumentRuleAction action, RuleDocument document) => action.ActionType switch
    {
        DocumentRuleActionType.MoveToFolder => Same(document.FolderId.ToString(), action.Payload),
        DocumentRuleActionType.SetDocumentType => Same(document.DocumentTypeId?.ToString(), action.Payload),
        DocumentRuleActionType.SetWorkStep => Same(document.WorkStepId?.ToString(), action.Payload),
        DocumentRuleActionType.SetPeriodCode => Same(document.PeriodCode, action.Payload),
        DocumentRuleActionType.SetStatus => Same(((int)document.Status).ToString(), action.Payload),
        // Etiket ekleme belgenin mevcut etiketlerine bakmadan planlanır; tekrar
        // ekleme servis katmanında zaten yok sayılır.
        _ => false,
    };
}
