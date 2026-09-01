using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 2d · Süreç akışındaki olay kaydı.
///
/// <para>YALNIZ başka yerde iz bırakmayan olaylar buraya yazılır: aşama taşıma,
/// atama değişikliği, devretme, gönderim. Mesajlar
/// <see cref="GrantApplicationMessage"/>, evrak yüklemeleri
/// <see cref="GrantApplicationDocumentVersion"/> tablolarında zaten duruyor;
/// aynı olayı iki yere yazmak akışı çift gösterirdi. Ekrandaki tek zaman çizelgesi
/// üç kaynağın birleşimidir.</para>
///
/// <para>Aktörün adı kopya olarak saklanır: host kullanıcısını kiracı sorgulayamaz.</para>
/// </summary>
public class GrantApplicationActivity : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }
    public GrantActivityKind Kind { get; private set; }
    public Guid ActorUserId { get; private set; }
    public string ActorName { get; private set; } = null!;
    public GrantPartyRole ActorRole { get; private set; }

    /// <summary>Olayın bağlamı — hedef aşamanın adı, atanan kişinin adı gibi.</summary>
    public string? Context { get; private set; }

    protected GrantApplicationActivity() { }

    public GrantApplicationActivity(
        Guid id,
        Guid? tenantId,
        Guid grantApplicationId,
        GrantActivityKind kind,
        Guid actorUserId,
        string actorName,
        GrantPartyRole actorRole,
        string? context) : base(id)
    {
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        Kind = kind;
        ActorUserId = actorUserId;
        ActorName = actorName;
        ActorRole = actorRole;
        Context = context;
    }
}
