namespace Apya.Platform.Ai.Providers;

/// <summary>
/// Field-length constraints for the <c>AiProviderConfig</c> aggregate.
/// ApiKey is stored as an unbounded "text" column (holds encrypted ciphertext).
/// </summary>
public static class ProviderConsts
{
    public const int MaxDisplayNameLength = 150;
    public const int MaxModelLength = 128;
}
