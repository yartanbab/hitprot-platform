namespace Apya.Platform.Grants;

public static class FirmDataExtractionConsts
{
    public const int MaxFileNameLength = 256;

    public const int MaxErrorLength = 512;

    /// <summary>
    /// Yapay zekâya gönderilen belge metninin üst sınırı (karakter). Aşan kısım gönderilmez;
    /// yaklaşık 15 bin token — tek çağrı ve aylık kota için makul.
    /// </summary>
    public const int MaxTextLength = 60_000;
}
