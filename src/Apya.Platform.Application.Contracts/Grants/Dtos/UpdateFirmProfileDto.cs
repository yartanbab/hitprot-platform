using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

public class UpdateFirmProfileDto
{
    public OrganizationType Type { get; set; }

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

    // --- STK alanları; Type şirketse kayıtta yok sayılır ---

    [StringLength(64, ErrorMessage = "Kayıt / kütük numarası en fazla 64 karakter olabilir.")]
    public string? RegistryNumber { get; set; }

    [StringLength(16, ErrorMessage = "Vergi kimlik numarası en fazla 16 karakter olabilir.")]
    public string? TaxNumber { get; set; }

    [StringLength(128, ErrorMessage = "Vergi dairesi en fazla 128 karakter olabilir.")]
    public string? TaxOffice { get; set; }

    public NgoStaffBand? ProfessionalStaffBand { get; set; }

    public NgoProjectExperienceBand? ProjectExperience { get; set; }

    public List<GrantCriteriaTagDto> Tags { get; set; } = new();
}
