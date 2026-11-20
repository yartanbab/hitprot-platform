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
    Federasyon = 4,
    Kooperatif = 5
}

public static class OrganizationTypeExtensions
{
    /// <summary>Şirket dışındaki her tür STK alan grubunu kullanır.</summary>
    public static bool IsNgo(this OrganizationType type) => type != OrganizationType.Sirket;

    /// <summary>
    /// Programın "başvurabilecek kurum türleri" maskesinde bu türün biti. Bit numarası enum
    /// değeridir: Şirket 1, Dernek 2, Kulüp 4, Vakıf 8, Federasyon 16, Kooperatif 32.
    /// </summary>
    public static int ToMaskBit(this OrganizationType type) => 1 << (int)type;

    /// <summary>Maske bu türü içeriyor mu? Maske 0 ise kısıt yoktur, her tür içerilir.</summary>
    public static bool IsAllowedBy(this OrganizationType type, int mask) => mask == 0 || (mask & type.ToMaskBit()) != 0;

    /// <summary>Maskenin içerdiği türler, enum sırasıyla. Maske 0 ise boş liste (kısıt yok).</summary>
    public static System.Collections.Generic.List<OrganizationType> TypesIn(int mask)
    {
        var result = new System.Collections.Generic.List<OrganizationType>();
        foreach (var type in System.Enum.GetValues<OrganizationType>())
        {
            if ((mask & type.ToMaskBit()) != 0)
            {
                result.Add(type);
            }
        }
        return result;
    }

    /// <summary>
    /// Kurum profilindeki türün hibe tarafındaki karşılığı; karşılığı yoksa (kamu kurumu,
    /// "Diğer") null. Hibe profili kaydedilmemiş kurumun türü buradan çözülür — karşılığı
    /// olmayan tür "bilinmiyor" sayılır, sessizce Şirket'e düşmez.
    /// </summary>
    public static OrganizationType? TryToOrganizationType(this Apya.Platform.Tenants.CompanyType type) => type switch
    {
        Apya.Platform.Tenants.CompanyType.Company => OrganizationType.Sirket,
        Apya.Platform.Tenants.CompanyType.SoleProprietorship => OrganizationType.Sirket,
        Apya.Platform.Tenants.CompanyType.Association => OrganizationType.Dernek,
        Apya.Platform.Tenants.CompanyType.Foundation => OrganizationType.Vakif,
        _ => null
    };

    /// <summary>
    /// Kurum profilindeki türün hibe tarafındaki karşılığı. Kamu kurumu ve "Diğer"in hibe
    /// tarafında karşılığı yok; varsayılan (Şirket) kalır, kurum hibe profilinde seçer.
    /// </summary>
    public static OrganizationType ToOrganizationType(this Apya.Platform.Tenants.CompanyType type) => type switch
    {
        Apya.Platform.Tenants.CompanyType.Association => OrganizationType.Dernek,
        Apya.Platform.Tenants.CompanyType.Foundation => OrganizationType.Vakif,
        _ => OrganizationType.Sirket
    };
}
