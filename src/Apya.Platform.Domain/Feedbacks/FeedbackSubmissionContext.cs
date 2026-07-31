using System;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Gönderim anında otomatik yakalanan bağlam. Domain'de tanımlı çünkü Manager
/// kaydı tek seferde (tek INSERT) tamamlar; AppService bunu doldurup geçer.
/// Yeni alanlar varsayılanlı — eski çağıran kod değişmeden derlenir.
/// </summary>
public record FeedbackSubmissionContext(
    string? PageUrl,
    string? PageTitle,
    string? UserAgent,
    string? ScreenResolution,
    string? AppVersion,
    string? SubmittedByUserName,
    string? BreadcrumbJson,
    string? ScreenshotFileName,
    string? ModuleCode = null,
    string? ComponentCode = null,
    string? ActionCode = null,
    string? RelatedEntityType = null,
    Guid? RelatedEntityId = null,
    Guid? LastClientErrorId = null);
