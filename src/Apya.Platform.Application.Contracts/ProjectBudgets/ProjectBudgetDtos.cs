using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.ProjectBudgets.Dtos;

/// <summary>
/// Bir bütçe kalemi ve ona bağlı kayıtlardan HESAPLANAN gerçekleşme.
/// Harcanan/kalan/yüzde entity'de saklanmaz, her okumada toplanır.
/// </summary>
public class ProjectBudgetLineDto : EntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }

    /// <summary>Sözleşmedeki ilk tutar — revizyon bunu değiştirmez.</summary>
    public decimal PlannedAmount { get; set; }

    /// <summary>Yürürlükteki tutar.</summary>
    public decimal ApprovedAmount { get; set; }

    public decimal? TransferLimitPercent { get; set; }

    /// <summary>Bu kaleme yazılmış gider toplamı.</summary>
    public decimal SpentAmount { get; set; }

    /// <summary>Bu kaleme yazılmış gelir toplamı.</summary>
    public decimal IncomeAmount { get; set; }

    public decimal RemainingAmount => ApprovedAmount - SpentAmount;

    /// <summary>Onaylanan 0 ise 0 döner — bölme yok.</summary>
    public int UsagePercent => ApprovedAmount > 0
        ? (int)Math.Round(SpentAmount / ApprovedAmount * 100m)
        : 0;

    public bool IsOverBudget => ApprovedAmount > 0 && SpentAmount > ApprovedAmount;

    /// <summary>Kaleme bağlı gider+gelir sayısı. 0 değilse kalem silinemez.</summary>
    public int LinkedRecordCount { get; set; }
}

public class CreateUpdateBudgetLineDto
{
    [MaxLength(ProjectBudgetConsts.MaxCodeLength)]
    public string? Code { get; set; }

    [Required]
    [MaxLength(ProjectBudgetConsts.MaxNameLength)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 999999999999)]
    public decimal PlannedAmount { get; set; }

    /// <summary>
    /// Boş bırakılırsa <see cref="PlannedAmount"/> kullanılır — yeni kalemde
    /// sözleşme tutarı ile onaylanan tutar aynıdır.
    /// </summary>
    [Range(0, 999999999999)]
    public decimal? ApprovedAmount { get; set; }

    [Range(0, 100)]
    public decimal? TransferLimitPercent { get; set; }
}

public class TrancheDeductionDto : EntityDto<Guid>
{
    public Guid TrancheId { get; set; }
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime DeductionDate { get; set; }
    public DeductionResolution Resolution { get; set; }
    public Guid? BudgetRevisionId { get; set; }

    /// <summary>"Bütçeye işlendi · Rev.2" rozetinin sayısı; bağlı revizyon yoksa null.</summary>
    public int? BudgetRevisionNo { get; set; }
}

public class FundingTrancheDto : EntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public int SequenceNo { get; set; }
    public string? Title { get; set; }
    public DateTime? PlannedDate { get; set; }
    public decimal PlannedAmount { get; set; }
    public decimal ReceivedAmount { get; set; }
    public DateTime? ReceivedDate { get; set; }
    public FundingTrancheStatus Status { get; set; }
    public Guid? IncomeEntryId { get; set; }
    public string? Note { get; set; }

    public decimal DeductionTotal { get; set; }

    /// <summary>Planlanan − kesinti. "Tahsil edildi" kararı buna bakar.</summary>
    public decimal ExpectedAmount { get; set; }

    public decimal OutstandingAmount => Math.Max(0m, ExpectedAmount - ReceivedAmount);

    public List<TrancheDeductionDto> Deductions { get; set; } = new();
}

public class CreateUpdateTrancheDto
{
    [MaxLength(ProjectBudgetConsts.MaxNameLength)]
    public string? Title { get; set; }

    public DateTime? PlannedDate { get; set; }

    [Range(0.01, 999999999999)]
    public decimal PlannedAmount { get; set; }

    [MaxLength(ProjectBudgetConsts.MaxNoteLength)]
    public string? Note { get; set; }
}

public class RegisterCollectionDto
{
    /// <summary>KÜMÜLATİF tahsilat — o güne kadar gelen toplam, fark değil.</summary>
    [Range(0, 999999999999)]
    public decimal ReceivedAmount { get; set; }

    public DateTime? ReceivedDate { get; set; }

    /// <summary>Tahsilatın karşılığı olan gelir kaydı; para iki kez kaydedilmesin.</summary>
    public Guid? IncomeEntryId { get; set; }
}

public class CreateDeductionDto
{
    [Range(0.01, 999999999999)]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(ProjectBudgetConsts.MaxReasonLength)]
    public string Reason { get; set; } = string.Empty;

    public DateTime DeductionDate { get; set; }
}

