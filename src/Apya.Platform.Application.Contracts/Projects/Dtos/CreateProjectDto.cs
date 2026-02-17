using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Projects.Dtos;

public class CreateProjectDto
{
    // [Required] etiketini sildik ve Guid tipini Nullable (?) yaptýk. Artýk isteðe baðlý!
    public Guid? GrantId { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(32)]
    public string Code { get; set; }
}