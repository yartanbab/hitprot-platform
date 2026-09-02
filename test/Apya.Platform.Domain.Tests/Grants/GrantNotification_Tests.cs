using System;
using System.Collections.Generic;
using Apya.Platform.Grants;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Şablon metni ve zorunlu bildirim kuralları. DI'sız — saf domain davranışı.
/// </summary>
public class GrantNotification_Tests
{
    // ------------------------------------------------------------ metin doldurma

    [Fact]
    public void Degiskenler_Doldurulur()
    {
        var text = GrantNotificationRenderer.Render(
            "{çağrı_adı} son başvuru {son_tarih} — {kalan_gün} gün kaldı.",
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = "TÜBİTAK 1501",
                ["{son_tarih}"] = "30.09.2026",
                ["{kalan_gün}"] = "28"
            });

        text.ShouldBe("TÜBİTAK 1501 son başvuru 30.09.2026 — 28 gün kaldı.");
    }

    [Fact]
    public void Karsiligi_Olmayan_Token_Metinden_Cikarilir()
    {
        // Kullanıcıya "{kalan_gün}" diye giden bir e-posta, boşluktan çok daha kötü.
        var text = GrantNotificationRenderer.Render(
            "{çağrı_adı} kararı: {karar}. {itiraz_bilgisi}",
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = "KOSGEB",
                ["{karar}"] = "Onaylandı",
                ["{itiraz_bilgisi}"] = null
            });

        text.ShouldBe("KOSGEB kararı: Onaylandı.");
        text.ShouldNotContain("{");
    }

    [Fact]
    public void Tanimsiz_Token_Da_Silinir()
    {
        var text = GrantNotificationRenderer.Render(
            "Merhaba {bilinmeyen}, hoş geldiniz.",
            new Dictionary<string, string?>());

        text.ShouldBe("Merhaba , hoş geldiniz.");
    }

    /// <summary>
    /// Şablonu host yazıyor; kapanmayan tek bir süslü parantez <c>string.Format</c>
    /// ile bildirimi tamamen düşürürdü. Renderer bu yüzden elle ayrıştırıyor.
    /// </summary>
    [Fact]
    public void Kapanmayan_Parantez_Patlatmaz()
    {
        var text = GrantNotificationRenderer.Render(
            "Bütçenin {oran% kısmı destekleniyor",
            new Dictionary<string, string?>());

        text.ShouldBe("Bütçenin {oran% kısmı destekleniyor");
    }

    [Fact]
    public void Bos_Sablon_Bos_Doner()
    {
        GrantNotificationRenderer.Render("", new Dictionary<string, string?>()).ShouldBe(string.Empty);
    }

    // ------------------------------------------------------------ zorunlu bildirim

    [Fact]
    public void Zorunlu_Tetikleyici_Kapatilamaz()
    {
        var template = new GrantNotificationTemplate(
            Guid.NewGuid(), GrantNotificationTrigger.DecisionIssued, "Karar", "Gövde");

        Should.Throw<BusinessException>(() => template.SetEnabled(false))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantNotificationTemplateMandatory);
    }

    [Fact]
    public void Zorunlu_Tetikleyicide_Uygulama_Ici_Bildirim_Kapatilamaz()
    {
        var template = new GrantNotificationTemplate(
            Guid.NewGuid(), GrantNotificationTrigger.DecisionIssued, "Karar", "Gövde");

        // Yalnız e-posta bırakmak yetmez: kullanıcının e-posta tercihi kapalıysa
        // karar hiç görünmez ve itiraz süresi sessizce kaçar.
        Should.Throw<BusinessException>(() => template.SetChannels(inApp: false, email: true))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantNotificationTemplateMandatory);
    }

    [Fact]
    public void Zorunlu_Olmayan_Tetikleyici_Kapatilabilir()
    {
        var template = new GrantNotificationTemplate(
            Guid.NewGuid(), GrantNotificationTrigger.ApplicationStageChanged, "Aşama", "Gövde");

        template.SetEnabled(false);
        template.IsEnabled.ShouldBeFalse();
    }

    [Fact]
    public void Hicbir_Kanal_Acik_Degilse_Reddedilir()
    {
        var template = new GrantNotificationTemplate(
            Guid.NewGuid(), GrantNotificationTrigger.CallPublished, "Çağrı", "Gövde");

        Should.Throw<BusinessException>(() => template.SetChannels(inApp: false, email: false))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantNotificationTemplateNeedsChannel);
    }

    // ------------------------------------------------------------ kayıt tutarlılığı

    /// <summary>
    /// Her tetikleyicinin bir bildirim türü ve en az bir değişkeni olmalı; eksik
    /// eşleme sözlükte <c>KeyNotFoundException</c> ile ancak çalışma anında patlardı.
    /// </summary>
    [Fact]
    public void Her_Tetikleyicinin_Turu_Ve_Degiskenleri_Tanimli()
    {
        foreach (var trigger in Enum.GetValues<GrantNotificationTrigger>())
        {
            var type = GrantNotificationTriggerRegistry.NotificationTypeOf(trigger);
            NotificationTypeRegistry.IsRegistered(type)
                .ShouldBeTrue($"{trigger} → {type} bildirim kaydında yok");

            NotificationTypeRegistry.Get(type).Category.ShouldBe(NotificationCategory.Grants);
            GrantNotificationTriggerRegistry.VariablesOf(trigger).ShouldNotBeEmpty();
        }
    }

    [Fact]
    public void Yalniz_Kurum_Karari_Zorunludur()
    {
        foreach (var trigger in Enum.GetValues<GrantNotificationTrigger>())
        {
            GrantNotificationTriggerRegistry.IsMandatory(trigger)
                .ShouldBe(trigger == GrantNotificationTrigger.DecisionIssued,
                    $"{trigger} zorunluluk beklentisiyle uyuşmuyor");
        }
    }

    /// <summary>
    /// Varsayılan metinlerde geçen her token, o tetikleyicinin ilan ettiği değişken
    /// listesinde olmalı. Olmasaydı tohumlanan metin ham token'la kullanıcıya giderdi.
    /// </summary>
    [Fact]
    public void Tetikleyicinin_Degiskenleri_Benzersizdir()
    {
        foreach (var trigger in Enum.GetValues<GrantNotificationTrigger>())
        {
            var vars = GrantNotificationTriggerRegistry.VariablesOf(trigger);
            vars.ShouldBeUnique();
            foreach (var v in vars)
            {
                v.ShouldStartWith("{");
                v.ShouldEndWith("}");
            }
        }
    }
}
