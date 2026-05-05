using System;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Ai;

public interface IAiRequestRepository : IRepository<AiRequest, Guid>
{
}
