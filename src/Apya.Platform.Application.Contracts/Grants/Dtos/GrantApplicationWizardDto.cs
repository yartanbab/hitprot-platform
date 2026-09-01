using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 2a · Başvuru sihirbazının tek okumada döndürdüğü hâli: program künyesi, adımlar,
/// bütçe satırları (hesaplanmış destekle), açık alan kilitleri ve yazışma.
/// Tek çağrı: sihirbaz her adımda ayrı istek atmasın, iki taraf aynı anda aynı
/// görüntüyü alsın.
/// </summary>
public class GrantApplicationWizardDto
{
    public Guid Id { get; set; }
    public Guid GrantCallId { get; set; }
    public Guid GrantId { get; set; }

    // --- Program künyesi ---
    public string GrantName { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string? Period { get; set; }
    public DateTime? Deadline { get; set; }
    public int? DaysRemaining { get; set; }
    public decimal? MaxAmount { get; set; }
    public int? SupportRatePercent { get; set; }

    // --- Sihirbaz durumu ---
    public int CurrentStep { get; set; }
    public int StepCount { get; set; }
    public int CompletionPercent { get; set; }
    public GrantPartyRole PendingParty { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public bool IsReadOnly { get; set; }

    /// <summary>Bu isteği yapan kullanıcının başvurudaki rolü (kiracı = Firma, host = Danışman).</summary>
    public GrantPartyRole ViewerRole { get; set; }
    public Guid ViewerUserId { get; set; }

    // --- Adım 2 · Proje özeti ---
    public string? ProjectTitle { get; set; }
    public string? ProjectSummary { get; set; }
    public int? ProjectDurationMonths { get; set; }

    // --- Adım 1 · Firma bilgileri (salt okunur özet) ---
    public GrantWizardFirmSummaryDto? Firm { get; set; }

    // --- Adım 3 · Bütçe ---
    public List<GrantWizardBudgetLineDto> BudgetLines { get; set; } = new();
    public decimal TotalProject { get; set; }
    public decimal TotalSupport { get; set; }
    public decimal OwnContribution { get; set; }
    public bool CapApplied { get; set; }
    public int? SupportShareOfCapPercent { get; set; }

    // --- Canlı düzenleme ---
    public List<GrantFieldLockDto> Locks { get; set; } = new();

    /// <summary>Bu adımda henüz doldurulmamış alanlar — sağ paneldeki "Bu Adımda Kalanlar".</summary>
    public List<GrantWizardPendingFieldDto> PendingFields { get; set; } = new();

    public List<GrantApplicationMessageDto> Messages { get; set; } = new();
}

public class GrantWizardFirmSummaryDto
{
    public CompanySize? Size { get; set; }
    public int? StaffCount { get; set; }
    public int? RdStaffCount { get; set; }
    public int? Trl { get; set; }
    public bool? HasConsortiumPartner { get; set; }

    /// <summary>Profil doluluğu — 1d ile AYNI dokuz alan üzerinden sayılır.</summary>
    public int CompletionPercent { get; set; }
}

public class GrantWizardBudgetLineDto
{
    public GrantCostItemKind Kind { get; set; }
    public decimal Amount { get; set; }
    public string? Justification { get; set; }

    /// <summary>Kalemin üst limiti (%) — null ise limit yok.</summary>
    public int? LimitPercent { get; set; }

    public decimal SupportAmount { get; set; }

    /// <summary>Destek, kalemin limitine kırpıldı mı — ekranda uyarı etiketi çıkar.</summary>
    public bool LimitApplied { get; set; }

    /// <summary>Program bu kalemi desteklemiyor: satır görünür ama girilemez (tasarım 2a).</summary>
    public bool IsEligible { get; set; }
}

public class GrantWizardPendingFieldDto
{
    public string FieldKey { get; set; } = null!;
    public string Label { get; set; } = null!;

    /// <summary>Alan şu an kimde kilitli (varsa) — "danışman" rozetini besler.</summary>
    public GrantPartyRole? LockedByRole { get; set; }
}

public class GrantFieldLockDto
{
    public string FieldKey { get; set; } = null!;
    public Guid OwnerUserId { get; set; }
    public string OwnerName { get; set; } = null!;
    public GrantPartyRole OwnerRole { get; set; }
    public DateTime LastActivityAt { get; set; }
    public Guid? TakeoverRequestedByUserId { get; set; }
    public string? TakeoverRequestedByName { get; set; }
}

public class GrantApplicationMessageDto
{
    public Guid Id { get; set; }
    public Guid SenderUserId { get; set; }
    public string SenderName { get; set; } = null!;
    public GrantPartyRole SenderRole { get; set; }
    public string Body { get; set; } = null!;
    public DateTime CreationTime { get; set; }
}
