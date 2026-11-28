using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

public class GrantCallDto : EntityDto<Guid>
{
    public Guid GrantId { get; set; }
    public string Period { get; set; } = string.Empty;
    public GrantCallStatus Status { get; set; }
    public DateTime? OpenDate { get; set; }
    public DateTime? Deadline { get; set; }
    public decimal? Budget { get; set; }
    public string? Reference { get; set; }
    public string? SourceUrl { get; set; }
    public GrantCallClosureReason ClosureReason { get; set; }
    public DateTime? LastVerifiedAt { get; set; }
    public GrantCallVerificationStatus VerificationStatus { get; set; }
    public string? AnnouncementImageUrl { get; set; }
    public string? ImageSourceUrl { get; set; }
    public GrantImageLicense ImageLicense { get; set; }
    public GrantImageStatus ImageStatus { get; set; }
    public DateTime? ImageLastCheckedAt { get; set; }
    public string? GrantName { get; set; }

    /// <summary>18b · Bu güncellemede çağrı kapandıysa zincirin özeti; aksi hâlde null.</summary>
    public GrantCallClosingSummaryDto? ClosingSummary { get; set; }
}

public class GrantCallClosingSummaryDto
{
    public int MissedInterestCount { get; set; }
    public int UnfinishedApplicationCount { get; set; }
    public int NotifiedFirmCount { get; set; }
}
