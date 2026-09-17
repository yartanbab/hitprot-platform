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

    /// <summary>16 · Formu dolduran firmanın süren projeleri. Değer proje kimliğidir.</summary>
    public const string TenantProjects = "tenant-projects";

    /// <summary>
    /// 16b · Zincirli alan: yukarıda seçilen projenin görevleri. Üst alan <see cref="DependsOnSetting"/> ile
    /// gösterilir; üst alan seçilmeden liste boş gelir.
    /// </summary>
    public const string TenantProjectTasks = "tenant-project-tasks";

    /// <summary>16a · Kiracı (firma) kayıtları. Yalnız host bağlamında listelenir.</summary>
    public const string Firms = "firms";

    /// <summary>Zincirli alanın üst alanını gösteren ayar: değeri üst alanın blok kimliğidir.</summary>
    public const string DependsOnSetting = "dependsOn";

    /// <summary>Alan ayarı <c>"urlPrefill"</c> açıksa bu adres parametresindeki çağrı ön seçilir.</summary>
    public const string GrantPrefillParameter = "grant";

    /// <summary>
    /// 17 · Koşullu alanın görünürlük kuralı: <c>{ blockId, op, value }</c>. Kural yoksa alan hep görünür.
    /// </summary>
    public const string VisibleWhenSetting = "visibleWhen";
}

/// <summary>
/// 17 · Koşullu alanın karşılaştırması. Üç tanesi cevaba bakar, <see cref="Flag"/> ise SEÇİLEN KAYDIN
/// kendi özelliğine (ör. çağrı ortaklık istiyor mu) bakar.
/// </summary>
public static class FormConditionOperators
{
    /// <summary>Üst alanın cevabı verilen değere eşitse görünür.</summary>
    public const string Equals = "eq";

    /// <summary>Üst alanın cevabı verilen değerden farklıysa görünür (cevapsız alan da farklı sayılır).</summary>
    public const string NotEquals = "neq";

    /// <summary>Üst alan herhangi bir cevap aldıysa görünür.</summary>
    public const string Answered = "answered";

    /// <summary>Üst alanda seçilen kaydın <see cref="FormChoiceFlags"/> bayrağı açıksa görünür.</summary>
    public const string Flag = "flag";
}

/// <summary>
/// 17 · Canlı kaynaktan gelen seçeneğin, koşulda sorulabilen özellikleri. Kaynak hangi bayrakları
/// ürettiğini <c>IFormChoiceSource.Flags</c> ile bildirir; düzenleyici koşul listesini oradan çizer.
/// </summary>
public static class FormChoiceFlags
{
    /// <summary>Seçilen çağrının programı ortaklık/konsorsiyum şartı koyuyor.</summary>
    public const string RequiresConsortium = "requiresConsortium";
}
