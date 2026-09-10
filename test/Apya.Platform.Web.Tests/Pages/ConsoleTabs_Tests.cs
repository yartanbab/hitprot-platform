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
        // (PR-2a: takvim/gösterge/galeri paylaşılan bileşenlerle eklendi).
        html.ShouldContain("data-tab=\"list\"");
        html.ShouldContain("data-tab=\"kanban\"");
        html.ShouldContain("data-tab=\"gantt\"");
        html.ShouldContain("data-tab=\"calendar\"");
        html.ShouldContain("data-tab=\"dashboard\"");
        html.ShouldContain("data-tab=\"gallery\"");
        // Test host'u her zaman yetkili → bütçe özeti döner ve Finans sekmesi basılır.
        html.ShouldContain("data-tab=\"finance\"");

        // Kapatma düğmesi yalnız katalog panolarında (gantt/takvim/gösterge/
        // galeri): sabitler (Liste, Kart Panosu, Finans) kapatılamaz — düğme
        // sayısı bunu yapısal olarak kanıtlar.
        Regex.Matches(html, "apya-console-tab-close").Count.ShouldBe(4,
            "proje konsolunda yalnız 4 katalog panosu kapatılabilir olmalı");

        // Katalog panellerinin panel kapları da basılı olmalı — sekme var ama
        // panel yoksa etkinleştirme sessizce boş ekrana düşer.
        html.ShouldContain("id=\"view-calendar\"");
        html.ShouldContain("id=\"view-dashboard\"");
        html.ShouldContain("id=\"view-gallery\"");
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
