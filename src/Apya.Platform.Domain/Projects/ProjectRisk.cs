using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// Proje risk kütüğü kalemi (zaman çizelgesi ekranının sağ kolonu).
///
/// Olasılık ve etki 1-5 arasında; skor çarpımlarıdır (1-25). Skoru saklamıyoruz —
/// iki alandan türetilebilen bir değeri saklamak, biri değişince bayatlayan
/// üçüncü bir gerçeklik yaratırdı.
/// </summary>
public class ProjectRisk : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid ProjectId { get; private set; }

    /// <summary>Riskin bağlı olduğu iş adımı. Null = proje geneli.</summary>
    public Guid? WorkStepId { get; private set; }

    public string Title { get; private set; } = null!;

    /// <summary>1 (çok düşük) – 5 (çok yüksek).</summary>
    public int Likelihood { get; private set; }

    /// <summary>1 (önemsiz) – 5 (kritik).</summary>
    public int Impact { get; private set; }

    public string? Mitigation { get; private set; }

    public Guid? OwnerId { get; private set; }

    public bool IsClosed { get; private set; }

    protected ProjectRisk() { }

    public ProjectRisk(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        string title,
        int likelihood,
        int impact,
        Guid? workStepId = null,
        string? mitigation = null,
        Guid? ownerId = null) : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        SetTitle(title);
        SetAssessment(likelihood, impact);
        WorkStepId = workStepId;
        Mitigation = mitigation;
        OwnerId = ownerId;
    }

    /// <summary>Risk skoru = olasılık × etki (1-25). Türetilir, saklanmaz.</summary>
    public int Score => Likelihood * Impact;

    public void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new BusinessException(PlatformDomainErrorCodes.ProjectRiskTitleRequired);

        Title = Check.NotNullOrWhiteSpace(
            title, nameof(title), maxLength: Documents.MatchingConsts.MaxRiskTitleLength).Trim();
    }

    public void SetAssessment(int likelihood, int impact)
    {
        Likelihood = Math.Clamp(likelihood, 1, 5);
        Impact = Math.Clamp(impact, 1, 5);
    }

    public void Update(string title, int likelihood, int impact, Guid? workStepId, string? mitigation, Guid? ownerId)
    {
        SetTitle(title);
        SetAssessment(likelihood, impact);
        WorkStepId = workStepId;
        Mitigation = string.IsNullOrWhiteSpace(mitigation) ? null : mitigation.Trim();
        OwnerId = ownerId;
    }

    public void Close() => IsClosed = true;

    public void Reopen() => IsClosed = false;
}
