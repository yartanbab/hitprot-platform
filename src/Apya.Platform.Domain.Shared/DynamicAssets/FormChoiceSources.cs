namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Açılır liste alanının seçeneklerini sabit yazmak yerine canlı veriden alan kaynaklar. Alan ayarında
/// <c>"source"</c> olarak saklanır; seçenekler form her açıldığında sunucuda yeniden çözülür.
/// </summary>
public static class FormChoiceSources
{
    /// <summary>
    /// Host kataloğunda başvuruya açık hibe çağrıları. Değer çağrı kimliğidir; çağrı kapanınca listeden
    /// kendiliğinden düşer, yenisi yayınlanınca eklenir.
    /// </summary>
    public const string OpenGrantCalls = "open-grant-calls";

    /// <summary>Alan ayarı <c>"urlPrefill"</c> açıksa bu adres parametresindeki çağrı ön seçilir.</summary>
    public const string GrantPrefillParameter = "grant";
}
