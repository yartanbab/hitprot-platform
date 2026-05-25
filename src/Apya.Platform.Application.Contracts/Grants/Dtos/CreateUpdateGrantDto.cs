using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

public class CreateUpdateGrantDto
{
    [Required]
    [StringLength(128)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(64)]
    public string Issuer { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal? MaxAmount { get; set; }

    public double MinMatchScore { get; set; }
}
