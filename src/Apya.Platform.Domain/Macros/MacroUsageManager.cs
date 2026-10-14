using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro kullanım sayacının kuralları: günlük toplama, 30 günlük pencere, pencere dışının silinmesi.
/// Anahtarın katalogda olup olmadığına uygulama katmanı bakar (katalog Application.Contracts'ta).
/// </summary>
public class MacroUsageManager : DomainService
{
    private readonly IRepository<MacroUsageDaily, Guid> _repository;
    private readonly IDataFilter<IMultiTenant> _tenantFilter;

    public MacroUsageManager(IRepository<MacroUsageDaily, Guid> repository, IDataFilter<IMultiTenant> tenantFilter)
    {
        _repository = repository;
        _tenantFilter = tenantFilter;
    }

    /// <summary>Penceredeki ilk gün (bugün dahil <see cref="MacroUsageConsts.WindowDays"/> gün).</summary>
    public static DateTime WindowStart(DateTime now) => now.Date.AddDays(-(MacroUsageConsts.WindowDays - 1));

    public async Task RecordAsync(Guid userId, string macroKey, DateTime now)
    {
        var day = now.Date;
        var row = await _repository.FirstOrDefaultAsync(x =>
            x.UserId == userId && x.MacroKey == macroKey && x.Day == day);

        if (row == null)
        {
            // Kiracı açıkça verilir: ABP TenantId'yi nesne kurulurken atar, sonradan değil.
            await _repository.InsertAsync(new MacroUsageDaily(GuidGenerator.Create(), CurrentTenant.Id, userId, macroKey, day));
            return;
        }

        row.Increment();
        await _repository.UpdateAsync(row);
    }

    /// <summary>Penceredeki kullanım, makro anahtarına göre toplam (yalnız verilen kullanıcı).</summary>
    public async Task<Dictionary<string, int>> GetCountsAsync(Guid userId, DateTime now)
    {
        var since = WindowStart(now);
        var query = (await _repository.GetQueryableAsync())
            .Where(x => x.UserId == userId && x.Day >= since)
            .GroupBy(x => x.MacroKey)
            .Select(g => new { Key = g.Key, Count = g.Sum(x => x.Count) });

        return (await AsyncExecuter.ToListAsync(query)).ToDictionary(x => x.Key, x => x.Count, StringComparer.Ordinal);
    }

    /// <summary>Pencere dışı satırları TÜM kiracılarda siler; silinen satır sayısını döner.</summary>
    public async Task<int> DeleteOutsideWindowAsync(DateTime now)
    {
        var since = WindowStart(now);
        using (_tenantFilter.Disable())
        {
            var count = await AsyncExecuter.CountAsync((await _repository.GetQueryableAsync()).Where(x => x.Day < since));
            if (count > 0)
            {
                await _repository.DeleteDirectAsync(x => x.Day < since);
            }

            return count;
        }
    }
}
