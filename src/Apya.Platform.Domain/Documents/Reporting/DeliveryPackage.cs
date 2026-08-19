using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Kuruma gidecek teslim dosyası: sıralı ekler (EK-1…EK-n) + üretilmiş çıktı.
///
/// Üretim <see cref="DeliveryPackageStatus.Draft"/> durumundan çıkarır ve YALNIZCA
/// preflight temizse yapılabilir (bloke kalem varsa servis <c>DeliveryPackageBlocked</c>
/// fırlatır). Üretilmiş paket düzenlenemez — teslim edilen dosyanın içeriği sonradan
/// değişirse denetim izi anlamsızlaşır.
/// </summary>
public class DeliveryPackage : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid ProjectId { get; private set; }

    /// <summary>Hangi alıcı şablonuyla derlendiği. Şablon silinirse null kalır.</summary>
    public Guid? ReportTemplateId { get; private set; }

    public string Name { get; private set; } = null!;

    /// <summary>Dönem kapsamı ("2026-Q2") — preflight uygunluk kontrolü buna bakar.</summary>
    public string? PeriodCode { get; private set; }

    public DeliveryPackageStatus Status { get; private set; } = DeliveryPackageStatus.Draft;

    public ReportOutputFormat Formats { get; private set; } = ReportOutputFormat.Pdf;

    public DateTime? GeneratedAt { get; private set; }

    /// <summary>Üretilen dosyanın depodaki adı (IUploadedFileStorage). Üretilmeden null.</summary>
    public string? StoredFileName { get; private set; }

    public long OutputSize { get; private set; }

    public int ItemCount { get; private set; }

    protected DeliveryPackage() { }

    public DeliveryPackage(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        string name,
        Guid? reportTemplateId = null,
        string? periodCode = null,
        ReportOutputFormat formats = ReportOutputFormat.Pdf) : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        SetName(name);
        ReportTemplateId = reportTemplateId;
        PeriodCode = string.IsNullOrWhiteSpace(periodCode) ? null : periodCode.Trim();
        Formats = formats;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.DeliveryPackageNameRequired);

        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: ReportingConsts.MaxPackageNameLength).Trim();
    }

    public void Update(string name, Guid? reportTemplateId, string? periodCode, ReportOutputFormat formats)
    {
        EnsureEditable();
        SetName(name);
        ReportTemplateId = reportTemplateId;
        PeriodCode = string.IsNullOrWhiteSpace(periodCode) ? null : periodCode.Trim();
        Formats = formats;
    }

    /// <summary>Üretilmiş/gönderilmiş paket kilitlidir — içerik değişikliği izi bozar.</summary>
    public void EnsureEditable()
    {
        if (Status != DeliveryPackageStatus.Draft)
            throw new BusinessException(PlatformDomainErrorCodes.DeliveryPackageNotEditable)
                .WithData("Status", Status);
    }

    public void MarkGenerated(string storedFileName, long outputSize, int itemCount, DateTime generatedAt)
    {
        Status = DeliveryPackageStatus.Generated;
        StoredFileName = storedFileName;
        OutputSize = outputSize;
        ItemCount = itemCount;
        GeneratedAt = generatedAt;
    }

    public void MarkSent() => Status = DeliveryPackageStatus.Sent;

    public void SetItemCount(int itemCount) => ItemCount = itemCount;
}
