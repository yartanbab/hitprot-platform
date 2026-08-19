using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Paketin tek bir kontrol listesi kalemi ("SGK Borcu Yoktur Yazısı").
///
/// <see cref="DocumentTypeId"/> doluysa kalem OTOMATİK karşılanabilir: kapsamı
/// tutan ve bu tipte olan bir belge yüklendiğinde satır yeşile döner.
/// Boşsa yalnızca elle bağlama veya feragat ile kapatılabilir.
/// </summary>
public class ComplianceRequirement : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid PackageId { get; private set; }

    public string Title { get; private set; } = null!;

    /// <summary>Kalemi karşılayan belge tipi. Null = elle bağlama gerekir.</summary>
    public Guid? DocumentTypeId { get; private set; }

    public ComplianceScope Scope { get; private set; }

    /// <summary>Eksikse teslim paketi üretimini bloke eder (Faz C preflight'ı buna bakacak).</summary>
    public bool IsBlocking { get; private set; }

    public int Order { get; private set; }

    protected ComplianceRequirement() { }

    public ComplianceRequirement(
        Guid id,
        Guid? tenantId,
        Guid packageId,
        string title,
        ComplianceScope scope,
        Guid? documentTypeId = null,
        bool isBlocking = false,
        int order = 0) : base(id)
    {
        TenantId = tenantId;
        PackageId = packageId;
        SetTitle(title);
        Scope = scope;
        DocumentTypeId = documentTypeId;
        IsBlocking = isBlocking;
        Order = order;
    }

    public void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new BusinessException(PlatformDomainErrorCodes.ComplianceRequirementTitleRequired);

        Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: ComplianceConsts.MaxRequirementTitleLength).Trim();
    }

    public void Update(string title, ComplianceScope scope, Guid? documentTypeId, bool isBlocking, int order)
    {
        SetTitle(title);
        Scope = scope;
        DocumentTypeId = documentTypeId;
        IsBlocking = isBlocking;
        Order = order;
    }
}
