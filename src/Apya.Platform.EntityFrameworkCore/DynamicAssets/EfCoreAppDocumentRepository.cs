using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Apya.Platform.DynamicAssets;
using Apya.Platform.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// EF Core implementation of <see cref="IAppDocumentRepository"/>.
/// Provides the custom slug-based query with eager-loaded blocks.
/// </summary>
public class EfCoreAppDocumentRepository
    : EfCoreRepository<PlatformDbContext, AppDocument, System.Guid>,
      IAppDocumentRepository
{
    public EfCoreAppDocumentRepository(
        IDbContextProvider<PlatformDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public async Task<AppDocument?> GetBySlugWithBlocksAsync(
        string slug,
        CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();

        return await dbContext.AppDocuments
            .Include(d => d.Blocks.OrderBy(b => b.Order))
            .FirstOrDefaultAsync(d => d.Slug == slug, cancellationToken);
    }
}
