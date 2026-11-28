namespace Apya.Platform.Grants;

/// <summary>
/// Kapanan çağrının neden kapandığı. Yalnız <see cref="GrantCallStatus.Kapandi"/> çağrıda anlamlıdır; çağrı
/// yeniden açılınca boşalır. Durum listesi genişletilmedi: kapanış zinciri ve pano sekmeleri aynen çalışır.
/// </summary>
public enum GrantCallClosureReason
{
    Belirtilmemis = 0,
    SuresiDoldu = 1,
    ButceTukendi = 2,
    IptalEdildi = 3,
    AskiyaAlindi = 4
}
