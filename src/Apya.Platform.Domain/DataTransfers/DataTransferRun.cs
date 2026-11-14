using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.DataTransfers;

/// <summary>
/// Bir içe ya da dışa aktarma işleminin kaydı: kim, ne zaman, hangi modül, kaç satır. Yalnız eklenir.
/// Satır sayıları işlem bildirdiyse doludur (liste dışa aktarımı ve Excel/CSV içe aktarma); kendi
/// düzenini yazan raporlar ve ayar (JSON) aktarımları sayı bildirmez.
/// </summary>
public class DataTransferRun : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string ModuleKey { get; private set; } = null!;

    public DataTransferDirection Direction { get; private set; }

    /// <summary>Dosya biçimi ("xlsx", "csv", "json", "pdf"); bilinmiyorsa boş.</summary>
    public string? Format { get; private set; }

    public string? FileName { get; private set; }

    public Guid? TemplateId { get; private set; }

    public int? TemplateVersion { get; private set; }

    public int? TotalRows { get; private set; }

    public int? SucceededRows { get; private set; }

    public int? FailedRows { get; private set; }

    /// <summary>İşlem tamamlandı mı. İçe aktarmada hatalı satır varsa hiçbir satır yazılmaz ve bu alan yanlıştır.</summary>
    public bool Succeeded { get; private set; }

    public string? Message { get; private set; }

    public int DurationMs { get; private set; }

    protected DataTransferRun() { }

    public DataTransferRun(
        Guid id,
        Guid? tenantId,
        string moduleKey,
        DataTransferDirection direction,
        bool succeeded,
        int durationMs,
        string? format = null,
        string? fileName = null,
        int? totalRows = null,
        int? succeededRows = null,
        int? failedRows = null,
        string? message = null,
        Guid? templateId = null,
        int? templateVersion = null) : base(id)
    {
        TenantId = tenantId;
        ModuleKey = Check.NotNullOrWhiteSpace(moduleKey, nameof(moduleKey), DataTransferConsts.MaxModuleKeyLength);
        Direction = direction;
        Succeeded = succeeded;
        DurationMs = Math.Max(durationMs, 0);
        Format = Cut(format, DataTransferConsts.MaxFormatLength);
        FileName = Cut(fileName, DataTransferConsts.MaxFileNameLength);
        TotalRows = totalRows;
        SucceededRows = succeededRows;
        FailedRows = failedRows;
        Message = Cut(message, DataTransferConsts.MaxMessageLength);
        TemplateId = templateId;
        TemplateVersion = templateVersion;
    }

    private static string? Cut(string? value, int max)
        => string.IsNullOrWhiteSpace(value) ? null : value.Length <= max ? value : value[..max];
}
