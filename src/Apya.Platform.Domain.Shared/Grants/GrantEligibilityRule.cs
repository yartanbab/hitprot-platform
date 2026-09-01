namespace Apya.Platform.Grants;

/// <summary>
/// Uygunluk şartlarının tek tek değerlendirilebilen boyutları (1b · Canlı Eşleşme).
/// Her kuralın firma tarafında bir karşılığı vardır; karşılığı boşsa sonuç
/// <see cref="GrantRuleOutcome.Unknown"/> olur ve firma ELENMEZ.
/// </summary>
public enum GrantEligibilityRule
{
    CompanySize = 0,
    CompanyAge = 1,
    Trl = 2,
    StaffCount = 3,
    RdStaffCount = 4,
    Revenue = 5,
    Consortium = 6
}
