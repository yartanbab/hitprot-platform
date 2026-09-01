namespace Apya.Platform.Grants;

/// <summary>
/// 1a/3a · Çıkarılan bir alanın host tarafından onay durumu. Kabul edilmemiş alan
/// parametre formunda sarı işaretlenir ve yayın öncesi elle onay ister.
/// </summary>
public enum GrantDraftFieldStatus
{
    Beklemede = 0,
    Kabul = 1,
    Red = 2
}
