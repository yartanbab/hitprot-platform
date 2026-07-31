using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Feedbacks.Dtos;

public class UpdateFeedbackStatusDto
{
    [Required]
    public FeedbackStatus Status { get; set; }
}

public class UpdateFeedbackPriorityDto
{
    [Required]
    public FeedbackPriority Priority { get; set; }
}

public class UpdateFeedbackTagsDto
{
    [StringLength(FeedbackConsts.MaxTagsLength)]
    public string? AdminTags { get; set; }
}

/// <summary>Panelde seçilen birden çok kaydı tek hamlede aynı duruma taşımak için.</summary>
public class BulkUpdateFeedbackStatusDto
{
    [Required]
    public List<Guid> Ids { get; set; } = new();

    [Required]
    public FeedbackStatus Status { get; set; }
}

public class UpdateFeedbackImpactDto
{
    public FeedbackImpact? Impact { get; set; }
}

/// <summary>Atama; <c>UserId</c> null ise atama kaldırılır.</summary>
public class AssignFeedbackDto
{
    public Guid? UserId { get; set; }
}

public class AddFeedbackCommentDto
{
    [Required]
    [StringLength(FeedbackConsts.MaxCommentLength)]
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// true → yalnızca yöneticinin gördüğü iç not (bildirim gitmez).
    /// false → kullanıcıya görünen cevap, bildirim tetikler.
    /// </summary>
    public bool IsInternal { get; set; }
}
