using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

/* ─── Şablon ve bölümler ─────────────────────────────────────────────── */

public class ReportTemplateDto : EntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ReportRecipient Recipient { get; set; }
    public string? Issuer { get; set; }
    public bool IsSystem { get; set; }
    public int Order { get; set; }
    public List<ReportSectionDto> Sections { get; set; } = new();

    /// <summary>Açık bölüm sayısı — "9 bölüm" rozetinin kaynağı.</summary>
    public int EnabledSectionCount { get; set; }
}

public class ReportSectionDto : EntityDto<Guid>
{
    public Guid TemplateId { get; set; }
    public ReportSectionKey SectionKey { get; set; }
    public int Order { get; set; }
    public bool IsEnabled { get; set; }

    /// <summary>Bu bölümün verisi bu fazda üretilebiliyor mu (Faz E bölümleri false).</summary>
    public bool IsAvailable { get; set; }
}

public class UpdateReportSectionsDto
{
    public Guid TemplateId { get; set; }
    public List<ReportSectionOrderDto> Sections { get; set; } = new();
}

public class ReportSectionOrderDto
{
    public Guid SectionId { get; set; }
    public int Order { get; set; }
    public bool IsEnabled { get; set; }
}

/* ─── Teslim paketi ──────────────────────────────────────────────────── */

public class DeliveryPackageDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public Guid ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public Guid? ReportTemplateId { get; set; }
    public string? ReportTemplateName { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? PeriodCode { get; set; }
    public DeliveryPackageStatus Status { get; set; }
    public ReportOutputFormat Formats { get; set; }
    public DateTime? GeneratedAt { get; set; }
    public long OutputSize { get; set; }
    public int ItemCount { get; set; }
    public bool HasOutput { get; set; }
}

public class DeliveryPackageDetailDto : DeliveryPackageDto
{
    public List<DeliveryPackageItemDto> Items { get; set; } = new();
}

public class DeliveryPackageItemDto : EntityDto<Guid>
{
    public Guid PackageId { get; set; }
    public Guid DocumentFileId { get; set; }
    public string DocumentFileName { get; set; } = string.Empty;
    public string? DocumentTypeName { get; set; }
    public int Order { get; set; }
    public string? AnnexNumber { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public long FileSize { get; set; }
}

public class CreateUpdateDeliveryPackageDto
{
    public Guid ProjectId { get; set; }

    [Required]
    [StringLength(ReportingConsts.MaxPackageNameLength)]
    public string Name { get; set; } = string.Empty;

    public Guid? ReportTemplateId { get; set; }

    [StringLength(DocumentConsts.MaxPeriodCodeLength)]
    public string? PeriodCode { get; set; }

    public ReportOutputFormat Formats { get; set; } = ReportOutputFormat.Pdf;
}

public class AddDeliveryPackageItemsDto
{
    public Guid PackageId { get; set; }
    public List<Guid> DocumentFileIds { get; set; } = new();
}

public class ReorderDeliveryPackageItemsDto
{
    public Guid PackageId { get; set; }

    /// <summary>İstenen sıradaki kalem id'leri. Ek numaraları bu sıradan türetilir.</summary>
    public List<Guid> ItemIds { get; set; } = new();
}

/* ─── Preflight ──────────────────────────────────────────────────────── */

public class PreflightIssueDto
{
    public PreflightIssueKind Kind { get; set; }
    public bool IsBlocking { get; set; }
    public string Message { get; set; } = string.Empty;
    public Guid? DocumentFileId { get; set; }
}

public class PreflightResultDto
{
    public bool CanGenerate { get; set; }
    public int BlockingCount { get; set; }
    public int WarningCount { get; set; }
    public List<PreflightIssueDto> Issues { get; set; } = new();
}

/* ─── Rapor sürüm arşivi ─────────────────────────────────────────────── */

public class ReportRunDto : FullAuditedEntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public Guid? ReportTemplateId { get; set; }
    public string? ReportTemplateName { get; set; }
    public Guid? DeliveryPackageId { get; set; }
    public string? PeriodCode { get; set; }
    public int Version { get; set; }
    public ReportOutputFormat Formats { get; set; }
    public long OutputSize { get; set; }
    public int SectionCount { get; set; }
    public int AnnexCount { get; set; }
    public string GeneratedByName { get; set; } = string.Empty;
    public string DownloadUrl { get; set; } = string.Empty;
}

