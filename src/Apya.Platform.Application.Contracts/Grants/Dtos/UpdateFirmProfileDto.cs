using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

public class UpdateFirmProfileDto
{
    public CompanySize? Size { get; set; }

    public DateTime? FoundedOn { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Personel sayısı negatif olamaz.")]
    public int? StaffCount { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Ar-Ge personeli sayısı negatif olamaz.")]
    public int? RdStaffCount { get; set; }

    [Range(0, 999999999999.99, ErrorMessage = "Ciro negatif olamaz.")]
    public decimal? AnnualRevenue { get; set; }

    [Range(1, 9, ErrorMessage = "TRL değeri 1 ile 9 arasında olmalıdır.")]
    public int? Trl { get; set; }

    public bool? HasConsortiumPartner { get; set; }

    public List<GrantCriteriaTagDto> Tags { get; set; } = new();
}
