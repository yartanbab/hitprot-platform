namespace Apya.Platform.Grants;

/// <summary>
/// 6b · Danışmanın bir red gerekçesine karşı tutumu. Tasarımın dili birebir:
/// "itiraz edilebilir" ya da "haklı, kabul et".
/// </summary>
public enum GrantAppealStance
{
    /// <summary>Danışman henüz görüş yazmadı.</summary>
    Belirsiz = 0,

    /// <summary>İtiraz edilebilir — madde itiraz dosyasına girer.</summary>
    Itiraz = 1,

    /// <summary>Kurum haklı — itiraz konusu YAPILMAZ.</summary>
    Kabul = 2
}
