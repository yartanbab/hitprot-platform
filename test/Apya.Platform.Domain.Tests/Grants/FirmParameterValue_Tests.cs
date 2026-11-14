using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Kurum parametresi değerinin sözleşmesi: EKSİK ile SIFIR ayrıdır, değer tanımın kurallarına
/// göre doğrulanır ve nereden geldiği değerle birlikte saklanır.
/// </summary>
public class FirmParameterValue_Tests
{
    private static readonly DateTime Now = new(2026, 1, 10, 9, 30, 0);
    private static readonly Guid Tenant = Guid.NewGuid();

    private static FirmParameterDefinition Definition(
        FirmParameterDataType type,
        FirmParameterSource sources = FirmParameterSource.Kullanici | FirmParameterSource.BelgeAi,
        FirmParameterSystemKey? systemKey = null)
        => new(Guid.NewGuid(), "test_param", "Deneme parametresi", type, FirmParameterGroup.Finans, systemKey)
        {
            AllowedSources = sources
        };

    private static FirmParameterValue Value(
        FirmParameterDefinition definition, FirmParameterInput input, FirmParameterOrigin? origin = null)
        => new(Guid.NewGuid(), Tenant, definition, input, origin ?? FirmParameterOrigin.UserEntry, Now);

    private static string CodeOf(Action action) => Should.Throw<BusinessException>(action).Code!;

    [Fact]
    public void Sifir_bir_degerdir_eksik_degildir()
    {
        var money = Definition(FirmParameterDataType.Money);
        money.SetNumberRange(0, null);

        var value = Value(money, new FirmParameterInput(Number: 0m));

        value.ValueNumber.ShouldBe(0m, "sıfır kapasite 'bilinmiyor' değil, girilmiş bir bilgidir");
    }

    [Fact]
    public void Hayir_bir_degerdir_eksik_degildir()
    {
        var value = Value(Definition(FirmParameterDataType.Boolean), new FirmParameterInput(Bool: false));

        value.ValueBool.ShouldBe(false);
    }

