using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks;

/* ─────────────────── EKİP TARAFI (yetkili kullanıcı) ─────────────────── */

/// <summary>Görev detayındaki paylaşım listesinin satırı. Token BURADA YOKTUR.</summary>
public class TaskShareLinkDto : EntityDto<Guid>
{
    public Guid TaskId { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public string? RecipientEmail { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool AllowComment { get; set; }
    public bool AllowUpload { get; set; }
    public bool AllowDownload { get; set; }
    public DateTime? RevokedAt { get; set; }
    public int AccessCount { get; set; }
    public int UploadCount { get; set; }
    public DateTime CreationTime { get; set; }

    /// <summary>Ne iptal edilmiş ne de süresi dolmuş.</summary>
    public bool IsActive { get; set; }
}

/// <summary>
/// Yeni üretilen link. <see cref="Url"/> token'ı taşıyan TEK yanıttır — sunucu onu bir
/// daha üretemez, kullanıcı kopyalamazsa link kaybolur.
/// </summary>
public class CreatedTaskShareLinkDto : TaskShareLinkDto
{
    public string Url { get; set; } = string.Empty;
}

public class CreateTaskShareLinkDto
{
    public Guid TaskId { get; set; }

    [Required]
    [StringLength(TaskShareConsts.MaxRecipientNameLength)]
    public string RecipientName { get; set; } = string.Empty;

    [StringLength(TaskShareConsts.MaxRecipientEmailLength)]
    [EmailAddress]
    public string? RecipientEmail { get; set; }

    [Range(1, TaskShareConsts.MaxLifetimeDays)]
    public int LifetimeDays { get; set; } = TaskShareConsts.DefaultLifetimeDays;

    public bool AllowComment { get; set; } = true;
    public bool AllowUpload { get; set; } = true;
    public bool AllowDownload { get; set; } = true;
}

/* ─────────────────── MİSAFİR TARAFI (anonim) ─────────────────── */

/// <summary>Süreli linkin açtığı görünüm. Kapsam = kök görev + alt görev ağacı.</summary>
public class GuestTaskViewDto
{
    public string RecipientName { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool AllowComment { get; set; }
    public bool AllowUpload { get; set; }
    public bool AllowDownload { get; set; }

    /// <summary>Kök görev — alt görevleri <see cref="GuestTaskNodeDto.SubTasks"/> içinde.</summary>
    public GuestTaskNodeDto Root { get; set; } = new();
}

public class GuestTaskNodeDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string StatusText { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }

    public List<GuestTaskNodeDto> SubTasks { get; set; } = new();

    /// <summary>Yalnız bu linkin thread'i — ekip içi yorumlar BURAYA GİRMEZ.</summary>
    public List<GuestCommentDto> Comments { get; set; } = new();

    /// <summary>Misafirin kendi yükledikleri + ekibin dışa açtığı ekler.</summary>
    public List<GuestAttachmentDto> Attachments { get; set; } = new();
}

public class GuestCommentDto : EntityDto<Guid>
{
    public string Text { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public DateTime CreationTime { get; set; }

    /// <summary>true = misafirin kendi yazdığı, false = ekipten gelen yanıt.</summary>
    public bool IsGuest { get; set; }

    public Guid? ParentCommentId { get; set; }

    public List<GuestCommentDto> Replies { get; set; } = new();
}

public class GuestAttachmentDto : EntityDto<Guid>
{
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTime CreationTime { get; set; }

    /// <summary>true = misafirin kendi yüklediği, false = ekibin dışa açtığı dosya.</summary>
    public bool IsGuestUpload { get; set; }
}

/// <summary>
/// Misafir indirmesinin çözümlenmiş hedefi. Fiziksel dosyayı Web katmanı sunar —
/// Application katmanı disk yolunu bilmez.
/// </summary>
public class GuestDownloadDto
{
    public string StoredFileName { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = "application/octet-stream";
}

/// <summary>
/// Anonim isteğin kimlik bırakmayan izi. Ham IP taşınmaz — Web katmanı hash'leyip verir
/// (KVKK); Application katmanı ham değeri hiç görmez.
/// </summary>
public class GuestRequestContextDto
{
    public string? IpHash { get; set; }
    public string? UserAgent { get; set; }
}
