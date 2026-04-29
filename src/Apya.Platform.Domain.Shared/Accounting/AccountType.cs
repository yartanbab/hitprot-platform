namespace Apya.Platform.Accounting;

/// <summary>
/// Çift kayıtlı muhasebe çekirdeğinin temel hesap tipleri.
/// <para>
/// Normal balance kuralı:
/// </para>
/// <list type="bullet">
///   <item>Asset, Expense → Debit</item>
///   <item>Liability, Equity, Revenue → Credit</item>
/// </list>
/// Tip ile normal balance arasındaki ilişki bilinçli olarak <see cref="NormalBalance"/>
/// ayrı tutulur — gelecekte contra-account (ör. accumulated depreciation) eklendiğinde
/// tip aynı kalsa da normal balance ters çevrilebilir.
/// </summary>
public enum AccountType : byte
{
    Asset = 1,
    Liability = 2,
    Equity = 3,
    Revenue = 4,
    Expense = 5
}
