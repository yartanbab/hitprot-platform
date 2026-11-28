namespace Apya.Platform.Grants;

/// <summary>
/// Desteğin biçimi (1b · Finansal Yapı). <see cref="GrantRepaymentType"/>'tan bağımsızdır: teknik destek
/// nakit vermez, faizsiz kredi geri ödemelidir. Eşleştirmeye girmez; programın ne verdiğini anlatır.
/// </summary>
public enum GrantSupportType
{
    Belirtilmemis = 0,
    NakdiHibe = 1,
    TeknikDestek = 2,
    FaizsizKredi = 3,
    FaizDestegi = 4,
    Odul = 5,
    Burs = 6,
    Hareketlilik = 7,
    VergiSgkTesviki = 8,
    SermayeYatirimi = 9,
    AyniDestek = 10
}
