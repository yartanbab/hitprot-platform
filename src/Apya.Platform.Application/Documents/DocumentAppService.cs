using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;

namespace Apya.Platform.Documents;

[Authorize(PlatformPermissions.Documents.Default)]
public class DocumentAppService :
    CrudAppService<
        Document,
        DocumentDto,
        Guid,
        GetDocumentsInput,
        CreateUpdateDocumentDto>,
    IDocumentAppService
{
    private readonly IRepository<DocumentAttachment, Guid> _attachmentRepository;
    private readonly IRepository<DocumentFile, Guid> _documentFileRepository;
    private readonly IRepository<DocumentAccessLog, Guid> _accessLogRepository;
    private readonly IRepository<IdentityUser, Guid> _identityRepository;
    private readonly IRepository<Project, Guid> _projectRepository;

    public DocumentAppService(
        IRepository<Document, Guid> repository,
        IRepository<DocumentAttachment, Guid> attachmentRepository,
        IRepository<DocumentFile, Guid> documentFileRepository,
        IRepository<DocumentAccessLog, Guid> accessLogRepository,
        IRepository<IdentityUser, Guid> identityRepository,
        IRepository<Project, Guid> projectRepository)
        : base(repository)
    {
        _attachmentRepository = attachmentRepository;
        _documentFileRepository = documentFileRepository;
        _accessLogRepository = accessLogRepository;
        _identityRepository = identityRepository;
        _projectRepository = projectRepository;
        CreatePolicyName = PlatformPermissions.Documents.Create;
        UpdatePolicyName = PlatformPermissions.Documents.Edit;
        DeletePolicyName = PlatformPermissions.Documents.Delete;
    }

    [Authorize(PlatformPermissions.Documents.Edit)]
    public virtual async Task<DocumentAttachmentDto> AddAttachmentAsync(Guid documentId, string fileName, string storedFileName, string contentType, long fileSize)
    {
        // Belge var mı + tenant sınırı repository filtreleriyle doğrulanır (yoksa EntityNotFoundException).
        //
        // 🔴 İZLEMEDEN oku. Repository.GetAsync klasörü değişiklik izleyicisine alıyordu;
        // altına DocumentFile/DocumentAttachment eklenince EF, ilişki düzeltmesi sırasında
        // klasörü de "değişmiş" sayıp ConcurrencyStamp'li bir UPDATE üretiyordu. AYNI
        // klasöre eşzamanlı iki yükleme geldiğinde ikincisi AbpDbConcurrencyException ile
        // düşüyordu — yükleme kuyruğunda 4 dosyanın 2-3'ü HER SEFERİNDE hata veriyordu,
        // iki kullanıcı aynı klasöre aynı anda yüklediğinde de aynısı olurdu.
        // Burada yalnız varlık kontrolü ve ProjectId gerekiyor; izlemeye gerek yok.
        var folderQueryable = await Repository.GetQueryableAsync();
        var folder = await AsyncExecuter.FirstOrDefaultAsync(
            folderQueryable.AsNoTracking().Where(d => d.Id == documentId));

        if (folder == null)
        {
            throw new EntityNotFoundException(typeof(Document), documentId);
        }

        // Aynı klasörde aynı isimde bir dosya zaten varsa: yeni yükleme onun yeni versiyonu olur.
        var existingLatest = (await _attachmentRepository.GetListAsync(x =>
                x.DocumentId == documentId && x.FileName == fileName && x.IsLatest))
            .FirstOrDefault();

        // Meta verinin sahibi DocumentFile'dır: yeni versiyon mevcut belgeye eklenir,
        // yeni dosya ise yeni bir belge açar (tür/tutar/dönem sonradan doldurulur).
        var documentFile = existingLatest != null
            ? await _documentFileRepository.GetAsync(existingLatest.DocumentFileId)
            : null;

        if (documentFile == null)
        {
            documentFile = new DocumentFile(
                GuidGenerator.Create(),
                CurrentTenant.Id,
                documentId,
                fileName,
                projectId: folder.ProjectId);

            await _documentFileRepository.InsertAsync(documentFile, autoSave: true);
        }
        else
        {
            documentFile.EnsureNotLocked();
        }

        var newId = GuidGenerator.Create();
        var attachment = new DocumentAttachment(newId)
        {
            TenantId = CurrentTenant.Id,
            DocumentId = documentId,
            DocumentFileId = documentFile.Id,
            FileName = fileName,
            StoredFileName = storedFileName,
            ContentType = contentType,
            FileSize = fileSize,
            VersionGroupId = existingLatest?.VersionGroupId ?? newId,
            VersionNumber = (existingLatest?.VersionNumber ?? 0) + 1,
            IsLatest = true
        };

        if (existingLatest != null)
        {
            existingLatest.IsLatest = false;
            await _attachmentRepository.UpdateAsync(existingLatest);
        }

        await _attachmentRepository.InsertAsync(attachment, autoSave: true);

        // VersionNumber artan bir sayaçtır (aradan versiyon silinmiş olabilir);
        // görünen "N versiyon" sayısı için gerçek satır sayısı okunur.
        var versionCount = await _attachmentRepository.CountAsync(x => x.DocumentFileId == documentFile.Id);
        documentFile.RegisterVersion(attachment.Id, versionCount);
        await _documentFileRepository.UpdateAsync(documentFile);

        await _accessLogRepository.InsertAsync(new DocumentAccessLog(
            GuidGenerator.Create(), CurrentTenant.Id, documentId, attachment.Id,
            DocumentAccessAction.Uploaded, documentFile.Id,
            attachment.VersionNumber > 1 ? $"v{attachment.VersionNumber}" : null,
            CurrentUser.Roles?.FirstOrDefault()));

        return await MapAttachmentToDtoAsync(attachment);
    }

    [Authorize(PlatformPermissions.Documents.Default)]
    public virtual async Task<List<DocumentAttachmentDto>> GetAttachmentsAsync(Guid documentId, bool includeHistory = false)
    {
        // DocumentAttachment artık IMultiTenant — tenant izolasyonu ABP'nin data filter'ı tarafından otomatik sağlanır.
        await Repository.GetAsync(documentId);

        var attachments = await _attachmentRepository.GetListAsync(x =>
            x.DocumentId == documentId && (includeHistory || x.IsLatest));

        var ordered = includeHistory
            ? attachments.OrderBy(x => x.FileName).ThenByDescending(x => x.VersionNumber)
            : attachments.OrderByDescending(x => x.CreationTime);

        var userIds = attachments.Select(x => x.CreatorId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
        var userQueryable = await _identityRepository.GetQueryableAsync();
        var users = await userQueryable.Where(u => userIds.Contains(u.Id)).ToListAsync();
        var userDict = users.ToDictionary(k => k.Id, v => v.UserName);

        return ordered
            .Select(x => new DocumentAttachmentDto
            {
                Id = x.Id,
                CreationTime = x.CreationTime,
                DocumentId = x.DocumentId,
                DocumentFileId = x.DocumentFileId,
                FileName = x.FileName,
                ContentType = x.ContentType,
                FileSize = x.FileSize,
                DownloadUrl = "/Documents?handler=DownloadAttachment&attachmentId=" + x.Id,
                UploaderName = (x.CreatorId.HasValue && userDict.ContainsKey(x.CreatorId.Value)) ? userDict[x.CreatorId.Value] : "Sistem",
                VersionGroupId = x.VersionGroupId,
                VersionNumber = x.VersionNumber,
                IsLatest = x.IsLatest
            }).ToList();
    }

    [Authorize(PlatformPermissions.Documents.Delete)]
    public virtual async Task DeleteAttachmentAsync(Guid attachmentId)
    {
        var attachment = await _attachmentRepository.GetAsync(attachmentId);

        // Ek artık IMultiTenant; ek olarak belgenin de bu tenant'ta görülebilir olduğu doğrulanır.
        await Repository.GetAsync(attachment.DocumentId);

        var documentFile = await _documentFileRepository.FindAsync(attachment.DocumentFileId);
        documentFile?.EnsureNotLocked();

        await _accessLogRepository.InsertAsync(new DocumentAccessLog(
            GuidGenerator.Create(), CurrentTenant.Id, attachment.DocumentId, attachment.Id,
            DocumentAccessAction.Deleted, attachment.DocumentFileId,
            $"v{attachment.VersionNumber}", CurrentUser.Roles?.FirstOrDefault()));

        await _attachmentRepository.DeleteAsync(attachment, autoSave: true);

        if (documentFile == null)
        {
            return;
        }

        // Versiyon silindikten sonra belgenin denormalize alanları tazelenir;
        // son versiyon da gittiyse belge (meta verisiyle birlikte) anlamsız kalır, silinir.
        var remaining = await _attachmentRepository.GetListAsync(x => x.DocumentFileId == documentFile.Id);

        if (remaining.Count == 0)
        {
            await _documentFileRepository.DeleteAsync(documentFile);
            return;
        }

        var latest = remaining.OrderByDescending(x => x.VersionNumber).First();
        if (!latest.IsLatest)
        {
            latest.IsLatest = true;
            await _attachmentRepository.UpdateAsync(latest);
        }

        documentFile.RegisterVersion(latest.Id, remaining.Count);
        await _documentFileRepository.UpdateAsync(documentFile);
    }

    [Authorize(PlatformPermissions.Documents.ViewAccessLog)]
    public virtual async Task<List<DocumentAccessLogDto>> GetAccessLogAsync(Guid documentId)
    {
        await Repository.GetAsync(documentId);

        var logs = await _accessLogRepository.GetListAsync(x => x.DocumentId == documentId);

        var userIds = logs.Select(x => x.CreatorId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
        var userQueryable = await _identityRepository.GetQueryableAsync();
        var users = await userQueryable.Where(u => userIds.Contains(u.Id)).ToListAsync();
        var userDict = users.ToDictionary(k => k.Id, v => v.UserName);

        return logs
            .OrderByDescending(x => x.CreationTime)
            .Take(50)
            .Select(x => new DocumentAccessLogDto
            {
                Id = x.Id,
                CreationTime = x.CreationTime,
                CreatorId = x.CreatorId,
                DocumentId = x.DocumentId,
                AttachmentId = x.AttachmentId,
                Action = x.Action,
                ActorName = (x.CreatorId.HasValue && userDict.ContainsKey(x.CreatorId.Value)) ? userDict[x.CreatorId.Value] : "Sistem"
            }).ToList();
    }

    [Authorize(PlatformPermissions.Documents.Default)]
    public virtual async Task<DocumentAttachmentDownloadDto> PrepareDownloadAsync(Guid attachmentId)
    {
        var attachment = await _attachmentRepository.GetAsync(attachmentId);
        await Repository.GetAsync(attachment.DocumentId);

        await _accessLogRepository.InsertAsync(new DocumentAccessLog(
            GuidGenerator.Create(), CurrentTenant.Id, attachment.DocumentId, attachment.Id,
            DocumentAccessAction.Downloaded, attachment.DocumentFileId,
            null, CurrentUser.Roles?.FirstOrDefault()));

        return new DocumentAttachmentDownloadDto
        {
            StoredFileName = attachment.StoredFileName,
            FileName = attachment.FileName,
            ContentType = attachment.ContentType
        };
    }

    private async Task<DocumentAttachmentDto> MapAttachmentToDtoAsync(DocumentAttachment attachment)
    {
        string uploaderName = "Sistem";
        if (attachment.CreatorId.HasValue)
        {
            var user = await _identityRepository.FindAsync(attachment.CreatorId.Value);
            if (user != null) uploaderName = user.UserName;
        }

        return new DocumentAttachmentDto
        {
            Id = attachment.Id,
            CreationTime = attachment.CreationTime,
            DocumentId = attachment.DocumentId,
            DocumentFileId = attachment.DocumentFileId,
            FileName = attachment.FileName,
            ContentType = attachment.ContentType,
            FileSize = attachment.FileSize,
            DownloadUrl = "/Documents?handler=DownloadAttachment&attachmentId=" + attachment.Id,
            UploaderName = uploaderName,
            VersionGroupId = attachment.VersionGroupId,
            VersionNumber = attachment.VersionNumber,
            IsLatest = attachment.IsLatest
        };
    }

    protected override async Task<List<DocumentDto>> MapToGetListOutputDtosAsync(List<Document> entities)
    {
        var dtos = await base.MapToGetListOutputDtosAsync(entities);

        var projectIds = entities.Where(x => x.ProjectId.HasValue).Select(x => x.ProjectId!.Value).Distinct().ToList();
        if (projectIds.Count > 0)
        {
            var projects = await _projectRepository.GetListAsync(x => projectIds.Contains(x.Id));
            var projectNames = projects.ToDictionary(x => x.Id, x => x.Name);

            foreach (var dto in dtos)
            {
                if (dto.ProjectId.HasValue && projectNames.TryGetValue(dto.ProjectId.Value, out var name))
                {
                    dto.ProjectName = name;
                }
            }
        }

        return dtos;
    }

    protected override async Task<IQueryable<Document>> CreateFilteredQueryAsync(GetDocumentsInput input)
    {
        var query = await base.CreateFilteredQueryAsync(input);

        if (!string.IsNullOrWhiteSpace(input.FilterText))
        {
            query = query.Where(d => d.Title.Contains(input.FilterText) || d.Content.Contains(input.FilterText));
        }

        if (input.ProjectId.HasValue)
        {
            query = query.Where(d => d.ProjectId == input.ProjectId);
        }

        if (input.RootLevelOnly)
        {
            query = query.Where(d => d.ParentDocumentId == null);
        }
        else if (input.ParentDocumentId.HasValue)
        {
            query = query.Where(d => d.ParentDocumentId == input.ParentDocumentId);
        }

        return query;
    }
}
