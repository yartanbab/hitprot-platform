namespace Apya.Platform.Invoices;

/// <summary>
/// APYA-142: Fatura yönü. Satış = müşteriden alacak (AR, cari Borç).
/// Alış = tedarikçiye borç (AP). Tek model, iki yön — en kapsamlı + basit.
/// </summary>
public enum InvoiceDirection
{
    /// <summary>Satış faturası — varsayılan; cari Borç tahakkuku üretir.</summary>
    Sales = 0,

    /// <summary>Alış faturası — tedarikçi/AP tarafı.</summary>
    Purchase = 1,
}
