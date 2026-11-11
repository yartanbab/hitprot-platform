using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Documents;

/// <summary>
/// Gider/gelir penceresinden yüklenen belgeyi Belge Merkezi'ne koyar ve kayda bağlar.
///
/// <para>Dosya kaydın projesinin belge klasörüne düşer (içinde "Finans" alt klasörü varsa oraya).
/// Projede henüz klasör yoksa, belge kurulum sihirbazının açtığı kök klasörün aynısı açılır.
/// Projesiz kayıtta kiracının "Finans" klasörü kullanılır. Bağ, eşleştirme ekranının ve gelir
/// belge penceresinin kullandığı tablolara yazılır; Finans Merkezi'nin belge simgesi bunları okur.</para>
///
/// <para>🔴 Uzaktan ÇAĞRILAMAZ: saklanan dosya adını çağırandan alır (bkz. arayüz).</para>
/// </summary>
[Authorize]
[Volo.Abp.RemoteService(IsEnabled = false)]
public class FinanceDocumentAppService : PlatformAppService, IFinanceDocumentAppService
{
    /// <summary>Kurulum sihirbazının "Karma" şemasında açtığı alt klasörün adı.</summary>
    private const string FinanceFolderTitle = "Finans";

    private readonly IDocumentAppService _documentAppService;
    private readonly IRepository<Document, Guid> _folderRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentAttachment, Guid> _attachmentRepository;
    private readonly IRepository<DocumentExpenseMatch, Guid> _expenseMatchRepository;
    private readonly IRepository<DocumentIncomeLink, Guid> _incomeLinkRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<Project, Guid> _projectRepository;

    public FinanceDocumentAppService(
        IDocumentAppService documentAppService,
        IRepository<Document, Guid> folderRepository,
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<DocumentAttachment, Guid> attachmentRepository,
        IRepository<DocumentExpenseMatch, Guid> expenseMatchRepository,
        IRepository<DocumentIncomeLink, Guid> incomeLinkRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<IncomeEntry, Guid> incomeRepository,
        IRepository<Project, Guid> projectRepository)
    {
        _documentAppService = documentAppService;
        _folderRepository = folderRepository;
        _fileRepository = fileRepository;
        _attachmentRepository = attachmentRepository;
        _expenseMatchRepository = expenseMatchRepository;
        _incomeLinkRepository = incomeLinkRepository;
        _expenseRepository = expenseRepository;
        _incomeRepository = incomeRepository;
        _projectRepository = projectRepository;
    }

    // Belgeler paketi kapalıysa Documents.Default reddedilir (izin paketin feature'ına bağlı).
    public virtual async Task<bool> CanAttachAsync()
        => await AuthorizationService.IsGrantedAsync(PlatformPermissions.Documents.Default)
           && await AuthorizationService.IsGrantedAsync(PlatformPermissions.Documents.Edit);

    [Authorize(PlatformPermissions.Documents.Default)]
    [Authorize(PlatformPermissions.Documents.Edit)]
    public virtual async Task AttachToExpenseAsync(
        Guid expenseId, string fileName, string storedFileName, string contentType, long fileSize)
    {
        var expense = await _expenseRepository.GetAsync(expenseId);
        var file = await AddToFolderAsync(expense.ProjectId, fileName, storedFileName, contentType, fileSize);

        // Skor 100: kullanıcı belgeyi bu gidere doğrudan ekledi, öneri değil.
        await _expenseMatchRepository.InsertAsync(
            new DocumentExpenseMatch(GuidGenerator.Create(), expense.TenantId, file.Id, expense.Id, 100, MatchSource.Manual),
            autoSave: true);

        // Eşleştirme ekranındaki elle bağlamayla aynı: bağlı belge "Eşleşti" durumuna geçer.
        file.ChangeStatus(DocumentFileStatus.Matched, CurrentUser.Id, Clock.Now);
        await _fileRepository.UpdateAsync(file, autoSave: true);
    }

    [Authorize(PlatformPermissions.Documents.Default)]
    [Authorize(PlatformPermissions.Documents.Edit)]
    public virtual async Task AttachToIncomeAsync(
        Guid incomeEntryId, string fileName, string storedFileName, string contentType, long fileSize)
    {
        var income = await _incomeRepository.GetAsync(incomeEntryId);
        var file = await AddToFolderAsync(income.ProjectId, fileName, storedFileName, contentType, fileSize);

        await _incomeLinkRepository.InsertAsync(
            new DocumentIncomeLink(GuidGenerator.Create(), income.TenantId, file.Id, income.Id),
            autoSave: true);
    }

    [Authorize(PlatformPermissions.Documents.Default)]
    public virtual async Task<List<ProjectExpenseDocumentDto>> GetExpenseDocumentsAsync(Guid expenseId)
    {
        return await ToDocumentsAsync((await _expenseMatchRepository.GetQueryableAsync())
            .Where(m => m.ExpenseId == expenseId)
            .OrderBy(m => m.CreationTime)
            .Select(m => m.DocumentFileId));
    }

