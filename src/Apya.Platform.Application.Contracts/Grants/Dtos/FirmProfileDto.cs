using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// Firmanın eşleştirme profili. Alanlar programların uygunluk şartlarının AYNASIDIR —
/// biri boşken karşılığı olan şart ölçülemez ve çağrı "koşullu" kovasına düşer (9a).
/// </summary>
public class FirmProfileDto
{
    public OrganizationType Type { get; set; }
    public CompanySize? Size { get; set; }
    public DateTime? FoundedOn { get; set; }
    public int? StaffCount { get; set; }
    public int? RdStaffCount { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? Trl { get; set; }
    public bool? HasConsortiumPartner { get; set; }

    // --- STK alanları (Type şirket dışıysa doludur) ---
    public string? RegistryNumber { get; set; }
    public string? TaxNumber { get; set; }
    public string? TaxOffice { get; set; }
    public NgoStaffBand? ProfessionalStaffBand { get; set; }
    public NgoProjectExperienceBand? ProjectExperience { get; set; }

    public List<GrantCriteriaTagDto> Tags { get; set; } = new();

    /// <summary>1d profil kartındaki ilerleme çubuğu.</summary>
    public int CompletionPercent { get; set; }

    /// <summary>Doldurulmamış alan sayısı — "N alan eksik" chip'i.</summary>
    public int MissingFieldCount { get; set; }
}
