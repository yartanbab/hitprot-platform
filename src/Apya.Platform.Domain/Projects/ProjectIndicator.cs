using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// PRJ-08 · Projenin göstergesi (çıktı / sonuç hedefi): "Eğitilen kişi sayısı — hedef 200 kişi".
/// Gerçekleşen değer burada TUTULMAZ; ölçüm girişlerinden (<see cref="ProjectIndicatorEntry"/>)
/// okunur — en son tarihli giriş, göstergenin o günkü değeridir.
/// </summary>
public class ProjectIndicator : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid ProjectId { get; private set; }

    public string Name { get; private set; } = null!;

    /// <summary>Ölçü birimi ("kişi", "adet", "%"). Boş olabilir.</summary>
    public string? Unit { get; private set; }

    /// <summary>Proje başındaki değer; ilerleme bu değerden hedefe doğru ölçülür.</summary>
    public decimal BaselineValue { get; private set; }

    /// <summary>Hedef; başlangıçtan küçük de olabilir (azaltma hedefi), eşit olamaz.</summary>
    public decimal TargetValue { get; private set; }

    public DateTime? TargetDate { get; private set; }

    /// <summary>İsteğe bağlı: göstergenin bağlı olduğu iş adımı (aynı projeden).</summary>
    public Guid? WorkStepId { get; private set; }

    protected ProjectIndicator() { }

    public ProjectIndicator(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        string name,
        string? unit,
        decimal baselineValue,
        decimal targetValue,
        DateTime? targetDate = null,
        Guid? workStepId = null) : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        Update(name, unit, baselineValue, targetValue, targetDate, workStepId);
    }

    public void Update(
        string name, string? unit, decimal baselineValue, decimal targetValue, DateTime? targetDate, Guid? workStepId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.ProjectIndicatorNameRequired);

        if (targetValue == baselineValue)
            throw new BusinessException(PlatformDomainErrorCodes.ProjectIndicatorTargetInvalid);

        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: ProjectIndicatorConsts.MaxNameLength).Trim();
        Unit = string.IsNullOrWhiteSpace(unit)
            ? null
            : Check.Length(unit.Trim(), nameof(unit), ProjectIndicatorConsts.MaxUnitLength);
        BaselineValue = baselineValue;
        TargetValue = targetValue;
        TargetDate = targetDate?.Date;
        WorkStepId = workStepId;
    }

    public void SetWorkStep(Guid? workStepId) => WorkStepId = workStepId;
}
