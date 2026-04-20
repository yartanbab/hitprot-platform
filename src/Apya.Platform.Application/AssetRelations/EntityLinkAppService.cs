using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.AssetRelations.Dtos;

namespace Apya.Platform.AssetRelations;

/// <summary>
/// Manages polymorphic entity links between source and target entities.
/// Enables loosely-coupled relationships like Task → Document, Project → Document.
/// </summary>
[Authorize]
public class EntityLinkAppService : PlatformAppService, IEntityLinkAppService
{
    private readonly IRepository<EntityLink, Guid> _entityLinkRepository;
    private readonly ILogger<EntityLinkAppService> _logger;

    public EntityLinkAppService(
        IRepository<EntityLink, Guid> entityLinkRepository,
        ILogger<EntityLinkAppService> logger)
    {
        _entityLinkRepository = entityLinkRepository;
        _logger = logger;
    }

    public async Task<EntityLinkDto> CreateLinkAsync(CreateEntityLinkDto input)
    {
        var entityLink = new EntityLink(
            GuidGenerator.Create(),
            input.SourceEntityName,
            input.SourceEntityId,
            input.TargetEntityName,
            input.TargetEntityId,
            input.RelationType
        );

        await _entityLinkRepository.InsertAsync(entityLink, autoSave: true);

        _logger.LogInformation(
            "Varlık bağlantısı oluşturuldu. LinkId: {LinkId}, Source: {SourceEntityName}/{SourceEntityId}, Target: {TargetEntityName}/{TargetEntityId}",
            entityLink.Id,
            entityLink.SourceEntityName,
            entityLink.SourceEntityId,
            entityLink.TargetEntityName,
            entityLink.TargetEntityId);

        return ObjectMapper.Map<EntityLink, EntityLinkDto>(entityLink);
    }

    public async Task<List<EntityLinkDto>> GetLinksForSourceAsync(
        string sourceEntityName,
        Guid sourceEntityId)
    {
        var links = await _entityLinkRepository.GetListAsync(
            l => l.SourceEntityName == sourceEntityName
              && l.SourceEntityId == sourceEntityId
        );

        return ObjectMapper.Map<List<EntityLink>, List<EntityLinkDto>>(links);
    }

    public async Task RemoveLinkAsync(Guid linkId)
    {
        await _entityLinkRepository.DeleteAsync(linkId);

        _logger.LogInformation(
            "Varlık bağlantısı silindi. LinkId: {LinkId}", linkId);
    }
}
