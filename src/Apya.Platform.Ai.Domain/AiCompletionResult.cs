using System;

namespace Apya.Platform.Ai;

public class AiCompletionResult
{
    public string Response { get; init; } = string.Empty;

    public int InputTokens { get; init; }

    public int OutputTokens { get; init; }

    public TimeSpan Duration { get; init; }

    public int TotalTokens => InputTokens + OutputTokens;
}
