namespace Apya.Platform.Grants;

/// <summary>
/// Profil sahibinin kurum türü. Form bu değere göre iki alan grubundan birini gösterir:
/// <see cref="Sirket"/> ise ölçek/ciro/TRL/Ar-Ge gibi ticari alanlar, diğerlerinde
/// STK alanları (kütük no, ekip bandı, proje deneyimi, tematik alan).
/// Bit maskesi DEĞİLDİR — <see cref="CompanySize"/>'dan farklı olarak bir kurum tek türdür.
/// </summary>
public enum OrganizationType
{
    Sirket = 0,
    Dernek = 1,
    Kulup = 2,
    Vakif = 3,
    Federasyon = 4
}

public static class OrganizationTypeExtensions
{
    /// <summary>Şirket dışındaki her tür STK alan grubunu kullanır.</summary>
    public static bool IsNgo(this OrganizationType type) => type != OrganizationType.Sirket;
}
