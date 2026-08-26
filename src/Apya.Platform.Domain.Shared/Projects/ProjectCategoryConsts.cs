using System;

namespace Apya.Platform.Projects;

/// <summary>
/// Kategori tanımlarının sabitleri. Sistem kategorilerinin Id'leri SABİTTİR:
/// migration bunları doğrudan INSERT eder ve mevcut projelerin eski enum
/// değerlerini bu Id'lere taşır. Değiştirilirse geçmiş veri kopar.
/// </summary>
public static class ProjectCategoryConsts
{
    public const int MaxNameLength = 64;
    public const int MaxIconLength = 64;
    public const int MaxToneLength = 32;

    /// <summary>
    /// Tone doğrudan CSS sınıfına yazılır (<c>apya-chip-{Tone}</c> / <c>kpi-icon-box--{Tone}</c>),
    /// bu yüzden serbest metin değil bu listeden bir değer olmalıdır — listede olmayan
    /// değer tanımsız bir sınıf üretip rozeti stilsiz bırakırdı.
    /// </summary>
    public static readonly string[] Tones =
    {
        "neutral", "brand", "accent", "positive", "warning", "negative", "ai"
    };

    public const string DefaultTone = "neutral";
    public const string DefaultIcon = "fa-diagram-project";

    /// <summary>Sistem kategorileri TenantId = null ile tutulur; tüm kiracılar görür.</summary>
    public static class SystemIds
    {
        public static readonly Guid Other = new("a1c0a7e0-0000-4000-8000-000000000000");
        public static readonly Guid GrantProject = new("a1c0a7e0-0000-4000-8000-000000000001");
        public static readonly Guid Event = new("a1c0a7e0-0000-4000-8000-000000000002");
    }

    /// <summary>Eski <see cref="ProjectCategory"/> değerinin karşılığı olan sistem Id'si.</summary>
    public static Guid IdFor(ProjectCategory category) => category switch
    {
        ProjectCategory.GrantProject => SystemIds.GrantProject,
        ProjectCategory.Event => SystemIds.Event,
        _ => SystemIds.Other
    };
}
