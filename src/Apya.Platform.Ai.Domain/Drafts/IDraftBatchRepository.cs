using System;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Ai.Drafts;

public interface IDraftBatchRepository : IRepository<DraftBatch, Guid>
{
}
