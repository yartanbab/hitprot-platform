using System.Collections.Generic;
using Apya.Platform.Settings;
using Apya.Platform.Web.Menus;
using Shouldly;
using Xunit;

namespace Apya.Platform.Menus;

/// <summary>
/// Menü düzeninin SESSİZ KAYIP yüzeyleri — kod incelemesinde çıkan üç delik.
///
/// Ortak tema: değer kabul edilir, kaydedilir, kullanıcı "kaydedildi" görür ve
/// kaybı ancak menüde fark eder. Buradaki testler o üç yolu kapatıyor:
/// boyut kırpması, protokol-göreli hedef ve tek bozuk girdinin listeyi düşürmesi.
/// </summary>
public class MenuLayoutHardening_Tests
{
    /// <summary>Sınırı tek başına aşacak kadar uzun bir yerleşim listesi üretir.</summary>
    private static void FillPlacementLists(MenuLayout layout)
    {
        var fill = new string('x', PlatformSettingDefaults.ShellMenuLayoutNameMax - 20);
        for (var i = 0; i < PlatformSettingDefaults.ShellMenuLayoutListMax; i++)
        {
            layout.Sections.Add("Apya.Sec" + i + fill);
            layout.SettingsOrder.Add("Apya.Set" + i + fill);
        }
    }

    private static MenuLayoutLink Link(string name, string url)
    {
        return new MenuLayoutLink
        {
            Name = name,
            Title = "Kısayol",
            Icon = MenuIcons.Default,
            Url = url
        };
    }

    /// <summary>
    /// Yerleşim listeleri de küçültme zincirinde olmak ZORUNDA. Sections ve
    /// SettingsOrder tek başlarına sınırı ikiye katlayabiliyor (60 ad × 128
    /// karakter × 2 ≈ 15,7 KB > 8 KB); zincir onları atlarsa Serialize sınır
    /// ÜSTÜ bir değer döndürür, ayar sorunsuz kaydedilir ve sonraki okumada
    /// Parse uzunluk kontrolünde reddedip kullanıcının düzenini TÜMÜYLE siler.
    /// </summary>
    [Fact]
    public void Serialize_ShrinksPlacementLists_WhenTheyAloneExceedTheCap()
    {
        var layout = new MenuLayout();
        FillPlacementLists(layout);

        var json = layout.Serialize();

        json.Length.ShouldBeLessThanOrEqualTo(PlatformSettingDefaults.ShellMenuLayoutMaxChars);
        // Asıl sözleşme: yazılan değer geri okunabilmeli.
        MenuLayout.Parse(json).IsEmpty.ShouldBeFalse();
    }

    /// <summary>
    /// Feda sırası: yerleşim tercihleri ÖNCE, kullanıcının yazdığı veri SONRA.
    /// Bir sıralama kaybolunca öğe koddaki yerine döner; bir kısayol kaybolunca
    /// kullanıcının girdiği ad + ikon + hedef yok olur.
    /// </summary>
    [Fact]
    public void Serialize_DropsPlacementBeforeUserAuthoredEntries()
    {
        var layout = new MenuLayout();
        FillPlacementLists(layout);
        layout.Links.Add(Link("Apya.User.abc123", "/Tasks"));

        var restored = MenuLayout.Parse(layout.Serialize());

        restored.Links.Count.ShouldBe(1);
        restored.Links[0].Url.ShouldBe("/Tasks");
    }

    /// <summary>
    /// "/" ile başlamak YETMEZ. Tarayıcı özel şemalarda ters bölüyü eğik çizgiye
    /// normalize ediyor: "/\evil.example" mutlak URI değildir, "/" ile başlar ve
    /// "//" ile başlamaz — üç kontrolden de geçer, ama tarayıcıda
    /// "//evil.example" olarak çözülüp BAŞKA BİR ORIGIN'e gider. Araya sıkışan
    /// sekme/satır sonu da URL'den atıldığı için aynı sonucu verir.
    /// </summary>
    [Theory]
    [InlineData("/\\evil.example")]
    [InlineData("/\\/evil.example")]
    [InlineData("/\tevil.example")]
    [InlineData("/\n/evil.example")]
    [InlineData("//evil.example")]
    [InlineData("https://evil.example/x")]
    public void Normalize_RejectsOffOriginShortcutTargets(string url)
    {
        var layout = new MenuLayout();
        layout.Links.Add(Link("Apya.User.abc123", url));

        MenuLayout.Normalize(layout).Links.ShouldBeEmpty();
    }

    /// <summary>Sıradan site içi yol elenmemeli — kural fazla geniş olmamalı.</summary>
    [Theory]
    [InlineData("/Tasks")]
    [InlineData("/Projects?view=list")]
    [InlineData("/Reports/ProjectBudget")]
    public void Normalize_KeepsSitePaths(string url)
    {
        var layout = new MenuLayout();
        layout.Links.Add(Link("Apya.User.abc123", url));

        MenuLayout.Normalize(layout).Links.ShouldHaveSingleItem().Url.ShouldBe(url);
    }

    /// <summary>
    /// Tek bir bozuk girdi listenin KALANINI düşürmemeli (döngüde `continue`),
    /// geçersiz hedefli kısayol da adet tavanından yer HARCAMAMALI (filtre
    /// döngünün İÇİNDE). İkisi de sessiz kayıp yolu.
    /// </summary>
    [Fact]
    public void Normalize_SkipsInvalidEntriesWithoutDroppingTheRest()
    {
        var layout = new MenuLayout();
        layout.Links.Add(Link("Apya.User.bad1", "https://evil.example/x"));
        layout.Links.Add(null!);
        layout.Links.Add(Link("Apya.User.ok1", "/Tasks"));

        var cleaned = MenuLayout.Normalize(layout).Links;

        cleaned.ShouldHaveSingleItem().Name.ShouldBe("Apya.User.ok1");
    }

    /// <summary>
    /// Geçersiz kısayollar tavanı yememeli: tavan kadar bozuk girdiden sonra
    /// gelen geçerli kayıt yine de yerleşmeli.
    /// </summary>
    [Fact]
    public void Normalize_InvalidLinksDoNotConsumeTheQuota()
    {
        var layout = new MenuLayout();
        for (var i = 0; i < PlatformSettingDefaults.ShellMenuLayoutCustomLinkMax; i++)
        {
            layout.Links.Add(Link("Apya.User.bad" + i, "https://evil.example/" + i));
        }
        layout.Links.Add(Link("Apya.User.ok1", "/Tasks"));

        MenuLayout.Normalize(layout).Links.ShouldHaveSingleItem().Name.ShouldBe("Apya.User.ok1");
    }
}
