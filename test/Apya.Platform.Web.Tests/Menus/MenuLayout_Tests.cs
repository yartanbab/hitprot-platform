using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Settings;
using Apya.Platform.Web.Menus;
using Shouldly;
using Xunit;

namespace Apya.Platform.Menus;

/// <summary>
/// Menü düzeni ayarının ayrıştırma/normalizasyon sözleşmesi.
///
/// Değer TARAYICIDAN gelir: bozuk, şişirilmiş veya manipüle edilmiş bir yük
/// menüyü çökertmemeli. Beklenen davranış her koşulda "boş düzene düş" ya da
/// "kırp" — asla istisna değil.
/// </summary>
public class MenuLayout_Tests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("{bozuk json")]
    [InlineData("[1,2,3]")]
    public void Parse_InvalidValue_FallsBackToEmptyLayout(string? raw)
    {
        var layout = MenuLayout.Parse(raw);

        layout.IsEmpty.ShouldBeTrue();
    }

    [Fact]
    public void Parse_OversizedRawValue_IsRejectedBeforeDeserialization()
    {
        var padding = new string('x', PlatformSettingDefaults.ShellMenuLayoutMaxChars);
        var raw = $$"""{"sections":["Apya.Work"],"pad":"{{padding}}"}""";

        MenuLayout.Parse(raw).IsEmpty.ShouldBeTrue();
    }

    [Fact]
    public void Parse_ReadsAllFields()
    {
        var layout = MenuLayout.Parse("""
            {"sections":["Apya.Work","Apya.Finance"],
             "settingsOrder":["Apya.Admin.Users","Apya.AiCenter"],
             "items":{"Apya.Work":["Apya.Work.Projects"]}}
            """);

        layout.IsEmpty.ShouldBeFalse();
        layout.Sections.ShouldBe(new[] { "Apya.Work", "Apya.Finance" });
        layout.SettingsOrder.ShouldBe(new[] { "Apya.Admin.Users", "Apya.AiCenter" });
        layout.Items["Apya.Work"].ShouldBe(new[] { "Apya.Work.Projects" });
    }

    [Fact]
    public void Normalize_TrimsDeduplicatesAndDropsBlankNames()
    {
        var layout = MenuLayout.Normalize(new MenuLayout
        {
            Sections = new List<string> { " Apya.Work ", "Apya.Work", "", "   ", "Apya.Finance" }
        });

        layout.Sections.ShouldBe(new[] { "Apya.Work", "Apya.Finance" });
    }

    /// <summary>
    /// Bir ad yalnız TEK bir yerde durabilir — yoksa aynı öğe iki sütunda birden
    /// görünürdü. Tarayıcı böyle bir yük üretmez; kural manipüle edilmiş istek için.
    /// </summary>
    [Fact]
    public void Normalize_NameCanAppearInOnlyOnePlace()
    {
        var layout = MenuLayout.Normalize(new MenuLayout
        {
            Sections = new List<string> { "Apya.Finance" },
            SettingsOrder = new List<string> { "Apya.Finance", "Apya.Admin.Users" },
            Items = new Dictionary<string, List<string>>
            {
                ["Apya.Work"] = new() { "Apya.Finance", "Apya.Work.Projects" }
            }
        });

        layout.Sections.ShouldBe(new[] { "Apya.Finance" });
        layout.SettingsOrder.ShouldBe(new[] { "Apya.Admin.Users" });
        layout.Items["Apya.Work"].ShouldBe(new[] { "Apya.Work.Projects" });
    }

    [Fact]
    public void Normalize_CapsListLength()
    {
        var tooMany = Enumerable
            .Range(0, PlatformSettingDefaults.ShellMenuLayoutListMax + 25)
            .Select(i => "Apya.Item" + i)
            .ToList();

        var layout = MenuLayout.Normalize(new MenuLayout { Sections = tooMany });

        layout.Sections.Count.ShouldBe(PlatformSettingDefaults.ShellMenuLayoutListMax);
    }

    [Fact]
    public void Normalize_CapsGroupCountAndDropsOverlongNames()
    {
        var items = new Dictionary<string, List<string>>();
        for (var i = 0; i < PlatformSettingDefaults.ShellMenuLayoutGroupMax + 10; i++)
        {
            items["Apya.Group" + i] = new List<string> { "Apya.Group" + i + ".Child" };
        }
        items[new string('x', PlatformSettingDefaults.ShellMenuLayoutNameMax + 1)] =
            new List<string> { "Apya.Whatever" };

        var layout = MenuLayout.Normalize(new MenuLayout { Items = items });

        layout.Items.Count.ShouldBe(PlatformSettingDefaults.ShellMenuLayoutGroupMax);
        layout.Items.Keys.ShouldAllBe(k => k.Length <= PlatformSettingDefaults.ShellMenuLayoutNameMax);
    }

    [Fact]
    public void Normalize_ChildlessGroupKeyIsDropped()
    {
        var layout = MenuLayout.Normalize(new MenuLayout
        {
            Items = new Dictionary<string, List<string>> { ["Apya.Work"] = new() }
        });

        layout.Items.ShouldNotContainKey("Apya.Work");
    }

    [Fact]
    public void Serialize_RoundTrips()
    {
        var original = new MenuLayout
        {
            Sections = new List<string> { "Apya.Finance", "Apya.Work" },
            SettingsOrder = new List<string> { "Apya.AiCenter", "Apya.Admin.Users" },
            Items = new Dictionary<string, List<string>>
            {
                ["Apya.Finance"] = new() { "Apya.Finance.Hub", "Apya.Finance.CashAccounts" }
            }
        };

        var restored = MenuLayout.Parse(original.Serialize());

        restored.Sections.ShouldBe(original.Sections);
        restored.SettingsOrder.ShouldBe(original.SettingsOrder);
        restored.Items["Apya.Finance"].ShouldBe(original.Items["Apya.Finance"]);
    }

    /// <summary>
    /// Katalog anahtarları düzen ayarında kimlik olarak saklanıyor ve LeptonX
    /// bunları `id="MenuItem_Apya_Admin_Tenants"` biçiminde basıyor;
    /// apya-sidebar-shell.js adı `_` → `.` çevirisiyle geri okuyor. Ada alt
    /// çizgi girerse o çeviri sessizce bozulur (sabitleme/rozet kaybolur).
    /// </summary>
    [Fact]
    public void AdminLinkNames_AreUnique_AndContainNoUnderscore()
    {
        var names = PlatformAdminLinks.All.Select(x => x.Name).ToList();

        names.ShouldBeUnique();
        names.ShouldAllBe(n => !n.Contains('_'));
    }

    /// <summary>
    /// Yazma ve okuma yolu boyut sınırında ANLAŞMALI. Normalize'ın izin verdiği
    /// üst sınırlar ham uzunluk sınırından çok daha büyük bir JSON üretebiliyor;
    /// Serialize kırpmasaydı ayar kaydedilir, sonraki Parse onu reddeder ve
    /// kullanıcının düzeni sessizce kaybolurdu.
    /// </summary>
    [Fact]
    public void Serialize_Output_IsAlwaysAcceptedByParse()
    {
        var layout = new MenuLayout();
        for (var g = 0; g < PlatformSettingDefaults.ShellMenuLayoutGroupMax; g++)
        {
            var children = new List<string>();
            for (var c = 0; c < PlatformSettingDefaults.ShellMenuLayoutListMax; c++)
            {
                children.Add("Apya.G" + g + ".Child" + c + new string('x', 60));
            }
            layout.Items["Apya.Group" + g] = children;
        }

        var json = layout.Serialize();

        json.Length.ShouldBeLessThanOrEqualTo(PlatformSettingDefaults.ShellMenuLayoutMaxChars);
        // Asıl sözleşme: yazılan değer geri okunabilmeli (boş düzene düşmemeli).
        MenuLayout.Parse(json).IsEmpty.ShouldBeFalse();
    }
