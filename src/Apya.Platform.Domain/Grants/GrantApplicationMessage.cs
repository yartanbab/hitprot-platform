using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 2a · Sağ paneldeki "Danışmana sor" yazışması. Başvuru bağlamına bağlı kısa notlar;
/// 2d'deki yazışma geçmişi de aynı kaydı okur.
///
/// Gönderen adı KOPYA olarak saklanır: danışman host kullanıcısıdır, kiracı onun
/// kullanıcı kaydını sorgulayamaz — ada her okumada kullanıcı tablosundan bakılsaydı
/// kiracı tarafında boş görünürdü.
/// </summary>
public class GrantApplicationMessage : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }
    public Guid SenderUserId { get; private set; }
    public string SenderName { get; private set; } = null!;

    /// <summary>Gönderenin başvurudaki rolü — mesaj balonunun tarafını belirler.</summary>
    public GrantPartyRole SenderRole { get; private set; }

    public string Body { get; private set; } = null!;

    protected GrantApplicationMessage() { }

    public GrantApplicationMessage(
        Guid id,
        Guid? tenantId,
        Guid grantApplicationId,
        Guid senderUserId,
        string senderName,
        GrantPartyRole senderRole,
        string body) : base(id)
    {
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        SenderUserId = senderUserId;
        SenderName = senderName;
        SenderRole = senderRole;
        Body = body;
    }
}
