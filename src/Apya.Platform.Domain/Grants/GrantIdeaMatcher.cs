using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Apya.Platform.Grants;

/// <summary>
/// 20a · Havuzdaki fikrin bir programa uyumu: fikir metni + firma profili birlikte puanlanır.
///
/// <para>Metin payı: programın kendi dilinde yazdıkları (ad, amaç, öncelikler, uygun başvuranlar,
/// anahtar kelime ve tematik etiketler) fikrin cevaplarında ne kadar geçiyor. Firma payı
/// <see cref="GrantMatchManager"/>'ın firma skorudur — ikinci bir firma formülü YOK.</para>
///
/// <para>Türkçe ekler kelimeyi uzattığı için eşleşme kelimenin ilk <see cref="StemLength"/> harfiyle
/// yapılır ("kadınlar" = "kadın", "dijitalleşme" = "dijital") ve Türkçe harfler ASCII'ye katlanır
/// (tematik alan anahtarları "Egitim" gibi ASCII yazılı). Saf hesap, kalıcılık yok.</para>
/// </summary>
public static class GrantIdeaMatcher
{
    /// <summary>Bu puan ve üstü "çağrıya uyan fikir" sayılır.</summary>
    public const int Threshold = 60;

    public const double TextWeight = 0.6;

    /// <summary>Kelimenin karşılaştırılan kökü.</summary>
    public const int StemLength = 5;

    /// <summary>Fikrin bu kadar farklı kökü programla örtüşürse metin payı tamdır.</summary>
    public const int FullTextOverlap = 8;

    private const int MinWordLength = 4;
    private const int MaxReasonTerms = 3;

    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    /// <summary>
    /// Her hibe metninde geçen, fikir hakkında bir şey söylemeyen kökler. Bunlar sayılsaydı
    /// "proje", "destek", "faaliyet" yazan her fikir her programa uyardı.
    /// </summary>
    private static readonly HashSet<string> StopStems = new[]
    {
        "proje", "destek", "hibe", "program", "cagri", "kapsam", "faaliyet", "basvuru", "uygun", "amac", "amaci",
        "hedef", "olarak", "olan", "olmak", "olmasi", "olup", "yapilan", "yapmak", "icin", "gibi", "veya", "daha",
        "kurum", "kurulus", "alan", "alani", "saglamak", "yonelik", "ilgili", "etmek", "etme", "gelistirme",
        "artirmak", "katki", "turkiye", "tarafindan", "uzere", "sonra", "once", "kadar", "ayrica", "bunun",
        "bunlar", "ozellikle", "yeni", "iliskin", "sure", "donem", "kisi", "genel", "onemli", "surec", "calisma",
        "bizim", "istiyoruz", "isteyen", "planliyoruz", "dusunuyoruz"
    }.Select(w => w.Length <= StemLength ? w : w[..StemLength]).ToHashSet(StringComparer.Ordinal);

    public static GrantIdeaMatch Match(
        GrantInterest idea,
        Grant grant,
        IReadOnlyList<GrantCriteriaTag> tags,
        int? firmScore)
    {
        var programTerms = ProgramTerms(grant, tags);
        var ideaStems = IdeaText(idea).SelectMany(Stems).Select(t => t.Stem).ToHashSet(StringComparer.Ordinal);

        int? textScore = null;
        var matched = new List<string>();
        if (programTerms.Count > 0)
        {
            matched = programTerms.Where(t => ideaStems.Contains(t.Key)).Select(t => t.Value).ToList();
            var fullAt = Math.Max(1, Math.Min(FullTextOverlap, Math.Min(programTerms.Count, ideaStems.Count)));
            textScore = (int)Math.Round(Math.Min(1.0, (double)matched.Count / fullAt) * 100);
        }

        // Ölçülemeyen pay toplamı düşürmez: programın dili yoksa firma skoru, program hedeflenmemişse
        // (etiketsiz → firma skoru hesaplanamaz) metin payı tek başına kalır.
        var total = (textScore, firmScore) switch
        {
            ({ } text, { } firm) => (int)Math.Round(text * TextWeight + firm * (1 - TextWeight)),
            ({ } text, null) => text,
            (null, { } firm) => firm,
            _ => 0
        };

        return new GrantIdeaMatch(
            Math.Clamp(total, 0, 100),
            textScore,
            firmScore,
            matched.Take(MaxReasonTerms).ToList(),
            BudgetFits(idea.EstimatedBudget, grant));
    }

