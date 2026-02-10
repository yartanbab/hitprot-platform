using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Projects.Dtos;

public class CreateProjectDto
{
    [Required]
    public Guid GrantId { get; set; }


    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty; // <-- Hatayý veren kýsým buydu

    [Required]
    [StringLength(32)]
    public string Code { get; set; }

}
