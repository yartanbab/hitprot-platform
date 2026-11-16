using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>Belgeden okunan önerinin metin biçimi kültürden bağımsızdır; okunamayan değer sessizce boş sayılmaz.</summary>
public class FirmParameterRawValue_Tests
{
    private static FirmParameterDefinition Definition(FirmParameterDataType type, params string[] options)
    {
        var definition = new FirmParameterDefinition(Guid.NewGuid(), "test_param", "Deneme", type, FirmParameterGroup.Finans);
        if (options.Length > 0)
        {
            definition.SetOptions(options);
        }
        return definition;
    }

    [Fact]
    public void Bos_deger_bilinmiyor_demektir()
    {
        FirmParameterRawValue.Parse(Definition(FirmParameterDataType.Money), "  ").ShouldBeNull();
        FirmParameterRawValue.Parse(Definition(FirmParameterDataType.Text), null).ShouldBeNull();
    }

    [Fact]
    public void Tipler_kulturden_bagimsiz_okunur()
    {
        FirmParameterRawValue.Parse(Definition(FirmParameterDataType.Money), "250000.50")!.Number.ShouldBe(250000.50m);
        FirmParameterRawValue.Parse(Definition(FirmParameterDataType.Date), "2026-03-31")!.Date.ShouldBe(new DateTime(2026, 3, 31));
        FirmParameterRawValue.Parse(Definition(FirmParameterDataType.Boolean), "false")!.Bool.ShouldBe(false);
        FirmParameterRawValue.Parse(Definition(FirmParameterDataType.MultiSelect, "Tarım", "Gıda"), "[\"Tarım\",\"Gıda\"]")!
            .Choices.ShouldBe(new[] { "Tarım", "Gıda" });
        FirmParameterRawValue.Parse(Definition(FirmParameterDataType.LongText), " Bölgesel kalkınma ")!.Text.ShouldBe("Bölgesel kalkınma");
    }

    [Theory]
    [InlineData(FirmParameterDataType.Money, "250.000,50")]
    [InlineData(FirmParameterDataType.Money, "250 bin TL")]
    [InlineData(FirmParameterDataType.Date, "31.03.2026")]
    [InlineData(FirmParameterDataType.Boolean, "evet")]
    [InlineData(FirmParameterDataType.MultiSelect, "Tarım, Gıda")]
    [InlineData(FirmParameterDataType.MultiSelect, "[]")]
    public void Okunamayan_deger_hata_verir(FirmParameterDataType type, string raw)
    {
        var definition = Definition(type, "Tarım", "Gıda");

        Should.Throw<BusinessException>(() => FirmParameterRawValue.Parse(definition, raw))
            .Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterValueInvalid);
    }
}
