using System.Collections.Generic;

namespace Apya.Platform.Feedbacks.Dtos;

/// <summary>Detay görünümü — tam bağlam + yorum akışı.</summary>
public class FeedbackDetailDto : FeedbackDto
{
    public string Body { get; set; } = string.Empty;

    /// <summary>Türe özel alanlar (beklenen/gerçekleşen sonuç vb.) JSON nesnesi.</summary>
    public string? DetailsJson { get; set; }

    public string? UserAgent { get; set; }
    public string? ScreenResolution { get; set; }
    public string? AppVersion { get; set; }
    public string? ScreenshotFileName { get; set; }

    public string? ComponentCode { get; set; }
    public string? ActionCode { get; set; }
    public string? RelatedEntityType { get; set; }
    public System.Guid? RelatedEntityId { get; set; }
    public System.Guid? LastClientErrorId { get; set; }

    /// <summary>Davranış izi JSON dizisi; panelde zaman çizelgesi olarak çizilir.</summary>
    public string? BreadcrumbJson { get; set; }

    public List<FeedbackCommentDto> Comments { get; set; } = new();

    public List<FeedbackAttachmentDto> Attachments { get; set; } = new();
}
