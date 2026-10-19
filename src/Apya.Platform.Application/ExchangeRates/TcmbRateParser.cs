using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Xml.Linq;

namespace Apya.Platform.ExchangeRates;

/// <summary>
/// F-06 · TCMB kur bülteni (today.xml ya da arşiv) ayrıştırıcısı. Ağdan bağımsız, birim testli.
/// <para>Kullanıcı kararı (2026-10-19): kayıtta TCMB <b>döviz alış</b> kuru (ForexBuying) esas alınır.</para>
/// <para>Bültenin tarihi kökteki <c>Tarih</c> özniteliğinden (gg.aa.yyyy) okunur: today.xml hafta sonu
/// ve tatilde son iş gününün bültenidir; çalıştırma günü yazılırsa Cuma kuru Cumartesi tarihli görünür.</para>
/// </summary>
public static class TcmbRateParser
{
    public record Bulletin(DateTime Date, IReadOnlyDictionary<string, decimal> BuyingRates);

    public static Bulletin Parse(string xml, IEnumerable<string> currencyCodes, DateTime fallbackDate)
    {
        var doc = XDocument.Parse(xml);
        var root = doc.Root;
        var date = DateTime.TryParseExact((string?)root?.Attribute("Tarih"), "dd.MM.yyyy",
            CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed)
            ? parsed.Date
            : fallbackDate.Date;

        var rates = new Dictionary<string, decimal>();
        foreach (var code in currencyCodes)
        {
            var node = doc.Descendants("Currency")
                .FirstOrDefault(c => (string?)c.Attribute("CurrencyCode") == code);
            var text = node?.Element("ForexBuying")?.Value;
            if (string.IsNullOrWhiteSpace(text)) continue;
            if (!decimal.TryParse(text, NumberStyles.Any, CultureInfo.InvariantCulture, out var rate) || rate <= 0) continue;

            // "Unit" 1'den büyükse (ör. JPY 100) kur birim başına indirilir.
            var unit = int.TryParse(node?.Element("Unit")?.Value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var u) && u > 0 ? u : 1;
            rates[code] = rate / unit;
        }

        return new Bulletin(date, rates);
    }

    /// <summary>Arşiv adresi: https://www.tcmb.gov.tr/kurlar/yyyyAA/ggAAyyyy.xml</summary>
    public static string ArchiveUrl(DateTime date)
        => $"https://www.tcmb.gov.tr/kurlar/{date:yyyyMM}/{date:ddMMyyyy}.xml";
}
