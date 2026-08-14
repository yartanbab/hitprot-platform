using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Zaman çizelgesi bileşeni (wwwroot/js/apya-gantt.js) metinlerini
/// abp.localization.getResource('Platform') üzerinden alır. Bir anahtar
/// localization'da yoksa ABP İSTİSNA ATMAZ — anahtarın kendisini döndürür ve
/// ekranda "Tasks:Timeline:Zoom" yazar. JS tarafı hiçbir .NET testinde
/// çalışmadığı için bu sessizce geçer.
///
/// Bu test JS dosyasını OKUYUP içindeki l('...') anahtarlarını çıkarır ve
/// hepsinin çözüldüğünü doğrular. Böylece JS ile json arasındaki isim kayması
/// (yeni anahtar eklenip json'a yazılmaması, ya da json'dan silinmesi)
/// otomatik yakalanır — elle güncellenen bir liste değildir.
/// </summary>
public class GanttLocalization_Tests : PlatformWebTestBase
{
    private readonly IStringLocalizer<PlatformResource> _localizer;

    public GanttLocalization_Tests()
    {
        _localizer = GetRequiredService<IStringLocalizer<PlatformResource>>();
    }

    private static string FindGanttJs()
    {
        // Test çıktısından yukarı çıkıp repo kökünü bul.
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Apya.Platform.Web", "wwwroot", "js", "apya-gantt.js");
            if (File.Exists(candidate)) { return candidate; }
            dir = dir.Parent;
        }

        return null;
    }

    private static List<string> ExtractKeys(string source)
    {
        // (?<![\w$.]) — `.html('...')` gibi çağrılar da "l('" ile bitiyor;
        // sınır olmadan onlar da anahtar sanılıyordu (bu test onu yakaladı).
        return Regex.Matches(source, @"(?<![\w$.])l\('([^']+)'")
            .Select(m => m.Groups[1].Value)
            .Distinct()
            .OrderBy(k => k, StringComparer.Ordinal)
            .ToList();
    }

    [Fact]
    public void Gantt_bilesenindeki_tum_localization_anahtarlari_cozulur()
    {
        var path = FindGanttJs();

        // Dosya bulunamazsa test SESSİZCE geçmemeli — aksi halde hiçbir şey ölçmez.
        path.ShouldNotBeNull("apya-gantt.js bulunamadı; test yolu bozulmuş olabilir.");

        var keys = ExtractKeys(File.ReadAllText(path));

        // Bileşen localization kullanmayı bıraktıysa da haberimiz olsun.
        keys.Count.ShouldBeGreaterThan(20, "apya-gantt.js'te beklenenden az l('...') çağrısı var.");

        var missing = keys.Where(k => _localizer[k].ResourceNotFound).ToList();

        missing.ShouldBeEmpty(
            "Şu anahtarlar localization'da YOK — ekranda anahtarın kendisi görünür: " +
            string.Join(", ", missing));
    }

    /// <summary>
    /// Yukarıdaki testin boş olmadığının kanıtı: olmayan bir anahtar gerçekten
    /// ResourceNotFound ile işaretleniyor mu?
    /// </summary>
    [Fact]
    public void Olmayan_anahtar_ResourceNotFound_ile_isaretlenir()
    {
        _localizer["Tasks:Timeline:BoyleBirAnahtarYok"].ResourceNotFound.ShouldBeTrue();
    }

    /// <summary>
    /// Parametreli anahtarlar {0}/{1} yer tutucusunu korumalı — JS tarafı
    /// l(key, arg) ile dolduruyor, yer tutucu kaybolursa sayı ekranda hiç görünmez.
    /// </summary>
    [Theory]
    [InlineData("Tasks:Timeline:PendingCount", 1)]
    [InlineData("Tasks:Timeline:LaneMeta", 2)]
    [InlineData("Tasks:Timeline:OverflowWarning", 1)]
    [InlineData("Tasks:Timeline:CapacityHead", 1)]
    [InlineData("Tasks:Timeline:CapacityCell", 1)]
    [InlineData("Tasks:Timeline:Legend:Today", 1)]
    [InlineData("Tasks:Timeline:DatesUpdated", 1)]
    public void Parametreli_anahtarlar_yer_tutucularini_tasir(string key, int placeholderCount)
    {
        var value = _localizer[key].Value;

        for (var i = 0; i < placeholderCount; i++)
        {
            var placeholder = "{" + i + "}";
            value.Contains(placeholder).ShouldBeTrue(
                $"'{key}' değeri {placeholder} yer tutucusunu kaybetmiş: \"{value}\"");
        }
    }
}
