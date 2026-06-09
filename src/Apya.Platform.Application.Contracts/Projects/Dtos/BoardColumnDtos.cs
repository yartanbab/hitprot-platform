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
}

public class UpdateBoardColumnDto
{
    [Required]
    [StringLength(64)]
    public string Name { get; set; } = string.Empty;

    [StringLength(32)]
    public string ColorClass { get; set; } = "secondary";
}
