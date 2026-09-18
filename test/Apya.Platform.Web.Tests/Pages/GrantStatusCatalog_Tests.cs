using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Web.Pages.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Durum sözlüğünün sözleşmesi: enum → rozet tonu haritası sunucuda tek yerde durur
/// (<see cref="GrantStatusCatalog"/>), sayfa JS'i onu <c>apyaGrantStatus</c> olarak okur.
///
/// <para>Bu testler üç sessiz kırılma yolunu kapatır:</para>
/// <list type="number">
/// <item>Enum'a değer eklenir, tonu yazılmaz → rozet tonsuz kalır.</item>
/// <item>JS sözlükte olmayan bir ad okur (<c>apyaGrantStatus.dilim</c>) → <c>undefined</c>.</item>
/// <item>Sayfa <c>_StatusMap</c> partial'ını eklemeyi unutur → JS'te <c>undefined.keys</c>.</item>
/// </list>
/// </summary>
public class GrantStatusCatalog_Tests
{
    private static string FindGrantsDir()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Apya.Platform.Web", "Pages", "Grants");
            if (Directory.Exists(candidate)) { return candidate; }
            dir = dir.Parent;
        }

        return null;
    }

    /// <summary>Her enum değerinin tonu olmalı; eksikse Build() zaten patlar.</summary>
    [Fact]
    public void Sozlukteki_her_girisin_anahtari_ve_tonu_esit_sayida()
    {
        var map = GrantStatusCatalog.Build();

        map.Count.ShouldBeGreaterThan(0);

        foreach (var (name, entry) in map)
        {
            entry.Keys.Length.ShouldBeGreaterThan(0, $"'{name}' girişinde hiç enum adı yok.");
            entry.Tones.Length.ShouldBe(entry.Keys.Length,
                $"'{name}' girişinde ton sayısı enum değeri sayısıyla eşleşmiyor.");
            entry.Tones.ShouldAllBe(t => !string.IsNullOrWhiteSpace(t),
                $"'{name}' girişinde boş ton var.");
        }
    }

    /// <summary>
    /// Tonlar rozet sınıfına çevriliyor (<c>apya-chip-&lt;ton&gt;</c>); tema köprüsünde
    /// karşılığı olmayan bir ton yazılırsa rozet renksiz çıkar.
    /// </summary>
    [Fact]
    public void Tonlar_tanimli_rozet_setinden_secilir()
    {
        var allowed = new[] { "positive", "negative", "warning", "brand", "accent", "neutral", "ai" };

        foreach (var (name, entry) in GrantStatusCatalog.Build())
        {
            foreach (var tone in entry.Tones)
            {
                allowed.ShouldContain(tone,
                    $"'{name}' girişinde tanımsız ton: {tone}. apya-chip-* setine bak.");
            }
        }
    }

    /// <summary>
    /// İstemciye giden JSON'un şekli: JS <c>apyaGrantStatus.&lt;ad&gt;.keys/.tones</c> okuyor.
    /// Serileştirme politikası değişirse (örn. camelCase kalkarsa) her hibe sayfası
    /// <c>undefined.keys</c> ile açılışta patlar — testsiz fark edilmezdi.
    /// </summary>
    [Fact]
    public void Json_ciktisi_camelCase_keys_ve_tones_tasir()
    {
        var json = GrantStatusCatalog.ToJson();

        json.ShouldContain("\"interest\"", Case.Sensitive);
        json.ShouldContain("\"keys\"", Case.Sensitive, "JS 'keys' okuyor.");
        json.ShouldContain("\"tones\"", Case.Sensitive, "JS 'tones' okuyor.");
        json.ShouldNotContain("\"Keys\"", Case.Sensitive, "PascalCase sızmış: camelCase politikası düşmüş.");

        // Script etiketinin içine gömülüyor: kapanış etiketi kaçırılmadan yazılmamalı.
        json.ShouldNotContain("</", Case.Sensitive);
    }

    /// <summary>JS'in okuduğu her ad sözlükte olmalı.</summary>
    [Fact]
    public void Js_yalniz_sozlukte_olan_adlari_okur()
    {
        var dir = FindGrantsDir();
        dir.ShouldNotBeNull("Pages/Grants bulunamadı; test yolu bozulmuş olabilir.");

        var known = GrantStatusCatalog.Build().Keys.ToList();
        var used = new HashSet<string>(StringComparer.Ordinal);

        foreach (var js in Directory.GetFiles(dir, "*.js"))
        {
            foreach (Match m in Regex.Matches(File.ReadAllText(js), @"apyaGrantStatus\.([A-Za-z]+)"))
            {
                used.Add(m.Groups[1].Value);
            }
        }

        // Sözlük kullanılmıyorsa test anlamsızdır; bunu da yakala.
        used.Count.ShouldBeGreaterThan(0, "Hiçbir hibe JS'i apyaGrantStatus okumuyor.");

        foreach (var name in used)
        {
            known.ShouldContain(name,
                $"JS '{name}' adını okuyor ama GrantStatusCatalog.Build() içinde yok.");
        }
    }

    /// <summary>
    /// Etiketi sözlük anahtarından kurulan enum'larda (<c>l('Grants:Stage:' + keys[v])</c>)
    /// her anahtarın yerelleştirme karşılığı olmalı — yoksa ABP istisna atmaz, ham anahtarı basar.
    ///
    /// <para>Bu, silinen <c>GrantTrancheStatusJs_Tests</c>'in korumaya değer tek parçasıydı:
    /// dizi sırası artık <see cref="Enum.GetNames{TEnum}()"/>'den geldiği için kayamaz,
    /// ama anahtarın json'da karşılığı olup olmadığı hâlâ denetimsizdi.</para>
    /// </summary>
    [Theory]
    [InlineData("tranche", "Grants:Tranche:")]
    [InlineData("stage", "Grants:Stage:")]
    [InlineData("decision", "Grants:Decision:Outcome:")]
    [InlineData("activity", "Grants:DetailHost:Activity:")]
    public void Etiketi_anahtardan_kurulan_enumlarin_yerellestirmesi_tam(string entryName, string prefix)
    {
        var trPath = FindLocalization("tr.json");
        trPath.ShouldNotBeNull("tr.json bulunamadı.");

        var tr = File.ReadAllText(trPath);
        var entry = GrantStatusCatalog.Build()[entryName];

        foreach (var key in entry.Keys)
        {
            tr.ShouldContain($"\"{prefix}{key}\"", Case.Sensitive,
                $"{prefix}{key} anahtarı tr.json'da yok; ekranda ham anahtar görünür.");
        }
    }

    private static string FindLocalization(string fileName)
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(
                dir.FullName, "src", "Apya.Platform.Domain.Shared", "Localization", "Platform", fileName);
            if (File.Exists(candidate)) { return candidate; }
            dir = dir.Parent;
        }

        return null;
    }

    /// <summary>
    /// Sözlüğü okuyan her JS'in sayfası <c>_StatusMap</c> partial'ını basmalı;
    /// yoksa sayfa açılışta <c>undefined.keys</c> ile patlar.
    /// </summary>
    [Fact]
    public void Sozlugu_okuyan_her_sayfa_StatusMap_partialini_basar()
    {
        var dir = FindGrantsDir();
        dir.ShouldNotBeNull("Pages/Grants bulunamadı.");

        var views = Directory.GetFiles(dir, "*.cshtml")
            .ToDictionary(p => p, File.ReadAllText);

        var consumers = Directory.GetFiles(dir, "*.js")
            .Where(p => File.ReadAllText(p).Contains("apyaGrantStatus", StringComparison.Ordinal))
            .Select(Path.GetFileName)
            .ToList();

        consumers.Count.ShouldBeGreaterThan(0, "Sözlüğü okuyan hiç JS yok.");

        foreach (var js in consumers)
        {
            var hosts = views
                .Where(v => v.Value.Contains($"/Pages/Grants/{js}", StringComparison.Ordinal))
                .Select(v => v.Key)
                .ToList();

            hosts.Count.ShouldBeGreaterThan(0, $"{js} hiçbir sayfadan yüklenmiyor — ölü dosya mı?");

            foreach (var host in hosts)
            {
                views[host].ShouldContain("_StatusMap", Case.Sensitive,
                    $"{Path.GetFileName(host)} {js} dosyasını yüklüyor ama _StatusMap partial'ını basmıyor.");
            }
        }
    }
}
