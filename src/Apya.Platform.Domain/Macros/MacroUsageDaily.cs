using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro Ekran kullanım sayacı: kullanıcı başına, makro başına, GÜN başına tek satır.
/// Her tıklama satır yazmaz (çok kiracılı kurulumda tablo şişerdi); aynı gün aynı makro
/// sayacı artırır. Pencere dışı satırları <see cref="MacroUsageCleanupWorker"/> siler.
/// </summary>
public class MacroUsageDaily : Entity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid UserId { get; private set; }

    /// <summary>Katalog anahtarı (MacroCatalog). Menü adı değil: menüye bağlı makro da kendi anahtarıyla sayılır.</summary>
    public string MacroKey { get; private set; } = null!;

    /// <summary>Günün başı (yerel saat, IClock).</summary>
    public DateTime Day { get; private set; }

    public int Count { get; private set; }

    protected MacroUsageDaily()
    {
    }

    public MacroUsageDaily(Guid id, Guid? tenantId, Guid userId, string macroKey, DateTime day)
        : base(id)
    {
        TenantId = tenantId;
        UserId = userId;
        MacroKey = Check.NotNullOrWhiteSpace(macroKey, nameof(macroKey), MacroUsageConsts.MaxKeyLength);
        Day = day.Date;
        Count = 1;
    }

    public void Increment() => Count++;
}
