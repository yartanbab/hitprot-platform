using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Bir paketin belirli bir projeye (ve isteğe bağlı olarak belirli bir döneme)
/// uygulanmış hali. Aynı projeye birden çok paket uygulanabilir
/// (ör. hem KOSGEB hem banka dosyası).
/// </summary>
public class ComplianceAssignment : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid ProjectId { get; private set; }

    public Guid PackageId { get; private set; }

    /// <summary>
    /// Dönem kapsamlı kalemlerin hangi döneme bakacağı ("2026-Q2").
    /// Null = dönem kapsamlı kalemler değerlendirilmez.
    /// </summary>
    public string? PeriodCode { get; private set; }

    protected ComplianceAssignment() { }

    public ComplianceAssignment(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        Guid packageId,
        string? periodCode = null) : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        PackageId = packageId;
        SetPeriod(periodCode);
    }

    public void SetPeriod(string? periodCode)
        => PeriodCode = string.IsNullOrWhiteSpace(periodCode) ? null : periodCode.Trim();
}
