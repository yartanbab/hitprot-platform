using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Apya.Platform.Documents;

/// <summary>
/// Belgeye önerilen tek bir değişiklik.
///
/// Öneriler SAKLANMAZ, her okumada üretilir — tıpkı uygunluk durumu gibi.
/// Materyalize edilse belge veya kural değiştiğinde bayatlar ve kullanıcıya
/// artık geçerli olmayan bir öneri gösterirdik. Veritabanı yalnızca veriden
/// türetilemeyen kullanıcı kararını tutar: reddetme.
/// </summary>
public sealed record DocumentSuggestion(
    Guid DocumentFileId,
    DocumentSuggestionKind Kind,
    string? Payload,
    string Reason,
    int Confidence);

/// <summary>
/// Önerileri MEVCUT motorlardan üretir: kural motorunun planı ve harcama
/// eşleşme skorlayıcısı. Ayrı bir tahmin mantığı yazmıyoruz — kullanıcının
/// "kural olarak kaydet" dediği şeyle önerinin aynı kaynaktan gelmesi,
/// ikisinin sonsuza kadar tutarlı kalmasını sağlar.
///
/// Saf fonksiyonlar: veri erişimi, saat, rastgelelik yok.
/// </summary>
public static class DocumentSuggestionBuilder
{
    /// <summary>Bir harcama önerisinin gösterilmesi için gereken en düşük skor.</summary>
    public const int MinExpenseConfidence = 60;

    /// <summary>
    /// Reddetme anahtarı. Öneri kaydı olmadığı için karar, önerinin İÇERİĞİNE
    /// bağlanır: aynı belgeye aynı hedef yeniden önerilirse gizli kalır, ama
    /// BAŞKA bir hedef önerilirse kullanıcı onu yeniden görür.
    /// </summary>
    public static string KeyOf(DocumentSuggestion suggestion)
        => $"{(int)suggestion.Kind}:{suggestion.Payload ?? string.Empty}";

    /// <summary>
    /// Kural planını önerilere çevirir. Kural motorunun kendisi bu değişiklikleri
    /// otomatik uygulayabilir; öneri yolu, kuralı AÇMADAN önce "ne olurdu"yu
    /// kullanıcıya tek tek onaylatmak içindir.
    /// </summary>
    public static List<DocumentSuggestion> FromRulePlan(string ruleName, RulePlan plan)
    {
        var suggestions = new List<DocumentSuggestion>();

        foreach (var change in plan.Changes)
        {
            var kind = MapKind(change.ActionType);
            if (kind is null)
            {
                continue; // etiket/durum eylemleri öneri olarak sunulmuyor
            }

            suggestions.Add(new DocumentSuggestion(
                change.DocumentFileId,
                kind.Value,
                change.Payload,
                $"{ruleName} kuralı",
                // Kural eşleşmesi kesindir: koşulu tutan belge için tahmin yok.
                Confidence: 100));
        }

        return suggestions;
    }

    /// <summary>
    /// Harcama eşleşme adaylarını önerilere çevirir. Yalnız EN İYİ aday ve
    /// yalnız eşik üstündeyse: zayıf adayları öneri diye sunmak, kullanıcıyı
    /// yanlış bağlamaya davet ederdi.
    /// </summary>
    public static List<DocumentSuggestion> FromMatchCandidates(
        Guid documentFileId,
        IReadOnlyList<MatchCandidate> candidates)
    {
        var best = candidates
            .Where(c => c.Score >= MinExpenseConfidence)
            .OrderByDescending(c => c.Score)
            .FirstOrDefault();

        if (best is null)
        {
            return new List<DocumentSuggestion>();
        }

        return new List<DocumentSuggestion>
        {
            new(documentFileId,
                DocumentSuggestionKind.Expense,
                best.ExpenseId.ToString(),
                string.Join(" · ", best.Reasons),
                best.Score),
        };
    }

    /// <summary>
    /// Aynı belge+tür için birden çok öneri varsa en yükseğini bırakır.
    /// İki kural aynı belgeye farklı klasör öneriyorsa kullanıcıya ikisini de
    /// göstermek kararsızlık üretir; güveni yüksek olan kazanır.
    /// </summary>
    public static List<DocumentSuggestion> Deduplicate(IEnumerable<DocumentSuggestion> suggestions)
        => suggestions
            .GroupBy(s => (s.DocumentFileId, s.Kind))
            .Select(g => g.OrderByDescending(s => s.Confidence).First())
            .OrderByDescending(s => s.Confidence)
            .ToList();

    private static DocumentSuggestionKind? MapKind(DocumentRuleActionType actionType) => actionType switch
    {
        DocumentRuleActionType.MoveToFolder => DocumentSuggestionKind.Folder,
        DocumentRuleActionType.SetDocumentType => DocumentSuggestionKind.DocumentType,
        DocumentRuleActionType.SetWorkStep => DocumentSuggestionKind.WorkStep,
        DocumentRuleActionType.SetPeriodCode => DocumentSuggestionKind.PeriodCode,
        _ => null,
    };

    /// <summary>Payload'ı Guid'e çözer; geçersizse null (bozuk kural sessizce atlanır).</summary>
    public static Guid? PayloadAsGuid(string? payload)
        => Guid.TryParse(payload, out var id) ? id : null;

    /// <summary>Dönem kodu gibi metin payload'lar için normalize edilmiş hali.</summary>
    public static string? PayloadAsText(string? payload)
        => string.IsNullOrWhiteSpace(payload) ? null : payload.Trim();

    /// <summary>Güven yüzdesinin insan okunur hali.</summary>
    public static string FormatConfidence(int confidence)
        => string.Create(CultureInfo.InvariantCulture, $"%{confidence}");
}
