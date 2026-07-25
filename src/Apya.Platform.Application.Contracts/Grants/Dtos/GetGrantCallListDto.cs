using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

public class GetGrantCallListDto : PagedAndSortedResultRequestDto
{
    public Guid? GrantId { get; set; }
}
