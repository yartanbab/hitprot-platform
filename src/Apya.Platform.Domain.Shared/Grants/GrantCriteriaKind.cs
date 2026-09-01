namespace Apya.Platform.Grants;

public enum GrantCriteriaKind
{
    Sektor = 0,
    Bolge = 1,
    AnahtarKelime = 2,

    /// <summary>NACE faaliyet kodu (1b · Uygunluk Şartları). Program tarafında hedef kod,
    /// firma tarafında firmanın kendi kodu; örtüşme skoru diğer türlerle aynı yoldan hesaplanır.</summary>
    NaceKodu = 3
}
