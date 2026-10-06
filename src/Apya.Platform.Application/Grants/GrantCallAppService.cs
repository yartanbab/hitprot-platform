using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

public class GrantCallAppService :
    CrudAppService<GrantCall, GrantCallDto, Guid, GetGrantCallListDto, CreateUpdateGrantCallDto>,
    IGrantCallAppService
{
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantApplication, Guid> _applicationRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly GrantCallClosingManager _closingManager;

    public GrantCallAppService(
        IRepository<GrantCall, Guid> repository,
        IRepository<Grant, Guid> grantRepository,
        IRepository<GrantApplication, Guid> applicationRepository,
        IDataFilter<IMultiTenant> mtFilter,
        GrantCallClosingManager closingManager)
        : base(repository)
    {
        _grantRepository = grantRepository;
        _applicationRepository = applicationRepository;
        _mtFilter = mtFilter;
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

    /// <summary>
    /// Üzerinde başvuru olan çağrı silinemez. Silinince başvurular yetim kalıyordu: firma kendi
    /// başvurusunun ayrıntısını, evrakını ve uygulama ekranını açamıyor ("kayıt bulunamadı"),
    /// danışmanın listesinde satır adsız görünüyordu. Sessizce bağı koparmak yerine reddet
    /// (emsal: <see cref="GrantStageTemplateAppService.DeleteAsync"/>); başvuru almış çağrı
    /// silinmez, KAPATILIR.
    /// </summary>
    protected override async Task DeleteByIdAsync(Guid id)
    {
        int applicationCount;
        // Çağrı host kataloğunda, başvurular kiracılarda durur: süzgeç açıkken host hiçbirini
        // göremez ve sayım hep 0 çıkar. Buraya yalnız host bağlamında gelinir (CheckDeletePolicyAsync).
        using (_mtFilter.Disable())
        {
            applicationCount = (int)await _applicationRepository.CountAsync(a => a.GrantCallId == id);
        }

        if (applicationCount > 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantCallInUse)
                .WithData("ApplicationCount", applicationCount);
        }

        await base.DeleteByIdAsync(id);
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
