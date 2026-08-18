using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Paketteki tek bir ek. <see cref="AnnexNumber"/> ("EK-3") üretim anında sıraya göre
/// yeniden hesaplanır — kullanıcı sırayı değiştirince numaralar da kayar, elle
/// tutulan bir numara ile gerçek sıra ayrışmasın.
/// </summary>
public class DeliveryPackageItem : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid PackageId { get; private set; }

    public Guid DocumentFileId { get; private set; }

    public int Order { get; private set; }

    public string? AnnexNumber { get; private set; }

    protected DeliveryPackageItem() { }

    public DeliveryPackageItem(
        Guid id,
        Guid? tenantId,
        Guid packageId,
        Guid documentFileId,
        int order) : base(id)
    {
        TenantId = tenantId;
        PackageId = packageId;
        DocumentFileId = documentFileId;
        Order = order;
    }

    public void SetOrder(int order) => Order = order;

    public void AssignAnnexNumber(int index) => AnnexNumber = $"EK-{index}";
}
