using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 6c · Raporun bir alt bölümü (teknik, mali, çizelge, YMM onayı…).
/// Durumu <see cref="GrantReportStatus"/> ile AYNI enum üzerinden yürür; iki ayrı
/// durum sözlüğü tutmak ekranı da kodu da ikiye bölerdi.
/// </summary>
public class GrantReportSection : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid ReportId { get; private set; }
    public int Order { get; set; }
    public string Name { get; private set; } = null!;
    public GrantReportStatus Status { get; private set; }

    /// <summary>"3 fatura eksik" gibi kısa durum notu.</summary>
    public string? Note { get; private set; }

    protected GrantReportSection() { }

    public GrantReportSection(Guid id, Guid? tenantId, Guid reportId, int order, string name) : base(id)
    {
        TenantId = tenantId;
        ReportId = reportId;
        Order = order;
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 96).Trim();
        Status = GrantReportStatus.Planlandi;
    }

    public void SetStatus(GrantReportStatus status, string? note)
    {
        Status = status;
        Note = note;
    }
}
