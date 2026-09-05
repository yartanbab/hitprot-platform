namespace Apya.Platform.Grants;

/// <summary>
/// STK'nın çalışma alanı (1b · Uygunluk Şartları'nın STK karşılığı). Etiket olarak
/// saklanır (<see cref="GrantCriteriaKind.TematikAlan"/>) ve sektör boyutundan
/// eşleştirmeye girer. Etikete YAZILAN değer bu enum'un ADIDIR — hem firma hem host
/// aynı sabit listeden seçtiği için iki taraf birebir eşleşir; serbest metinde
/// "Eğitim"/"egitim" ayrımı eşleşmeyi sessizce düşürürdü.
/// </summary>
public enum GrantThematicArea
{
    Egitim = 0,
    KulturSanat = 1,
    SosyalHizmetler = 2,
    InsanHaklari = 3,
    Cevre = 4,
    BilimTeknoloji = 5,
    MeslekiDayanisma = 6,
    SaglikSpor = 7,
    SosyalGirisimcilik = 8,
    AfetYonetimi = 9,
    GenclikCocuk = 10,
    KadinAile = 11,
    Kalkinma = 12,
    UluslararasiIsbirligi = 13
}
