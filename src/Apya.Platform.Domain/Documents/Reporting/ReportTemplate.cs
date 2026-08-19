using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Alıcı şablonu ("KOSGEB", "Banka / finans", "Denetçi · YMM").
/// Bölümlerin İÇERİĞİNİ tutmaz — yalnız hangi bölümlerin hangi sırayla ve
/// açık/kapalı geleceğini (bkz. <see cref="ReportSection"/>). İçerik her üretimde
/// canlı veriden hesaplanır; şablon kaydı bayat rapor üretmez.
///
/// Sistem şablonları host seviyesinde (TenantId = null) seed edilir —
/// DocumentType/CompliancePackage ile aynı desen.
/// </summary>
public class ReportTemplate : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Name { get; private set; } = null!;

    public ReportRecipient Recipient { get; private set; }

    /// <summary>Kurum alıcılarında hangi kurum ("KOSGEB", "TÜBİTAK"); diğerlerinde null.</summary>
    public string? Issuer { get; private set; }

    public bool IsSystem { get; private set; }

    public int Order { get; private set; }

    protected ReportTemplate() { }

    public ReportTemplate(
        Guid id,
        Guid? tenantId,
        string name,
        ReportRecipient recipient,
        string? issuer = null,
        bool isSystem = false,
        int order = 0) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
        Recipient = recipient;
        Issuer = string.IsNullOrWhiteSpace(issuer) ? null : issuer.Trim();
        IsSystem = isSystem;
        Order = order;
    }

    /// <summary>
    /// Kiracının kendi şablonunu düzenler. Sistem şablonu DEĞİŞTİRİLEMEZ: host
    /// seviyesinde tohumlanır ve tüm kiracılarda paylaşılır — birinin düzenlemesi
    /// hepsini etkilerdi.
    /// </summary>
    public void Update(string name, ReportRecipient recipient, string? issuer, int order)
    {
        GuardNotSystem();

        SetName(name);
        Recipient = recipient;
        Issuer = string.IsNullOrWhiteSpace(issuer) ? null : issuer.Trim();
        Order = order;
    }

    /// <summary>Düzenleme/silme öncesi sistem şablonu koruması.</summary>
    public void GuardNotSystem()
    {
        if (IsSystem)
        {
            throw new BusinessException(PlatformDomainErrorCodes.ReportTemplateIsSystem)
                .WithData("Name", Name);
        }
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.ReportTemplateNameRequired);

        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: ReportingConsts.MaxTemplateNameLength).Trim();
    }
}
