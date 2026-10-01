using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kanban v2 (ekran 2a) — /Tasks filtre çubuğu ve pano SUNUCU sözleşmesi.
/// İstemci (Pages/Tasks/index.js + /js/apya-kanban.js) bu kancaları DOM'dan
/// okur: biri düşerse davranış sessizce kaybolur, hata görünmez. "＋ Filtre"
/// menü hedefleri, chip ✕'leri, sayaçlı Gecikmiş chip'i, sağa yaslı kanban
/// araç slotu ve Shell.KanbanView'ın data-kanban-view kablosu burada sabitlenir.
/// </summary>
public class KanbanV2FilterBar_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Tasks_filtre_cubugu_v2_kancalarini_tasir()
    {
        var html = await GetResponseAsStringAsync("/Tasks");

        // "＋ Filtre" menüsü beş kategoriyi de hedeflemeli.
        html.ShouldContain("id=\"chip-add-filter\"");
        foreach (var chip in new[] { "chip-status", "chip-assignee", "chip-project", "chip-priority", "chip-daterange" })
        {
            html.ShouldContain($"data-open-chip=\"{chip}\"");
        }

        // Etkin chip ✕'leri (dropdown chip'lerinde; toggle chip'lerinde yok).
        foreach (var key in new[] { "status", "assignee", "project", "priority", "daterange" })
        {
            html.ShouldContain($"data-chip-clear=\"{key}\"");
        }

        // Sayaçlı Gecikmiş chip'i ve sağa yaslı kanban araç slotu.
        html.ShouldContain("id=\"chip-overdue-text\"");
        html.ShouldContain("apya-overdue-dot");
        html.ShouldContain("id=\"kanban-tools-slot\"");
        html.ShouldContain("js-kanban-view");
    }

    [Fact]
    public async Task Kanban_panosu_gorunum_tercihini_data_kanban_view_ile_tasir()
    {
        var html = await GetResponseAsStringAsync("/Tasks");

        // Shell.KanbanView sayfayla gelir (ikinci istek yok) — boş olabilir ama
        // attribute mutlaka basılmalı; apya-kanban.js varsayılanı buradan kurar.
        html.ShouldContain("data-kanban-view=");
    }

    /// <summary>
    /// Yükleme hatası kartının başlığı ve 1000 tavanı notu partial'dan data-* ile gelir (JS'te ikinci
    /// Türkçe kopya yok). Tavan metni HAM {0}/{1} taşımalı: JS doldurur. IHtmlLocalizer'ın argümansız
    /// yazımı {0} yüzünden FormatException atardı; .Value biçimlendirmeden kodlanmış metin verir.
    /// </summary>
    [Fact]
    public async Task Kanban_panosu_yukleme_hatasi_ve_tavan_metinlerini_tasir()
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/Tasks"));

        var board = doc.DocumentNode.SelectSingleNode("//div[contains(@class,'kanban-board')]");
        board.ShouldNotBeNull("kanban panosu basılmadı");
        HtmlEntity.DeEntitize(board!.GetAttributeValue("data-load-failed", ""))
            .ShouldBe("Görevler yüklenemedi.");
        HtmlEntity.DeEntitize(board.GetAttributeValue("data-capped", ""))
            .ShouldBe("Pano yalnız ilk {0} görevi gösteriyor (toplam {1}). Tümünü görmek için süzgeci daraltın.");

        var cap = board.ParentNode.SelectSingleNode("./p[contains(@class,'js-kanban-cap')]");
        cap.ShouldNotBeNull("tavan notu panoyla aynı sarmalayıcıda olmalı (JS nearBoard ile bulur)");
        cap!.Attributes.Contains("hidden").ShouldBeTrue("not yalnız toplam gösterilenden fazlaysa görünür");
    }
}
