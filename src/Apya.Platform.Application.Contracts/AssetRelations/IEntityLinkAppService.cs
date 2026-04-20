using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.AssetRelations.Dtos;

namespace Apya.Platform.AssetRelations;

/// <summary>
/// Application service interface for managing polymorphic entity links.
/// </summary>
public interface IEntityLinkAppService : IApplicationService
{
    /// <summary>
    /// Creates a new link between a source and target entity.
    /// </summary>
    Task<EntityLinkDto> CreateLinkAsync(CreateEntityLinkDto input);

    /// <summary>
    /// Retrieves all links originating from a specific source entity.
    /// Example: Get all documents linked to a specific Task.
    /// </summary>
    Task<List<EntityLinkDto>> GetLinksForSourceAsync(string sourceEntityName, Guid sourceEntityId);

    /// <summary>
    /// Removes an existing link by its ID.
    /// </summary>
    Task RemoveLinkAsync(Guid linkId);
}
