using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos;

public class ProjectDto : AuditedEntityDto<Guid>
{
    public Guid? GrantId { get; set; }
    public Guid? TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;

    /// <summary>APYA-132</summary>
    public Guid? CustomerId { get; set; }
    /// <summary>APYA-132 — listede gösterim için AppService dolduruyor.</summary>
    public string? CustomerName { get; set; }
    /// <summary>APYA-132 — Hibe / Etkinlik / Diğer</summary>
    public ProjectCategory Category { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
    public string? Purpose { get; set; }
    public string? Duration { get; set; }
    public string? TargetAudience { get; set; }
    public string? Activities { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsApproved { get; set; }

    public decimal TotalBudget { get; set; }
    public decimal HourlyRate { get; set; }
    public string Currency { get; set; } = "TRY";
    public decimal SpentBudget { get; set; }

    /// <summary>Görev tamamlanma yüzdesi (Done / toplam). Görev yoksa 0.</summary>
    public int ProgressPercent { get; set; }
    /// <summary>ProjectMetricsCalculator.CalculateAiRisk'in renk sözlüğü: secondary/success/warning/danger.</summary>
    public string RiskColor { get; set; } = "secondary";
    /// <summary>Kart üzerinde gösterilen türetilmiş durum: Planlama / Aktif / Risk.</summary>
    public string DisplayStatus { get; set; } = "Planlama";
    /// <summary>Projedeki görevlere atanmış benzersiz kullanıcı sayısı (facepile için).</summary>
    public int AssigneeCount { get; set; }
    /// <summary>İlk birkaç atananın baş harfleri (facepile daireleri için, en fazla 5).</summary>
    public List<string> AssigneeInitials { get; set; } = new();
    /// <summary>Bitişe kalan gün (StartDate+EndDate ikisi de doluysa); yoksa null.
    /// NEGATİF OLABİLİR — süresi geçmiş proje "-3" döner. Projeler listesindeki risk
    /// kuralı (daysLeft &lt; 0 → yüksek risk) bu işarete dayanır, sıfıra kırpılmaz.</summary>
    public int? DaysRemaining { get; set; }

    /// <summary>Projedeki toplam görev sayısı — ilerleme etiketindeki payda ("31/76").</summary>
    public int TaskCount { get; set; }

    /// <summary>Tamamlanmış (Done) görev sayısı — ilerleme etiketindeki pay.</summary>
    public int CompletedTaskCount { get; set; }

    /// <summary>Son tarihi geçtiği hâlde tamamlanmamış görev sayısı. Risk kuralının
    /// ve liste/kart gecikme rozetinin girdisi.</summary>
    public int OverdueTaskCount { get; set; }

    /// <summary>En eski gecikmiş görevin kaç gündür geciktiği; gecikme yoksa null.</summary>
    public int? OldestOverdueDays { get; set; }

    /// <summary>Tamamlanmamış görevler arasındaki en yakın son tarih; yoksa null.
    /// Gecikme olmayan kartta "sonraki 20.09" metnini besler.</summary>
    public DateTime? NextDueDate { get; set; }

    /// <summary>Projede mevcut kullanıcıya atanmış en az bir görev var mı?
    /// Projeler listesindeki "Saha görünümü" (yalnız bana atananlar) kapsamı bunu
    /// kullanır; oturumsuz/atamasız durumda false.</summary>
    public bool IsAssignedToMe { get; set; }
}
