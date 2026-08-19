using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Apya.Platform.Permissions;

namespace Apya.Platform.Documents;

/// <summary>
/// Etkinlik sekmesi — değiştirilemez denetim izi.
/// Yalnızca okuma uçları var: kayıt ekleme, ilgili işlemi yapan servislerin
/// içinde olur; güncelleme/silme ucu bilinçli olarak YOK.
/// </summary>
[Authorize(PlatformPermissions.Documents.ViewAccessLog)]
public class DocumentActivityAppService : ApplicationService, IDocumentActivityAppService
{
    private readonly IRepository<DocumentAccessLog, Guid> _logRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<IdentityUser, Guid> _identityRepository;

    public DocumentActivityAppService(
        IRepository<DocumentAccessLog, Guid> logRepository,
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<Document, Guid> documentRepository,
        IRepository<IdentityUser, Guid> identityRepository)
    {
        _logRepository = logRepository;
        _fileRepository = fileRepository;
        _documentRepository = documentRepository;
        _identityRepository = identityRepository;
    }

    public virtual async Task<PagedResultDto<DocumentActivityDto>> GetListAsync(GetDocumentActivityInput input)
    {
        var queryable = (await _logRepository.GetQueryableAsync()).AsNoTracking();

        if (input.DocumentFileId.HasValue)
        {
            queryable = queryable.Where(l => l.DocumentFileId == input.DocumentFileId.Value);
        }

        if (input.ProjectId.HasValue)
        {
            // Proje filtresi belge üzerinden kurulur — log'da ProjectId kolonu yok
            // (belge proje değiştirirse iz de yeni projeyle görünmeli).
            var fileQueryable = await _fileRepository.GetQueryableAsync();
            var projectFileIds = fileQueryable.Where(f => f.ProjectId == input.ProjectId.Value).Select(f => f.Id);
            queryable = queryable.Where(l => l.DocumentFileId != null && projectFileIds.Contains(l.DocumentFileId!.Value));
        }

        if (input.Action.HasValue)
        {
            queryable = queryable.Where(l => l.Action == input.Action.Value);
        }

        if (input.DateFrom.HasValue)
        {
            queryable = queryable.Where(l => l.CreationTime >= input.DateFrom.Value);
        }

        if (input.DateTo.HasValue)
        {
            var upper = input.DateTo.Value.Date.AddDays(1);
            queryable = queryable.Where(l => l.CreationTime < upper);
        }

        var totalCount = await AsyncExecuter.CountAsync(queryable);

        // Denetim izi daima en yeniden eskiye — kullanıcı sıralaması kabul edilmez.
        var logs = await AsyncExecuter.ToListAsync(
            queryable.OrderByDescending(l => l.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount));

        var dtos = await MapAsync(logs);
        return new PagedResultDto<DocumentActivityDto>(totalCount, dtos);
    }

    private async Task<List<DocumentActivityDto>> MapAsync(List<DocumentAccessLog> logs)
    {
        if (logs.Count == 0)
        {
            return new List<DocumentActivityDto>();
        }

        var userIds = logs.Where(l => l.CreatorId.HasValue).Select(l => l.CreatorId!.Value).Distinct().ToList();
        var userQueryable = await _identityRepository.GetQueryableAsync();
        var userNames = (await AsyncExecuter.ToListAsync(
                userQueryable.AsNoTracking().Where(u => userIds.Contains(u.Id)).Select(u => new { u.Id, u.UserName })))
            .ToDictionary(k => k.Id, v => v.UserName);

        var fileIds = logs.Where(l => l.DocumentFileId.HasValue).Select(l => l.DocumentFileId!.Value).Distinct().ToList();
        var fileQueryable = await _fileRepository.GetQueryableAsync();
        var fileNames = (await AsyncExecuter.ToListAsync(
                fileQueryable.AsNoTracking().Where(f => fileIds.Contains(f.Id)).Select(f => new { f.Id, f.DisplayName })))
            .ToDictionary(k => k.Id, v => v.DisplayName);

        var documentIds = logs.Select(l => l.DocumentId).Distinct().ToList();
        var documentQueryable = await _documentRepository.GetQueryableAsync();
        var folderNames = (await AsyncExecuter.ToListAsync(
                documentQueryable.AsNoTracking().Where(d => documentIds.Contains(d.Id)).Select(d => new { d.Id, d.Title })))
            .ToDictionary(k => k.Id, v => v.Title);

        return logs.Select(log => new DocumentActivityDto
        {
            Id = log.Id,
            CreationTime = log.CreationTime,
            CreatorId = log.CreatorId,
            ActorName = log.CreatorId.HasValue && userNames.TryGetValue(log.CreatorId.Value, out var name)
                ? name
                : "Sistem",
            ActorRole = log.ActorRole,
            Action = log.Action,
            Detail = log.Detail,
            DocumentId = log.DocumentId,
            FolderName = folderNames.GetValueOrDefault(log.DocumentId),
            DocumentFileId = log.DocumentFileId,
            DocumentFileName = log.DocumentFileId.HasValue
                ? fileNames.GetValueOrDefault(log.DocumentFileId.Value)
                : null,
        }).ToList();
    }
}
