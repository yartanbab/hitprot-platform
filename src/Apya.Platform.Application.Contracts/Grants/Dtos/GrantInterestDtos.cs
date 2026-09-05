using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Kiracı: "İlgileniyorum" talebi.</summary>
public class ExpressGrantInterestInput
{
    [Required(ErrorMessage = "Çağrı seçilmedi.")]
    public Guid GrantCallId { get; set; }

    [StringLength(1000, ErrorMessage = "Not en fazla 1000 karakter olabilir.")]
    public string? Note { get; set; }
}

/// <summary>Kiracının kendi ilgi talebi — "İlgi Taleplerim" satırı ve detay rozeti.</summary>
public class MyGrantInterestDto
{
    public Guid Id { get; set; }
    public Guid GrantCallId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string? Period { get; set; }
    public DateTime CreationTime { get; set; }
    public GrantInterestStatus Status { get; set; }
    public string? Note { get; set; }

    /// <summary>Host'un gerekçesi — yalnız uygun bulunmayan taleplerde dolu.</summary>
    public string? HostFeedback { get; set; }

    /// <summary>Süreç başlatıldıysa açılan başvuru; sihirbaz bağlantısı buna bakar.</summary>
    public Guid? GrantApplicationId { get; set; }
}

/// <summary>Host: İlgi Talepleri konsolu.</summary>
public class GrantInterestConsoleDto
{
    public List<GrantInterestRowDto> Items { get; set; } = new();

    public int NewCount { get; set; }
    public int InReviewCount { get; set; }
    public int StartedCount { get; set; }
    public int RejectedCount { get; set; }
}

public class GrantInterestRowDto
{
    public Guid Id { get; set; }
    public Guid? TenantId { get; set; }
    public string FirmName { get; set; } = string.Empty;
    public Guid GrantCallId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string? Period { get; set; }

    /// <summary>Çağrının son başvuru tarihi — host aciliyeti buna göre görür.</summary>
    public DateTime? Deadline { get; set; }

    public int? DaysRemaining { get; set; }

    public DateTime CreationTime { get; set; }
    public string? Note { get; set; }
    public GrantInterestStatus Status { get; set; }
    public string? HostFeedback { get; set; }

    /// <summary>Talebi bırakan kişi — host'un irtibat kuracağı isim.</summary>
    public string? RequestedByName { get; set; }

    public Guid? ReviewedByUserId { get; set; }
    public string? ReviewedByName { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public Guid? GrantApplicationId { get; set; }
}

public class RejectGrantInterestInput
{
    [Required(ErrorMessage = "Talep seçilmedi.")]
    public Guid InterestId { get; set; }

    /// <summary>Firmaya aynen iletilir; boş geçilemez.</summary>
    [Required(ErrorMessage = "Gerekçe zorunludur.")]
    [StringLength(1000, ErrorMessage = "Gerekçe en fazla 1000 karakter olabilir.")]
    public string Reason { get; set; } = string.Empty;
}
