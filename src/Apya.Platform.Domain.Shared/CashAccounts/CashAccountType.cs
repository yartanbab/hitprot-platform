namespace Apya.Platform.CashAccounts;

/// <summary>
/// APYA-133: Kasa türü. Geniş kapsamlı — nakit, banka hesabı, kredi kartı.
/// </summary>
public enum CashAccountType
{
    /// <summary>Nakit kasa — varsayılan.</summary>
    Cash = 0,

    /// <summary>Banka hesabı.</summary>
    Bank = 1,

    /// <summary>Kredi kartı.</summary>
    CreditCard = 2,
}
