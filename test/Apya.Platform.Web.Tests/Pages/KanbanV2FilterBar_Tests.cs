using System.Threading.Tasks;
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
}
