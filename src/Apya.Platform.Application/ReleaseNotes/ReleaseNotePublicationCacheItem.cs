using System.Collections.Generic;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ReleaseNotes;

/// <summary>
/// Yayın kararlarının tamamı tek önbellek kaydında. Karar host seviyesindedir ve tüm
/// kiracılar için aynıdır → <see cref="IgnoreMultiTenancyAttribute"/> ile kiracı öneki
/// alınmaz, kiracı sayısı kadar kopya tutulmaz.
///
/// <para>Pencere HER sayfa açılışında çalıştığı için bu okuma DB'ye inmemeli.
/// Geçersizleştirme: <see cref="ReleaseNotePublicationAppService.SaveAsync"/>.</para>
/// </summary>
[IgnoreMultiTenancy]
public class ReleaseNotePublicationCacheItem
{
    public const string CacheKey = "all";

    public List<ReleaseNotePublicationCacheEntry> Entries { get; set; } = new();
}

public class ReleaseNotePublicationCacheEntry
{
    public string Version { get; set; } = string.Empty;
    public string ItemKey { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public bool ShowInModal { get; set; }
    public bool ShowInHistory { get; set; }

    /// <summary>İzin verilen paket kodları, virgüllü (entity ile aynı biçim).</summary>
    public string Packages { get; set; } = string.Empty;

    public ReleaseNoteAudience Audience { get; set; }
}
