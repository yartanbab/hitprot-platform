using System;
using System.Collections.Generic;
using Apya.Platform.Projects;

namespace Apya.Platform.Grants;

/// <summary>
/// Eşleştirici girdisi (genişletilebilir). Faz B1: elle profil sinyalleri.
/// Faz B2: proje sinyalleri eklendi (tipik bütçe, baskın kategori). ActiveProjectCount
/// alanı hazır ama Score() henüz kullanmıyor — kapasite yönü/formülü netleşmedi (B3/C).
/// </summary>
public sealed class FirmSignals
{
    public CompanySize? Size { get; set; }
    public IReadOnlyList<FirmSignalTag> Tags { get; set; } = new List<FirmSignalTag>();

    /// <summary>Tenant'ın bütçesi &gt;0 olan projelerinin ortalama TotalBudget'ı. Proje yoksa null.</summary>
    public decimal? TypicalProjectBudget { get; set; }

    /// <summary>Tenant'ın projelerinde en sık görülen Category. Proje yoksa null.</summary>
    public ProjectCategory? DominantCategory { get; set; }

    /// <summary>Devam eden (EndDate boş veya bugünden ileri) proje sayısı. B3/C'de kapasite sinyali için.</summary>
    public int ActiveProjectCount { get; set; }

    // --- 1b · uygunluk kurallarının firma tarafı (FirmProfile'dan okunur) ---
    // null = veri girilmemiş → ilgili kural Unknown döner, firma elenmez.
    public DateTime? FoundedOn { get; set; }
    public int? StaffCount { get; set; }
    public int? RdStaffCount { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? Trl { get; set; }
    public bool? HasConsortiumPartner { get; set; }
}

public sealed record FirmSignalTag(GrantCriteriaKind Kind, string Value);