    /// <summary>null = kıyaslanamaz (fikirde bütçe ya da programda tavan yok).</summary>
    public static bool? BudgetFits(decimal? budget, Grant grant)
    {
        if (budget is not > 0 || grant.MaxAmount is not > 0)
        {
            return null;
        }

        return budget <= grant.MaxAmount && (grant.MinAmount is not > 0 || budget >= grant.MinAmount);
    }

    /// <summary>Kök → programda ilk geçtiği hâl (gerekçe satırında okunur kelime görünsün).</summary>
    private static Dictionary<string, string> ProgramTerms(Grant grant, IReadOnlyList<GrantCriteriaTag> tags)
    {
        var texts = new List<string?> { grant.Name, grant.Objective, grant.Priorities, grant.EligibleApplicants };

        // Amacı ve öncelikleri girilmemiş (kazınmış, henüz düzenlenmemiş) programda tek dil açıklamadır.
        if (string.IsNullOrWhiteSpace(grant.Objective) && string.IsNullOrWhiteSpace(grant.Priorities))
        {
            texts.Add(grant.Description);
        }

        texts.AddRange(tags
            .Where(t => t.Kind is GrantCriteriaKind.AnahtarKelime or GrantCriteriaKind.TematikAlan)
            // Tematik alan anahtarı "KulturSanat" gibi bitişik: iki kelimeye ayrılır.
            .Select(t => Regex.Replace(t.Value, "(?<=[a-zçğıöşü])(?=[A-ZÇĞİÖŞÜ])", " ")));

        var terms = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var (stem, word) in texts.SelectMany(Stems))
        {
            terms.TryAdd(stem, word);
        }

        return terms;
    }

    private static IEnumerable<string?> IdeaText(GrantInterest idea) => new[]
    {
        idea.Note, idea.ProblemStatement, idea.TargetAudience, idea.PlannedActivities,
        idea.DurationAndPartners, idea.SupportNeeds
    };

    private static IEnumerable<(string Stem, string Word)> Stems(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            yield break;
        }

        foreach (var raw in Regex.Split(text.ToLower(Turkish), @"[^\p{L}\p{Nd}]+"))
        {
            if (raw.Length < MinWordLength)
            {
                continue;
            }

            var folded = Fold(raw);
            var stem = folded.Length <= StemLength ? folded : folded[..StemLength];
            if (!StopStems.Contains(stem))
            {
                yield return (stem, raw);
            }
        }
    }

    private static string Fold(string word)
    {
        var sb = new StringBuilder(word.Length);
        foreach (var c in word)
        {
            sb.Append(c switch
            {
                'ç' => 'c', 'ğ' => 'g', 'ı' => 'i', 'ö' => 'o', 'ş' => 's', 'ü' => 'u', 'â' => 'a', 'î' => 'i', 'û' => 'u',
                _ => c
            });
        }

        return sb.ToString();
    }
}

/// <summary>
/// 20a · Fikir↔program uyumu. <paramref name="TextScore"/> null = programın metni yok · <paramref name="FirmScore"/>
/// null = program hedeflenmemiş (etiketsiz), firma skoru hesaplanamaz. <paramref name="MatchedTerms"/> programın
/// dilinden örtüşen ilk kelimeler (gerekçe satırı).
/// </summary>
public sealed record GrantIdeaMatch(
    int Total,
    int? TextScore,
    int? FirmScore,
    IReadOnlyList<string> MatchedTerms,
    bool? BudgetFits)
{
    public bool IsMatch => Total >= GrantIdeaMatcher.Threshold;
}
