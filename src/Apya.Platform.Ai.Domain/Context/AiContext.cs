using System.Collections.Generic;

namespace Apya.Platform.Ai.Context;

public class AiContext
{
    public string Content { get; init; } = string.Empty;

    public int EstimatedTokens { get; init; }

    public bool Truncated { get; init; }

    public IReadOnlyList<string> IncludedSources { get; init; } = new List<string>();
}

public class AiContextRequest
{
    public string PrimaryText { get; init; } = string.Empty;

    public IDictionary<string, string>? Metadata { get; init; }

    public int TokenBudget { get; init; } = 8000;
}
