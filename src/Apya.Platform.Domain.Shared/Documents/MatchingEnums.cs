namespace Apya.Platform.Documents;

/// <summary>Eslesmenin nasil kuruldugu — denetimde "bunu kim/ne bagladi" sorusunu yanitlar.</summary>
public enum MatchSource
{
    /// <summary>Kullanici elle bagladi.</summary>
    Manual = 1,

    /// <summary>Oneri listesinden onaylandi (skor esikte).</summary>
    Suggested = 2,

    /// <summary>Kural motoru bagladi.</summary>
    Rule = 3
}

/// <summary>Cift kayit suphesinin nedeni.</summary>
public enum DuplicateReason
{
    /// <summary>Dosya icerigi birebir ayni (SHA-256).</summary>
    IdenticalContent = 1,

    /// <summary>Ayni harcamaya zaten baska bir belge bagli.</summary>
    ExpenseAlreadyMatched = 2,

    /// <summary>Ayni tutar + ayni tarih + ayni tedarikci, farkli dosya.</summary>
    SameAmountDateSupplier = 3
}
