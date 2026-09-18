using System.Collections.Generic;
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

    [Range(0, 999_999_999_999.99)]
    public decimal? MaxAmount { get; set; }

    // Skor 0-100; parametre ekranı zaten sınırlıyordu, bu giriş yolu sınırsızdı (150 → program kimseye önerilmez).
    [Range(0, 100)]
    public double MinMatchScore { get; set; }

    // Faz A: eşleştirme kriterleri (CompanySize bit-maskesi + sektör/bölge/anahtar kelime).
    public int EligibleCompanySizes { get; set; }

    public List<GrantCriteriaTagDto> CriteriaTags { get; set; } = new();
}
