using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

public class CreateUpdateGrantCallDto
{
    [Required]
    public Guid GrantId { get; set; }

    [Required]
    [StringLength(32)]
    public string Period { get; set; } = string.Empty;

    public GrantCallStatus Status { get; set; }
    public DateTime? OpenDate { get; set; }
    public DateTime? Deadline { get; set; }

    [Range(0, 999_999_999_999.99)]
    public decimal? Budget { get; set; }

    [StringLength(64)]
    public string? Reference { get; set; }
}
