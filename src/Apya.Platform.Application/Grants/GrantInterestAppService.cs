using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracı: çağrıya ilgi bildirme ("İlgileniyorum") ve kendi taleplerini izleme.
///
/// <para>🔴 Başvuruyu kiracı AÇMAZ. Talep host'un kutusuna düşer; süreç orada
/// başlatılır (<see cref="GrantInterestHostAppService"/>). Kiracıya doğrudan
/// başvuru açtıran uç HİÇ YOK — olsaydı bu kapı REST üzerinden atlanabilirdi.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantInterestAppService : PlatformAppService, IGrantInterestAppService
{
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantInterestAppService(
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _interestRepo = interestRepo;
        _appRepo = appRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _mtFilter = mtFilter;
    }

    public async Task<MyGrantInterestDto> ExpressAsync(ExpressGrantInterestInput input)
    {
        // Yalnız HOST kataloğuna ilgi bildirilebilir. Filtre kapalıyken TenantId koşulu
        // elle konmazsa kiracı, başka kiracının çağrı Id'siyle kendine talep açabilir.
        bool callExists;
        using (_mtFilter.Disable())
        {
            callExists = await _callRepo.FirstOrDefaultAsync(
                c => c.Id == input.GrantCallId && c.TenantId == null) != null;
        }
        if (!callExists)
        {
            throw new EntityNotFoundException(typeof(GrantCall), input.GrantCallId);
        }

        // Süren talep ya da açılmış başvuru varsa ikincisi yazılmaz. Uygun bulunmayan
        // talep ise kapıyı KAPATMAZ: firma durumunu düzeltip yeniden bildirebilir,
        // eski gerekçe geçmişte kalsın diye YENİ satır açılır.
        var pending = await _interestRepo.FirstOrDefaultAsync(
            i => i.GrantCallId == input.GrantCallId
                 && (i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor));
        var hasApplication = await _appRepo.FirstOrDefaultAsync(a => a.GrantCallId == input.GrantCallId) != null;
        if (pending != null || hasApplication)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestAlreadyOpen);
        }

        var interest = new GrantInterest(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            input.GrantCallId,
            CurrentUser.Id,
            input.Note);

        await _interestRepo.InsertAsync(interest, autoSave: true);

        var catalog = await ResolveCatalogAsync(new[] { interest.GrantCallId });
        return MapMine(interest, catalog);
    }

    public async Task<List<MyGrantInterestDto>> GetMineAsync()
    {
        var interests = await _interestRepo.GetListAsync();
        if (interests.Count == 0)
        {
            return new List<MyGrantInterestDto>();
        }

        var catalog = await ResolveCatalogAsync(interests.Select(i => i.GrantCallId));
        return interests
            .OrderByDescending(i => i.CreationTime)
            .Select(i => MapMine(i, catalog))
            .ToList();
    }

    /// <summary>Çağrı → (program adı, dönem). Katalog host'ta yaşıyor: filtre kapatılır.</summary>
    private async Task<Dictionary<Guid, (string Name, string? Period)>> ResolveCatalogAsync(
        IEnumerable<Guid> callIds)
    {
        var ids = callIds.Distinct().ToList();
        var map = new Dictionary<Guid, (string, string?)>();

        using (_mtFilter.Disable())
        {
            var calls = await _callRepo.GetListAsync(c => ids.Contains(c.Id) && c.TenantId == null);
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null))
                .ToDictionary(g => g.Id, g => g.Name);

            foreach (var call in calls)
            {
                map[call.Id] = (grants.GetValueOrDefault(call.GrantId, string.Empty), call.Period);
            }
        }

        return map;
    }

    private static MyGrantInterestDto MapMine(
        GrantInterest interest, Dictionary<Guid, (string Name, string? Period)> catalog)
    {
        var (name, period) = catalog.TryGetValue(interest.GrantCallId, out var found)
            ? found
            : (Name: string.Empty, Period: (string?)null);
        return new MyGrantInterestDto
        {
            Id = interest.Id,
            GrantCallId = interest.GrantCallId,
            GrantName = name,
            Period = period,
            CreationTime = interest.CreationTime,
            Status = interest.Status,
            Note = interest.Note,
            HostFeedback = interest.HostFeedback,
            GrantApplicationId = interest.GrantApplicationId
        };
    }
}
