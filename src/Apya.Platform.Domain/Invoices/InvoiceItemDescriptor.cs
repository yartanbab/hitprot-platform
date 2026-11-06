using System;

namespace Apya.Platform.Invoices;

/// <summary>
/// InvoiceManager.CreateAsync için kalem tanımlayıcısı.
/// Uygulama DTO'larından bağımsız, domain-içi transfer nesnesi.
/// </summary>
public sealed record InvoiceItemDescriptor(string Description, decimal Quantity, decimal UnitPrice)
{
    /// <summary>
    /// KDV dahil girilen birim fiyatı KDV hariç fiyata çevirir. Fiyat kolonu iki ondalıklı olduğu
    /// için kuruşa yuvarlanır; bu yüzden genel toplam girilen tutardan bir iki kuruş sapabilir.
    /// </summary>
    public InvoiceItemDescriptor WithoutTax(decimal taxRate) =>
        this with { UnitPrice = Math.Round(UnitPrice * 100 / (100 + taxRate), 2, MidpointRounding.AwayFromZero) };
}
