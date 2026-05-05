using System.Threading;
using System.Threading.Tasks;

namespace Apya.Platform.Ai.Context;

public interface IAiContextBuilder
{
    Task<AiContext> BuildAsync(AiContextRequest request, CancellationToken cancellationToken = default);
}
