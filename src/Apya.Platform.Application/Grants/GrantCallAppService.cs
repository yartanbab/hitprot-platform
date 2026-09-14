using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

public class GrantCallAppService :
    CrudAppService<GrantCall, GrantCallDto, Guid, GetGrantCallListDto, CreateUpdateGrantCallDto>,
    IGrantCallAppService
{
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly GrantCallClosingManager _closingManager;

    public GrantCallAppService(
        IRepository<GrantCall, Guid> repository,
        IRepository<Grant, Guid> grantRepository,
        GrantCallClosingManager closingManager)
        : base(repository)
    {
        _grantRepository = grantRepository;
        _closingManager = closingManager;
        GetPolicyName = PlatformPermissions.Grants.Default;
        GetListPolicyName = PlatformPermissions.Grants.Default;
        CreatePolicyName = PlatformPermissions.Grants.Create;
        UpdatePolicyName = PlatformPermissions.Grants.Edit;
        DeletePolicyName = PlatformPermissions.Grants.Delete;
    }

    protected override async Task<IQueryable<GrantCall>> CreateFilteredQueryAsync(GetGrantCallListDto input)
    {
        var query = await base.CreateFilteredQueryAsync(input);
        return input.GrantId.HasValue
            ? query.Where(c => c.GrantId == input.GrantId.Value)
            : query;
    }

    // Çağrı yazma izinleri host-only tanımlıdır (PlatformPermissionDefinitionProvider).
    // Aşağısı ikinci kilit: izin verisi elle kurcalansa bile kiracı bağlamında çağrı açılamaz.
    protected override async Task CheckCreatePolicyAsync()
    {
        EnsureHostContext();
        await base.CheckCreatePolicyAsync();
    }

    protected override async Task CheckUpdatePolicyAsync()
    {
        EnsureHostContext();
        await base.CheckUpdatePolicyAsync();
    }

    protected override async Task CheckDeletePolicyAsync()
    {
        EnsureHostContext();
        await base.CheckDeletePolicyAsync();
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Hibe çağrısı yalnızca host bağlamında yönetilebilir.");
        }
    }

    /// <summary>
    /// 18b · Çağrı bu güncellemede KAPANDIYSA kapanış zinciri çalışır. Zaten kapalı çağrıyı yeniden
    /// kaydetmek zinciri tetiklemez; yeniden açılıp kapatılırsa bildirim log'u tekrarı engeller.
    /// </summary>
    public override async Task<GrantCallDto> UpdateAsync(Guid id, CreateUpdateGrantCallDto input)
    {
        var before = (await Repository.GetAsync(id)).Status;
        var dto = await base.UpdateAsync(id, input);

        if (before != GrantCallStatus.Kapandi && dto.Status == GrantCallStatus.Kapandi)
        {
            var result = await _closingManager.RunAsync(id);
            dto.ClosingSummary = new GrantCallClosingSummaryDto
            {
                MissedInterestCount = result.MissedInterestCount,
                UnfinishedApplicationCount = result.UnfinishedApplicationCount,
                NotifiedFirmCount = result.NotifiedFirmCount
            };
        }

        return dto;
    }

    // AutoMapper yerine domain kurucusu/guard'ı kullan (private setter'lar + SetSchedule kuralı).
    protected override Task<GrantCall> MapToEntityAsync(CreateUpdateGrantCallDto input)
    {
        var entity = new GrantCall(GuidGenerator.Create(), input.GrantId, input.Period, input.Status);
        entity.SetSchedule(input.OpenDate, input.Deadline);
        entity.Budget = input.Budget;
        entity.Reference = input.Reference;
        return Task.FromResult(entity);
    }

    protected override Task MapToEntityAsync(CreateUpdateGrantCallDto input, GrantCall entity)
    {
        entity.SetPeriod(input.Period);
        entity.Status = input.Status;
        entity.SetSchedule(input.OpenDate, input.Deadline);
        entity.Budget = input.Budget;
        entity.Reference = input.Reference;
        return Task.CompletedTask;
    }

    protected override async Task<GrantCallDto> MapToGetOutputDtoAsync(GrantCall entity)
    {
        var dto = await base.MapToGetOutputDtoAsync(entity);
        var grant = await _grantRepository.FindAsync(entity.GrantId);
        dto.GrantName = grant?.Name;
        return dto;
    }
}
