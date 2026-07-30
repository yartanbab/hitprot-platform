using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Feedbacks.Dtos;

/// <summary>Liste satırı — ağır alanlar (gövde, breadcrumb, stack) burada yok.</summary>
public class FeedbackDto : EntityDto<Guid>
{
    public FeedbackType Type { get; set; }
    public string Subject { get; set; } = string.Empty;
    public FeedbackStatus Status { get; set; }
    public FeedbackPriority Priority { get; set; }
    public int? Rating { get; set; }

    public string? PageUrl { get; set; }
    public string? PageTitle { get; set; }

    public Guid? TenantId { get; set; }

    /// <summary>Host panelinde "hangi firmadan geldi" — AppService'te doldurulur.</summary>
    public string? TenantName { get; set; }

    public Guid? CreatorId { get; set; }
    public string? SubmittedByUserName { get; set; }

    public bool HasScreenshot { get; set; }
    public int CommentCount { get; set; }

    public DateTime CreationTime { get; set; }
    public DateTime? LastRespondedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? AdminTags { get; set; }
}
