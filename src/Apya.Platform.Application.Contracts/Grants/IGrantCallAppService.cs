using System;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

public interface IGrantCallAppService :
    ICrudAppService<GrantCallDto, Guid, GetGrantCallListDto, CreateUpdateGrantCallDto>
{
}
