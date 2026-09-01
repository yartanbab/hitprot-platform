namespace Apya.Platform.Grants;

public enum GrantCallStatus
{
    Planlandi = 0,
    Acik = 1,
    Kapandi = 2,

    /// <summary>
    /// Doğrulanmamış çağrı: elle girilmiş ya da kazımadan gelmiş, host henüz YAYINLAMAMIŞ.
    /// Kiracıya ve kamu yüzeyine ASLA çıkmaz — tüketici sorgular yalnız <see cref="Acik"/>
    /// okur. Değer sona eklendi; mevcut satırların sayısal karşılığı değişmedi.
    /// </summary>
    Taslak = 3
}
