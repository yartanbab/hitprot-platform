using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// Proje kapsamı uçları (birleşik sekme sistemi PR-2b): Belge / Form /
/// Kontrol Listesi / Bağımlılık toplamları PROJEYLE sınırlı kalmalı. Sızıntı
/// sessiz olurdu — komşu projenin belgesi panelde görünür, kimse hata almaz.
///
/// Gizlilik süzgeci burada AYRICA test edilmiyor: dört uç da
/// CreateFilteredQueryAsync'in görev sorgusuna JOIN'lendiği için liste
/// uçlarıyla aynı tenant+gizlilik süzgecini miras alır (yapısal garanti;
/// GetGalleryAsync ile aynı desen).
/// </summary>
public class ProjectPanelQueries_Tests : PlatformWebTestBase
{
    private readonly ITaskAppService _taskAppService;

    public ProjectPanelQueries_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
    }

    private sealed record Seeded(Guid P1, Guid T1a, Guid T1b, Guid P2, Guid T2);

    /// <summary>İki proje, üçü bir arada görev seti + çocuk kayıtlar.</summary>
    private async Task<Seeded> SeedAsync(string code)
    {
        var p1 = Guid.NewGuid(); var p2 = Guid.NewGuid();
        var t1a = Guid.NewGuid(); var t1b = Guid.NewGuid(); var t2 = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var projects = GetRequiredService<IRepository<Project, Guid>>();
            await projects.InsertAsync(new Project(p1, null, null, "Panel P1 " + code, code + "-1", "test"), autoSave: true);
            await projects.InsertAsync(new Project(p2, null, null, "Panel P2 " + code, code + "-2", "test"), autoSave: true);

            var tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
            var now = DateTime.Today;
            await tasks.InsertAsync(new TaskItem(t1a, "P1 görev A", projectId: p1, startDate: now), autoSave: true);
            await tasks.InsertAsync(new TaskItem(t1b, "P1 görev B", projectId: p1, startDate: now), autoSave: true);
            await tasks.InsertAsync(new TaskItem(t2, "P2 görev", projectId: p2, startDate: now), autoSave: true);

            var docs = GetRequiredService<IRepository<TaskDocument, Guid>>();
            await docs.InsertAsync(new TaskDocument(Guid.NewGuid(), t1a, "P1 belgesi"), autoSave: true);
            await docs.InsertAsync(new TaskDocument(Guid.NewGuid(), t2, "P2 belgesi"), autoSave: true);

            var items = GetRequiredService<IRepository<TaskChecklistItem, Guid>>();
            await items.InsertAsync(new TaskChecklistItem { TaskId = t1a, Text = "P1-A maddesi" }, autoSave: true);
            await items.InsertAsync(new TaskChecklistItem { TaskId = t1b, Text = "P1-B maddesi" }, autoSave: true);
            await items.InsertAsync(new TaskChecklistItem { TaskId = t2, Text = "P2 maddesi" }, autoSave: true);

            var deps = GetRequiredService<IRepository<TaskDependency, Guid>>();
            // Proje İÇİ kenar: T1a öncül → T1b ardıl.
            await deps.InsertAsync(new TaskDependency(Guid.NewGuid(), t1b, t1a), autoSave: true);
            // ÇAPRAZ kenar: öncül P2'de, ardıl P1'de — iki haritada da ELENMELİ.
            await deps.InsertAsync(new TaskDependency(Guid.NewGuid(), t1a, t2), autoSave: true);

            var forms = GetRequiredService<IRepository<AppDocument, Guid>>();
            var formId = Guid.NewGuid();
            await forms.InsertAsync(new AppDocument(formId, "Saha formu " + code, "saha-" + code.ToLowerInvariant()), autoSave: true);

            var links = GetRequiredService<IRepository<TaskFormLink, Guid>>();
            await links.InsertAsync(new TaskFormLink(Guid.NewGuid(), t1a, formId), autoSave: true);
            await links.InsertAsync(new TaskFormLink(Guid.NewGuid(), t2, formId), autoSave: true);

            await uow.CompleteAsync();
        }

        return new Seeded(p1, t1a, t1b, p2, t2);
    }

    [Fact]
    public async Task Belgeler_projeyle_sinirli_ve_gorev_kimligi_dolu()
    {
        var s = await SeedAsync("PPQ-D");

        var docs = await _taskAppService.GetProjectDocumentsAsync(s.P1);

        docs.Select(d => d.Title).ShouldContain("P1 belgesi");
        docs.Select(d => d.Title).ShouldNotContain("P2 belgesi");
        docs.Single(d => d.Title == "P1 belgesi").TaskId.ShouldBe(s.T1a);
        // Liste gövde taşımaz — tam gövde GetDocumentAsync'in işi.
        docs.ShouldAllBe(d => d.Content == null);
    }

    [Fact]
    public async Task Kontrol_listesi_projenin_tum_gorevlerini_toplar_komsuyu_almaz()
    {
        var s = await SeedAsync("PPQ-C");

        var items = await _taskAppService.GetProjectChecklistAsync(s.P1);

        items.Select(i => i.Text).ShouldBe(new[] { "P1-A maddesi", "P1-B maddesi" }, ignoreOrder: true);
        items.Single(i => i.Text == "P1-A maddesi").TaskId.ShouldBe(s.T1a);
        items.Single(i => i.Text == "P1-B maddesi").TaskId.ShouldBe(s.T1b);
    }

    [Fact]
    public async Task Bagimlilik_haritasi_proje_ici_kalir_capraz_kenar_iki_yonde_de_elenir()
    {
        var s = await SeedAsync("PPQ-E");

        var p1Edges = await _taskAppService.GetProjectDependenciesAsync(s.P1);
        p1Edges.ShouldHaveSingleItem();
        p1Edges[0].TaskId.ShouldBe(s.T1b);
        p1Edges[0].PredecessorTaskId.ShouldBe(s.T1a);

        // Çapraz kenarın öbür ucu: P2 haritasında da görünmemeli (ardıl P1'de).
        var p2Edges = await _taskAppService.GetProjectDependenciesAsync(s.P2);
        p2Edges.ShouldBeEmpty();
    }

    // --- Çapraz-proje kip (projectId = null, /Tasks Panolar yüzeyi) ---
    // Sıkı eşitlik YOK: null kip veritabanındaki TÜM görünür kayıtları döner,
    // paylaşılan test DB'sinde başka seed'ler de görünebilir. Bu yüzden
    // iddialar bu seed'in GUID'leriyle çapalanır (ShouldContain).

    [Fact]
    public async Task Capraz_proje_kip_kayitlari_tum_projelerden_toplar()
    {
        var s = await SeedAsync("PPQ-X");

        // Proje-seviyesi madde de görünmeli — global kipte kiracı sınırı
        // proje join'inden gelir, bu dal ancak böyle bir kayıtla çalışır.
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var items = GetRequiredService<IRepository<TaskChecklistItem, Guid>>();
            await items.InsertAsync(new TaskChecklistItem { ProjectId = s.P1, Text = "PPQ-X proje maddesi" }, autoSave: true);
            await uow.CompleteAsync();
        }

        var docs = await _taskAppService.GetProjectDocumentsAsync(null);
        docs.ShouldContain(d => d.TaskId == s.T1a && d.Title == "P1 belgesi");
        docs.ShouldContain(d => d.TaskId == s.T2 && d.Title == "P2 belgesi");

        var forms = await _taskAppService.GetProjectLinkedFormsAsync(null);
        forms.ShouldContain(f => f.TaskId == s.T1a);
        forms.ShouldContain(f => f.TaskId == s.T2);

        var checklist = await _taskAppService.GetProjectChecklistAsync(null);
        // Görev maddesinde ProjectId GÖREVİN projesi dolu gelir — istemci
        // proje başına bununla gruplar (partitionByProject).
        checklist.ShouldContain(i => i.TaskId == s.T1a && i.ProjectId == s.P1);
        checklist.ShouldContain(i => i.TaskId == s.T2 && i.ProjectId == s.P2);
        checklist.ShouldContain(i => i.TaskId == null && i.ProjectId == s.P1 && i.Text == "PPQ-X proje maddesi");
    }

    [Fact]
    public async Task Capraz_proje_kip_bagimlilik_haritasi_capraz_kenari_da_gosterir()
    {
        var s = await SeedAsync("PPQ-Y");

        var edges = await _taskAppService.GetProjectDependenciesAsync(null);

        // Proje içi kenar her iki kipte de var…
        edges.ShouldContain(e => e.TaskId == s.T1b && e.PredecessorTaskId == s.T1a);
        // …iki projeye yayılan kenar ise tekil haritalarda elenirken burada
        // görünür: iki ucu da görünür görev kümesinde.
        edges.ShouldContain(e => e.TaskId == s.T1a && e.PredecessorTaskId == s.T2);
    }

    [Fact]
    public async Task Formlar_projeyle_sinirli_gelir_ayni_form_iki_projede_ayri_bag()
    {
        var s = await SeedAsync("PPQ-F");

        var p1Forms = await _taskAppService.GetProjectLinkedFormsAsync(s.P1);
        p1Forms.ShouldHaveSingleItem();
        p1Forms[0].TaskId.ShouldBe(s.T1a);
        p1Forms[0].Title.ShouldContain("Saha formu");
        p1Forms[0].ResponseCount.ShouldBe(0);

        var p2Forms = await _taskAppService.GetProjectLinkedFormsAsync(s.P2);
        p2Forms.ShouldHaveSingleItem();
        p2Forms[0].TaskId.ShouldBe(s.T2);
    }
}
