using System;
using Apya.Platform.Projects;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Hibe başvurusunun ölçülebilir hedefi ("Eğitilen kişi sayısı — hedef 200 kişi"). Başvuru projeye
/// dönüştürülürken proje göstergesine (<see cref="ProjectIndicator"/>) kopyalanır.
///
/// <para>Kurallar göstergeyle AYNI tutulur (ad boş olamaz, hedef başlangıca eşit olamaz, aynı
/// uzunluk sınırları): burada kabul edilen bir satır dönüşümün ortasında reddedilmemeli.</para>
/// </summary>
public class GrantApplicationTarget : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid GrantApplicationId { get; private set; }

    public string Name { get; private set; } = null!;

    public string? Unit { get; private set; }

    public decimal BaselineValue { get; private set; }

    public decimal TargetValue { get; private set; }

    public DateTime? TargetDate { get; private set; }

    protected GrantApplicationTarget() { }

    public GrantApplicationTarget(
        Guid id,
        Guid? tenantId,
        Guid grantApplicationId,
        string name,
        string? unit,
        decimal baselineValue,
        decimal targetValue,
        DateTime? targetDate = null) : base(id)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.GrantTargetNameRequired);

        if (targetValue == baselineValue)
            throw new BusinessException(PlatformDomainErrorCodes.GrantTargetValueInvalid);

        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: ProjectIndicatorConsts.MaxNameLength).Trim();
        Unit = string.IsNullOrWhiteSpace(unit)
            ? null
            : Check.Length(unit.Trim(), nameof(unit), ProjectIndicatorConsts.MaxUnitLength);
        BaselineValue = baselineValue;
        TargetValue = targetValue;
        TargetDate = targetDate?.Date;
    }
}
