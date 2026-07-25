using System;

namespace Apya.Platform.Grants.Dtos;

public class UpcomingDeadlineDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime Date { get; set; }

    /// <summary>"Cagri" (açık çağrı son tarihi) veya "Milestone" (başvuru milestone'u).</summary>
    public string Kind { get; set; } = string.Empty;
}
