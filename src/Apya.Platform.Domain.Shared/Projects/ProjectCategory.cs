namespace Apya.Platform.Projects;

/// <summary>
/// APYA-132: Bir Project'in muhasebe/cari kategorisi. Mevcut <see cref="ProjectType"/>
/// (ArGe/Investment... — Ar-Ge sınıflandırması) ile karıştırılmamalı; bu eksen
/// Müşteri'nin (Cari) hibe dışı bütçelerini de ayırt etmek için.
/// </summary>
public enum ProjectCategory
{
    /// <summary>Diğer / Genel bütçe — varsayılan, mevcut projelerin kategori atanmamış hali.</summary>
    Other = 0,

    /// <summary>Hibe projesi (TÜBİTAK, KOSGEB, vb.). `GrantId` ile ilişkilenir.</summary>
    GrantProject = 1,

    /// <summary>Etkinlik / kampanya — proje gibi bütçe ve görev takibi yapılır ama hibe değil.</summary>
    Event = 2,
}
