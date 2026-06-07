using System.Threading;
using System.Threading.Tasks;

namespace Apya.Platform.Ai.Providers;

/// <summary>
/// Strategy contract for a concrete AI provider (OpenAI, Claude, Gemini, DeepSeek...).
/// Each implementation has a unique <see cref="Name"/> used by <see cref="IAiProviderResolver"/>.
/// Adding a new provider = new class implementing this interface + a DI registration; no existing
/// orchestration code changes (Open/Closed Principle). Distinct from <see cref="IAiProvider"/>,
/// which is the resilient facade (<c>AiGateway</c>) that domain services consume.
/// </summary>
public interface INamedAiProvider
{
    string Name { get; }

    Task<AiCompletionResult> CompleteAsync(
        string systemPrompt,
        string userMessage,
        CancellationToken cancellationToken = default);
}
