using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Apya.Platform.Documents;

/// <summary>Eşleştirmede belgenin karşılaştırılabilir alanları.</summary>
public sealed record MatchDocument(
    Guid Id,
    string DisplayName,
    decimal? Amount,
    DateTime? DocumentDate,
    string? Supplier,
    string? ContentHash);

/// <summary>Eşleştirmede harcamanın karşılaştırılabilir alanları.</summary>
public sealed record MatchExpense(
    Guid Id,
    string Title,
    decimal Amount,
    DateTime ExpenseDate,
    string? Supplier);

/// <summary>Tek bir aday ve gerekçesi.</summary>
public sealed record MatchCandidate(
    Guid DocumentFileId,
    Guid ExpenseId,
    int Score,
    int AmountScore,
    int DateScore,
    int SupplierScore,
    IReadOnlyList<string> Reasons)
{
    public bool IsStrong => Score >= MatchingConsts.StrongMatchScore;
}

/// <summary>
/// Harcama ↔ belge eşleştirme skoru.
///
/// Skor üç bileşenden gelir ve AĞIRLIKLI toplanır: tutar (50), tarih (30),
/// tedarikçi (20). Tutar en ağır çünkü mali eşleştirmede tek başına en ayırt
/// edici sinyal; tedarikçi en hafif çünkü serbest metinden geliyor ve
/// yazım farkları çok.
///
/// Skor bir ÖNERİDİR, karar değil: 100 puanlık bir aday bile kullanıcı
/// onayı olmadan bağlanmaz. Otomatik bağlama yalnız kural motoruyla ve
/// kullanıcının açıkça kurduğu bir kuralla olur.
///
/// Saf fonksiyon — veri erişimi yok, doğrudan test edilir.
/// </summary>
public static class ExpenseMatchScorer
{
    private const int AmountWeight = 50;
    private const int DateWeight = 30;
    private const int SupplierWeight = 20;

    /// <summary>
    /// Bir harcama için aday belgeleri skorlayıp sıralar.
    /// Eşik altındaki adaylar HİÇ dönmez — kullanıcıya 12 puanlık bir öneri
    /// göstermek, listeyi gürültüyle doldurup gerçek eşleşmeyi gizler.
    /// </summary>
    public static List<MatchCandidate> RankForExpense(
        MatchExpense expense,
        IReadOnlyList<MatchDocument> documents,
        int maxResults = 10)
        => documents
            .Select(d => Score(d, expense))
            .Where(c => c.Score >= MatchingConsts.MinSuggestionScore)
            .OrderByDescending(c => c.Score)
            .ThenBy(c => c.DocumentFileId)
            .Take(maxResults)
            .ToList();

    public static MatchCandidate Score(MatchDocument document, MatchExpense expense)
    {
        var reasons = new List<string>();

        var amountScore = ScoreAmount(document.Amount, expense.Amount, reasons);
        var dateScore = ScoreDate(document.DocumentDate, expense.ExpenseDate, reasons);
        var supplierScore = ScoreSupplier(document, expense, reasons);

        var total = (int)Math.Round(
            amountScore * AmountWeight + dateScore * DateWeight + supplierScore * SupplierWeight,
            MidpointRounding.AwayFromZero);

        return new MatchCandidate(
            document.Id, expense.Id, total,
            (int)Math.Round(amountScore * AmountWeight),
            (int)Math.Round(dateScore * DateWeight),
            (int)Math.Round(supplierScore * SupplierWeight),
            reasons);
    }

    /// <summary>
    /// Tutar yakınlığı 0..1. Birebir eşitlik 1; tolerans sınırında 0.
    /// Belgede tutar yoksa 0 — "bilinmiyor" ile "uyuyor" aynı şey değildir.
    /// </summary>
    private static double ScoreAmount(decimal? documentAmount, decimal expenseAmount, List<string> reasons)
    {
        if (!documentAmount.HasValue || expenseAmount == 0)
        {
            return 0;
        }

        var diff = Math.Abs(documentAmount.Value - expenseAmount);

        if (diff == 0)
        {
            reasons.Add("tutar birebir aynı");
            return 1;
        }

        var percent = diff / Math.Abs(expenseAmount) * 100m;

        if (percent > MatchingConsts.AmountTolerancePercent)
        {
            return 0;
        }

        reasons.Add($"tutar %{percent:0.##} sapma");
        return (double)(1 - percent / MatchingConsts.AmountTolerancePercent);
    }

