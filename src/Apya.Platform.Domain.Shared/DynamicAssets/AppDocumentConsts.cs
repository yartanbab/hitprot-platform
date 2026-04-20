namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Shared constants for the DynamicAssets module.
/// Used by both Domain and Application layers for validation and EF Core configuration.
/// </summary>
public static class AppDocumentConsts
{
    public const int MaxTitleLength = 256;
    public const int MaxSlugLength = 128;
}
