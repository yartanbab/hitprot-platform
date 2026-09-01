namespace Apya.Platform.Grants;

/// <summary>
/// 4b · Eksik Veri Kampanyası tablosundaki alanlar — firma profilinde boş kaldığında
/// eşleştirmenin körleştiği veriler. <see cref="GrantEligibilityRule"/>'dan ayrıdır:
/// orası programın ŞARTINI, burası firmanın VERİSİNİ adlandırır (NACE bir şart değil,
/// etikettir; bu yüzden kural listesinde yoktur).
/// </summary>
public enum GrantFirmDataField
{
    Nace = 0,
    Trl = 1,
    RdStaff = 2,
    StaffCount = 3,
    Revenue = 4,
    FoundedOn = 5,
    ConsortiumPartner = 6,
    CompanySize = 7
}
