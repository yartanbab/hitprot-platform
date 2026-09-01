using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 2d · Danışmanlık kaydı: bir başvuruya harcanan süre.
///
/// <para>Süre SAAT cinsinden ondalık tutulur (14,5 sa). Dakika alanı ayrı
/// tutulsaydı toplama her yerde ikili hesap gerektirirdi.</para>
///
/// <para>Kayıt HOST tarafına aittir; kiracı kendi başvurusuna harcanan danışmanlık
/// süresini görmez — bu bir maliyet/ücretlendirme verisidir.</para>
/// </summary>
public class GrantConsultingLog : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }
    public Guid UserId { get; private set; }
    public string UserName { get; private set; } = null!;
    public DateTime WorkDate { get; private set; }
    public decimal Hours { get; private set; }
    public string? Note { get; private set; }

    protected GrantConsultingLog() { }

    public GrantConsultingLog(
        Guid id,
        Guid? tenantId,
        Guid grantApplicationId,
        Guid userId,
        string userName,
        DateTime workDate,
        decimal hours,
        string? note) : base(id)
    {
        if (hours is <= 0 or > 24)
        {
            // Tek kayıtta bir günden fazla süre girilmesi veri hatasıdır.
            throw new BusinessException(PlatformDomainErrorCodes.GrantConsultingHoursInvalid);
        }

        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        UserId = userId;
        UserName = userName;
        WorkDate = workDate;
        Hours = hours;
        Note = note;
    }
}
