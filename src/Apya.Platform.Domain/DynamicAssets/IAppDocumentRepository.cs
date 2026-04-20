using System;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Custom repository interface for <see cref="AppDocument"/>.
/// Extends the standard ABP repository with domain-specific query methods.
/// </summary>
public interface IAppDocumentRepository : IRepository<AppDocument, Guid>
{
    /// <summary>
    /// Retrieves a document including its child blocks by the unique slug value.
    /// Returns null if no document matches the given slug.
    /// </summary>
    Task<AppDocument?> GetBySlugWithBlocksAsync(
        string slug,
        CancellationToken cancellationToken = default);
}
