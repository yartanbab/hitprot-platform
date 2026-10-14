namespace Apya.Platform.Macros;

public static class MacroUsageConsts
{
    /// <summary>Katalog anahtarının en fazla uzunluğu (Application.Contracts MacroDefinition.Key).</summary>
    public const int MaxKeyLength = 64;

    /// <summary>
    /// Makro Ekran sıralamasının baktığı pencere (gün, bugün dahil). Daha eski satır sıralamayı
    /// etkilemez; temizlik işçisi onları siler — her tıklamayı satır yazıp tabloyu şişirmemek için
    /// sayaç zaten günlük toplanıyor.
    /// </summary>
    public const int WindowDays = 30;
}
