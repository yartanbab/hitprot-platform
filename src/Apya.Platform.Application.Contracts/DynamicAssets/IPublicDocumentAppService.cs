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
    Task<PublicDocumentDto> GetBySlugAsync(string slug);
}
