using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Tenants;

namespace Apya.Platform.ReleaseNotes;

/// <summary>
/// Yayın kapısının saf kuralı — bir kiracı kullanıcısı bu maddeyi görür mü?
/// Servisten ayrı tutuldu ki ABP host'u ayağa kaldırmadan doğrudan test edilebilsin;
/// bu kural yanlışsa onaylanmamış bir madde müşteriye gider, sessizce.
/// </summary>
public static class ReleaseNoteVisibility
{
    /// <param name="decision">Karar satırı. <c>null</c> = host hiç karar vermemiş.</param>
    /// <param name="package">Kiracının paketi.</param>
    /// <param name="isTenantAdmin">Kullanıcı kiracı yöneticisi mi (TenantSettings izni)?</param>
    /// <param name="forModal">İlk açılış penceresi için mi soruluyor (değilse geçmiş sayfası)?</param>
    public static bool IsVisibleToTenant(
        ReleaseNotePublicationCacheEntry? decision,
        PackageCode package,
        bool isTenantAdmin,
        bool forModal)
    {
        // Karar yoksa YAYIN YOK. Varsayılan bilinçli olarak kapalı: kataloğa madde eklemek
        // tek başına yayınlamak anlamına gelmemeli.
        if (decision == null || !decision.IsApproved)
        {
            return false;
        }

        if (forModal ? !decision.ShowInModal : !decision.ShowInHistory)
        {
            return false;
        }

        if (decision.Audience == ReleaseNoteAudience.HostOnly)
        {
            return false;
        }

        if (decision.Audience == ReleaseNoteAudience.TenantAdmins && !isTenantAdmin)
        {
            return false;
        }

        return ParsePackages(decision.Packages).Contains(package);
    }

    /// <summary>Virgüllü paket listesini çözer; tanınmayan değerler atılır.</summary>
    public static List<PackageCode> ParsePackages(string csv)
        => csv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => Enum.TryParse<PackageCode>(s, out var code) ? (PackageCode?)code : null)
            .Where(c => c.HasValue)
            .Select(c => c!.Value)
            .ToList();
}
