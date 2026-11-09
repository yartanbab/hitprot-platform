namespace Apya.Platform.Feedbacks.Dtos;

/// <summary>Yapay zekânın ürettiği ön analiz (markdown, başlıksız gövde).</summary>
public class FeedbackPromptAnalysisDto
{
    public string Analysis { get; set; } = string.Empty;
}
