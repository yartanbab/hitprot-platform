using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Documents;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// Gider/gelir penceresinden eklenen fatura, fiş, dekont Belge Merkezi'ne düşer ve kayda bağlanır
/// (kullanıcı isteği, 2026-11-11). Önceden belge önce Belgeler ekranına yüklenip sonra ayrı
/// pencereden bağlanıyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FinanceDocumentAttach_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFinanceDocumentAppService _service;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<CashAccount, Guid> _cashRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<Document, Guid> _folderRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentExpenseMatch, Guid> _matchRepository;

    public FinanceDocumentAttach_Tests()
    {
        _service = GetRequiredService<IFinanceDocumentAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _cashRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _expenseRepository = GetRequiredService<IRepository<Expense, Guid>>();
        _incomeRepository = GetRequiredService<IRepository<IncomeEntry, Guid>>();
        _folderRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
        _matchRepository = GetRequiredService<IRepository<DocumentExpenseMatch, Guid>>();
    }

    private async Task<Project> ProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Belge ekli proje", "BEP-" + Guid.NewGuid().ToString("N")[..8], "");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project;
    }

    private async Task<Guid> ExpenseAsync(Guid? projectId)
    {
        var account = new CashAccount(Guid.NewGuid(), "Kasa " + Guid.NewGuid().ToString("N")[..6]);
        await _cashRepository.InsertAsync(account, autoSave: true);

        var expense = new Expense(
            Guid.NewGuid(), "Ofis kirası", 1_000m, account.Id, new DateTime(2026, 11, 11), projectId: projectId);
        await _expenseRepository.InsertAsync(expense, autoSave: true);
        return expense.Id;
    }

    private async Task<Guid> IncomeAsync(Guid? projectId)
    {
        var income = new IncomeEntry(Guid.NewGuid(), "Hibe dilimi", 5_000m, new DateTime(2026, 11, 11), projectId: projectId);
        await _incomeRepository.InsertAsync(income, autoSave: true);
        return income.Id;
    }

    private Task AttachToExpenseAsync(Guid expenseId, string fileName)
        => _service.AttachToExpenseAsync(expenseId, fileName, Guid.NewGuid() + ".pdf", "application/pdf", 1024);

    [Fact]
    public async Task Gidere_eklenen_belge_projenin_Finans_klasorune_duser_ve_eslesir()
    {
        var project = await ProjectAsync();
        var root = new Document(Guid.NewGuid(), null, project.Name, "", project.Id);
        await _folderRepository.InsertAsync(root, autoSave: true);
        var finance = new Document(Guid.NewGuid(), null, "Finans", "", project.Id, root.Id);
        await _folderRepository.InsertAsync(finance, autoSave: true);
        var expenseId = await ExpenseAsync(project.Id);

        await AttachToExpenseAsync(expenseId, "Kira faturası.pdf");

        var match = (await _matchRepository.GetListAsync(m => m.ExpenseId == expenseId)).ShouldHaveSingleItem();
        match.Source.ShouldBe(MatchSource.Manual);
        match.Score.ShouldBe(100);

        var file = await _fileRepository.GetAsync(match.DocumentFileId);
        file.DocumentId.ShouldBe(finance.Id);
        file.ProjectId.ShouldBe(project.Id);
        file.DisplayName.ShouldBe("Kira faturası.pdf");
        file.Status.ShouldBe(DocumentFileStatus.Matched);
        file.LatestAttachmentId.ShouldNotBeNull();

        var listed = (await _service.GetExpenseDocumentsAsync(expenseId)).ShouldHaveSingleItem();
        listed.Name.ShouldBe("Kira faturası.pdf");
        listed.DownloadUrl.ShouldEndWith("attachmentId=" + file.LatestAttachmentId);

        // Finans Merkezi'nin gider satırındaki belge simgesi aynı bağı okur (DOC-12).
        var row = (await GetRequiredService<IExpenseAppService>().GetListAsync(
                new GetExpensesInput { ProjectId = project.Id, MaxResultCount = 100 }))
            .Items.Single(e => e.Id == expenseId);
        row.Documents.ShouldHaveSingleItem().Name.ShouldBe("Kira faturası.pdf");
    }

    [Fact]
    public async Task Klasoru_olmayan_projede_tek_kok_klasor_acilir()
    {
        var project = await ProjectAsync();
        var first = await ExpenseAsync(project.Id);
        var second = await ExpenseAsync(project.Id);

        await AttachToExpenseAsync(first, "Fiş 1.jpg");
        await AttachToExpenseAsync(second, "Fiş 2.jpg");

        var root = (await _folderRepository.GetListAsync(d => d.ProjectId == project.Id)).ShouldHaveSingleItem();
        root.Title.ShouldBe(project.Name);
        root.ParentDocumentId.ShouldBeNull();
        (await _fileRepository.GetListAsync(f => f.DocumentId == root.Id)).Count.ShouldBe(2);
    }

    [Fact]
    public async Task Projesiz_gelirin_dekontu_kiracinin_Finans_klasorune_duser_ve_baglanir()
    {
        var first = await IncomeAsync(null);
        var second = await IncomeAsync(null);

        await _service.AttachToIncomeAsync(first, "Dekont.pdf", Guid.NewGuid() + ".pdf", "application/pdf", 10);
        await _service.AttachToIncomeAsync(second, "Banka yazısı.pdf", Guid.NewGuid() + ".pdf", "application/pdf", 10);

        var finance = (await _folderRepository.GetListAsync(d =>
                d.ProjectId == null && d.ParentDocumentId == null && d.ContextType == DocumentContextType.Finance))
            .ShouldHaveSingleItem();
        finance.Title.ShouldBe("Finans");

        (await _service.GetIncomeDocumentsAsync(first)).ShouldHaveSingleItem().Name.ShouldBe("Dekont.pdf");
        // Gelir belge penceresi (DOC-08) aynı bağı gösterir.
        (await GetRequiredService<IIncomeEntryAppService>().GetLinkedDocumentsAsync(second))
            .ShouldHaveSingleItem().Name.ShouldBe("Banka yazısı.pdf");
    }

    [Fact]
    public async Task Ayni_adli_iki_fis_ayri_belge_olur_birbirinin_surumu_olmaz()
    {
        var project = await ProjectAsync();
        var first = await ExpenseAsync(project.Id);
        var second = await ExpenseAsync(project.Id);

        // Telefon kamerası her fotoğrafı aynı adla gönderebilir.
        await AttachToExpenseAsync(first, "image.jpg");
        await AttachToExpenseAsync(second, "IMAGE.jpg");

        var firstDoc = (await _service.GetExpenseDocumentsAsync(first)).ShouldHaveSingleItem();
        var secondDoc = (await _service.GetExpenseDocumentsAsync(second)).ShouldHaveSingleItem();

        firstDoc.Name.ShouldBe("image.jpg");
        secondDoc.Name.ShouldBe("IMAGE (2).jpg");
        secondDoc.AttachmentId.ShouldNotBe(firstDoc.AttachmentId);
        (await _fileRepository.GetListAsync(f => f.ProjectId == project.Id)).Count.ShouldBe(2);
    }

    [Fact]
    public void Servis_uzaktan_cagrilamaz_ve_belge_yukleme_izni_ister()
    {
        var type = typeof(FinanceDocumentAppService);
        type.GetCustomAttribute<RemoteServiceAttribute>()!.IsEnabled.ShouldBeFalse();

        foreach (var name in new[] { nameof(FinanceDocumentAppService.AttachToExpenseAsync), nameof(FinanceDocumentAppService.AttachToIncomeAsync) })
        {
            type.GetMethod(name)!.GetCustomAttributes<AuthorizeAttribute>().Select(a => a.Policy)
                .ShouldBe(new[] { PlatformPermissions.Documents.Default, PlatformPermissions.Documents.Edit }, ignoreOrder: true);
        }
    }
}
