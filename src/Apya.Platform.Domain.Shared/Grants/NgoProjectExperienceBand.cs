namespace Apya.Platform.Grants;

/// <summary>
/// STK'nın bugüne dek yürüttüğü proje sayısı bandı. Yalnız profil verisidir —
/// hiçbir uygunluk kuralına bağlanmaz, doluluk yüzdesine sayılır.
/// </summary>
public enum NgoProjectExperienceBand
{
    Yok = 0,
    BirUc = 1,
    DortOn = 2,
    OnBirYirmiBes = 3,
    YirmiBesUstu = 4
}
