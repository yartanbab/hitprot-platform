using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Ai.Context;

/// <summary>
/// V0 — deterministic, no semantic ranking.
/// Approximates tokens as chars/4 (English+Turkish heuristic; OpenAI tiktoken averages ~3.5–4.5 chars/token).
/// </summary>
public class DeterministicAiContextBuilder : IAiContextBuilder, ITransientDependency
{
    private const double CharsPerToken = 4.0;

    public Task<AiContext> BuildAsync(AiContextRequest request, CancellationToken cancellationToken = default)
    {
        var sb = new StringBuilder();
        var sources = new List<string>();
        var truncated = false;

        // Char budget = tokenBudget * charsPerToken
        var charBudget = (int)(request.TokenBudget * CharsPerToken);

        if (request.Metadata != null && request.Metadata.Count > 0)
        {
            sb.AppendLine("# Metadata");
            foreach (var (key, value) in request.Metadata)
            {
                if (sb.Length >= charBudget) { truncated = true; break; }
                sb.AppendLine($"- {key}: {value}");
            }
            sources.Add("metadata");
        }

        if (!string.IsNullOrWhiteSpace(request.PrimaryText))
        {
            sb.AppendLine();
            sb.AppendLine("# Primary Content");
            var remaining = charBudget - sb.Length;
            if (remaining > 0)
            {
                if (request.PrimaryText.Length > remaining)
                {
                    sb.Append(request.PrimaryText.Substring(0, remaining));
                    truncated = true;
                }
                else
                {
                    sb.Append(request.PrimaryText);
                }
                sources.Add("primary");
            }
            else
            {
                truncated = true;
            }
        }

        var content = sb.ToString();
        var estimatedTokens = (int)(content.Length / CharsPerToken);

        return Task.FromResult(new AiContext
        {
            Content = content,
            EstimatedTokens = estimatedTokens,
            Truncated = truncated,
            IncludedSources = sources
        });
    }
}
