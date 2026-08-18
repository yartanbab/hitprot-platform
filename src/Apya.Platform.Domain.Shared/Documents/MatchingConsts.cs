namespace Apya.Platform.Documents;

public static class MatchingConsts
{
    /// <summary>Bu skorun altindaki aday oneri listesinde GOSTERILMEZ.</summary>
    public const int MinSuggestionScore = 40;

    /// <summary>Bu skorun ustundeki aday "guclu eslesme" sayilir (UI vurgular).</summary>
    public const int StrongMatchScore = 80;

    /// <summary>Tutar yakinligi bu yuzdenin uzerinde saparsa tutar puani sifirdir.</summary>
    public const decimal AmountTolerancePercent = 5m;

    /// <summary>Tarih bu kadar gun uzaksa tarih puani sifirdir.</summary>
    public const int DateToleranceDays = 45;

    public const int MaxAnnexNumberLength = 24;
    public const int MaxRiskTitleLength = 200;
    public const int MaxRiskTextLength = 1000;
}
