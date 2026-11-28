namespace Apya.Platform.Grants;

/// <summary>
/// Programın çağrılarının nasıl açıldığı. Son tarihi boş çağrının "sürekli açık" mı yoksa tarihi
/// girilmemiş mi olduğunu ayırır; dönem metninden ("Sürekli") okumaya gerek bırakmaz.
/// </summary>
public enum GrantCallCycle
{
    Belirtilmemis = 0,
    TekSeferlik = 1,
    Donemsel = 2,
    SurekliAcik = 3,
    ButceTukenene = 4
}
