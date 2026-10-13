using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 6b · Red &amp; İtiraz. Kurumun kararı, madde madde gerekçeler, her maddeye
/// danışman görüşü ve itiraz penceresinin durumu.
/// </summary>
public class GrantAppealConsoleDto
{
    public Guid ApplicationId { get; set; }
    public string GrantName { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string? Period { get; set; }

    /// <summary>Karar girilmemişse null — ekran "henüz karar yok" der.</summary>
    public Guid? DecisionId { get; set; }

    public GrantDecisionOutcome? Outcome { get; set; }
    public DateTime? DecidedOn { get; set; }
    public string? ReferenceNo { get; set; }
    public DateTime? AppealDeadline { get; set; }

    /// <summary>İtiraz penceresine kalan gün; pencere kapalıysa null.</summary>
    public int? AppealDaysLeft { get; set; }

    public bool IsAppealWindowOpen { get; set; }
    public DateTime? AppealSubmittedAt { get; set; }
    public bool? AppealAccepted { get; set; }

    /// <summary>Danışman görüş yazabilir; firma yalnız okur.</summary>
    public bool CanEditOpinion { get; set; }

    /// <summary>
    /// Görüntüleyen bu bağlamda hibe YAZMA iznine sahip mi (host: Grants.Edit, firma:
    /// Grants.ManageApplications). Sunucu yazma uçlarını zaten reddeder; bayrak ekranın yazma
    /// denetimlerini baştan gizlemesi içindir. "Gönderildi" (IsReadOnly) durumundan AYRIDIR.
    /// </summary>
    public bool CanWrite { get; set; }

    public List<GrantAppealItemDto> Items { get; set; } = new();

    /// <summary>İtiraz dosyasına giren madde sayısı (tasarımdaki "2/3").</summary>
    public int AppealedCount { get; set; }
    public int AcceptedCount { get; set; }

    public GrantAppealStatsDto Stats { get; set; } = new();

    /// <summary>Aynı programın açık bir sonraki çağrısı — "tekrar başvur" bağlantısı.</summary>
    public Guid? NextCallId { get; set; }
    public string? NextCallPeriod { get; set; }
    public DateTime? NextCallDeadline { get; set; }
}

public class GrantAppealItemDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
    public string Title { get; set; } = null!;
    public string? InstitutionText { get; set; }
    public string? OpinionSummary { get; set; }
    public string? OpinionDetail { get; set; }
    public GrantAppealStance Stance { get; set; }
    public string? OpinionByName { get; set; }
}

/// <summary>
/// Programın itiraz istatistiği — GERÇEK kararlardan hesaplanır. Örneklem küçükse
/// oran gösterilmez: üç karardan çıkan yüzde yanıltıcı olur.
/// </summary>
public class GrantAppealStatsDto
{
    /// <summary>İstatistiğin dayandığı karar sayısı.</summary>
    public int SampleSize { get; set; }

    public bool HasEnoughData { get; set; }
    public int? AcceptanceRatePercent { get; set; }
    public int? AppealRatePercent { get; set; }
}

// ------------------------------------------------------------------ girdiler

public class SaveGrantDecisionInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    public GrantDecisionOutcome Outcome { get; set; }

    [Required(ErrorMessage = "Karar tarihi zorunludur.")]
    public DateTime DecidedOn { get; set; }

    [StringLength(64, ErrorMessage = "Karar no en fazla 64 karakter olabilir.")]
    public string? ReferenceNo { get; set; }

    public DateTime? AppealDeadline { get; set; }
}

/// <summary>
/// LIF-10 · Kurum itirazı KABUL etti: yeni sonuç ve (varsa) onaylanan tutar tek istekte gelir;
/// karar, aşama ve tutar birlikte güncellenir.
/// </summary>
public class AcceptGrantAppealInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    /// <summary>Onaylandı ya da Kısmi onay. "Reddedildi" kabul edilen itirazın sonucu olamaz.</summary>
    public GrantDecisionOutcome Outcome { get; set; } = GrantDecisionOutcome.Onaylandi;

    [Range(0, 999999999999, ErrorMessage = "Onaylanan tutar eksi olamaz.")]
    public decimal? ApprovedAmount { get; set; }
}

public class AddGrantAppealItemInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    [Required(ErrorMessage = "Gerekçe başlığı zorunludur.")]
    [StringLength(256, ErrorMessage = "Başlık en fazla 256 karakter olabilir.")]
    public string Title { get; set; } = null!;

    [StringLength(2000, ErrorMessage = "Kurum metni en fazla 2000 karakter olabilir.")]
    public string? InstitutionText { get; set; }
}

public class SaveGrantAppealOpinionInput
{
    [Required(ErrorMessage = "Madde zorunludur.")]
    public Guid ItemId { get; set; }

    public GrantAppealStance Stance { get; set; }

    [StringLength(128, ErrorMessage = "Kısa görüş en fazla 128 karakter olabilir.")]
    public string? Summary { get; set; }

    [StringLength(2000, ErrorMessage = "Gerekçe en fazla 2000 karakter olabilir.")]
    public string? Detail { get; set; }
}
