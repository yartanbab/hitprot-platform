namespace Apya.Platform.IssueTasks;

public static class IssueTaskConsts
{
    /// <summary>
    /// Kaynağı tekilleştiren anahtar. Geri bildirimde kaydın Id'si, istemci hatasında
    /// Fingerprint, sunucu hatasında (URL + exception türü) özetidir. (SourceType,
    /// SourceKey) üzerinde unique index var: bir kaynak ikinci kez göreve DÖNÜŞMEZ.
    /// </summary>
    public const int MaxSourceKeyLength = 128;

    /// <summary>Kaynağın panelde gösterilen kısa adı ("FB-2026-000123", hata mesajı özeti).</summary>
    public const int MaxSourceLabelLength = 256;

    /// <summary>Otomatik kuralın istemci hatası için varsayılan oluşum eşiği.</summary>
    public const int DefaultClientErrorThreshold = 10;

    /// <summary>Otomatik kuralın sunucu hatası için varsayılan tekrar eşiği.</summary>
    public const int DefaultServerErrorThreshold = 10;

    public const int MinOccurrenceThreshold = 1;
    public const int MaxOccurrenceThreshold = 10_000;

    /// <summary>Otomatik kuralın tek turda açabileceği en fazla görev — eşik yanlış
    /// ayarlandığında görev listesinin bir gecede dolmasını engeller.</summary>
    public const int MaxAutoTasksPerRun = 25;

    /// <summary>Görev açıklamasına kopyalanan teşhis metninin üst sınırı.</summary>
    public const int MaxDescriptionLength = 8000;
}
