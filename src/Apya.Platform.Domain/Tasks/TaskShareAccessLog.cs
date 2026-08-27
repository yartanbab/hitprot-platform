using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

/// <summary>
/// Süreli görev linkinin erişim kaydı — "dış kişi ne zaman baktı, ne yazdı, ne yükledi".
///
/// Link YAZMA yetkisi taşıdığı için bu iz salt okunur paylaşımdakinden daha kritiktir:
/// göreve düşen bir yorumun/dosyanın hangi linkten geldiği yalnız buradan doğrulanabilir.
/// Kayıt append-only'dir.
///
/// KVKK: ham IP tutulmaz. <see cref="IpHash"/> tek yönlü özettir; amaç kişiyi tanımlamak
/// değil, aynı ziyaretçiyi tekrar eden erişimlerde eşleştirebilmek ve kötüye kullanımı
/// fark etmek.
/// </summary>
public class TaskShareAccessLog : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid ShareLinkId { get; set; }

    public TaskShareAction Action { get; set; }

    /// <summary>İşlemin dokunduğu görev — kök görev de olabilir, alt görev de.</summary>
    public Guid? TaskId { get; set; }

    public string? IpHash { get; set; }

    public string? UserAgent { get; set; }

    public TaskShareAccessLog() { }

    public TaskShareAccessLog(
        Guid id, Guid? tenantId, Guid shareLinkId, TaskShareAction action,
        Guid? taskId, string? ipHash, string? userAgent) : base(id)
    {
        TenantId = tenantId;
        ShareLinkId = shareLinkId;
        Action = action;
        TaskId = taskId;
        IpHash = ipHash;
        UserAgent = userAgent;
    }
}