/* ─── Süreli dış paylaşım ────────────────────────────────────────────── */

public class ExternalShareLinkDto : EntityDto<Guid>
{
    public ShareTargetType TargetType { get; set; }
    public Guid TargetId { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool AllowDownload { get; set; }
    public string? Watermark { get; set; }
    public DateTime? RevokedAt { get; set; }
    public int AccessCount { get; set; }
    public DateTime CreationTime { get; set; }
    public bool IsActive { get; set; }
}

/// <summary>
/// Link oluşturma yanıtı. <see cref="Url"/> token'ı içerir ve YALNIZ BU YANITTA döner —
/// sunucu token'ın kendisini saklamaz (hash'ini saklar), sonradan yeniden gösterilemez.
/// </summary>
public class CreatedShareLinkDto : ExternalShareLinkDto
{
    public string Url { get; set; } = string.Empty;
}

public class CreateShareLinkDto
{
    public ShareTargetType TargetType { get; set; }
    public Guid TargetId { get; set; }

    [Range(1, 365)]
    public int LifetimeDays { get; set; } = ReportingConsts.DefaultShareLifetimeDays;

    public bool AllowDownload { get; set; }

    [StringLength(120)]
    public string? Watermark { get; set; }
}

/// <summary>Denetçi sayfasının (AllowAnonymous) gördüğü salt okunur içerik.</summary>
public class SharedPackageViewDto
{
    public string PackageName { get; set; } = string.Empty;
    public string? ProjectName { get; set; }
    public string? PeriodCode { get; set; }
    public DateTime? GeneratedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool AllowDownload { get; set; }
    public string? Watermark { get; set; }
    public List<SharedPackageItemDto> Items { get; set; } = new();
}

public class SharedPackageItemDto
{
    public string AnnexNumber { get; set; } = string.Empty;
    public string DocumentFileName { get; set; } = string.Empty;
    public string? DocumentTypeName { get; set; }
    public DateTime? DocumentDate { get; set; }

    /// <summary>Maskeli alanlar dışa aktarımda boş görünür (Faz D'de rol matrisiyle genişleyecek).</summary>
    public bool IsMasked { get; set; }
}

/// <summary>
/// Üretilmiş çıktının (paket veya rapor sürümü) indirme bilgisi.
/// Depodaki fiziksel ad DTO listelerinde taşınmaz; yalnız indirme anında çözülür.
/// </summary>
public class GeneratedFileDownloadDto
{
    public string StoredFileName { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = "application/octet-stream";
}

/// <summary>
/// ZIP'e konacak ek dosyasının çözümlenmiş hali.
/// Denetim izine "indirildi" YAZMAZ — paketleme kullanıcı indirmesi değildir.
/// </summary>
public class AnnexFileDto
{
    public string AnnexNumber { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string? StoredFileName { get; set; }
}

/// <summary>
/// Rapor Derleyici'de şablon künyesi. Bölümler ayrı uçtan (UpdateSectionsAsync)
/// yönetilir — künye düzenlemesi bölüm sırasını sıfırlamasın diye ayrıldı.
/// </summary>
public class CreateUpdateReportTemplateDto
{
    [Required]
    [StringLength(ReportingConsts.MaxTemplateNameLength)]
    public string Name { get; set; } = string.Empty;

    public ReportRecipient Recipient { get; set; } = ReportRecipient.Institution;

    /// <summary>Kurum alıcılarında hangi kurum ("KOSGEB", "TÜBİTAK"); diğerlerinde boş.</summary>
    [StringLength(ReportingConsts.MaxIssuerLength)]
    public string? Issuer { get; set; }

    public int Order { get; set; }
}
