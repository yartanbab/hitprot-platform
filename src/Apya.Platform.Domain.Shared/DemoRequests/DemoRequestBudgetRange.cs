namespace Apya.Platform.DemoRequests;

/// <summary>
/// Adayın beklediği hibe bütçesi aralığı (EUR). Serbest metin yerine aralık
/// soruluyor: panelde süzülebilsin ve aday rakam uydurmak zorunda kalmasın.
/// </summary>
public enum DemoRequestBudgetRange
{
    UpTo25k = 0,
    From25kTo60k = 1,
    From60kTo150k = 2,
    Over150k = 3,

    /// <summary>Aday henüz bir bütçe aralığı belirlemedi.</summary>
    Unknown = 4
}
