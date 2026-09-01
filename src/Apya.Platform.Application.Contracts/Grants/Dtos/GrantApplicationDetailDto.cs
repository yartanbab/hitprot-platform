using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 2d · Başvuru detayı (danışman görünümü). Tek okumada: künye, süreç akışı,
/// form durumu, birleşik zaman çizelgesi, dilimler, milestone'lar ve danışmanlık
/// kaydı.
/// </summary>
public class GrantApplicationDetailDto
{
    public Guid Id { get; set; }
    public Guid GrantCallId { get; set; }
    public string FirmName { get; set; } = null!;
    public string GrantName { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string? Period { get; set; }

    /// <summary>Kullanıcıya gösterilen başvuru referansı (GA-2026-0148 biçiminde).</summary>
    public string Reference { get; set; } = null!;

    public DateTime OpenedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public int? DaysRemaining { get; set; }

    /// <summary>Firmanın bu programa uyum skoru; profil boşsa null.</summary>
    public int? MatchScore { get; set; }

    public string? CurrentStageName { get; set; }
    public GrantPartyRole PendingParty { get; set; }
    public Guid? AssignedUserId { get; set; }
    public string? AssignedUserName { get; set; }

    public List<GrantDetailStepDto> Steps { get; set; } = new();
    public List<GrantDetailSectionDto> Sections { get; set; } = new();
    public List<GrantDetailActivityDto> Activities { get; set; } = new();
    public List<GrantDisbursementTrancheDto> Tranches { get; set; } = new();
    public List<GrantMilestoneDto> Milestones { get; set; } = new();

    // --- Danışmanlık kaydı ---
    public decimal TotalHours { get; set; }
    public decimal? SuccessFeePercent { get; set; }

    /// <summary>Başarı primi × (onaylı tutar, yoksa talep edilen destek).</summary>
    public decimal? EstimatedRevenue { get; set; }

    public List<GrantConsultingLogDto> ConsultingLogs { get; set; } = new();
}

public class GrantDetailStepDto
{
    public Guid? StepId { get; set; }
    public string Name { get; set; } = null!;
    public int Order { get; set; }
    public GrantPartyRole Owner { get; set; }
    public bool IsCurrent { get; set; }
    public bool IsDone { get; set; }
}

/// <summary>
/// Form bölümünün durumu — tasarımdaki "alan bazlı sahiplik" kartı.
/// Metin sunucuda kurulmaz: <see cref="Key"/> + sayılar döner, cümleyi istemci
/// yerelleştirir.
/// </summary>
public class GrantDetailSectionDto
{
    public string Key { get; set; } = null!;
    public GrantDetailSectionState State { get; set; }

    /// <summary>Bölümün sayısal bağlamı (dolu alan, eksik evrak…).</summary>
    public int Value { get; set; }
    public int Total { get; set; }

    /// <summary>Bölüm şu an kimde bekliyor; kimseyi beklemiyorsa null.</summary>
    public GrantPartyRole? Party { get; set; }
}

public enum GrantDetailSectionState
{
    Empty = 0,
    InProgress = 1,
    Live = 2,
    Complete = 3,
    Locked = 4
}

public class GrantDetailActivityDto
{
    public DateTime At { get; set; }
    public string ActorName { get; set; } = null!;
    public GrantPartyRole ActorRole { get; set; }

    /// <summary>Akış sekmeleri bunu süzer: Mesaj · Evrak · Aşama.</summary>
    public GrantDetailActivityChannel Channel { get; set; }

    /// <summary>Mesaj gövdesi ya da olayın kısa metni.</summary>
    public string? Text { get; set; }

    /// <summary>Aşama/atama olaylarında olay türü; mesaj ve evrakta null.</summary>
    public GrantActivityKind? Kind { get; set; }

    /// <summary>Evrak olaylarında evrakın adı ve sürüm numarası.</summary>
    public string? DocumentName { get; set; }
    public int? VersionNo { get; set; }
}

public enum GrantDetailActivityChannel
{
    Message = 0,
    Document = 1,
    Stage = 2
}

public class GrantConsultingLogDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = null!;
    public DateTime WorkDate { get; set; }
    public decimal Hours { get; set; }
    public string? Note { get; set; }
}

// ------------------------------------------------------------------ girdiler

public class AddGrantConsultingLogInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    [Range(0.25, 24, ErrorMessage = "Süre 0,25 ile 24 saat arasında olmalıdır.")]
    public decimal Hours { get; set; }

    public DateTime? WorkDate { get; set; }

    [StringLength(256, ErrorMessage = "Not en fazla 256 karakter olabilir.")]
    public string? Note { get; set; }
}

public class SetGrantSuccessFeeInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    [Range(0, 100, ErrorMessage = "Başarı primi 0 ile 100 arasında olmalıdır.")]
    public decimal? Percent { get; set; }
}
