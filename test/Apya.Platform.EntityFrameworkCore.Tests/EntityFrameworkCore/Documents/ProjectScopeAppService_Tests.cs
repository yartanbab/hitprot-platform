using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// Proje kapsamı ağacı.
///
/// Ağacın iki ekseni var ve şema onları birbirine bağlamıyor: belge iş adımından,
/// görev projeden sarkar. Bu testler ikisinin de doğru dala düştüğünü, iş adımı
/// atanmamış belgenin kaybolmadığını ve toplamın belge tutarlarıyla tuttuğunu
/// doğrular — bu üçü bozulursa kuruma eksik/yanlış kapsam raporlanır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectScopeAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectScopeAppService _scopeAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public ProjectScopeAppService_Tests()
    {
        _scopeAppService = GetRequiredService<IProjectScopeAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _workStepRepository = GetRequiredService<IRepository<ProjectWorkStep, Guid>>();
        _documentRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Project> CreateProjectAsync(string name, string code, decimal budget = 0)
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, grantId: null,
            name: name, code: code, description: "kapsam testi",
            totalBudget: budget, currency: "TRY",
            startDate: new DateTime(2026, 1, 1), endDate: new DateTime(2026, 12, 31));

        await _projectRepository.InsertAsync(project, autoSave: true);
        return project;
    }

    private async Task<ProjectWorkStep> CreateStepAsync(Guid projectId, int order, string name)
    {
        var step = new ProjectWorkStep(Guid.NewGuid(), _currentTenant.Id, projectId, order, name);
        await _workStepRepository.InsertAsync(step, autoSave: true);
        return step;
    }

    private async Task<DocumentFile> CreateFileAsync(
        Guid projectId, Guid? workStepId, string name, decimal? amount = null, string currency = "TRY")
    {
        var folder = new Document(Guid.NewGuid(), _currentTenant.Id, name + " klasörü", string.Empty, projectId);
        await _documentRepository.InsertAsync(folder, autoSave: true);

        var file = new DocumentFile(
            Guid.NewGuid(), _currentTenant.Id, folder.Id, name,
            documentTypeId: null, projectId: projectId, workStepId: workStepId);

        file.SetAmount(amount, currency);
        await _fileRepository.InsertAsync(file, autoSave: true);
        return file;
    }

    private async Task<TaskItem> CreateTaskAsync(Guid projectId, string title, Guid? parentTaskId = null)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title, projectId: projectId, parentTaskId: parentTaskId,
            isPrivate: false, tenantId: _currentTenant.Id, now: DateTime.Now);

        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    [Fact]
    public async Task Genel_bakis_proje_satirlarini_ve_belge_sayisini_doner()
    {
        var project = await CreateProjectAsync("Kapsam Projesi", "KPS-1");
        var step = await CreateStepAsync(project.Id, 1, "Kavramsal Tasarım");
        await CreateFileAsync(project.Id, step.Id, "Rapor.pdf", 1000m);
        await CreateFileAsync(project.Id, step.Id, "Fatura.pdf", 500m);

        var overview = await _scopeAppService.GetOverviewAsync();

        var row = overview.Rows.Where(r => r.EntityId == project.Id).ShouldHaveSingleItem();
        row.Kind.ShouldBe(ScopeRowKind.Project);
        row.Depth.ShouldBe(0);
        row.DocumentCount.ShouldBe(2);
        row.Amount.ShouldBe(1500m);

        // Proje satiri her zaman tembeldir: cocuklari ayrica istenir.
        row.IsLazy.ShouldBeTrue();
        row.HasChildren.ShouldBeTrue();
    }

    [Fact]
    public async Task Kontrol_listesi_olmayan_projede_uygunluk_tanimsizdir()
    {
        var project = await CreateProjectAsync("Listesiz Proje", "KPS-2");

        var overview = await _scopeAppService.GetOverviewAsync();
        var row = overview.Rows.Where(r => r.EntityId == project.Id).ShouldHaveSingleItem();

        // %0 DEGIL null: sifir yuzde "her sey eksik" demek olurdu.
        row.CompliancePercent.ShouldBeNull();
    }

    [Fact]
    public async Task Dalda_belge_is_adiminin_altina_dusuyor()
    {
        var project = await CreateProjectAsync("Dal Projesi", "KPS-3");
        var step = await CreateStepAsync(project.Id, 1, "Prototip");
        var file = await CreateFileAsync(project.Id, step.Id, "Makine Faturası.pdf", 250m);

        var branch = await _scopeAppService.GetBranchAsync(project.Id);

        var stepRow = branch.Rows.Where(r => r.EntityId == step.Id).ShouldHaveSingleItem();
        stepRow.Kind.ShouldBe(ScopeRowKind.WorkStep);
        stepRow.ParentId.ShouldBe("p:" + project.Id);
        stepRow.Depth.ShouldBe(1);

        var fileRow = branch.Rows.Where(r => r.EntityId == file.Id).ShouldHaveSingleItem();
        fileRow.Kind.ShouldBe(ScopeRowKind.Document);
        fileRow.ParentId.ShouldBe(stepRow.Id);
        fileRow.Depth.ShouldBe(2);
        fileRow.Amount.ShouldBe(250m);
    }

    [Fact]
    public async Task Is_adimi_atanmamis_belge_kaybolmuyor()
    {
        var project = await CreateProjectAsync("Sahipsiz Belge", "KPS-4");
        await CreateStepAsync(project.Id, 1, "Adım");
        var orphan = await CreateFileAsync(project.Id, workStepId: null, name: "Serbest.pdf", amount: 90m);

        var branch = await _scopeAppService.GetBranchAsync(project.Id);

        var group = branch.Rows.Where(r => r.Kind == ScopeRowKind.UnassignedGroup).ShouldHaveSingleItem();
        group.DocumentCount.ShouldBe(1);

        var orphanRow = branch.Rows.Where(r => r.EntityId == orphan.Id).ShouldHaveSingleItem();
        orphanRow.ParentId.ShouldBe(group.Id);
    }

    [Fact]
    public async Task Gorevler_kardes_dalda_ve_alt_gorev_iceriyor()
    {
        var project = await CreateProjectAsync("Görevli Proje", "KPS-5");
        var parent = await CreateTaskAsync(project.Id, "Kök görev");
        var child = await CreateTaskAsync(project.Id, "Alt görev", parentTaskId: parent.Id);

        var branch = await _scopeAppService.GetBranchAsync(project.Id);

        var group = branch.Rows.Where(r => r.Kind == ScopeRowKind.TaskGroup).ShouldHaveSingleItem();
        group.ParentId.ShouldBe("p:" + project.Id);

        var parentRow = branch.Rows.Where(r => r.EntityId == parent.Id).ShouldHaveSingleItem();
        parentRow.Kind.ShouldBe(ScopeRowKind.Task);
        parentRow.ParentId.ShouldBe(group.Id);
        parentRow.HasChildren.ShouldBeTrue();

        var childRow = branch.Rows.Where(r => r.EntityId == child.Id).ShouldHaveSingleItem();
        childRow.Kind.ShouldBe(ScopeRowKind.SubTask);
        childRow.ParentId.ShouldBe(parentRow.Id);
        childRow.Depth.ShouldBe(3);

        branch.TaskCount.ShouldBe(1);
        branch.SubTaskCount.ShouldBe(1);
    }

    [Fact]
    public async Task Farkli_para_birimli_belge_toplama_katilmaz_ve_isaretlenir()
    {
        var project = await CreateProjectAsync("Karışık Kur", "KPS-6");
        var step = await CreateStepAsync(project.Id, 1, "Adım");
        await CreateFileAsync(project.Id, step.Id, "TL fatura.pdf", 100m, "TRY");
        await CreateFileAsync(project.Id, step.Id, "Dolar fatura.pdf", 100m, "USD");

        var overview = await _scopeAppService.GetOverviewAsync();
        var row = overview.Rows.Where(r => r.EntityId == project.Id).ShouldHaveSingleItem();

        // 200 DEGIL: kuru bilinmeyen kalem toplanmaz.
        row.Amount.ShouldBe(100m);
        row.DocumentCount.ShouldBe(2);
        overview.Rollup.HasMixedCurrency.ShouldBeTrue();
    }
}
