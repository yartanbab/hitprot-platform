using System;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Birleşik sekme sistemi (PR-1) — üç yüzeyin SUNUCU sözleşmesi. İstemci modülü
/// (apya-task-console.js → createTabs) düzeni sayfadan `data-board-tabs` ile,
/// görev detayı sırasını `data-tab-order` ile okur: attribute'lardan biri
/// düşerse şerit sessizce varsayılana döner, kullanıcı düzenini "kaybeder" —
/// hata görünmez. Bu testler o kabloları sabitler.
/// </summary>
public class ConsoleTabs_Tests : PlatformWebTestBase
{
    private async Task<Guid> CreateProjectAsync(string code)
    {
        var projectId = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<Project, Guid>>();
            await repository.InsertAsync(
                new Project(projectId, null, null, "Sekme Testi " + code, code, "Birleşik sekme testi"),
                autoSave: true);
            await uow.CompleteAsync();
        }

        return projectId;
    }

    [Fact]
    public async Task Tasks_seridi_dueni_data_board_tabs_ile_tasir()
    {
        var html = await GetResponseAsStringAsync("/Tasks");

        html.ShouldContain("id=\"console-tabs\"");
        html.ShouldContain("data-board-tabs=");
        html.ShouldContain("id=\"btn-tab-add\"");
        html.ShouldContain("id=\"tab-add-menu\"");

        // PR-3b: sabit üçlü (Liste · Kart Panosu · Finans) ✕'siz — kapatma
        // düğmesi yalnız 4 katalog panosunda. Test host'u her zaman yetkili →
        // Finans sekmesi ve paneli basılır.
        html.ShouldContain("data-tab=\"finance\"");
        html.ShouldContain("id=\"view-finance\"");
        Regex.Matches(html, "apya-console-tab-close").Count.ShouldBe(4,
            "/Tasks şeridinde yalnız takvim/gantt/gösterge/galeri kapatılabilir olmalı");
    }

    [Fact]
    public async Task Proje_detayi_ortak_sekme_modeline_gecti()
    {
        var projectId = await CreateProjectAsync("SKM-1");
        var html = WebUtility.HtmlDecode(
            await GetResponseAsStringAsync($"/Projects/ProjectDetails/{projectId}"));

        // /Tasks ile aynı iskelet: tabstrip + data-board-tabs + "＋" menüsü.
        html.ShouldContain("apya-console-tabstrip");
        html.ShouldContain("data-board-tabs=");
        html.ShouldContain("id=\"btn-tab-add\"");

        // Sabitler + kapatılabilir katalog panoları kind'larıyla basılır
        // (PR-2a paylaşılan bileşenler + PR-2b island panelleri).
        foreach (var kind in new[]
        {
            "list", "kanban", "gantt", "calendar", "dashboard", "gallery",
            "documents", "forms", "checklist", "dependencies"
        })
        {
            html.ShouldContain($"data-tab=\"{kind}\"");
        }
        // Test host'u her zaman yetkili → bütçe özeti döner ve Finans sekmesi basılır.
        html.ShouldContain("data-tab=\"finance\"");

        // Kapatma düğmesi yalnız katalog panolarında (8 adet): sabitler (Liste,
        // Kart Panosu, Finans) kapatılamaz — düğme sayısı bunu yapısal kanıtlar.
        Regex.Matches(html, "apya-console-tab-close").Count.ShouldBe(8,
            "proje konsolunda yalnız 8 katalog panosu kapatılabilir olmalı");

        // Katalog panellerinin panel kapları da basılı olmalı — sekme var ama
        // panel yoksa etkinleştirme sessizce boş ekrana düşer. Island kapları
        // ayrıca projectId taşımalı: island mount'u onsuz hiç render etmez.
        html.ShouldContain("id=\"view-calendar\"");
        html.ShouldContain("id=\"view-dashboard\"");
        html.ShouldContain("id=\"view-gallery\"");
        foreach (var kind in new[] { "documents", "forms", "checklist", "dependencies" })
        {
            html.ShouldContain($"id=\"view-{kind}\" class=\"view-panel d-none\" role=\"tabpanel\" aria-labelledby=\"btn-view-{kind}\" data-project-id=\"{projectId}\"");
        }
    }

    [Fact]
    public async Task Gorev_detayi_islandi_sekme_sirasini_data_tab_order_ile_alir()
    {
        // Modal host'u (_TaskDetailIsland) hem /Tasks hem proje detayına basılıyor.
        var html = await GetResponseAsStringAsync("/Tasks");

        html.ShouldContain("id=\"task-detail-island\"");
        html.ShouldContain("data-tab-order=");
    }
}