    /// <summary>Tarih yakınlığı 0..1. Aynı gün 1; tolerans sınırında 0.</summary>
    private static double ScoreDate(DateTime? documentDate, DateTime expenseDate, List<string> reasons)
    {
        if (!documentDate.HasValue)
        {
            return 0;
        }

        var days = Math.Abs((documentDate.Value.Date - expenseDate.Date).TotalDays);

        if (days == 0)
        {
            reasons.Add("aynı tarih");
            return 1;
        }

        if (days > MatchingConsts.DateToleranceDays)
        {
            return 0;
        }

        reasons.Add($"{days:0} gün fark");
        return 1 - days / MatchingConsts.DateToleranceDays;
    }

    /// <summary>
    /// Tedarikçi benzerliği 0..1. Belgenin tedarikçi alanı boşsa belge ADINDA
    /// aranır — faturalar sıklıkla "Makine Alım Faturası MİKROTEK.pdf" gibi
    /// adlandırılıyor ve bu sinyal kaybedilmemeli.
    /// </summary>
    private static double ScoreSupplier(MatchDocument document, MatchExpense expense, List<string> reasons)
    {
        var expected = Normalize(expense.Supplier);

        if (string.IsNullOrEmpty(expected))
        {
            return 0;
        }

        var candidate = Normalize(document.Supplier);

        if (!string.IsNullOrEmpty(candidate))
        {
            if (candidate == expected)
            {
                reasons.Add("tedarikçi aynı");
                return 1;
            }

            if (candidate.Contains(expected) || expected.Contains(candidate))
            {
                reasons.Add("tedarikçi kısmen uyuyor");
                return 0.7;
            }
        }

        var name = Normalize(document.DisplayName);
        if (!string.IsNullOrEmpty(name) && name.Contains(expected))
        {
            reasons.Add("tedarikçi adı belge adında geçiyor");
            return 0.5;
        }

        return 0;
    }

    /// <summary>Şirket biçimi belirten, ayırt ediciliği olmayan kelimeler.</summary>
    private static readonly HashSet<string> CompanyFormWords = new(StringComparer.Ordinal)
    {
        "as", "sti", "ltd", "san", "tic", "ve", "inc", "co", "llc", "gmbh", "sa", "ag", "bv",
    };

    /// <summary>
    /// Tedarikçi adı karşılaştırması için normalize.
    ///
    /// Gerçek veride aynı firma "MİKROTEK A.Ş.", "Mikrotek AŞ" ve "mikrotek as"
    /// diye üç türlü yazılıyor. Bu yüzden: küçült, Türkçe aksanları katla,
    /// noktalamayı at, tek harflik parçaları ve şirket biçimi kelimelerini
    /// (A.Ş., Ltd., San., Tic.) düşür — geriye ayırt edici gövde kalsın.
    /// </summary>
    private static string Normalize(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var lowered = value.ToLower(CultureInfo.GetCultureInfo("tr-TR"));

        var folded = new string(lowered.Select(c => c switch
        {
            'ş' => 's',
            'ı' => 'i',
            'ğ' => 'g',
            'ü' => 'u',
            'ö' => 'o',
            'ç' => 'c',
            'â' => 'a',
            'î' => 'i',
            'û' => 'u',
            _ => char.IsLetterOrDigit(c) ? c : ' ',
        }).ToArray());

        var tokens = folded
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Where(t => t.Length > 1)
            .Where(t => !CompanyFormWords.Contains(t));

        return string.Join(' ', tokens);
    }

    /// <summary>
    /// Çift kayıt tespiti. İçerik özeti aynıysa kesin; değilse tutar+tarih+tedarikçi
    /// üçlüsü aynı olan farklı bir dosya şüphelidir.
    /// </summary>
    public static DuplicateReason? DetectDuplicate(
        MatchDocument candidate,
        IReadOnlyList<MatchDocument> others)
    {
        if (!string.IsNullOrEmpty(candidate.ContentHash)
            && others.Any(o => o.Id != candidate.Id && o.ContentHash == candidate.ContentHash))
        {
            return DuplicateReason.IdenticalContent;
        }

        var sameTriple = others.Any(o =>
            o.Id != candidate.Id
            && candidate.Amount.HasValue && o.Amount == candidate.Amount
            && candidate.DocumentDate.HasValue && o.DocumentDate?.Date == candidate.DocumentDate?.Date
            && !string.IsNullOrEmpty(candidate.Supplier)
            && Normalize(o.Supplier) == Normalize(candidate.Supplier));

        return sameTriple ? DuplicateReason.SameAmountDateSupplier : null;
    }
}
