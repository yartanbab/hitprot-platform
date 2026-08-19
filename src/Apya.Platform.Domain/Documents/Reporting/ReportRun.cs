using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Rapor sürüm arşivi: "hangi şablonla, hangi dönem için, ne zaman, kim üretti".
/// Üretilen dosya saklandığı için eski bir teslimin BİREBİR kopyası sonradan indirilebilir —
/// kuruma gönderilen dosyayı yeniden üretmeye çalışmak (veri değişmiş olabilir) yanlış olurdu.
/// </summary>
public class ReportRun : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid ProjectId { get; private set; }

    public Guid? ReportTemplateId { get; private set; }

    /// <summary>Paketten üretildiyse kaynağı; serbest rapor üretiminde null.</summary>
    public Guid? DeliveryPackageId { get; private set; }

    public string? PeriodCode { get; private set; }

    /// <summary>Aynı (proje, şablon, dönem) için artan sürüm numarası — 1'den başlar.</summary>
    public int Version { get; private set; }

    public ReportOutputFormat Formats { get; private set; }

    public string StoredFileName { get; private set; } = null!;

    public long OutputSize { get; private set; }

    public int SectionCount { get; private set; }

    public int AnnexCount { get; private set; }

    protected ReportRun() { }

    public ReportRun(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        Guid? reportTemplateId,
        Guid? deliveryPackageId,
        string? periodCode,
        int version,
        ReportOutputFormat formats,
        string storedFileName,
        long outputSize,
        int sectionCount,
        int annexCount) : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        ReportTemplateId = reportTemplateId;
        DeliveryPackageId = deliveryPackageId;
        PeriodCode = string.IsNullOrWhiteSpace(periodCode) ? null : periodCode.Trim();
        Version = version;
        Formats = formats;
        StoredFileName = storedFileName;
        OutputSize = outputSize;
        SectionCount = sectionCount;
        AnnexCount = annexCount;
    }
}
