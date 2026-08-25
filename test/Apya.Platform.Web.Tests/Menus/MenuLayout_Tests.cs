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
             "items":{"Apya.Work":["Apya.Work.Projects"]},
             "toSidebar":["Apya.Admin.Tenants"],
             "toSettings":["Apya.Platform.Consents"],
             "settingsOrder":["Apya.Admin.Users"]}
            """);

        layout.IsEmpty.ShouldBeFalse();
        layout.Sections.ShouldBe(new[] { "Apya.Work", "Apya.Finance" });
        layout.Items["Apya.Work"].ShouldBe(new[] { "Apya.Work.Projects" });
        layout.ToSidebar.ShouldBe(new[] { "Apya.Admin.Tenants" });
        layout.ToSettings.ShouldBe(new[] { "Apya.Platform.Consents" });
        layout.SettingsOrder.ShouldBe(new[] { "Apya.Admin.Users" });
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

    /// <summary>
    /// Aynı ad iki yönde birden gelirse (yalnız manipüle edilmiş yükte mümkün)
    /// davranış deterministik olmalı: Ayarlar tarafı kazanır.
    /// </summary>
    [Fact]
    public void Normalize_NameCannotBeInBothDirections()
    {
        var layout = MenuLayout.Normalize(new MenuLayout
        {
            ToSidebar = new List<string> { "Apya.Admin.Tenants", "Apya.Admin.Users" },
            ToSettings = new List<string> { "Apya.Admin.Tenants" }
        });

        layout.ToSidebar.ShouldBe(new[] { "Apya.Admin.Users" });
        layout.ToSettings.ShouldBe(new[] { "Apya.Admin.Tenants" });
    }

    [Fact]
    public void Serialize_RoundTrips()
    {
        var original = new MenuLayout
        {
            Sections = new List<string> { "Apya.Finance", "Apya.Work" },
            Items = new Dictionary<string, List<string>>
            {
                ["Apya.Finance"] = new() { "Apya.Finance.Hub", "Apya.Finance.CashAccounts" }
            },
            ToSidebar = new List<string> { "Apya.Admin.Roles" },
            ToSettings = new List<string> { "Apya.Platform.Consents" },
            SettingsOrder = new List<string> { "Apya.Platform.Consents", "Apya.Admin.Users" }
        };

        var restored = MenuLayout.Parse(original.Serialize());

        restored.Sections.ShouldBe(original.Sections);
        restored.Items["Apya.Finance"].ShouldBe(original.Items["Apya.Finance"]);
        restored.ToSidebar.ShouldBe(original.ToSidebar);
        restored.ToSettings.ShouldBe(original.ToSettings);
        restored.SettingsOrder.ShouldBe(original.SettingsOrder);
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
}
