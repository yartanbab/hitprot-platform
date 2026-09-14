using System;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Grants;

public interface IGrantCallDailyStatRepository : IRepository<GrantCallDailyStat, Guid>
{
    /// <summary>
    /// Günün satırını bir artırır, yoksa 1 ile açar. Artış tek SQL güncellemesidir; aynı anda gelen iki
    /// görüntülenme sayımı ezmez.
    /// </summary>
    Task IncrementAsync(Guid grantCallId, DateTime day, GrantCallStatKind kind);
}
