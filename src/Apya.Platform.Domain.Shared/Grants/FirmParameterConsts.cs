namespace Apya.Platform.Grants;

public static class FirmParameterConsts
{
    public const int MaxCodeLength = 64;
    public const int MaxNameLength = 128;
    public const int MaxDescriptionLength = 512;
    public const int MaxOptionsJsonLength = 2000;

    /// <summary>Text tipinin varsayılan üst sınırı.</summary>
    public const int MaxTextLength = 256;

    /// <summary>LongText tipinin üst sınırı; değer kolonunun da sınırıdır.</summary>
    public const int MaxLongTextLength = 4000;

    public const int MaxSourceExcerptLength = 512;

    /// <summary>Belgeden okunan değerde "yüksek güven" eşiği (hibe metni çıkarımıyla aynı: %80).</summary>
    public const int HighConfidenceThreshold = 80;
}
