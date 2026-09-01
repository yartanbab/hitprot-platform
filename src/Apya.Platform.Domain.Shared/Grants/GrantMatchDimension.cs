namespace Apya.Platform.Grants;

/// <summary>
/// 4b · Uyum skorunu oluşturan boyutlar. Sıra ekrandaki gösterim sırasıdır.
/// Her boyutun bir çarpanı vardır (0 = kapalı); skor bu çarpanlarla AĞIRLIKLI
/// ortalamadır (bkz. <see cref="GrantMatchManager.Score"/>).
/// </summary>
public enum GrantMatchDimension
{
    /// <summary>Sektör + NACE etiketlerinin örtüşmesi.</summary>
    Sector = 0,

    /// <summary>TRL aralığı uyumu — firma profilindeki TRL beyanı.</summary>
    TechnicalMaturity = 1,

    /// <summary>Ar-Ge personeli asgarisinin karşılanması.</summary>
    RdStaff = 2,

    /// <summary>İl / bölge / OSB etiketlerinin örtüşmesi.</summary>
    Region = 3,

    /// <summary>Proje geçmişi: tipik bütçe uyumu + baskın proje kategorisi.</summary>
    ProjectHistory = 4,

    /// <summary>Serbest anahtar kelime örtüşmesi.</summary>
    Keyword = 5
}
