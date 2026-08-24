using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

public class GrantAppService :
    CrudAppService<
        Grant,
        GrantDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateUpdateGrantDto>,
    IGrantAppService
{
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepository;

    public GrantAppService(
        IRepository<Grant, Guid> repository,
        IRepository<GrantCall, Guid> callRepository,
        IRepository<GrantCriteriaTag, Guid> criteriaRepository)
        : base(repository)
    {
        _callRepository = callRepository;
        _criteriaRepository = criteriaRepository;
        GetPolicyName    = PlatformPermissions.Grants.Default;
        GetListPolicyName = PlatformPermissions.Grants.Default;
        CreatePolicyName = PlatformPermissions.Grants.Create;
        UpdatePolicyName = PlatformPermissions.Grants.Edit;
        DeletePolicyName = PlatformPermissions.Grants.Delete;
    }

    protected override async Task<GrantDto> MapToGetOutputDtoAsync(Grant entity)
    {
        var dto = await base.MapToGetOutputDtoAsync(entity);
        dto.CallCount = (int)await _callRepository.CountAsync(c => c.GrantId == entity.Id);
        var tags = await _criteriaRepository.GetListAsync(t => t.GrantId == entity.Id);
        dto.CriteriaTags = tags
            .Select(t => new GrantCriteriaTagDto { Kind = t.Kind, Value = t.Value })
            .ToList();
        return dto;
    }

    // Liste de CallCount + kriterleri taşısın (base list mapping bunları atlar).
    // Host kataloğu küçük olduğundan program başına sorgu (N+1) kabul edilebilir.
    protected override Task<GrantDto> MapToGetListOutputDtoAsync(Grant entity)
        => MapToGetOutputDtoAsync(entity);

    public override async Task<GrantDto> CreateAsync(CreateUpdateGrantDto input)
    {
        var dto = await base.CreateAsync(input);
        await SyncCriteriaAsync(dto.Id, input);
        return await GetAsync(dto.Id);
    }

    public override async Task<GrantDto> UpdateAsync(Guid id, CreateUpdateGrantDto input)
    {
        var dto = await base.UpdateAsync(id, input);
        await SyncCriteriaAsync(id, input);
        return await GetAsync(id);
    }

    // Katalog yazma izinleri host-only tanımlıdır (PlatformPermissionDefinitionProvider).
    // Aşağısı ikinci kilit: izin verisi elle kurcalansa bile kiracı bağlamında katalog yazılamaz.
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
            throw new AbpAuthorizationException("Hibe programı yalnızca host bağlamında yönetilebilir.");
        }
    }

    // Programın kriter etiketlerini DTO ile senkronla: mevcutları sil, yenilerini ekle.
    private async Task SyncCriteriaAsync(Guid grantId, CreateUpdateGrantDto input)
    {
        var existing = await _criteriaRepository.GetListAsync(t => t.GrantId == grantId);
        await _criteriaRepository.DeleteManyAsync(existing);

        foreach (var tag in input.CriteriaTags.Where(t => !string.IsNullOrWhiteSpace(t.Value)))
        {
            await _criteriaRepository.InsertAsync(
                new GrantCriteriaTag(GuidGenerator.Create(), grantId, tag.Kind, tag.Value));
        }
    }
}
