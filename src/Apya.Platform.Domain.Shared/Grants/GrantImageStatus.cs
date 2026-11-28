namespace Apya.Platform.Grants;

/// <summary>Çağrı görselinin son kontroldeki durumu (bkz. <c>GrantCall.ImageLastCheckedAt</c>).</summary>
public enum GrantImageStatus
{
    Belirtilmemis = 0,
    YalnizAdres = 1,
    Indirildi = 2,
    Bulunamadi = 3,
    KirikBaglanti = 4
}
