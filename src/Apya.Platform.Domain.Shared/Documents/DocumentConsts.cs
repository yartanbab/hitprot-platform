namespace Apya.Platform.Documents;

public static class DocumentConsts
{
    public const int MaxDisplayNameLength = 255;
    public const int MaxExternalRefLength = 128;
    public const int MaxPeriodCodeLength = 16;
    public const int MaxTagNameLength = 40;
    public const int MaxColorLength = 16;
    public const int CurrencyLength = 3;

    /// <summary>SHA-256 hex — çift kayıt tespiti için.</summary>
    public const int ContentHashLength = 64;

    public const int MaxTypeNameLength = 64;
    public const int MaxTypeCodeLength = 32;
    public const int MaxFileNamePatternLength = 200;

    /// <summary>Öneri reddetme anahtarı: "tür:hedef" (Guid payload sığar).</summary>
    public const int MaxSuggestionKeyLength = 64;

    public const int MaxFieldKeyLength = 64;
    public const int MaxFieldLabelLength = 128;
    public const int MaxFieldValueTextLength = 1000;
}
