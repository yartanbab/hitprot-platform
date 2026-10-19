using System;
using Apya.Platform.ExchangeRates;
using Shouldly;
using Xunit;

namespace Apya.Platform.ExchangeRates;

/// <summary>
/// F-06 · TCMB bülteninden ALIŞ kuru okunur (kullanıcı kararı; eskiden satış) ve kayıt bültenin kendi
/// tarihini alır (hafta sonu çalıştırma Cuma kurunu Cumartesi tarihli yazıyordu).
/// </summary>
public class TcmbRateParser_Tests
{
    private const string Xml = """
        <?xml version="1.0" encoding="UTF-8"?>
        <Tarih_Date Tarih="17.10.2026" Date="10/17/2026" Bulten_No="2026/200">
          <Currency CrossOrder="0" Kod="USD" CurrencyCode="USD">
            <Unit>1</Unit><ForexBuying>41.9012</ForexBuying><ForexSelling>41.9767</ForexSelling>
          </Currency>
          <Currency CrossOrder="1" Kod="EUR" CurrencyCode="EUR">
            <Unit>1</Unit><ForexBuying>48.7020</ForexBuying><ForexSelling>48.7898</ForexSelling>
          </Currency>
          <Currency CrossOrder="2" Kod="JPY" CurrencyCode="JPY">
            <Unit>100</Unit><ForexBuying>27.8100</ForexBuying><ForexSelling>27.9900</ForexSelling>
          </Currency>
        </Tarih_Date>
        """;

    [Fact]
    public void Alis_kuru_ve_bulten_tarihi_okunur()
    {
        var bulletin = TcmbRateParser.Parse(Xml, new[] { "USD", "EUR", "GBP" }, new DateTime(2026, 10, 18));

        bulletin.Date.ShouldBe(new DateTime(2026, 10, 17), "Cumartesi çalışsa da bülten Cuma'nın");
        bulletin.BuyingRates["USD"].ShouldBe(41.9012m);
        bulletin.BuyingRates["EUR"].ShouldBe(48.7020m);
        bulletin.BuyingRates.ContainsKey("GBP").ShouldBeFalse("bültende yoksa kayıt üretilmez");
    }

    [Fact]
    public void Birim_kur_tek_birime_indirilir_ve_arsiv_adresi_dogru()
    {
        TcmbRateParser.Parse(Xml, new[] { "JPY" }, DateTime.Today).BuyingRates["JPY"].ShouldBe(0.2781m);
        TcmbRateParser.ArchiveUrl(new DateTime(2026, 10, 2)).ShouldBe("https://www.tcmb.gov.tr/kurlar/202610/02102026.xml");
    }
}