// ── Özel kategori / kısayol ─────────────────────────────────────────────

    /// <summary>
    /// Özel ad ayrılmış ön ekle başlamalı ve yalnız alfasayısal son ek almalı.
    /// Alt çizgi ÖZELLİKLE yasak: LeptonX id'yi MenuItem_Apya_User_ab12 diye
    /// basıyor, kabuk JS'i alt çizgiyi noktaya çevirerek adı geri okuyor.
    /// </summary>
    [Theory]
    [InlineData("Apya.Work")]              // ayrılmış ad alanı dışında
    [InlineData("Apya.User.")]             // son ek yok
    [InlineData("Apya.User.ab_12")]        // alt çizgi
    [InlineData("Apya.User.ab-12")]        // tire
    [InlineData("Apya.User.ab 12")]        // boşluk
    [InlineData("")]
    public void Normalize_RejectsInvalidCustomName(string name)
    {
        var layout = MenuLayout.Normalize(new MenuLayout
        {
            Groups = new List<MenuLayoutGroup> { new() { Name = name, Title = "Deneme" } }
        });

        layout.Groups.ShouldBeEmpty();
    }

    [Fact]
    public void Normalize_AcceptsValidCustomGroup()
    {
        var layout = MenuLayout.Normalize(new MenuLayout
        {
            Groups = new List<MenuLayoutGroup>
            {
                new() { Name = "Apya.User.ab12", Title = "  Günlük  ", Icon = "fa fa-star" }
            }
        });

        layout.Groups.Single().Name.ShouldBe("Apya.User.ab12");
        layout.Groups.Single().Title.ShouldBe("Günlük");
        layout.Groups.Single().Icon.ShouldBe("fa fa-star");
    }

    /// <summary>
    /// İkon doğrudan class attribute'una basılıyor: beyaz liste dışı değer
    /// sayfaya rastgele sınıf enjekte etme yüzeyi olurdu.
    /// </summary>
    [Theory]
    [InlineData("fa fa-skull-crossbones")]
    [InlineData("apya-navedit-btn")]
    [InlineData("")]
    [InlineData(null)]
    public void Normalize_UnknownIconFallsBackToDefault(string? icon)
    {
        var layout = MenuLayout.Normalize(new MenuLayout
        {
            Groups = new List<MenuLayoutGroup>
            {
                new() { Name = "Apya.User.ab12", Title = "Deneme", Icon = icon! }
            }
        });

        layout.Groups.Single().Icon.ShouldBe(MenuIcons.Default);
    }

    /// <summary>Kısayol yalnız site içi yola gidebilir — dış adres elenir.</summary>
    [Theory]
    [InlineData("https://baska-site.example/x", "")]
    [InlineData("//baska-site.example/x", "")]
    [InlineData("javascript:alert(1)", "")]
    [InlineData("Tasks", "")]
    [InlineData("/Tasks?gecikmis=1", "/Tasks?gecikmis=1")]
    public void Normalize_LinkUrlMustBeSitePath(string url, string expected)
    {
        var layout = MenuLayout.Normalize(new MenuLayout
        {
            Links = new List<MenuLayoutLink>
            {
                new() { Name = "Apya.User.ab12", Title = "Kısayol", Url = url }
            }
        });

        if (expected.Length == 0) { layout.Links.ShouldBeEmpty(); }
        else { layout.Links.Single().Url.ShouldBe(expected); }
    }

    [Fact]
    public void Normalize_CapsCustomCounts()
    {
        var groups = Enumerable.Range(0, PlatformSettingDefaults.ShellMenuLayoutCustomGroupMax + 5)
            .Select(i => new MenuLayoutGroup { Name = "Apya.User.g" + i, Title = "G" + i })
            .ToList();
        var links = Enumerable.Range(0, PlatformSettingDefaults.ShellMenuLayoutCustomLinkMax + 5)
            .Select(i => new MenuLayoutLink { Name = "Apya.User.l" + i, Title = "L" + i, Url = "/x" })
            .ToList();

        var layout = MenuLayout.Normalize(new MenuLayout { Groups = groups, Links = links });

        layout.Groups.Count.ShouldBe(PlatformSettingDefaults.ShellMenuLayoutCustomGroupMax);
        layout.Links.Count.ShouldBe(PlatformSettingDefaults.ShellMenuLayoutCustomLinkMax);
    }

    /// <summary>
    /// Gizleme YERLEŞİMDEN bağımsız: bir ad hem bir sırada hem gizlide olabilir,
    /// tekillik havuzuna katılmamalı.
    /// </summary>
    [Fact]
    public void Normalize_HiddenIsIndependentOfPlacement()
    {
        var layout = MenuLayout.Normalize(new MenuLayout
        {
            Sections = new List<string> { "Apya.Work" },
            Hidden = new List<string> { "Apya.Work" }
        });

        layout.Sections.ShouldBe(new[] { "Apya.Work" });
        layout.Hidden.ShouldBe(new[] { "Apya.Work" });
    }

    /// <summary>
    /// Boyut kırpması yeni alanları da kapsamalı. Yalnız Items azaltılsaydı,
    /// Items bitince döngü çıkar ve sınırı aşan JSON dönerdi — kaydedilir ama
    /// bir sonraki okumada reddedilir, yani düzen sessizce kaybolur.
    /// </summary>
    [Fact]
    public void Serialize_TrimsCustomEntriesWhenStillTooLong()
    {
        var layout = new MenuLayout();
        for (var i = 0; i < PlatformSettingDefaults.ShellMenuLayoutCustomLinkMax; i++)
        {
            layout.Links.Add(new MenuLayoutLink
            {
                Name = "Apya.User.l" + i,
                Title = new string('t', PlatformSettingDefaults.ShellMenuLayoutTitleMax),
                Url = "/" + new string('u', PlatformSettingDefaults.ShellMenuLayoutUrlMax - 1)
            });
        }
        for (var i = 0; i < PlatformSettingDefaults.ShellMenuLayoutListMax; i++)
        {
            layout.Hidden.Add("Apya.Hidden" + i + new string('x', 100));
        }

        var json = layout.Serialize();

        json.Length.ShouldBeLessThanOrEqualTo(PlatformSettingDefaults.ShellMenuLayoutMaxChars);
        MenuLayout.Parse(json).IsEmpty.ShouldBeFalse();
    }

    /// <summary>İkon beyaz listesi boş olamaz ve varsayılanı içermeli.</summary>
    [Fact]
    public void IconWhitelist_ContainsDefault()
    {
        MenuIcons.All.ShouldNotBeEmpty();
        MenuIcons.All.ShouldContain(MenuIcons.Default);
        MenuIcons.All.ShouldBeUnique();
    }
}
