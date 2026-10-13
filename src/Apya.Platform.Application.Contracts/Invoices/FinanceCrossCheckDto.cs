namespace Apya.Platform.Invoices.Dtos;

/// <summary>
/// FIN-05 · Alış faturası ile gider kaydı birbirinin karşılığıdır. Biri girilip öteki
/// bulunamazsa kullanıcı UYARILIR; kayıt engellenmez.
/// </summary>
public class FinanceCrossCheckDto
{
    /// <summary>Karşılık bulunamadı ve kullanıcı karşı tarafı görme iznine sahip.</summary>
    public bool ShouldWarn { get; set; }
}
