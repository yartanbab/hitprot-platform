using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Tenants;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.ReleaseNotes;

public static class ReleaseNotePublicationConsts
{
    public const int MaxVersionLength = 32;
    public const int MaxItemKeyLength = 64;

    /// <summary>Dört paket adının virgüllü hâli ~40 karakter; pay bırakıldı.</summary>
    public const int MaxPackagesLength = 128;
}

/// <summary>
/// Bir sürüm notu maddesinin yayın kararı. Katalog kodda durur
/// (<c>Apya.Platform.ReleaseNotes.ReleaseNoteCatalog</c>); bu tablo yalnız host'un o madde
/// için verdiği "yayınlansın mı, kime, hangi pakete" kararını taşır.
///
/// <para><b>Host kaydıdır</b>: <c>IMultiTenant</c> UYGULANMAZ — karar tüm kiracılar için
/// tektir ve host bağlamında yazılır. Satırın HİÇ olmaması "onaylanmadı" demektir; kiracı
/// tarafında varsayılan kapalıdır.</para>
///
/// <para><see cref="ItemKey"/> maddenin başlığından türeyen kararlı anahtardır
/// (bkz. <c>ReleaseNoteItem.Key</c>). Başlık değişirse anahtar değişir ve madde yeniden
/// onay bekler — bu bilinçlidir: içerik değiştiyse onay da tazelenmelidir.</para>
/// </summary>
public class ReleaseNotePublication : AuditedAggregateRoot<Guid>
{
    public string Version { get; private set; }

    public string ItemKey { get; private set; }

    /// <summary>Host onayladı mı? False ise madde hiçbir kiracı kullanıcısına gösterilmez.</summary>
    public bool IsApproved { get; private set; }

    /// <summary>İlk açılış "Yenilikler" penceresinde görünsün mü?</summary>
    public bool ShowInModal { get; private set; }

    /// <summary>/ReleaseNotes sürüm geçmişi sayfasında görünsün mü?</summary>
    public bool ShowInHistory { get; private set; }

    /// <summary>İzin verilen paket kodları, virgülle ayrılmış (örn. "Standard,Premium").</summary>
    public string Packages { get; private set; }

    public ReleaseNoteAudience Audience { get; private set; }

    protected ReleaseNotePublication()
    {
        Version = string.Empty;
        ItemKey = string.Empty;
        Packages = string.Empty;
    }

    public ReleaseNotePublication(Guid id, string version, string itemKey) : base(id)
    {
        Version = Check.NotNullOrWhiteSpace(version, nameof(version), ReleaseNotePublicationConsts.MaxVersionLength);
        ItemKey = Check.NotNullOrWhiteSpace(itemKey, nameof(itemKey), ReleaseNotePublicationConsts.MaxItemKeyLength);
        Packages = string.Empty;
    }

    public void Set(
        bool isApproved,
        bool showInModal,
        bool showInHistory,
        IEnumerable<PackageCode> packages,
        ReleaseNoteAudience audience)
    {
        IsApproved = isApproved;
        ShowInModal = showInModal;
        ShowInHistory = showInHistory;
        Packages = string.Join(",", packages.Distinct().OrderBy(p => (int)p));
        Audience = audience;
    }

    /// <summary>Kararda seçili paket kodları. Boş liste = hiçbir pakete açık değil.</summary>
    public IReadOnlyList<PackageCode> PackageCodes()
        => Packages.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => Enum.TryParse<PackageCode>(s, out var code) ? (PackageCode?)code : null)
            .Where(c => c.HasValue)
            .Select(c => c!.Value)
            .ToList();
}
