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
}
