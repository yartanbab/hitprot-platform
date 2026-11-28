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
    Consortium = 6,
    /// <summary>
    /// Program il etiketi taşıyorsa (kalkınma ajansı programları) kurumun illerinden biri
    /// o listede olmalı. İl adı <see cref="TurkeyProvinces"/> sözlüğünden gelir.
    /// </summary>
    Region = 7,
    /// <summary>
    /// Program yalnız belirli kurum türlerine açıksa (<c>Grant.EligibleApplicantTypes</c>) ya da
    /// platform kurumlarına hiç açık değilse (<c>Grant.ClosedToPlatformApplicants</c>) kurumun
    /// türü uymalı. Tür bilinmiyorsa sonuç Unknown olur, kurum elenmez.
    /// </summary>
    OrganizationType = 8,
    /// <summary>
    /// Türkiye'den katılım (<c>Grant.TurkeyParticipation</c>): Türkiye programa katılmıyorsa ya da Türk
    /// kurumu fon alamıyorsa her kurum elenir. Firma tarafında karşılığı yoktur; sonuç hiçbir zaman Unknown olmaz.
    /// </summary>
    CountryParticipation = 9
}
