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
}
