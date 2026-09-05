namespace Apya.Platform.Grants;

/// <summary>
/// STK'nın profesyonel (ücretli) ekip büyüklüğü bandı. STK'lar personel sayısını
/// tam sayıyla beyan etmez; bant, programın asgari personel şartına
/// <see cref="MinStaff"/> üzerinden alt sınırıyla girer.
/// </summary>
public enum NgoStaffBand
{
    BirUc = 1,
    DortOn = 2,
    OnBirYirmiBes = 3,
    YirmiBesUstu = 4
}

public static class NgoStaffBandExtensions
{
    /// <summary>
    /// Bandın alt sınırı — eşleştirmede StaffCount yerine geçer. Alt sınır seçilir ki
    /// bant, karşılamadığı bir asgari şartı karşılıyormuş gibi göstermesin.
    /// </summary>
    public static int MinStaff(this NgoStaffBand band) => band switch
    {
        NgoStaffBand.BirUc => 1,
        NgoStaffBand.DortOn => 4,
        NgoStaffBand.OnBirYirmiBes => 11,
        _ => 26
    };
}
