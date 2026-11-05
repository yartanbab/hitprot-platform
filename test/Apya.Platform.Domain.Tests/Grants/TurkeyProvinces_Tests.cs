using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>Bölge sözlüğünün bütünlüğü: 81 il, 26 ajans, çakışmayan yazım anahtarları.</summary>
public class TurkeyProvinces_Tests
{
    [Fact]
    public void Seksen_Bir_Il_Ve_Yirmi_Alti_Ajans_Var()
    {
        TurkeyProvinces.All.Count.ShouldBe(81);
        TurkeyProvinces.All.Select(p => p.PlateCode).OrderBy(x => x).ShouldBe(Enumerable.Range(1, 81));
        TurkeyProvinces.Agencies.Count.ShouldBe(26);
        TurkeyProvinces.Agencies.Select(a => a.RegionCode).Distinct().Count().ShouldBe(26);
    }

    [Fact]
    public void Her_Il_Var_Olan_Bir_Ajansa_Bagli_Ve_Her_Ajansin_Ili_Var()
    {
        var codes = TurkeyProvinces.Agencies.Select(a => a.Code).ToHashSet();
        TurkeyProvinces.All.ShouldAllBe(p => codes.Contains(p.AgencyCode));
        TurkeyProvinces.Agencies.ShouldAllBe(a => TurkeyProvinces.OfAgency(a.Code).Count > 0);
        TurkeyProvinces.OfAgency("OKA").Select(p => p.Name)
            .ShouldBe(new[] { "Amasya", "Çorum", "Samsun", "Tokat" }, ignoreOrder: true);
    }

    [Fact]
    public void Yazim_Anahtarlari_Cakismaz()
    {
        TurkeyProvinces.All.Select(p => TurkeyProvinces.Key(p.Name)).Distinct().Count().ShouldBe(81);
    }

    [Theory]
    [InlineData("istanbul", "İstanbul")]
    [InlineData("ISTANBUL", "İstanbul")]
    [InlineData("  izmir ", "İzmir")]
    [InlineData("sanliurfa", "Şanlıurfa")]
    [InlineData("IĞDIR", "Iğdır")]
    [InlineData("Igdir", "Iğdır")]
    [InlineData("kirikkale", "Kırıkkale")]
    public void Yazim_Farki_Resmi_Ada_Doner(string input, string expected)
    {
        TurkeyProvinces.Normalize(input).ShouldBe(expected);
    }

    [Fact]
    public void Taninmayan_Deger_Kirpilip_Oldugu_Gibi_Kalir()
    {
        TurkeyProvinces.Find("Doğu Karadeniz").ShouldBeNull();
        TurkeyProvinces.Normalize(" Doğu Karadeniz ").ShouldBe("Doğu Karadeniz");
    }

    [Fact]
    public void Bolge_Etiketi_Kurulurken_Resmi_Ada_Cevrilir_Diger_Turler_Dokunulmaz()
    {
        new GrantCriteriaTag(Guid.NewGuid(), Guid.NewGuid(), GrantCriteriaKind.Bolge, "istanbul").Value.ShouldBe("İstanbul");
        new FirmProfileTag(Guid.NewGuid(), Guid.NewGuid(), GrantCriteriaKind.Bolge, "ANKARA").Value.ShouldBe("Ankara");
        new GrantCriteriaTag(Guid.NewGuid(), Guid.NewGuid(), GrantCriteriaKind.AnahtarKelime, "istanbul").Value.ShouldBe("istanbul");
    }

    [Fact]
    public void Kayitta_Taninmayan_Il_Reddedilir()
    {
        var ex = Should.Throw<Volo.Abp.BusinessException>(() => ProvinceTagGuard.EnsureKnown(new[]
        {
            (GrantCriteriaKind.Bolge, (string?)"Ankara"),
            (GrantCriteriaKind.Bolge, (string?)"Orta Karadeniz")
        }));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantUnknownProvince);
        ex.Data["name"].ShouldBe("Orta Karadeniz");

        // Bölge dışındaki türler ve boş değerler denetlenmez.
        ProvinceTagGuard.EnsureKnown(new[]
        {
            (GrantCriteriaKind.AnahtarKelime, (string?)"Orta Karadeniz"),
            (GrantCriteriaKind.Bolge, (string?)" ")
        });
    }

    /// <summary>
    /// Katalog tohumlarındaki her bölge değeri il adı olmalı: tanınmayan değer bölge
    /// şartı koydurmaz ve program, bölgesi dışındaki kurumlara da "uygun" görünür.
    /// </summary>
    [Fact]
    public void Katalog_Tohumlarindaki_Her_Bolge_Il_Adidir()
    {
        var dir = FindSeedDirectory();
        var unknown = Directory.GetFiles(dir, "*.json")
            .SelectMany(file =>
            {
                using var doc = JsonDocument.Parse(File.ReadAllText(file));
                return doc.RootElement.EnumerateArray()
                    .Where(g => g.TryGetProperty("regions", out var r) && r.ValueKind == JsonValueKind.Array)
                    .SelectMany(g => g.GetProperty("regions").EnumerateArray().Select(v => v.GetString() ?? ""))
                    .Where(v => TurkeyProvinces.Find(v) == null)
                    .Select(v => $"{Path.GetFileName(file)}: {v}")
                    .ToList();
            })
            .ToList();

        unknown.ShouldBeEmpty();
    }

    private static string FindSeedDirectory()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null && !Directory.Exists(Path.Combine(dir.FullName, "src", "Apya.Platform.Domain", "Grants", "SeedData")))
        {
            dir = dir.Parent;
        }
        dir.ShouldNotBeNull();
        return Path.Combine(dir!.FullName, "src", "Apya.Platform.Domain", "Grants", "SeedData");
    }
}
