namespace Apya.Platform.Telemetry;

public static class ClientErrorConsts
{
    public const int MaxMessageLength     = 1024;
    public const int MaxStackTraceLength  = 8000;
    public const int MaxPageUrlLength     = 512;
    public const int MaxUserAgentLength   = 512;
    public const int MaxScreenSizeLength  = 32;
    public const int MaxAppVersionLength  = 64;
    public const int MaxBreadcrumbLength  = 8000;

    /// <summary>
    /// Aynı hatayı tekilleştiren imza (mesaj + stack ilk satırı + sayfa yolu → SHA256 kısaltma).
    /// (TenantId, Fingerprint) üzerinde unique index var: tekrar eden hata yeni satır AÇMAZ.
    /// </summary>
    public const int FingerprintLength = 32;
}
