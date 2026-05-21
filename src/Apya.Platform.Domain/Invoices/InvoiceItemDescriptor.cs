namespace Apya.Platform.Invoices;

/// <summary>
/// InvoiceManager.CreateAsync için kalem tanımlayıcısı.
/// Uygulama DTO'larından bağımsız, domain-içi transfer nesnesi.
/// </summary>
public sealed record InvoiceItemDescriptor(string Description, decimal Quantity, decimal UnitPrice);
