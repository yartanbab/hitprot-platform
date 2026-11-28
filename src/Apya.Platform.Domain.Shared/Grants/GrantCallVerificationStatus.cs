namespace Apya.Platform.Grants;

/// <summary>Çağrı bilgisinin en son nasıl doğrulandığı. Tarihi <c>GrantCall.LastVerifiedAt</c>'te.</summary>
public enum GrantCallVerificationStatus
{
    Dogrulanmadi = 0,
    ResmiKaynak = 1,
    IkincilKaynak = 2,
    Dogrulanamadi = 3,
    Celiskili = 4
}