public class BudgetRevisionLineDto : EntityDto<Guid>
{
    public Guid BudgetLineId { get; set; }
    public string BudgetLineName { get; set; } = string.Empty;
    public decimal PreviousAmount { get; set; }
    public decimal NewAmount { get; set; }
    public decimal Delta => NewAmount - PreviousAmount;
}

public class BudgetRevisionDto : EntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public int RevisionNo { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime EffectiveDate { get; set; }
    public decimal TotalApprovedAmount { get; set; }
    public decimal NetDelta { get; set; }
    public List<BudgetRevisionLineDto> Lines { get; set; } = new();
}

public class ApplyBudgetRevisionDto
{
    [Required]
    [MaxLength(ProjectBudgetConsts.MaxReasonLength)]
    public string Reason { get; set; } = string.Empty;

    public DateTime EffectiveDate { get; set; }

    /// <summary>Kalem id → yeni onaylanan tutar. Değişmeyen kalem gönderilmez.</summary>
    public Dictionary<Guid, decimal> Changes { get; set; } = new();

    /// <summary>Revizyonu tetikleyen kesinti; verilirse o kesinti bu revizyona bağlanır.</summary>
    public Guid? SourceDeductionId { get; set; }
}

/// <summary>
/// "Genel" sekmesinin tek veri kaynağı: altı KPI, fonlama akışı ve kalem tablosu.
///
/// Kalem tanımlanmamış projelerde (<see cref="HasBudgetLines"/> false) tutarlar
/// <c>Project.TotalBudget</c>'a düşer — ekran boş kalmaz, sadece kırılım göstermez.
/// </summary>
public class ProjectBudgetOverviewDto
{
    public Guid ProjectId { get; set; }
    public string Currency { get; set; } = "TRY";
    public bool HasBudgetLines { get; set; }

    /// <summary>Sözleşme bütçesi — kalemlerin planlanan toplamı.</summary>
    public decimal ContractBudget { get; set; }

    /// <summary>Onaylanan (revize) bütçe — kalemlerin yürürlükteki toplamı.</summary>
    public decimal ApprovedBudget { get; set; }

    public decimal PlannedFunding { get; set; }
    public decimal ReceivedFunding { get; set; }
    public decimal DeductionTotal { get; set; }

    /// <summary>
    /// Projeye bağlı gelir kayıtlarının toplamı — dilimlerden BAĞIMSIZ.
    /// Dilim tanımlanmamış projelerde "gelen para" sorusunun tek cevabı budur.
    /// </summary>
    public decimal IncomeRecordTotal { get; set; }

    /// <summary>
    /// Fiilen gelen para. Dilim tanımlıysa tahsilat toplamı, değilse gelir kayıtları.
    /// İkisini TOPLAMAZ: dilim tahsilatı zaten bir gelir kaydına bağlanıyor, toplamak
    /// aynı parayı iki kez sayardı.
    /// </summary>
    public decimal MoneyIn => TrancheCount > 0 ? ReceivedFunding : IncomeRecordTotal;

    /// <summary>Kesintisi "finanse edilmeyen" olarak kapatılmış tutar.</summary>
    public decimal UnfundedTotal { get; set; }

    /// <summary>Planlanan − gelen − kesinti; negatife düşmez.</summary>
    public decimal PendingFunding => Math.Max(0m, PlannedFunding - ReceivedFunding - DeductionTotal);

    /// <summary>Projeye bağlı TÜM gider (kalemi olan olmayan).</summary>
    public decimal SpentAmount { get; set; }

    /// <summary>Projeye bağlı ama hiçbir kaleme yazılmamış gider.</summary>
    public decimal UnassignedSpentAmount { get; set; }

    /// <summary>Gelen − harcanan. Bütçe değil, NAKİT sorusunun cevabı.</summary>
    public decimal AvailableCash => MoneyIn - SpentAmount;

    /// <summary>Onaylanan − harcanan.</summary>
    public decimal RemainingBudget => ApprovedBudget - SpentAmount;

    public int BudgetUsagePercent => ApprovedBudget > 0
        ? (int)Math.Round(SpentAmount / ApprovedBudget * 100m)
        : 0;

    public int FundingPercent => ApprovedBudget > 0
        ? (int)Math.Round(MoneyIn / ApprovedBudget * 100m)
        : 0;

    /// <summary>0 = hiç revizyon yok.</summary>
    public int LatestRevisionNo { get; set; }

    public int TrancheCount { get; set; }
    public int CollectedTrancheCount { get; set; }

    public List<ProjectBudgetLineDto> Lines { get; set; } = new();
}
