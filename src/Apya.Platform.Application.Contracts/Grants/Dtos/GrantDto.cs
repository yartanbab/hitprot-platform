using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

public class GrantDto : EntityDto<Guid>
{
    public string Name { get; set; }
    public string Issuer { get; set; }
    public string? Description { get; set; }
    public decimal? MaxAmount { get; set; }
    public double MinMatchScore { get; set; }
}