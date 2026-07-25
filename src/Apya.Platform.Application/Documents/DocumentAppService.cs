using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
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
    private readonly IRepository<DocumentAccessLog, Guid> _accessLogRepository;
    private readonly IRepository<IdentityUser, Guid> _identityRepository;
    private readonly IRepository<Project, Guid> _projectRepository;

    public DocumentAppService(
        IRepository<Document, Guid> repository,
        IRepository<DocumentAttachment, Guid> attachmentRepository,
        IRepository<DocumentAccessLog, Guid> accessLogRepository,
        IRepository<IdentityUser, Guid> identityRepository,
        IRepository<Project, Guid> projectRepository)
        : base(repository)
    {
        _attachmentRepository = attachmentRepository;
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
        await Repository.GetAsync(documentId);

        // Aynı klasörde aynı isimde bir dosya zaten varsa: yeni yükleme onun yeni versiyonu olur.
        var existingLatest = (await _attachmentRepository.GetListAsync(x =>
                x.DocumentId == documentId && x.FileName == fileName && x.IsLatest))
            .FirstOrDefault();

        var newId = GuidGenerator.Create();
        var attachment = new DocumentAttachment(newId)
        {
            TenantId = CurrentTenant.Id,
            DocumentId = documentId,
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

        await _attachmentRepository.InsertAsync(attachment);
        await _accessLogRepository.InsertAsync(new DocumentAccessLog(
            GuidGenerator.Create(), CurrentTenant.Id, documentId, attachment.Id, DocumentAccessAction.Uploaded));

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

        await _accessLogRepository.InsertAsync(new DocumentAccessLog(
            GuidGenerator.Create(), CurrentTenant.Id, attachment.DocumentId, attachment.Id, DocumentAccessAction.Deleted));

        await _attachmentRepository.DeleteAsync(attachment);
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
            GuidGenerator.Create(), CurrentTenant.Id, attachment.DocumentId, attachment.Id, DocumentAccessAction.Downloaded));

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
