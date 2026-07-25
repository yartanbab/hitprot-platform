using System;

namespace Apya.Platform.Grants.Dtos;

public class CreateUpdateMilestoneDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
}