    [Theory]
    [InlineData(FirmParameterDataType.Text)]
    [InlineData(FirmParameterDataType.LongText)]
    [InlineData(FirmParameterDataType.Number)]
    [InlineData(FirmParameterDataType.Money)]
    [InlineData(FirmParameterDataType.Percent)]
    [InlineData(FirmParameterDataType.Date)]
    [InlineData(FirmParameterDataType.Boolean)]
    [InlineData(FirmParameterDataType.Select)]
    [InlineData(FirmParameterDataType.MultiSelect)]
    public void Bos_degerle_satir_yazilamaz(FirmParameterDataType type)
    {
        var definition = Definition(type);
        if (type is FirmParameterDataType.Select or FirmParameterDataType.MultiSelect)
        {
            definition.SetOptions(new[] { "A", "B" });
        }

        // Boş girdi: "bilmiyorum" satır yazarak değil, satır yazmayarak ifade edilir.
        CodeOf(() => Value(definition, new FirmParameterInput(Text: "   ")))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterValueRequired);
    }

    [Fact]
    public void Sinir_disindaki_sayi_reddedilir()
    {
        var definition = Definition(FirmParameterDataType.Number);
        definition.SetNumberRange(0, 500);

        CodeOf(() => Value(definition, new FirmParameterInput(Number: -1)))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterValueBelowMin);
        CodeOf(() => Value(definition, new FirmParameterInput(Number: 501)))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterValueAboveMax);
        Value(definition, new FirmParameterInput(Number: 500)).ValueNumber.ShouldBe(500m);
    }

    [Fact]
    public void Yuzde_sinir_verilmese_de_0_ile_100_arasindadir()
    {
        var definition = Definition(FirmParameterDataType.Percent);

        CodeOf(() => Value(definition, new FirmParameterInput(Number: 101)))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterValueAboveMax);
        CodeOf(() => Value(definition, new FirmParameterInput(Number: -5)))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterValueBelowMin);
        Value(definition, new FirmParameterInput(Number: 20)).ValueNumber.ShouldBe(20m);
    }

    [Fact]
    public void Metin_kirpilir_ve_ust_siniri_asamaz()
    {
        var definition = Definition(FirmParameterDataType.Text);

        Value(definition, new FirmParameterInput(Text: "  Ankara  ")).ValueText.ShouldBe("Ankara");
        CodeOf(() => Value(definition, new FirmParameterInput(Text: new string('a', FirmParameterConsts.MaxTextLength + 1))))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterValueTooLong);
    }

    [Fact]
    public void Tanimli_olmayan_secenek_reddedilir()
    {
        var definition = Definition(FirmParameterDataType.Select);
        definition.SetOptions(new[] { "Yok", "1-3", "4-10" });

        Value(definition, new FirmParameterInput(Text: "1-3")).ValueText.ShouldBe("1-3");
        CodeOf(() => Value(definition, new FirmParameterInput(Text: "100+")))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterOptionNotAllowed);
    }

    [Fact]
    public void Coklu_secim_yinelenenleri_eler_ve_geri_okunur()
    {
        var definition = Definition(FirmParameterDataType.MultiSelect);
        definition.SetOptions(new[] { "Eğitim", "Çevre", "Sağlık" });

        var value = Value(definition, new FirmParameterInput(Choices: new[] { "Çevre", " Eğitim ", "Çevre" }));

        value.GetChoices(definition).ShouldBe(new[] { "Çevre", "Eğitim" });
        value.ValueText.ShouldBe("[\"Çevre\",\"Eğitim\"]", "Türkçe harf veritabanına kaçırılmadan yazılır");
        CodeOf(() => Value(definition, new FirmParameterInput(Choices: new[] { "Çevre", "Spor" })))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterOptionNotAllowed);
    }

    [Fact]
    public void Tanimin_izin_vermedigi_kaynaktan_deger_yazilamaz()
    {
        var onlyManual = Definition(FirmParameterDataType.LongText, FirmParameterSource.Kullanici);

        CodeOf(() => Value(onlyManual, new FirmParameterInput(Text: "metin"),
                new FirmParameterOrigin(FirmParameterSource.BelgeAi, Confidence: 90)))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterSourceNotAllowed);
    }

    [Fact]
    public void Degeri_baska_yerde_yasayan_sistem_parametresine_buradan_yazilamaz()
    {
        // Ciro FirmProfile'da durur; burada ikinci bir kopyası tutulursa iki kaynak ayrışırdı.
        var revenue = Definition(FirmParameterDataType.Money, systemKey: FirmParameterSystemKey.YillikCiro);

        CodeOf(() => Value(revenue, new FirmParameterInput(Number: 1_000_000m)))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterSystemReadOnly);
    }

    [Fact]
    public void Kullanimdan_kalkan_tanima_yeni_deger_girilemez()
    {
        var retired = Definition(FirmParameterDataType.Text);
        retired.IsActive = false;

        CodeOf(() => Value(retired, new FirmParameterInput(Text: "x")))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterInactive);
    }

    [Fact]
    public void Belgeden_gelen_degerin_kaynagi_ve_yeri_saklanir()
    {
        var definition = Definition(FirmParameterDataType.Money);
        var documentId = Guid.NewGuid();

        var value = Value(definition, new FirmParameterInput(Number: 250_000m),
            new FirmParameterOrigin(
                FirmParameterSource.BelgeAi,
                Confidence: 140,
                DocumentFileId: documentId,
                Page: 12,
                Excerpt: new string('x', FirmParameterConsts.MaxSourceExcerptLength + 50)));

        value.Source.ShouldBe(FirmParameterSource.BelgeAi);
        value.Verification.ShouldBe(FirmParameterVerification.Dogrulanmadi, "yapay zekâ çıkarımı onaylanana kadar kesin bilgi değildir");
        value.SourceDocumentFileId.ShouldBe(documentId);
        value.SourcePage.ShouldBe(12);
        value.SourceExcerpt!.Length.ShouldBe(FirmParameterConsts.MaxSourceExcerptLength);
        value.Confidence.ShouldBe(100, "güven 0-100 aralığına sıkıştırılır");
    }

    [Fact]
    public void Gecersiz_yeni_deger_mevcut_degeri_bozmaz()
    {
        var definition = Definition(FirmParameterDataType.Number);
        definition.SetNumberRange(0, 10);
        var value = Value(definition, new FirmParameterInput(Number: 4));

        Should.Throw<BusinessException>(() => value.Set(
            definition, new FirmParameterInput(Number: 99), new FirmParameterOrigin(FirmParameterSource.BelgeAi), Now.AddDays(1)));

        value.ValueNumber.ShouldBe(4m);
        value.Source.ShouldBe(FirmParameterSource.Kullanici);
        value.ConfirmedAt.ShouldBe(Now);
    }

    [Fact]
    public void Gecerlilik_suresi_dolan_deger_guncel_degildir()
    {
        var definition = Definition(FirmParameterDataType.Money);
        definition.SetValidity(6);
        var value = Value(definition, new FirmParameterInput(Number: 100m)); // 2026-01-10

        value.IsStale(definition, new DateTime(2026, 7, 10)).ShouldBeFalse("altı ayın son günü hâlâ güncel");
        value.IsStale(definition, new DateTime(2026, 7, 11)).ShouldBeTrue();

        // "Hâlâ güncel" teyidi değeri değiştirmeden süreyi yeniden başlatır.
        value.Confirm(new DateTime(2026, 7, 11));
        value.IsStale(definition, new DateTime(2026, 7, 11)).ShouldBeFalse();
        value.ValueNumber.ShouldBe(100m);
    }

    [Fact]
    public void Suresiz_parametre_hic_bayatlamaz()
    {
        var definition = Definition(FirmParameterDataType.Date);
        var value = Value(definition, new FirmParameterInput(Date: new DateTime(2015, 3, 1, 14, 0, 0)));

        value.ValueDate.ShouldBe(new DateTime(2015, 3, 1), "tarih parametresi saat taşımaz");
        value.IsStale(definition, new DateTime(2040, 1, 1)).ShouldBeFalse();
    }

    [Fact]
    public void Guvenilirlik_kaynak_dogrulama_ve_guncellikten_turetilir()
    {
        var definition = Definition(FirmParameterDataType.Money);
        definition.SetValidity(6);
        var today = Now.Date;
        var input = new FirmParameterInput(Number: 100m);

        Value(definition, input).ReliabilityAt(definition, today)
            .ShouldBe(FirmParameterReliability.Orta, "doğrulanmamış kullanıcı beyanı");
        Value(definition, input, new FirmParameterOrigin(FirmParameterSource.Kullanici, Verified: true))
            .ReliabilityAt(definition, today).ShouldBe(FirmParameterReliability.Yuksek);
        Value(definition, input, new FirmParameterOrigin(FirmParameterSource.BelgeAi, Confidence: 90))
            .ReliabilityAt(definition, today).ShouldBe(FirmParameterReliability.Orta);
        Value(definition, input, new FirmParameterOrigin(FirmParameterSource.BelgeAi, Confidence: 60))
            .ReliabilityAt(definition, today).ShouldBe(FirmParameterReliability.Dusuk);

        // Süresi dolan değer doğrulanmış olsa da düşüktür.
        Value(definition, input, new FirmParameterOrigin(FirmParameterSource.Kullanici, Verified: true))
            .ReliabilityAt(definition, today.AddMonths(7)).ShouldBe(FirmParameterReliability.Dusuk);
    }
}
