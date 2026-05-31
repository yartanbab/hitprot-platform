namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Shared constants for the DynamicAssets module.
/// Used by both Domain and Application layers for validation and EF Core configuration.
/// </summary>
public static class AppDocumentConsts
{
    public const int MaxTitleLength = 256;
    public const int MaxSlugLength = 128;
    public const int MaxDescriptionLength = 2000;
}

/// <summary>
/// Shared constants for the FormCategory aggregate.
/// </summary>
public static class FormCategoryConsts
{
    public const int MaxNameLength = 128;
    public const int MaxColorLength = 16;  // örn. #RRGGBB
    public const int MaxIconLength = 64;   // ikon adı / emoji
}

/// <summary>
/// Shared constants for the ResponseComment child entity.
/// </summary>
public static class ResponseCommentConsts
{
    public const int MaxTextLength = 2000;
}
