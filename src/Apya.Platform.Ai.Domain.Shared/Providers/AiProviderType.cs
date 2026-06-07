namespace Apya.Platform.Ai.Providers;

/// <summary>
/// Supported AI providers. New providers are added here together with a new
/// <c>IAiProvider</c> strategy implementation and a DI registration — no existing
/// orchestration code changes (Open/Closed Principle, resolved via IAiProviderResolver).
/// </summary>
public enum AiProviderType
{
    OpenAI = 0,
    Claude = 1,
    Gemini = 2,
    DeepSeek = 3
}
