using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Projects.Dtos;

public class CreateProjectDto
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(64)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string? Description { get; set; }

    public Guid? TenantId { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public Guid? GrantId { get; set; }

    public decimal TotalBudget { get; set; }
    public decimal HourlyRate { get; set; }
    public string Currency { get; set; } = "TRY";
}
