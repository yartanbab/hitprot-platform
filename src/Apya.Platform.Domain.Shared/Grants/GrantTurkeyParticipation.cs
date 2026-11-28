namespace Apya.Platform.Grants;

/// <summary>
/// Türkiye'de yerleşik bir kurumun programa katılım koşulu: AB ve uluslararası programlarda programa ve
/// yıla göre değişir. Ulusal programda <see cref="Belirtilmemis"/> kalır.
/// <para>Eşleştirme (<see cref="GrantEligibilityRule.CountryParticipation"/>): <see cref="UygunDegil"/> ve
/// <see cref="FonAlamaz"/> her kurumu eler; <see cref="YalnizOrtak"/> konsorsiyum şartı gibi değerlendirilir.</para>
/// </summary>
public enum GrantTurkeyParticipation
{
    Belirtilmemis = 0,
    TamUygun = 1,
    YalnizOrtak = 2,
    AsosiyeKosullu = 3,
    FonAlamaz = 4,
    UygunDegil = 5
}
