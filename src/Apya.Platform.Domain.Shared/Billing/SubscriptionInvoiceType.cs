namespace Apya.Platform.Billing;

/// <summary>
/// Faturanın konusu — protokolün 5. maddesindeki üç kalem.
/// </summary>
public enum SubscriptionInvoiceType
{
    /// <summary>Yıllık lisans/kullanım bedeli (Madde 5.1).</summary>
    License = 1,

    /// <summary>Proje başarı ve yürütme primi (Madde 5.3).</summary>
    SuccessFee = 2,

    /// <summary>Danışmanlık / ek hizmet.</summary>
    Consulting = 3
}
