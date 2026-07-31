namespace Apya.Platform.Telemetry;

public static class TelemetryConsts
{
    /// <summary>İstemcinin tek seferde gönderebileceği en fazla davranış izi olayı.</summary>
    public const int MaxBreadcrumbEvents = 25;

    /// <summary>Saklama süresi alt/üst sınırı — ayardan gelen değer bu aralığa kırpılır.</summary>
    public const int MinRetentionDays = 7;
    public const int MaxRetentionDays = 3650;

    /// <summary>Bir temizlik turunda silinecek en fazla kayıt (uzun kilit ve şişkin transaction'ı önler).</summary>
    public const int RetentionBatchSize = 5000;
}
