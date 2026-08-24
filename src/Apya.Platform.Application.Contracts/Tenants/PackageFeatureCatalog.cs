using System.Collections.Generic;
using Apya.Platform.Features;

namespace Apya.Platform.Tenants;

/// <summary>
/// Paket yönetim UI'ında düzenlenebilen feature listesi (ad + Türkçe etiket + sayısal mı).
/// Hem app service DTO'sunu hem de düzenleme ekranını besler — tek kaynak.
/// </summary>
public static class PackageFeatureCatalog
{
    public static readonly IReadOnlyList<PackageFeatureMeta> Managed = new List<PackageFeatureMeta>
    {
        new(PlatformFeatures.Finance, "Finans & Muhasebe", false),
        new(PlatformFeatures.Grants, "Hibe Yönetimi", false),
        new(PlatformFeatures.Documents, "Doküman Yönetimi", false),
        new(PlatformFeatures.Forms, "Form / Dinamik Varlık", false),
        new(PlatformFeatures.Calendar, "Takvim", false),
        new(PlatformFeatures.TaskQuickEntry, "Hızlı Görev Girişi", false),
        new(PlatformFeatures.AiAssist, "AI Asistan", false),
        new(PlatformFeatures.MultiCurrency, "Çoklu Döviz", false),
        new(PlatformFeatures.AdvancedReports, "Gelişmiş Raporlar", false),
        new(PlatformFeatures.MaxUsers, "Maksimum Kullanıcı", true),
        new(PlatformFeatures.MaxProjects, "Maksimum Proje", true),
    };
}

public record PackageFeatureMeta(string Name, string DisplayName, bool IsNumeric);
