namespace Apya.Platform.Ai.Security;

/// <summary>
/// Neutralizes common prompt-injection patterns in untrusted user content (e.g. form answers)
/// before it is embedded into an AI prompt. Defense-in-depth (ROADMAP B-03): the form-evaluation
/// path processes submissions that may be anonymous/public, so the content is treated as data.
/// </summary>
public interface IPromptInjectionSanitizer
{
    string Sanitize(string input);
}