    [Authorize(PlatformPermissions.Documents.Default)]
    public virtual async Task<List<ProjectExpenseDocumentDto>> GetIncomeDocumentsAsync(Guid incomeEntryId)
    {
        return await ToDocumentsAsync((await _incomeLinkRepository.GetQueryableAsync())
            .Where(l => l.IncomeEntryId == incomeEntryId)
            .OrderBy(l => l.CreationTime)
            .Select(l => l.DocumentFileId));
    }

    /* ─────────────────────────── Yardımcılar ─────────────────────────── */

    private async Task<DocumentFile> AddToFolderAsync(
        Guid? projectId, string fileName, string storedFileName, string contentType, long fileSize)
    {
        var folderId = await ResolveFolderAsync(projectId);

        // Belge Merkezi aynı klasörde aynı adı YENİ SÜRÜM sayar. Telefondan gelen iki fiş de
        // "image.jpg" olabilir: ikinci gider birincinin belgesine bağlanırdı.
        var attachment = await _documentAppService.AddAttachmentAsync(
            folderId, await FreeFileNameAsync(folderId, fileName), storedFileName, contentType, fileSize);

        return await _fileRepository.GetAsync(attachment.DocumentFileId);
    }

    private async Task<Guid> ResolveFolderAsync(Guid? projectId)
    {
        var folders = (await _folderRepository.GetQueryableAsync()).AsNoTracking();

        if (projectId.HasValue)
        {
            var rootId = await AsyncExecuter.FirstOrDefaultAsync(folders
                .Where(d => d.ProjectId == projectId && d.ParentDocumentId == null)
                .OrderBy(d => d.CreationTime)
                .Select(d => (Guid?)d.Id));

            if (rootId == null)
            {
                var project = await _projectRepository.GetAsync(projectId.Value);
                return await CreateFolderAsync(project.Name, project.Id, DocumentContextType.Custom);
            }

            var financeId = await AsyncExecuter.FirstOrDefaultAsync(folders
                .Where(d => d.ParentDocumentId == rootId && d.Title == FinanceFolderTitle)
                .OrderBy(d => d.CreationTime)
                .Select(d => (Guid?)d.Id));

            return financeId ?? rootId.Value;
        }

        var tenantFinanceId = await AsyncExecuter.FirstOrDefaultAsync(folders
            .Where(d => d.ProjectId == null && d.ParentDocumentId == null
                        && (d.ContextType == DocumentContextType.Finance || d.Title == FinanceFolderTitle))
            .OrderBy(d => d.CreationTime)
            .Select(d => (Guid?)d.Id));

        return tenantFinanceId
               ?? await CreateFolderAsync(FinanceFolderTitle, null, DocumentContextType.Finance);
    }

    private async Task<Guid> CreateFolderAsync(string title, Guid? projectId, DocumentContextType contextType)
    {
        var folder = new Document(GuidGenerator.Create(), CurrentTenant.Id, title, string.Empty, projectId, icon: "📁")
        {
            ContextType = contextType,
        };
        await _folderRepository.InsertAsync(folder, autoSave: true);
        return folder.Id;
    }

    private async Task<string> FreeFileNameAsync(Guid folderId, string fileName)
    {
        var stem = Path.GetFileNameWithoutExtension(fileName);
        var extension = Path.GetExtension(fileName);

        // Büyük/küçük harf duyarsız: SQL Server harmanlaması duyarsız, Postgres duyarlı karşılaştırır.
        var taken = (await AsyncExecuter.ToListAsync((await _attachmentRepository.GetQueryableAsync())
                .Where(a => a.DocumentId == folderId && a.IsLatest && a.FileName.StartsWith(stem))
                .Select(a => a.FileName)))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var candidate = fileName;
        for (var n = 2; taken.Contains(candidate); n++)
        {
            candidate = $"{stem} ({n}){extension}";
        }

        return candidate;
    }

    private async Task<List<ProjectExpenseDocumentDto>> ToDocumentsAsync(IQueryable<Guid> orderedFileIds)
    {
        var fileIds = await AsyncExecuter.ToListAsync(orderedFileIds);
        if (fileIds.Count == 0)
        {
            return new List<ProjectExpenseDocumentDto>();
        }

        var files = (await _fileRepository.GetListAsync(f => fileIds.Contains(f.Id) && f.LatestAttachmentId != null))
            .ToDictionary(f => f.Id);

        return fileIds
            .Where(files.ContainsKey)
            .Select(id => files[id])
            .Select(f => new ProjectExpenseDocumentDto
            {
                AttachmentId = f.LatestAttachmentId!.Value,
                Name = f.DisplayName,
                DownloadUrl = "/Documents?handler=DownloadAttachment&attachmentId=" + f.LatestAttachmentId,
            })
            .ToList();
    }
}
