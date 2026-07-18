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
    private readonly IRepository<IdentityUser, Guid> _identityRepository;

    public DocumentAppService(
        IRepository<Document, Guid> repository,
        IRepository<DocumentAttachment, Guid> attachmentRepository,
        IRepository<IdentityUser, Guid> identityRepository)
        : base(repository)
    {
        _attachmentRepository = attachmentRepository;
        _identityRepository = identityRepository;
        CreatePolicyName = PlatformPermissions.Documents.Create;
        UpdatePolicyName = PlatformPermissions.Documents.Edit;
        DeletePolicyName = PlatformPermissions.Documents.Delete;
    }

    [Authorize(PlatformPermissions.Documents.Edit)]
    public virtual async Task<DocumentAttachmentDto> AddAttachmentAsync(Guid documentId, string fileName, string storedFileName, string contentType, long fileSize)
    {
        // Belge var mı + tenant sınırı repository filtreleriyle doğrulanır (yoksa EntityNotFoundException).
        await Repository.GetAsync(documentId);

        var attachment = new DocumentAttachment
        {
            DocumentId = documentId,
            FileName = fileName,
            StoredFileName = storedFileName,
            ContentType = contentType,
            FileSize = fileSize
        };
        await _attachmentRepository.InsertAsync(attachment);

        return await MapAttachmentToDtoAsync(attachment);
    }

    [Authorize(PlatformPermissions.Documents.Default)]
    public virtual async Task<List<DocumentAttachmentDto>> GetAttachmentsAsync(Guid documentId)
    {
        // DocumentAttachment IMultiTenant DEĞİL — sahiplik/tenant sınırı belge
        // üzerinden doğrulanmalı, yoksa GUID bilen başka tenant ekleri listeleyebilir.
        await Repository.GetAsync(documentId);

        var attachments = await _attachmentRepository.GetListAsync(x => x.DocumentId == documentId);

        var userIds = attachments.Select(x => x.CreatorId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
        var userQueryable = await _identityRepository.GetQueryableAsync();
        var users = await userQueryable.Where(u => userIds.Contains(u.Id)).ToListAsync();
        var userDict = users.ToDictionary(k => k.Id, v => v.UserName);

        return attachments
            .OrderByDescending(x => x.CreationTime)
            .Select(x => new DocumentAttachmentDto
            {
                Id = x.Id,
                CreationTime = x.CreationTime,
                FileName = x.FileName,
                ContentType = x.ContentType,
                FileSize = x.FileSize,
                DownloadUrl = "/file/get/" + x.StoredFileName,
                UploaderName = (x.CreatorId.HasValue && userDict.ContainsKey(x.CreatorId.Value)) ? userDict[x.CreatorId.Value] : "Sistem"
            }).ToList();
    }

    [Authorize(PlatformPermissions.Documents.Delete)]
    public virtual async Task DeleteAttachmentAsync(Guid attachmentId)
    {
        var attachment = await _attachmentRepository.GetAsync(attachmentId);

        // Ek tenant-filtreli değil; silme ancak ekin bağlı olduğu belge bu tenant'ta
        // görülebiliyorsa geçerli (aksi halde EntityNotFoundException).
        await Repository.GetAsync(attachment.DocumentId);

        await _attachmentRepository.DeleteAsync(attachment);
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
            FileName = attachment.FileName,
            ContentType = attachment.ContentType,
            FileSize = attachment.FileSize,
            DownloadUrl = "/file/get/" + attachment.StoredFileName,
            UploaderName = uploaderName
        };
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
