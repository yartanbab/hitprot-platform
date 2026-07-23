using System;
using System.Linq;
using System.Threading.Tasks;
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

    public GrantCallAppService(
        IRepository<GrantCall, Guid> repository,
        IRepository<Grant, Guid> grantRepository)
        : base(repository)
    {
        _grantRepository = grantRepository;
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
