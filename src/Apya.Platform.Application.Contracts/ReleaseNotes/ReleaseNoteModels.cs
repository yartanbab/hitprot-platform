using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Apya.Platform.ReleaseNotes;

/// <summary>Sürüm notu kategorisi — kullanıcıya emoji + etiket + renk sınıfıyla gösterilir.</summary>
public enum ReleaseNoteCategory
{
    Security,     // Güvenlik
    Feature,      // Yenilik
    Improvement,  // İyileştirme
    Fix           // Düzeltme
}

public static class ReleaseNoteCategoryInfo
{
    public static string Label(ReleaseNoteCategory c) => c switch
    {
        ReleaseNoteCategory.Security    => "Güvenlik",
        ReleaseNoteCategory.Feature     => "Yenilik",
        ReleaseNoteCategory.Improvement => "İyileştirme",
        ReleaseNoteCategory.Fix         => "Düzeltme",
        _ => ""
    };

    /// <summary>CSS değiştirici anahtarı → <c>apya-rn-tag--{key}</c> (kurumsal kategori etiketi).</summary>
    public static string Key(ReleaseNoteCategory c) => c switch
    {
        ReleaseNoteCategory.Security    => "security",
        ReleaseNoteCategory.Feature     => "feature",
        ReleaseNoteCategory.Improvement => "improvement",
        ReleaseNoteCategory.Fix         => "fix",
        _ => "neutral"
    };
}

public sealed class ReleaseNoteItem
{
    public ReleaseNoteCategory Category { get; }

    /// <summary>Kısa başlık — madde özetinde bu görünür.</summary>
    public string Title { get; }

    /// <summary>"Ne işe yaradığı" — sade açıklama, ayrıntı görünümünde gösterilir.</summary>
    public string Description { get; }

    /// <summary>
    /// Yayın kararının (onay / paket / seviye) bağlandığı kararlı anahtar — başlığın
    /// karmasından türer, <see cref="ReleaseNote"/> kurucusunda atanır.
    ///
    /// <para>🔴 YAYINLANMIŞ bir maddenin BAŞLIĞINI değiştirme: anahtar değişir, host'un
    /// o maddeye verdiği onay düşer ve madde yeniden onay bekler. Açıklama metnini
    /// değiştirmek anahtarı etkilemez.</para>
    /// </summary>
    public string Key { get; internal set; } = string.Empty;

    public ReleaseNoteItem(ReleaseNoteCategory category, string title, string description)
    {
        Category = category;
        Title = title;
        Description = description;
    }
}

public sealed class ReleaseNote
{
    /// <summary>Benzersiz sürüm kimliği (görülme takibi bununla yapılır). Örn. "2026.08.16".</summary>
    public string Version { get; }

    public string Date { get; }

    /// <summary>Sürümün tek cümlelik başlığı.</summary>
    public string Title { get; }

    public IReadOnlyList<ReleaseNoteItem> Items { get; }

    public ReleaseNote(string version, string date, string title, params ReleaseNoteItem[] items)
    {
        Version = version;
        Date = date;
        Title = title;
        Items = items;

        AssignKeys(items);
    }

    /// <summary>
    /// Maddelere sürüm içinde benzersiz anahtar verir. Anahtar, başlığın SHA-256
    /// karmasının ilk 12 hex hanesidir; aynı sürümde iki madde aynı anahtarı üretirse
    /// (pratikte yalnız birebir aynı başlıkta) sonuna sıra eki gelir.
    /// </summary>
    private static void AssignKeys(ReleaseNoteItem[] items)
    {
        var used = new HashSet<string>(StringComparer.Ordinal);

        foreach (var item in items)
        {
            var hash = HashOf(item.Title);
            var candidate = hash;
            var suffix = 2;
            while (!used.Add(candidate))
            {
                candidate = hash + "-" + suffix++;
            }

            item.Key = candidate;
        }
    }

    private static string HashOf(string title)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(title));
        return Convert.ToHexString(bytes, 0, 6).ToLowerInvariant();
    }
}
