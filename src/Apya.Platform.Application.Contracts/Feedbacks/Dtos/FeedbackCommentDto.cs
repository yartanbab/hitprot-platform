using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Feedbacks.Dtos;

public class FeedbackCommentDto : EntityDto<Guid>
{
    public string Text { get; set; } = string.Empty;

    /// <summary>true ise iç not — kullanıcı tarafındaki listelerde hiç dönmez.</summary>
    public bool IsInternal { get; set; }

    public string? AuthorName { get; set; }
    public DateTime CreationTime { get; set; }
}
