namespace Apya.Platform.ExchangeRates;

/// <summary>APYA-137: Kur kaydının kaynağı.</summary>
public enum ExchangeRateSource
{
    /// <summary>Elle girilen kur — varsayılan.</summary>
    Manual = 0,

    /// <summary>TCMB günlük kurlarından otomatik çekilen.</summary>
    Tcmb = 1,
}
