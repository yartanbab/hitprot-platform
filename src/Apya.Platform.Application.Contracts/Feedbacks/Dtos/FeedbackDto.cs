using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Feedbacks.Dtos;

/// <summary>Liste satırı — ağır alanlar (gövde, breadcrumb, stack) burada yok.</summary>
public class FeedbackDto : EntityDto<Guid>
{
    /// <summary>İnsan-okur takip numarası ("FB-2026-000123").</summary>
    public string FeedbackNumber { get; set; } = string.Empty;

    public FeedbackType Type { get; set; }
    public string Subject { get; set; } = string.Empty;
    public FeedbackStatus Status { get; set; }

    /// <summary>Kullanıcı tarafında gösterilen sadeleşmiş durum — user endpoint'leri doldurur.</summary>
    public FeedbackUserStatus UserStatus { get; set; }

    public FeedbackPriority Priority { get; set; }
    public FeedbackPriority? Severity { get; set; }
    public FeedbackImpact? Impact { get; set; }
    public int? Rating { get; set; }

    public Guid? AssignedUserId { get; set; }
    public string? AssignedUserName { get; set; }

    public string? ModuleCode { get; set; }
    public bool IsAnonymous { get; set; }
    public bool AllowContact { get; set; }

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

    /// <summary>Kayıt göreve dönüştürülmüşse görevin Id'si — listede rozet için.</summary>
    public Guid? LinkedTaskId { get; set; }

    /// <summary>Bağlı görevin kullanıcıya gösterilen sırası ("GRV-42" → 42).</summary>
    public int? LinkedTaskNumber { get; set; }
}
