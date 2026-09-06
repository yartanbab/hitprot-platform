namespace Apya.Platform.Billing;

/// <summary>
/// KDV uygulaması. Protokol Madde 5.2: Teknopark Ar-Ge ve yazılım mevzuatı kapsamında
/// istisna uygulanan hallerde fatura KDV'siz kesilir.
/// </summary>
public enum VatMode
{
    /// <summary>KDV uygulanır; oran faturada saklanır.</summary>
    Standard = 1,

    /// <summary>Teknopark istisnası — KDV'siz.</summary>
    TeknoparkExempt = 2
}
