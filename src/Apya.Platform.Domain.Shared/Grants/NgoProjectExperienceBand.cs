namespace Apya.Platform.Grants;

/// <summary>
/// Kurumun (şirket ya da STK) bugüne dek yürüttüğü proje sayısı bandı. Yalnız profil
/// verisidir — hiçbir uygunluk kuralına bağlanmaz. Ad tarihseldir: önce yalnız STK'da vardı.
/// </summary>
public enum NgoProjectExperienceBand
{
    Yok = 0,
    BirUc = 1,
    DortOn = 2,
    OnBirYirmiBes = 3,
    YirmiBesUstu = 4
}
