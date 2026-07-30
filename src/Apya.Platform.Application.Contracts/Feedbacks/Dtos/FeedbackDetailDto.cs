using System.Collections.Generic;

namespace Apya.Platform.Feedbacks.Dtos;

/// <summary>Detay görünümü — tam bağlam + yorum akışı.</summary>
public class FeedbackDetailDto : FeedbackDto
{
    public string Body { get; set; } = string.Empty;

    public string? UserAgent { get; set; }
    public string? ScreenResolution { get; set; }
    public string? AppVersion { get; set; }
    public string? ScreenshotFileName { get; set; }

    /// <summary>Davranış izi JSON dizisi; panelde zaman çizelgesi olarak çizilir.</summary>
    public string? BreadcrumbJson { get; set; }

    public List<FeedbackCommentDto> Comments { get; set; } = new();
}
