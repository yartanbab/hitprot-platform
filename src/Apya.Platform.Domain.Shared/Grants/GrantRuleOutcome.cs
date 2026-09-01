namespace Apya.Platform.Grants;

/// <summary>
/// Bir uygunluk kuralının tek firma için sonucu. <see cref="Unknown"/> = firmada veri yok;
/// eleyici DEĞİLDİR, yalnız "eksik veri" sayacına girer (1b sağ panel, 1e "eksik iki şart
/// eleyici değil").
/// </summary>
public enum GrantRuleOutcome
{
    Passed = 0,
    Failed = 1,
    Unknown = 2
}
