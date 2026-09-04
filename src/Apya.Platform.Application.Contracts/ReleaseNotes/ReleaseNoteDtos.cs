using System.Collections.Generic;
using Apya.Platform.Tenants;

namespace Apya.Platform.ReleaseNotes;

// ── Host yönetim ekranı ────────────────────────────────────────────────────────

/// <summary>Yönetim ekranındaki bir sürüm bloğu — katalog içeriği + mevcut yayın kararları.</summary>
public class ReleaseNoteAdminDto
{
    public string Version { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public List<ReleaseNoteAdminItemDto> Items { get; set; } = new();
}

public class ReleaseNoteAdminItemDto
{
    public string Key { get; set; } = string.Empty;
    public ReleaseNoteCategory Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    /// <summary>Bu madde için hiç karar verilmemiş mi? (tabloda satır yok = onay bekliyor)</summary>
    public bool IsPending { get; set; }

    public bool IsApproved { get; set; }
    public bool ShowInModal { get; set; }
    public bool ShowInHistory { get; set; }
    public List<PackageCode> Packages { get; set; } = new();
    public ReleaseNoteAudience Audience { get; set; }
}

// ── Kaydetme ───────────────────────────────────────────────────────────────────

public class SaveReleaseNotePublicationsInput
{
    public List<ReleaseNotePublicationInput> Items { get; set; } = new();
}

public class ReleaseNotePublicationInput
{
    public string Version { get; set; } = string.Empty;
    public string ItemKey { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public bool ShowInModal { get; set; }
    public bool ShowInHistory { get; set; }
    public List<PackageCode> Packages { get; set; } = new();
    public ReleaseNoteAudience Audience { get; set; }
}

// ── Kullanıcıya gösterim ───────────────────────────────────────────────────────

public class ReleaseNoteViewDto
{
    public string Version { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public List<ReleaseNoteViewItemDto> Items { get; set; } = new();
}

public class ReleaseNoteViewItemDto
{
    public ReleaseNoteCategory Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Yalnız host'ta dolar: madde onaylanmadığı hâlde host'a gösteriliyor.
    /// Kiracı kullanıcısına giden listede bu bayrak taşıyan madde BULUNMAZ.
    /// </summary>
    public bool IsPendingApproval { get; set; }
}

/// <summary>İlk açılış "Yenilikler" penceresinin içeriği. Gösterilecek madde yoksa null döner.</summary>
public class ReleaseNoteModalDto : ReleaseNoteViewDto
{
    /// <summary>
    /// Kullanıcının "gördüm" işareti olarak saklanacak damga: <c>{sürüm}|{karma}</c>.
    /// Karma, kullanıcının gördüğü madde kümesinden türer — host sonradan yeni madde
    /// onaylarsa damga değişir ve pencere bir kez daha açılır.
    /// </summary>
    public string SeenToken { get; set; } = string.Empty;

    /// <summary>Host'a gösterilen pencerede onay bekleyen madde var mı? (rozet + yönlendirme)</summary>
    public bool HasPendingItems { get; set; }
}
