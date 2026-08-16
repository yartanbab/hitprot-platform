using System.Collections.Generic;

namespace Apya.Platform.Web.ReleaseNotes;

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
    }
}
