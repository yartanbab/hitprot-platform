using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Incomes;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// DOC-08 · Gelire (tahsilata) belge bağlanır (ürün kararı, 2026-10-13). Belge eşleştirme yalnız
/// gider için vardı; hibe diliminin dekontu gelir kaydına bağlanamıyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class IncomeDocumentLink_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid OtherTenant = Guid.Parse("99990000-cccc-4000-8000-000000000095");

    private readonly IIncomeEntryAppService _incomes;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Document, Guid> _folderRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentIncomeLink, Guid> _linkRepository;
    private readonly ICurrentTenant _currentTenant;

    public IncomeDocumentLink_Tests()
    {
        _incomes = GetRequiredService<IIncomeEntryAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _folderRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
        _linkRepository = GetRequiredService<IRepository<DocumentIncomeLink, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> ProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Tahsilat projesi", "TBP-" + Guid.NewGuid().ToString("N")[..8], "");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<Guid> IncomeAsync(Guid? projectId)
        => (await _incomes.CreateAsync(new CreateUpdateIncomeEntryDto
        {
            Title = "Hibe dilimi", Amount = 100_000m, Currency = "TRY",
            IncomeDate = new DateTime(2026, 10, 13), ProjectId = projectId
        })).Id;

    private async Task<Guid> FileAsync(Guid? tenantId, Guid? projectId, string name, bool withAttachment = true)
    {
        using (_currentTenant.Change(tenantId))
        {
            var folder = new Document(Guid.NewGuid(), tenantId, "Dekontlar", "");
            await _folderRepository.InsertAsync(folder, autoSave: true);

            var file = new DocumentFile(Guid.NewGuid(), tenantId, folder.Id, name, projectId: projectId);
            if (withAttachment)
            {
                file.RegisterVersion(Guid.NewGuid(), 1);
            }
            await _fileRepository.InsertAsync(file, autoSave: true);
            return file.Id;
        }
    }

    [Fact]
    public async Task Gelire_baglanan_belge_listede_ve_secenek_disinda_gorunur()
    {
        var projectId = await ProjectAsync();
        var incomeId = await IncomeAsync(projectId);
        var receipt = await FileAsync(null, projectId, "Dekont.pdf");
        var other = await FileAsync(null, projectId, "Onay yazısı.pdf");

        (await _incomes.GetDocumentOptionsAsync(incomeId)).Select(o => o.DocumentFileId)
            .ShouldBe(new[] { receipt, other }, ignoreOrder: true);

        await _incomes.LinkDocumentAsync(incomeId, receipt);
        // Aynı bağ ikinci kez kurulmaz.
        await _incomes.LinkDocumentAsync(incomeId, receipt);

        (await _linkRepository.GetListAsync(l => l.IncomeEntryId == incomeId)).Count.ShouldBe(1);
        (await _incomes.GetLinkedDocumentsAsync(incomeId)).Single().Name.ShouldBe("Dekont.pdf");
        (await _incomes.GetDocumentOptionsAsync(incomeId)).Single().DocumentFileId.ShouldBe(other);

        var row = (await _incomes.GetListAsync(new GetIncomeEntriesInput { ProjectId = projectId, MaxResultCount = 100 }))
            .Items.Single(i => i.Id == incomeId);
        row.Documents.Single().Name.ShouldBe("Dekont.pdf");
    }

    [Fact]
    public async Task Baska_projenin_belgesi_gelire_baglanamaz()
    {
        var incomeId = await IncomeAsync(await ProjectAsync());
        var foreignProjectFile = await FileAsync(null, await ProjectAsync(), "Başka proje.pdf");

        (await Should.ThrowAsync<BusinessException>(() => _incomes.LinkDocumentAsync(incomeId, foreignProjectFile)))
            .Code.ShouldBe(PlatformDomainErrorCodes.IncomeDocumentProjectMismatch);

        (await _linkRepository.GetListAsync(l => l.IncomeEntryId == incomeId)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Baska_kiracinin_belgesi_gelire_baglanamaz()
    {
        var incomeId = await IncomeAsync(await ProjectAsync());
        var foreignFile = await FileAsync(OtherTenant, null, "Yabancı kiracı.pdf");

        await Should.ThrowAsync<EntityNotFoundException>(() => _incomes.LinkDocumentAsync(incomeId, foreignFile));
    }

    [Fact]
    public async Task Bag_kaldirilir_belge_kalir_gelir_silinince_bag_da_gider()
    {
        var projectId = await ProjectAsync();
        var incomeId = await IncomeAsync(projectId);
        var first = await FileAsync(null, projectId, "Dekont.pdf");
        var second = await FileAsync(null, projectId, "Yazı.pdf");
        await _incomes.LinkDocumentAsync(incomeId, first);
        await _incomes.LinkDocumentAsync(incomeId, second);

        await _incomes.UnlinkDocumentAsync(incomeId, first);
        (await _linkRepository.GetListAsync(l => l.IncomeEntryId == incomeId)).Single().DocumentFileId.ShouldBe(second);
        (await _fileRepository.FindAsync(first)).ShouldNotBeNull();

        await _incomes.DeleteAsync(incomeId);
        (await _linkRepository.GetListAsync(l => l.IncomeEntryId == incomeId)).ShouldBeEmpty();
        (await _fileRepository.FindAsync(second)).ShouldNotBeNull();
    }
}
