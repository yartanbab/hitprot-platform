using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Kontrol listesi satırındaki KULLANICI KARARI.
///
/// Dikkat: satırın "karşılandı / eksik" durumu burada SAKLANMAZ — o her okumada
/// belge verisinden hesaplanır (ComplianceAppService). Hesaplanmış durumu
/// materyalize etmek, belge eklendiğinde/silindiğinde bayatlayan bir ikinci
/// gerçeklik kaynağı yaratırdı. Bu tablo yalnızca veriden türetilemeyen iki şeyi tutar:
///   1) feragat (bu kalem bu proje için aranmayacak),
///   2) elle bağlama (otomatik eşleşmeyen bir belgenin kalemi karşıladığının beyanı).
///
/// Kapsam örneği (WorkStepId / PeriodCode) satırın hangi tekrarına ait olduğunu belirler.
/// </summary>
public class ComplianceItemState : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid AssignmentId { get; private set; }

    public Guid RequirementId { get; private set; }

    /// <summary>WorkStep kapsamlı kalemlerde hangi iş adımı; diğerlerinde null.</summary>
    public Guid? WorkStepId { get; private set; }

    /// <summary>Period kapsamlı kalemlerde hangi dönem; diğerlerinde null.</summary>
    public string? PeriodCode { get; private set; }

    /// <summary>Kalemi karşıladığı elle beyan edilen belge.</summary>
    public Guid? DocumentFileId { get; private set; }

    public bool IsWaived { get; private set; }

    public string? WaiveReason { get; private set; }

    protected ComplianceItemState() { }

    public ComplianceItemState(
        Guid id,
        Guid? tenantId,
        Guid assignmentId,
        Guid requirementId,
        Guid? workStepId = null,
        string? periodCode = null) : base(id)
    {
        TenantId = tenantId;
        AssignmentId = assignmentId;
        RequirementId = requirementId;
        WorkStepId = workStepId;
        PeriodCode = string.IsNullOrWhiteSpace(periodCode) ? null : periodCode.Trim();
    }

    public void Waive(string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new BusinessException(PlatformDomainErrorCodes.ComplianceWaiveReasonRequired);

        IsWaived = true;
        WaiveReason = Check.NotNullOrWhiteSpace(reason, nameof(reason), maxLength: ComplianceConsts.MaxWaiveReasonLength).Trim();
    }

    public void RemoveWaiver()
    {
        IsWaived = false;
        WaiveReason = null;
    }

    public void LinkDocument(Guid? documentFileId) => DocumentFileId = documentFileId;

    /// <summary>Ne feragat ne de bağlantı kaldıysa satır anlamsızdır — çağıran silebilir.</summary>
    public bool IsEmpty => !IsWaived && DocumentFileId == null;
}
