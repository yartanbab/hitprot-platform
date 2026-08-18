using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// Projenin iş adımı / fazı ("1 · Kavramsal Tasarım", "2 · Prototip Üretimi").
/// Doküman bağlam ağacının omurgası: her belge bir iş adımına bağlanabilir,
/// uygunluk kontrol listesi (Faz B) iş adımı kapsamında değerlendirilir.
/// Görev (TaskItem) ile karıştırılmamalı — iş adımı planın sabit kırılımıdır,
/// altında birden çok görev bulunabilir.
/// </summary>
public class ProjectWorkStep : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid ProjectId { get; private set; }

    /// <summary>Kullanıcıya gösterilen sıra ("1 ·", "2 ·"). Proje içinde benzersiz olması beklenir.</summary>
    public int Order { get; private set; }

    public string Name { get; private set; } = null!;

    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }

    /// <summary>Tamamlanma yüzdesi (0-100). Gantt çubuğunun dolgusu — Faz E'de görev verisinden türetilecek.</summary>
    public int ProgressPercent { get; private set; }

    protected ProjectWorkStep() { }

    public ProjectWorkStep(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        int order,
        string name,
        DateTime? startDate = null,
        DateTime? endDate = null) : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        Order = order;
        SetName(name);
        SetSchedule(startDate, endDate);
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.WorkStepNameRequired);

        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: ProjectWorkStepConsts.MaxNameLength).Trim();
    }

    public void SetSchedule(DateTime? startDate, DateTime? endDate)
    {
        if (startDate.HasValue && endDate.HasValue && endDate.Value < startDate.Value)
            throw new BusinessException(PlatformDomainErrorCodes.WorkStepScheduleInvalid)
                .WithData("StartDate", startDate)
                .WithData("EndDate", endDate);

        StartDate = startDate;
        EndDate = endDate;
    }

    public void SetOrder(int order) => Order = order;

    public void SetProgress(int progressPercent)
        => ProgressPercent = Math.Clamp(progressPercent, 0, 100);

    public void Update(int order, string name, DateTime? startDate, DateTime? endDate, int progressPercent)
    {
        SetOrder(order);
        SetName(name);
        SetSchedule(startDate, endDate);
        SetProgress(progressPercent);
    }
}
