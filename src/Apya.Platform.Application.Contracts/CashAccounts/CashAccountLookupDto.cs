using System;

namespace Apya.Platform.CashAccounts;

/// <summary>Gider/gelir formlarının kasa seçicisi için yalın satır (ad + para birimi).</summary>
public class CashAccountLookupDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
}
