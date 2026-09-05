namespace Apya.Platform.Billing;

/// <summary>Tahsilatın geldiği kanal.</summary>
public enum PaymentMethod
{
    /// <summary>Havale / EFT — protokolün öngördüğü yol (Madde 5.1).</summary>
    BankTransfer = 1,

    /// <summary>Nakit.</summary>
    Cash = 2,

    /// <summary>Diğer (mahsup, çek, kredi kartı…). Açıklaması referans alanında.</summary>
    Other = 3
}
