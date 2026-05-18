namespace Apya.Platform.Incomes;

/// <summary>
/// APYA-142d: Faturasız gelir kategorisi. Devlet raporunda hibe ≠ satış geliri ayrışır.
/// </summary>
public enum IncomeCategory
{
    /// <summary>Diğer / sınıflandırılmamış — varsayılan.</summary>
    Other = 0,

    /// <summary>Hibe (TÜBİTAK, KOSGEB, AB fonu vb.) — satış geliri DEĞİL.</summary>
    Grant = 1,

    /// <summary>Bağış / sponsorluk.</summary>
    Donation = 2,

    /// <summary>Faturasız satış / nakit gelir.</summary>
    CashSale = 3,

    /// <summary>Faiz / finansal gelir.</summary>
    Financial = 4,
}
