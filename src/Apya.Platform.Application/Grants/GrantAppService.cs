using System;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Grants.Dtos;

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
    }
}