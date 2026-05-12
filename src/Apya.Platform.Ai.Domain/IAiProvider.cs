using System.Threading;
using System.Threading.Tasks;

namespace Apya.Platform.Ai;

public interface IAiProvider
{
    string Name { get; }

    Task<AiCompletionResult> CompleteAsync(
        string systemPrompt,
        string userMessage,
        CancellationToken cancellationToken = default);
}
