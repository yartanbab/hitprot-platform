namespace Apya.Platform.Grants;

/// <summary>
/// Firmanın bir çağrıya "İlgilenmiyorum" deme gerekçesi. Değerler 1'den başlar: 0 "seçilmedi"
/// ile karışmasın. 🔴 Olay tablosunda sayı olarak saklanır — yeni gerekçe SONA eklenir,
/// mevcut numaralar DEĞİŞTİRİLMEZ.
/// </summary>
public enum GrantDismissReason
{
    /// <summary>Programın konusu firmanın alanı dışında.</summary>
    OutOfScope = 1,

    /// <summary>Bütçe ya da eş finansman payı karşılanamıyor.</summary>
    BudgetInsufficient = 2,

    /// <summary>Son başvuru tarihine yetişilemez.</summary>
    NotEnoughTime = 3,

    /// <summary>Firma bir uygunluk şartını karşılamıyor.</summary>
    NotEligible = 4,

    /// <summary>Şu an başvuruyu yürütecek kapasite yok.</summary>
    NoCapacity = 5,

    Other = 6
}
