using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Shouldly;
using Volo.Abp.Localization;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// X-05 · Dil seçicide 18 dil vardı; Türkçe ve İngilizce dışındakilerin platform çeviri dosyasında
/// yalnız şablonun 5 anahtarı duruyordu. O dili seçen kullanıcı ekranların neredeyse tamamını
/// Türkçe görüyordu.
/// </summary>
public class LanguageSelector_Tests : PlatformWebTestBase
{
    /// <summary>
    /// Seçicideki her dilin platform çevirisi Türkçe anahtarların en az %80'ini karşılar; eşiğin
    /// altındaki dil, eksik metinleri Türkçe gösterir. Yeni dil, çevirisiyle birlikte eklenir.
    /// </summary>
    [Fact]
    public void Seciciye_yalniz_cevirisi_olan_diller_girer()
    {
        var languages = GetRequiredService<IOptions<AbpLocalizationOptions>>().Value.Languages;
        var folder = Path.Combine(WebSourceFiles.RepoRoot(), "src", "Apya.Platform.Domain.Shared", "Localization", "Platform");
        var required = KeyCount(Path.Combine(folder, "tr.json")) * 0.8;

        var thin = languages
            .Select(l => l.CultureName)
            .Where(culture => KeyCount(Path.Combine(folder, culture + ".json")) < required)
            .ToList();

        thin.ShouldBeEmpty("Çevirisi olmayan dil seçicide sunulmamalı: " + string.Join(", ", thin));
    }

    private static int KeyCount(string file)
    {
        if (!File.Exists(file))
        {
            return 0;
        }

        using var doc = JsonDocument.Parse(File.ReadAllText(file));
        return doc.RootElement.GetProperty("texts").EnumerateObject().Count();
    }
}
