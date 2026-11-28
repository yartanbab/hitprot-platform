using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

public class CreateUpdateGrantCallDto
{
    [Required]
    public Guid GrantId { get; set; }

    [Required]
    [StringLength(32)]
    public string Period { get; set; } = string.Empty;

    public GrantCallStatus Status { get; set; }
    public DateTime? OpenDate { get; set; }
    public DateTime? Deadline { get; set; }

    [Range(0, 999_999_999_999.99)]
    public decimal? Budget { get; set; }

    [StringLength(64)]
    public string? Reference { get; set; }

    /// <summary>Çağrının resmî duyuru adresi; boşsa programın adresi geçerli.</summary>
    [StringLength(512)]
    public string? SourceUrl { get; set; }

    /// <summary>Yalnız <see cref="GrantCallStatus.Kapandi"/> ile birlikte dolu olabilir.</summary>
    public GrantCallClosureReason ClosureReason { get; set; }

    public DateTime? LastVerifiedAt { get; set; }

    public GrantCallVerificationStatus VerificationStatus { get; set; }

    // Duyuru görseli: yalnız adres; ekranda düzenlenmez, çağrı penceresi okuduğunu aynen geri gönderir.
    [StringLength(512)]
    public string? AnnouncementImageUrl { get; set; }

    [StringLength(512)]
    public string? ImageSourceUrl { get; set; }

    public GrantImageLicense ImageLicense { get; set; }

    public GrantImageStatus ImageStatus { get; set; }

    public DateTime? ImageLastCheckedAt { get; set; }
}
