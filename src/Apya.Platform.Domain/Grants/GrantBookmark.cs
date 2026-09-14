using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 1d/9a/13b · Kiracının takip ettiği çağrı ("Takip ettiklerim" sekmesi ve katalogdaki
/// yer imi düğmesi). Kiracıya aittir — host'un gönderdiği öneriden
/// (<see cref="GrantRecommendation"/>) ayrıdır: biri kiracının kendi işareti, diğeri
/// host'un bilinçli yönlendirmesi.
///
/// <para>13b: takibe kısa bir not düşülebilir; danışman da firma adına işaretleyebilir
/// (<see cref="MarkedByUserId"/> dolu). İki durumda da satır kiracının satırıdır —
/// takipten çıkarma hakkı firmada kalır.</para>
/// </summary>
public class GrantBookmark : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid GrantCallId { get; private set; }

    /// <summary>Firmanın takip notu — "patent belgesi hâlâ eksik" gibi. Boş = not yok.</summary>
    public string? Note { get; private set; }

    /// <summary>Firma adına işaretleyen host kullanıcısı; firma kendi işaretlediyse null.</summary>
    public Guid? MarkedByUserId { get; private set; }

    protected GrantBookmark() { }

    public GrantBookmark(Guid id, Guid? tenantId, Guid grantCallId, Guid? markedByUserId = null) : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
        MarkedByUserId = markedByUserId;
    }

    /// <summary>Boşluktan ibaret not "not yok" sayılır.</summary>
    public void SetNote(string? note)
    {
        var trimmed = note?.Trim();
        Note = string.IsNullOrEmpty(trimmed) ? null : Check.Length(trimmed, nameof(note), maxLength: 500);
    }
}
