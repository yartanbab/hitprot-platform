using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// İlk kurulum sihirbazı.
///
/// Sihirbazın iki sözü var ve ikisi de sessizce bozulabilir: doğru klasörleri
/// kurmak ve tamamlandıktan sonra BİR DAHA açılmamak. İkincisi bozulursa
/// kullanıcı her girişte aynı ekranı görür ve klasörleri ikinci kez kurar.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DocumentSetupAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IDocumentSetupAppService _setupAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly ICurrentTenant _currentTenant;

    public DocumentSetupAppService_Tests()
    {
        _setupAppService = GetRequiredService<IDocumentSetupAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _workStepRepository = GetRequiredService<IRepository<ProjectWorkStep, Guid>>();
        _documentRepository = GetRequiredService<IRepository<Document, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Project> CreateProjectAsync(string name, int workStepCount = 0)
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, grantId: null,
            name: name, code: "SETUP-" + Guid.NewGuid().ToString("N")[..6], description: "kurulum testi");

        await _projectRepository.InsertAsync(project, autoSave: true);

        for (var i = 1; i <= workStepCount; i++)
        {
            await _workStepRepository.InsertAsync(
                new ProjectWorkStep(Guid.NewGuid(), _currentTenant.Id, project.Id, i, $"Adım {i}"),
                autoSave: true);
        }

        return project;
    }

    private async Task<int> FolderCountAsync(Guid projectId)
        => (await _documentRepository.GetListAsync(d => d.ProjectId == projectId)).Count;

    [Fact]
    public async Task Durum_projeleri_ve_is_adimi_sayilarini_doner()
    {
        var project = await CreateProjectAsync("Kurulum Projesi", workStepCount: 3);

        var state = await _setupAppService.GetStateAsync();

        var row = state.Projects.Where(p => p.Id == project.Id).ShouldHaveSingleItem();
        row.WorkStepCount.ShouldBe(3);
        row.HasFolders.ShouldBeFalse();
    }

    [Fact]
    public async Task Is_adimi_semasi_her_adim_icin_klasor_kurar()
    {
        var project = await CreateProjectAsync("İş Adımı Şeması", workStepCount: 4);

        var result = await _setupAppService.ApplyAsync(new ApplyDocumentSetupDto
        {
            ProjectId = project.Id,
            Schema = DocumentFolderSchema.WorkStep,
        });

        // 1 kök + 4 iş adımı
        result.CreatedFolderCount.ShouldBe(5);
        (await FolderCountAsync(project.Id)).ShouldBe(5);
    }

    [Fact]
    public async Task Karma_sema_is_adimlarina_kurumsal_klasorleri_ekler()
    {
        var project = await CreateProjectAsync("Karma Şema", workStepCount: 2);

        var result = await _setupAppService.ApplyAsync(new ApplyDocumentSetupDto
        {
            ProjectId = project.Id,
            Schema = DocumentFolderSchema.Mixed,
        });

        // 1 kök + 2 iş adımı + Finans / Personel / Sözleşmeler
        result.CreatedFolderCount.ShouldBe(6);
    }

    [Fact]
    public async Task Donem_semasi_dort_ceyrek_kurar()
    {
        var project = await CreateProjectAsync("Dönem Şeması");

        var result = await _setupAppService.ApplyAsync(new ApplyDocumentSetupDto
        {
            ProjectId = project.Id,
            Schema = DocumentFolderSchema.Period,
        });

        result.CreatedFolderCount.ShouldBe(5); // kök + 4 çeyrek
    }

    /// <summary>
    /// İş adımı yoksa uydurma "1. Adım" klasörü ÜRETİLMEZ — kullanıcıya
    /// temizlemesi gereken boş klasörler bırakmak, hiç kurmamaktan kötü.
    /// </summary>
    [Fact]
    public async Task Is_adimi_yoksa_yalniz_kok_klasor_kurulur()
    {
        var project = await CreateProjectAsync("Adımsız Proje");

        var result = await _setupAppService.ApplyAsync(new ApplyDocumentSetupDto
        {
            ProjectId = project.Id,
            Schema = DocumentFolderSchema.WorkStep,
        });

        result.CreatedFolderCount.ShouldBe(1);
    }

    /// <summary>Sihirbazın ikinci sözü: tamamlandıktan sonra bir daha açılmaz.</summary>
    [Fact]
    public async Task Kurulum_tamamlaninca_durum_isaretlenir()
    {
        var project = await CreateProjectAsync("Bayrak Projesi", workStepCount: 1);

        (await _setupAppService.GetStateAsync()).SetupCompleted.ShouldBeFalse();

        await _setupAppService.ApplyAsync(new ApplyDocumentSetupDto
        {
            ProjectId = project.Id,
            Schema = DocumentFolderSchema.Mixed,
        });

        var state = await _setupAppService.GetStateAsync();
        state.SetupCompleted.ShouldBeTrue();
        state.Schema.ShouldBe(DocumentFolderSchema.Mixed);
    }

    [Fact]
    public async Task Sihirbaz_kurulum_yapmadan_da_atlanabilir()
    {
        await _setupAppService.CompleteAsync();

        (await _setupAppService.GetStateAsync()).SetupCompleted.ShouldBeTrue();
    }
}
