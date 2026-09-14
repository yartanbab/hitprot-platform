using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Public-facing application service for retrieving published documents by slug.
/// Designed for anonymous (unauthenticated) access via Headless API.
/// </summary>
public interface IPublicDocumentAppService : IApplicationService
{
    /// <summary>
    /// Retrieves a published document with its blocks by the unique slug.
    /// Returns only the publicly-safe fields needed for form rendering.
    /// </summary>
    /// <param name="slug">Form slug (unique per tenant).</param>
    /// <param name="tenantId">Form owner's tenant, carried by a tenant form's public link. Empty:
    /// the caller's own tenant, then (for a signed-in tenant user) the host's forms.</param>
    Task<PublicDocumentDto> GetBySlugAsync(string slug, Guid? tenantId = null);
}
