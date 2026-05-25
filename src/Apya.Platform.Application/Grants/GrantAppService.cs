using System;
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
        Volo.Abp.Application.Dtos.PagedAndSortedResultRequestDto,
        CreateUpdateGrantDto>,
    IGrantAppService
{
    public GrantAppService(IRepository<Grant, Guid> repository)
        : base(repository)
    {
        GetPolicyName    = PlatformPermissions.Grants.Default;
        GetListPolicyName = PlatformPermissions.Grants.Default;
        CreatePolicyName = PlatformPermissions.Grants.Create;
        UpdatePolicyName = PlatformPermissions.Grants.Edit;
        DeletePolicyName = PlatformPermissions.Grants.Delete;
    }
}