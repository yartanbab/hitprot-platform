using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos;

/// <summary>Faz 2: Kanban board kolonu DTO'su.</summary>
public class BoardColumnDto : EntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ColorClass { get; set; } = "secondary";
    public int Order { get; set; }
    public int? StatusValue { get; set; } // sistem kolonu → TaskStatus int; özel kolon → null
    public bool IsSystem { get; set; }

    /// <summary>WIP limiti; null = limit yok. Aşım engellenmez, board'da rozetle uyarılır.</summary>
    public int? WipLimit { get; set; }
}

public class CreateBoardColumnDto
{
    [Required]
    public Guid ProjectId { get; set; }

    [Required]
    [StringLength(64)]
    public string Name { get; set; } = string.Empty;

    [StringLength(32)]
    public string ColorClass { get; set; } = "secondary";

    /// <summary>Faz 4a: özel kolonun temsil ettiği görev durumu (TaskStatus 1-4).
    /// null = durum değişmesin (varsayılan davranış).</summary>
    [Range(1, 4)]
    public int? StatusValue { get; set; }
}

/// <summary>
/// Faz 4a: özel kolon → durum eşlemesi. AYRI bir uçtur, bilerek:
/// <see cref="UpdateBoardColumnDto"/> ad + renk + WIP'i BİRLİKTE ister ve eksik
/// gelen alanı sıfırlar; eşlemeyi oraya koymak her yeniden adlandırmada eşlemeyi
/// sessizce silerdi.
/// </summary>
public class SetStatusMappingDto
{
    /// <summary>TaskStatus 1-4; null = durum değişmesin.</summary>
    [Range(1, 4)]
    public int? StatusValue { get; set; }

    /// <summary>true → kolonda HÂLİHAZIRDA duran kartların durumu da bu değere çekilir.
    /// false ise eşleme yalnız bundan sonra taşınan kartlara uygulanır.</summary>
    public bool ApplyToExistingTasks { get; set; }
}

public class UpdateBoardColumnDto
{
    [Required]
    [StringLength(64)]
    public string Name { get; set; } = string.Empty;

    [StringLength(32)]
    public string ColorClass { get; set; } = "secondary";

    /// <summary>null veya 0 → limit yok.</summary>
    [Range(0, 999)]
    public int? WipLimit { get; set; }
}
