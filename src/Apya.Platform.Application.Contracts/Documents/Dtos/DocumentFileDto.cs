using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

/// <summary>
/// Liste satırı. Sol ağaç, tablo ve grid aynı DTO'yu kullanır —
/// istemci tarafında ikinci bir istek olmadan satır çizilebilmeli.
/// </summary>
public class DocumentFileDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public Guid DocumentId { get; set; }
    public string? FolderName { get; set; }

    public Guid? DocumentTypeId { get; set; }
    public string? DocumentTypeName { get; set; }
    public string? DocumentTypeCode { get; set; }
    public string? DocumentTypeIcon { get; set; }

    public Guid? ProjectId { get; set; }
    public string? ProjectName { get; set; }

    public Guid? WorkStepId { get; set; }
    public string? WorkStepName { get; set; }
    public int? WorkStepOrder { get; set; }

    public string DisplayName { get; set; } = string.Empty;
    public decimal? Amount { get; set; }
    public string? Currency { get; set; }
    public DateTime? DocumentDate { get; set; }
    public string? PeriodCode { get; set; }
    public DocumentFileStatus Status { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime? RetentionUntil { get; set; }
    public string? ExternalRef { get; set; }
    public bool IsLocked { get; set; }

    /* --- Güncel versiyon (denormalize; ek sorgu gerekmez) --- */
    public Guid? LatestAttachmentId { get; set; }
    public int VersionCount { get; set; }
    public string? FileName { get; set; }
    public string? ContentType { get; set; }
    public long FileSize { get; set; }
    public string? DownloadUrl { get; set; }
    public string? UploaderName { get; set; }

    public List<string> Tags { get; set; } = new();
}
