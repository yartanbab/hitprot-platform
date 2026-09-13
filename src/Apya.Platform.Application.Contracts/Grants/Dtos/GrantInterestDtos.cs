using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// Kiracı: "İlgileniyorum" talebi — hibe detayındaki onay adımından sonra doldurulan
/// proje fikri. Talep host kutusuna bu bilgilerle düşer.
/// </summary>
public class ExpressGrantInterestInput
{
    [Required(ErrorMessage = "Çağrı seçilmedi.")]
    public Guid GrantCallId { get; set; }

    /// <summary>Proje fikri, birkaç cümle. Danışmanın ön değerlendirmesi buradan başlar.</summary>
    [Required(ErrorMessage = "Proje fikrinizi birkaç cümleyle yazın.")]
    [StringLength(1000, ErrorMessage = "Proje fikri en fazla 1000 karakter olabilir.")]
    public string Note { get; set; } = string.Empty;

    [Range(typeof(decimal), "0", "999999999999", ErrorMessage = "Bütçe negatif olamaz.")]
    public decimal? EstimatedBudget { get; set; }

    /// <summary>Hedeflenen başlangıç çeyreğinin ilk günü. Boş = henüz belli değil.</summary>
    public DateTime? TargetStartDate { get; set; }

    /// <summary>
    /// Yalnız konsorsiyum şartı taşıyan çağrıda sorulur ve orada ZORUNLUDUR (servis denetler).
    /// true = ortak arıyor · false = ortağı belli.
    /// </summary>
    public bool? NeedsPartner { get; set; }

    [StringLength(200, ErrorMessage = "Ortak kuruluşun adı en fazla 200 karakter olabilir.")]
    public string? PartnerName { get; set; }
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
    public decimal? EstimatedBudget { get; set; }
    public DateTime? TargetStartDate { get; set; }
    public bool? NeedsPartner { get; set; }
    public string? PartnerName { get; set; }
    public DateTime? WithdrawnAt { get; set; }

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

    /// <summary>Proje fikri.</summary>
    public string? Note { get; set; }

    public decimal? EstimatedBudget { get; set; }
    public DateTime? TargetStartDate { get; set; }

    /// <summary>null = soru sorulmadı (çağrı ortaklık istemiyor) · true = ortak arıyor · false = ortağı belli.</summary>
    public bool? NeedsPartner { get; set; }

    public string? PartnerName { get; set; }
    public DateTime? WithdrawnAt { get; set; }

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
