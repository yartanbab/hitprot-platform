using System;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// 🔴 DOM-01: Şablon adımı → sabit aşama eşlemesinin varsayılanı. Eşleme asıl olarak
/// host'un seçimidir; burası mevcut şablonları doldurur ve yeni adıma başlangıç verir.
/// Yanlış varsayılan huniyi yanlış gösterir, bu yüzden kural testle kilitli.
/// </summary>
public class GrantStageMapping_Tests
{
    [Theory]
    [InlineData("Başvuru", GrantApplicationStage.Basvuru)]
    [InlineData("Değerlendirme", GrantApplicationStage.Degerlendirme)]
    [InlineData("Onay", GrantApplicationStage.Onay)]
    [InlineData("Ödeme", GrantApplicationStage.Odeme)]
    [InlineData("  onay  ", GrantApplicationStage.Onay)]
    [InlineData("ÖDEME", GrantApplicationStage.Odeme)]
    public void Adi_Sabit_Asamayla_Birebir_Olan_Adim_Ada_Gore_Eslenir(string name, GrantApplicationStage expected)
    {
        // Konum kasten çelişiyor: ad eşleşmesi konumdan ÖNCE gelmeli.
        GrantStageMapping.Suggest(name, order: 0, stepCount: 9).ShouldBe(expected);
    }

    /// <summary>
    /// Varsayılan şablonun dört adımı tam olarak sabit aşamaların adlarını taşır;
    /// orada eşleme bire bir çıkmalı.
    /// </summary>
    [Fact]
    public void Varsayilan_Sablonun_Dort_Adimi_Bire_Bir_Eslenir()
    {
        var names = new[] { "Başvuru", "Değerlendirme", "Onay", "Ödeme" };

        for (var i = 0; i < names.Length; i++)
        {
            GrantStageMapping.Suggest(names[i], i, names.Length).ShouldBe((GrantApplicationStage)i);
        }
    }

    [Theory]
    // Dört adımlı özel şablon: sırayla dört aşama.
    [InlineData(4, 0, GrantApplicationStage.Basvuru)]
    [InlineData(4, 1, GrantApplicationStage.Degerlendirme)]
    [InlineData(4, 2, GrantApplicationStage.Onay)]
    [InlineData(4, 3, GrantApplicationStage.Odeme)]
    // Üç adımlı: ödeme aşamasına hiç düşmez — süreç onayla bitiyorsa doğrusu bu.
    [InlineData(3, 0, GrantApplicationStage.Basvuru)]
    [InlineData(3, 2, GrantApplicationStage.Onay)]
    // Altı adımlı: ilk iki adım hâlâ "Başvuru" özetinde.
    [InlineData(6, 0, GrantApplicationStage.Basvuru)]
    [InlineData(6, 1, GrantApplicationStage.Basvuru)]
    [InlineData(6, 5, GrantApplicationStage.Odeme)]
    // Tek adımlı şablon: her şey başvuruda.
    [InlineData(1, 0, GrantApplicationStage.Basvuru)]
    public void Adi_Eslesmeyen_Adim_Konumuna_Gore_Oranlanir(int stepCount, int order, GrantApplicationStage expected)
    {
        GrantStageMapping.Suggest("Dış süreç", order, stepCount).ShouldBe(expected);
    }

    /// <summary>
    /// Sıra ya da sayı bozuk gelirse (0 adım, aralık dışı sıra) eşleme patlamaz —
    /// tohumlama tek bir bozuk satır yüzünden tüm turu düşürmemeli.
    /// </summary>
    [Theory]
    [InlineData(0, 0)]
    [InlineData(4, -3)]
    [InlineData(4, 99)]
    public void Bozuk_Girdi_Istisna_Atmaz(int stepCount, int order)
    {
        var stage = GrantStageMapping.Suggest("Herhangi", order, stepCount);

        Enum.IsDefined(stage).ShouldBeTrue();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("Saha ziyareti")]
    public void Ada_Gore_Eslesme_Yoksa_Null_Doner(string? name)
    {
        GrantStageMapping.MatchByName(name).ShouldBeNull();
    }
}
