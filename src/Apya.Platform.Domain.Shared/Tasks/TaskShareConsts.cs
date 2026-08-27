namespace Apya.Platform.Tasks;

/// <summary>Görev dış paylaşım linkinin sabitleri.</summary>
public static class TaskShareConsts
{
    /// <summary>Token'ın SHA-256 özeti (hex). Token'ın kendisi SAKLANMAZ.</summary>
    public const int TokenHashLength = 64;

    public const int MaxRecipientNameLength = 128;
    public const int MaxRecipientEmailLength = 256;

    /// <summary>Süreli link varsayılan ömrü (gün).</summary>
    public const int DefaultLifetimeDays = 14;

    /// <summary>Bir linkin açabileceği azami ömür — süresiz link üretilemez.</summary>
    public const int MaxLifetimeDays = 90;

    /// <summary>
    /// Bir link üzerinden yüklenebilecek azami dosya. Anonim yükleme ucunu korur:
    /// boyut ve uzantı kontrolü tek tek dosyayı sınırlar, bu tavan ise toplamı.
    /// </summary>
    public const int MaxUploadsPerLink = 20;

    /// <summary>
    /// Kapsam doğrulamasında yürünecek azami üst-görev adımı. Veri bozulması sonucu
    /// oluşmuş bir döngüde sonsuz döngüye girmeyi engeller.
    /// </summary>
    public const int MaxScopeDepth = 10;
}
