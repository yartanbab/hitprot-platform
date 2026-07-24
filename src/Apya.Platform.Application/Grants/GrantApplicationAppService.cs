using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>Tenant başvuruları (minimal). "Başvur" idempotent; katalog okuması filtre-kapalı.</summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantApplicationAppService : ApplicationService, IGrantApplicationAppService
{
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantRecommendation, Guid> _recRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantApplicationAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantRecommendation, Guid> recRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _appRepo = appRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _recRepo = recRepo;
        _mtFilter = mtFilter;
    }

    public async Task<GrantApplicationDto> ApplyAsync(Guid grantCallId)
    {
        // İdempotent: aynı tenant+çağrı için varsa mevcut başvuruyu döndür.
        var existing = await _appRepo.FirstOrDefaultAsync(a => a.GrantCallId == grantCallId);
        if (existing != null)
        {
            return await ToDtoAsync(existing);
        }

        bool callExists;
        using (_mtFilter.Disable())
        {
            callExists = await _callRepo.FindAsync(grantCallId) != null;
        }
        if (!callExists)
        {
            throw new EntityNotFoundException(typeof(GrantCall), grantCallId);
        }

        var app = new GrantApplication(GuidGenerator.Create(), CurrentTenant.Id, grantCallId);
        await _appRepo.InsertAsync(app, autoSave: true);

        // Host bu çağrıyı bu firmaya göndermişse (B3), başvuruldu olarak işaretle.
        var rec = await _recRepo.FirstOrDefaultAsync(r => r.GrantCallId == grantCallId);
        if (rec != null)
        {
            rec.MarkApplied();
            await _recRepo.UpdateAsync(rec, autoSave: true);
        }

        return await ToDtoAsync(app);
    }

    public async Task<List<GrantApplicationDto>> GetMyApplicationsAsync()
    {
        var apps = await _appRepo.GetListAsync();
        var dtos = new List<GrantApplicationDto>();
        foreach (var a in apps)
        {
            dtos.Add(await ToDtoAsync(a));
        }
        return dtos.OrderByDescending(d => d.AppliedDate).ToList();
    }

    private async Task<GrantApplicationDto> ToDtoAsync(GrantApplication app)
    {
        var dto = ObjectMapper.Map<GrantApplication, GrantApplicationDto>(app);
        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FindAsync(app.GrantCallId);
            dto.Period = call?.Period;
            if (call != null)
            {
                var grant = await _grantRepo.FindAsync(call.GrantId);
                dto.GrantName = grant?.Name;
            }
        }
        return dto;
    }
}
