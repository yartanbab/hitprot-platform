using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Şablonun tek bir bölümü. Sürükleyerek sıralanır, anahtarla açılıp kapanır.
/// Kapalı bölüm çıktıya GİRMEZ ama kayıtta kalır — kullanıcı sonra geri açabilsin.
/// </summary>
public class ReportSection : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid TemplateId { get; private set; }

    public ReportSectionKey SectionKey { get; private set; }

    public int Order { get; private set; }

    public bool IsEnabled { get; private set; }

    protected ReportSection() { }

    public ReportSection(
        Guid id,
        Guid? tenantId,
        Guid templateId,
        ReportSectionKey sectionKey,
        int order,
        bool isEnabled = true) : base(id)
    {
        TenantId = tenantId;
        TemplateId = templateId;
        SectionKey = sectionKey;
        Order = order;
        IsEnabled = isEnabled;
    }

    public void SetOrder(int order) => Order = order;

    public void SetEnabled(bool isEnabled) => IsEnabled = isEnabled;
}
