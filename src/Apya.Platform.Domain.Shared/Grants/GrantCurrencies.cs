using System;
using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Grants;

/// <summary>
/// Hibe programının destek tutarlarının (asgari/azami) para birimi. Projedeki diğer para alanları
/// gibi ISO 4217 kodu metin olarak tutulur. Döviz tavanlı programda TL ile karşılaştırma YAPILMAZ:
/// eşleştirmenin tutar boyutu ve bütçe kullanım yüzdesi "veri yok" sayılır (kur çevrimi yok).
/// </summary>
public static class GrantCurrencies
{
    public const string Try = "TRY";
    public const string Eur = "EUR";
    public const string Usd = "USD";
    public const string Gbp = "GBP";

    public const int MaxLength = 3;

    public static IReadOnlyList<string> All { get; } = [Try, Eur, Usd, Gbp];

    public static bool IsSupported(string? code) => code != null && All.Contains(code);

    /// <summary>Boş ya da desteklenmeyen kod TRY'ye düşer; büyük/küçük harf duyarsız.</summary>
    public static string Normalize(string? code)
    {
        var upper = code?.Trim().ToUpperInvariant();
        return IsSupported(upper) ? upper! : Try;
    }

    public static bool IsTry(string? code) => string.Equals(Normalize(code), Try, StringComparison.Ordinal);
}
