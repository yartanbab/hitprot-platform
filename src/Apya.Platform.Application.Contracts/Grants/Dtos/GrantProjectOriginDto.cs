using System;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 🔴 DOC-02 · Proje konsolundaki "bu proje şu hibeden doğdu" şeridinin verisi.
/// Evrak SAYISI taşınır, evrakın kendisi taşınmaz: belgeler başvuruda kalır,
/// buradan yalnız onlara gidilir.
/// </summary>
public class GrantProjectOriginDto
{
    public Guid ApplicationId { get; set; }

    /// <summary>Hibe programının adı (host katalogundan).</summary>
    public string GrantName { get; set; } = null!;

    /// <summary>Çağrı dönemi ("2026 1. Dönem") — katalogda boş olabilir.</summary>
    public string? CallPeriod { get; set; }

    /// <summary>Başvurunun evrak sayısı; 0 ise evrak bağlantısı basılmaz.</summary>
    public int DocumentCount { get; set; }
}

/// <summary>
/// Projenin doğduğu hibe başvurusundan gelen bir kilometre taşı. Proje tarafında
/// karşılığı olan ayrı bir varlık YOK ve bilerek açılmadı: kilometre taşı başvuruda
/// yaşar, rapor onu oradan okur — kopyalansaydı iki liste ayrışırdı.
/// </summary>
public class GrantProjectMilestoneDto
{
    public string Title { get; set; } = null!;
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
}
