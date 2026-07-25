using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

public class FirmProfileDto
{
    public CompanySize? Size { get; set; }
    public List<GrantCriteriaTagDto> Tags { get; set; } = new();
}
