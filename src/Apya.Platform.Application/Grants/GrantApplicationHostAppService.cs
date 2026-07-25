using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// Host'un tüm tenant'ların başvuru pipeline'ını yönetmesi (Faz C — host ilerletir, tenant
/// salt-okunur izler). Yalnız host bağlamında çalışır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantApplicationHostAppService : ApplicationService, IGrantApplicationHostAppService
{
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantDisbursementTranche, Guid> _trancheRepo;
    private readonly IRepository<GrantMilestone, Guid> _milestoneRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly ICurrentTenant _currentTenant;

    public GrantApplicationHostAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantDisbursementTranche, Guid> trancheRepo,
        IRepository<GrantMilestone, Guid> milestoneRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        ITenantRepository tenantRepo,
        ICurrentTenant currentTenant)
    {
        _appRepo = appRepo;
        _trancheRepo = trancheRepo;
        _milestoneRepo = milestoneRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _tenantRepo = tenantRepo;
        _currentTenant = currentTenant;
    }

    public async Task<List<GrantApplicationDto>> GetListAsync()
    {
        EnsureHostContext();

        var calls = (await _callRepo.GetListAsync()).ToDictionary(c => c.Id);
        var grantIds = calls.Values.Select(c => c.GrantId).Distinct().ToList();
        var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id))).ToDictionary(g => g.Id);

        var tenants = await _tenantRepo.GetListAsync();
        var result = new List<GrantApplicationDto>();
        foreach (var tenant in tenants)
        {
            using (_currentTenant.Change(tenant.Id))
            {
                var apps = await _appRepo.GetListAsync();
                foreach (var app in apps)
                {
                    result.Add(await ToDtoAsync(app, tenant.Name, calls, grants));
                }
            }
        }

        return result.OrderByDescending(d => d.AppliedDate).ToList();
    }

    public async Task AdvanceStageAsync(AdvanceApplicationStageInput input)
    {
        EnsureHostContext();

        var tenantId = await FindApplicationTenantIdAsync(input.ApplicationId);
        using (_currentTenant.Change(tenantId))
        {
            var app = await _appRepo.GetAsync(input.ApplicationId);
            app.AdvanceStage(input.Stage, input.ApprovedAmount);
            await _appRepo.UpdateAsync(app, autoSave: true);
        }
    }

    public async Task<GrantDisbursementTrancheDto> AddTrancheAsync(Guid applicationId, CreateUpdateTrancheDto input)
    {
        EnsureHostContext();

        var tenantId = await FindApplicationTenantIdAsync(applicationId);
        using (_currentTenant.Change(tenantId))
        {
            var tranche = new GrantDisbursementTranche(GuidGenerator.Create(), tenantId, applicationId, input.SequenceNo, input.Amount, input.DueDate);
            await _trancheRepo.InsertAsync(tranche, autoSave: true);
            return ObjectMapper.Map<GrantDisbursementTranche, GrantDisbursementTrancheDto>(tranche);
        }
    }

    public async Task UpdateTrancheAsync(Guid trancheId, CreateUpdateTrancheDto input)
    {
        EnsureHostContext();

        var tenantId = await FindTrancheTenantIdAsync(trancheId);
        using (_currentTenant.Change(tenantId))
        {
            var tranche = await _trancheRepo.GetAsync(trancheId);
            tranche.Update(input.SequenceNo, input.Amount, input.Status, input.DueDate);
            await _trancheRepo.UpdateAsync(tranche, autoSave: true);
        }
    }

    public async Task DeleteTrancheAsync(Guid trancheId)
    {
        EnsureHostContext();

        var tenantId = await FindTrancheTenantIdAsync(trancheId);
        using (_currentTenant.Change(tenantId))
        {
            await _trancheRepo.DeleteAsync(trancheId);
        }
    }

    public async Task<GrantMilestoneDto> AddMilestoneAsync(Guid applicationId, CreateUpdateMilestoneDto input)
    {
        EnsureHostContext();

        var tenantId = await FindApplicationTenantIdAsync(applicationId);
        using (_currentTenant.Change(tenantId))
        {
            var milestone = new GrantMilestone(GuidGenerator.Create(), tenantId, applicationId, input.Title, input.DueDate);
            if (input.IsCompleted)
            {
                milestone.Complete();
            }
            await _milestoneRepo.InsertAsync(milestone, autoSave: true);
            return ObjectMapper.Map<GrantMilestone, GrantMilestoneDto>(milestone);
        }
    }

    public async Task UpdateMilestoneAsync(Guid milestoneId, CreateUpdateMilestoneDto input)
    {
        EnsureHostContext();

        var tenantId = await FindMilestoneTenantIdAsync(milestoneId);
        using (_currentTenant.Change(tenantId))
        {
            var milestone = await _milestoneRepo.GetAsync(milestoneId);
            milestone.Update(input.Title, input.DueDate, input.IsCompleted);
            await _milestoneRepo.UpdateAsync(milestone, autoSave: true);
        }
    }

    public async Task DeleteMilestoneAsync(Guid milestoneId)
    {
        EnsureHostContext();

        var tenantId = await FindMilestoneTenantIdAsync(milestoneId);
        using (_currentTenant.Change(tenantId))
        {
            await _milestoneRepo.DeleteAsync(milestoneId);
        }
    }

    private async Task<Guid?> FindApplicationTenantIdAsync(Guid applicationId)
    {
        foreach (var tenant in await _tenantRepo.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                if (await _appRepo.FindAsync(applicationId) != null)
                {
                    return tenant.Id;
                }
            }
        }
        throw new EntityNotFoundException(typeof(GrantApplication), applicationId);
    }

    private async Task<Guid?> FindTrancheTenantIdAsync(Guid trancheId)
    {
        foreach (var tenant in await _tenantRepo.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                if (await _trancheRepo.FindAsync(trancheId) != null)
                {
                    return tenant.Id;
                }
            }
        }
        throw new EntityNotFoundException(typeof(GrantDisbursementTranche), trancheId);
    }

    private async Task<Guid?> FindMilestoneTenantIdAsync(Guid milestoneId)
    {
        foreach (var tenant in await _tenantRepo.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                if (await _milestoneRepo.FindAsync(milestoneId) != null)
                {
                    return tenant.Id;
                }
            }
        }
        throw new EntityNotFoundException(typeof(GrantMilestone), milestoneId);
    }

    private async Task<GrantApplicationDto> ToDtoAsync(
        GrantApplication app, string tenantName,
        Dictionary<Guid, GrantCall> calls, Dictionary<Guid, Grant> grants)
    {
        var dto = ObjectMapper.Map<GrantApplication, GrantApplicationDto>(app);
        dto.TenantName = tenantName;
        if (calls.TryGetValue(app.GrantCallId, out var call))
        {
            dto.Period = call.Period;
            if (grants.TryGetValue(call.GrantId, out var grant))
            {
                dto.GrantName = grant.Name;
            }
        }

        var tranches = await _trancheRepo.GetListAsync(t => t.GrantApplicationId == app.Id);
        dto.Tranches = tranches.OrderBy(t => t.SequenceNo)
            .Select(t => ObjectMapper.Map<GrantDisbursementTranche, GrantDisbursementTrancheDto>(t)).ToList();

        var milestones = await _milestoneRepo.GetListAsync(m => m.GrantApplicationId == app.Id);
        dto.Milestones = milestones.OrderBy(m => m.DueDate)
            .Select(m => ObjectMapper.Map<GrantMilestone, GrantMilestoneDto>(m)).ToList();

        return dto;
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Bu işlem yalnızca host bağlamında yapılabilir.");
        }
    }
}
