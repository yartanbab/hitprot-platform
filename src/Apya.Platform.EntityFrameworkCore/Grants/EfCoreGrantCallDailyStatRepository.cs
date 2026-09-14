using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Guids;

namespace Apya.Platform.Grants;

public class EfCoreGrantCallDailyStatRepository
    : EfCoreRepository<PlatformDbContext, GrantCallDailyStat, Guid>,
      IGrantCallDailyStatRepository
{
    private readonly IGuidGenerator _guidGenerator;

    public EfCoreGrantCallDailyStatRepository(
        IDbContextProvider<PlatformDbContext> dbContextProvider,
        IGuidGenerator guidGenerator)
        : base(dbContextProvider)
    {
        _guidGenerator = guidGenerator;
    }

    public async Task IncrementAsync(Guid grantCallId, DateTime day, GrantCallStatKind kind)
    {
        var dbContext = await GetDbContextAsync();
        var date = day.Date;

        // Okuyup yazmak yerine tek UPDATE: aynı anda gelen iki görüntülenme birbirinin artışını ezmez.
        var updated = await dbContext.GrantCallDailyStats
            .Where(s => s.GrantCallId == grantCallId && s.Day == date && s.Kind == kind)
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.Count, x => x.Count + 1));

        if (updated == 0)
        {
            await dbContext.GrantCallDailyStats.AddAsync(new GrantCallDailyStat(_guidGenerator.Create(), grantCallId, date, kind, 1));
            await dbContext.SaveChangesAsync();
        }
    }
}
