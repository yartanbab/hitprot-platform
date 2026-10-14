using System;
using System.Collections.Generic;

namespace Apya.Platform.Macros.Dtos;

public class MacroMyProjectsDto
{
    /// <summary>Üyesi olunan projelerin tamamı — liste ilk N'i taşır, grup başlığı bu sayıyı basar.</summary>
    public int TotalCount { get; set; }

    public List<MacroProjectDto> Items { get; set; } = new();
}

public class MacroProjectDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public DateTime? EndDate { get; set; }

    /// <summary>Açık (bitmemiş, iptal edilmemiş) görev sayısı; gizli görevler sayılmaz.</summary>
    public int OpenTaskCount { get; set; }

    /// <summary>Açık görevlerden son tarihi geçmiş olanlar; gizli görevler sayılmaz.</summary>
    public int OverdueTaskCount { get; set; }

    /// <summary>Kullanıcının bu projeye ya da görevlerine dair okunmamış bildirimi var mı ("gelişme var").</summary>
    public bool HasUnread { get; set; }
}
