using System.Text.RegularExpressions;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Ai.Security;

/// <summary>
/// Heuristic sanitizer: replaces well-known injection trigger phrases / role markers / instruction
/// tags with a neutral placeholder so they cannot hijack the system prompt. Not a complete defense
/// on its own, but a cheap, deterministic layer combined with schema-driven output + the system
/// prompt. Pure and stateless.
/// </summary>
public class PromptInjectionSanitizer : IPromptInjectionSanitizer, ITransientDependency
{
    private const string Placeholder = "[filtrelendi]";

    // CultureInvariant ŞART: büyük/küçük harf eşlemesi kültüre bağlıysa Türkçede "I" → "ı" olur ve
    // "Ignore…", "INSTRUCTIONS", "ASSISTANT:" gibi büyük I'lı kalıplar süzülmeden geçerdi.
    private static readonly Regex[] Patterns =
    {
        // "ignore/disregard/forget (the) previous/above instructions/prompts"
        new(@"\b(ignore|disregard|forget|override)\b[^.\n]{0,40}\b(previous|above|prior|earlier|all|system)\b[^.\n]{0,30}\b(instruction|instructions|prompt|prompts|message|messages|rule|rules|context)\b",
            RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled),
        // role-override attempts
        new(@"\byou\s+are\s+now\b", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled),
        new(@"\bact\s+as\s+(a|an|if|though)\b", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled),
        new(@"\bnew\s+(instructions?|prompt|rules?)\s*:", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled),
        // chat role markers at the start of a line
        new(@"(?im)^\s*(system|assistant|developer|user)\s*:", RegexOptions.CultureInvariant | RegexOptions.Compiled),
        // instruction/system tags
        new(@"</?\s*(system|instructions?|prompt|assistant)\s*>", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled),
    };

    public string Sanitize(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input ?? string.Empty;

        var result = input;
        foreach (var pattern in Patterns)
            result = pattern.Replace(result, Placeholder);

        return result;
    }
}
