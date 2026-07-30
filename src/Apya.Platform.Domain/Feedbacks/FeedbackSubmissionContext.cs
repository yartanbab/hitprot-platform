namespace Apya.Platform.Feedbacks;

/// <summary>
/// Gönderim anında otomatik yakalanan bağlam. Domain'de tanımlı çünkü Manager
/// kaydı tek seferde (tek INSERT) tamamlar; AppService bunu doldurup geçer.
/// </summary>
public record FeedbackSubmissionContext(
    string? PageUrl,
    string? PageTitle,
    string? UserAgent,
    string? ScreenResolution,
    string? AppVersion,
    string? SubmittedByUserName,
    string? BreadcrumbJson,
    string? ScreenshotFileName);
