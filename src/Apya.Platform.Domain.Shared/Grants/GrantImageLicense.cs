namespace Apya.Platform.Grants;

/// <summary>
/// Çağrı görselinin kullanım koşulu. Görsel indirilmez, yalnız adresi tutulur (karar 2026-11-28); koşul belirsizken
/// görsel uygulamada gösterilmemeli.
/// </summary>
public enum GrantImageLicense
{
    Belirsiz = 0,
    ResmiKullanimSerbest = 1,
    AcikLisans = 2,
    IzinGerekli = 3
}
