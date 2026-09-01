using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Fonlamanın bir dilimi — hakediş, hibe taksiti, bağış taahhüdü.
///
/// Para tek yerde durur: dilim TAHSİL edilince karşılığı yine bir gelir kaydıdır
/// (<see cref="IncomeEntryId"/>). Dilim o gelirin PLANINI ve kesinti hikâyesini
/// taşır, geliri ikinci kez kaydetmez.
/// </summary>
public class FundingTranche : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid ProjectId { get; private set; }

    /// <summary>"1. Dilim" — proje içinde tekildir.</summary>
    public int SequenceNo { get; private set; }

    public string? Title { get; private set; }

    public DateTime? PlannedDate { get; private set; }

    public decimal PlannedAmount { get; private set; }

    public decimal ReceivedAmount { get; private set; }

    public DateTime? ReceivedDate { get; private set; }

    public FundingTrancheStatus Status { get; private set; } = FundingTrancheStatus.Pending;

    /// <summary>Tahsilatın karşılığı olan gelir kaydı. Tahsil edilene kadar boştur.</summary>
    public Guid? IncomeEntryId { get; private set; }

    public string? Note { get; private set; }

    public ICollection<TrancheDeduction> Deductions { get; private set; } = new List<TrancheDeduction>();

    /// <summary>Kesintilerin toplamı.</summary>
    public decimal DeductionTotal => Deductions.Sum(d => d.Amount);

    /// <summary>
    /// Bu dilimden gerçekte beklenen tutar: planlanan eksi kesinti. "Tahsil edildi"
    /// kararı buna bakar — kesinti yapılmış bir dilim, planlanandan az geldiği hâlde
    /// TAM tahsil edilmiş sayılır.
    /// </summary>
    public decimal ExpectedAmount => Math.Max(0m, PlannedAmount - DeductionTotal);

    /// <summary>EF Core için.</summary>
    protected FundingTranche()
    {
    }

    public FundingTranche(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        int sequenceNo,
        decimal plannedAmount,
        DateTime? plannedDate = null,
        string? title = null,
        string? note = null)
        : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        SequenceNo = sequenceNo;
        SetPlan(plannedAmount, plannedDate);
        SetTitle(title);
        SetNote(note);
    }

    public void SetPlan(decimal plannedAmount, DateTime? plannedDate)
    {
        if (plannedAmount <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.TrancheAmountInvalid)
                .WithData("PlannedAmount", plannedAmount);

        PlannedAmount = plannedAmount;
        PlannedDate = plannedDate;
        RefreshStatus();
    }

    public void SetTitle(string? title)
        => Title = Truncate(title, ProjectBudgetConsts.MaxNameLength);

    public void SetNote(string? note)
        => Note = Truncate(note, ProjectBudgetConsts.MaxNoteLength);

    public void SetSequenceNo(int sequenceNo) => SequenceNo = sequenceNo;

    /// <summary>
    /// Tahsilatı kaydeder. Tutar KÜMÜLATİFTİR (o güne kadar gelen toplam), fark değil —
    /// kısmi tahsil ikinci kez girildiğinde "üzerine ekle" ile "yerine yaz" karışmasın.
    /// </summary>
    public void RegisterCollection(decimal receivedAmount, DateTime? receivedDate, Guid? incomeEntryId)
    {
        if (receivedAmount < 0)
            throw new BusinessException(PlatformDomainErrorCodes.TrancheCollectionInvalid)
                .WithData("ReceivedAmount", receivedAmount);

        ReceivedAmount = receivedAmount;
        ReceivedDate = receivedAmount > 0 ? receivedDate : null;
        IncomeEntryId = receivedAmount > 0 ? incomeEntryId : null;
        RefreshStatus();
    }

    /// <summary>İtiraz sürecini elle işaretler/kaldırır. Tutardan türemez.</summary>
    public void SetDisputed(bool disputed)
    {
        if (disputed)
        {
            Status = FundingTrancheStatus.Disputed;
            return;
        }

        if (Status == FundingTrancheStatus.Disputed)
        {
            Status = DeriveStatus();
        }
    }

    public TrancheDeduction AddDeduction(Guid id, decimal amount, string reason, DateTime deductionDate)
    {
        if (amount <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.DeductionAmountInvalid)
                .WithData("Amount", amount);

        if (string.IsNullOrWhiteSpace(reason))
            throw new BusinessException(PlatformDomainErrorCodes.DeductionReasonRequired);

        if (DeductionTotal + amount > PlannedAmount)
            throw new BusinessException(PlatformDomainErrorCodes.DeductionExceedsTranche)
                .WithData("PlannedAmount", PlannedAmount)
                .WithData("DeductionTotal", DeductionTotal + amount);

        var deduction = new TrancheDeduction(id, TenantId, Id, amount, reason, deductionDate);
        Deductions.Add(deduction);
        RefreshStatus();
        return deduction;
    }

    public void RemoveDeduction(Guid deductionId)
    {
        var deduction = Deductions.FirstOrDefault(d => d.Id == deductionId);
        if (deduction == null)
        {
            return;
        }

        Deductions.Remove(deduction);
        RefreshStatus();
    }

    /// <summary>
    /// Durumu tutarlardan yeniden türetir. İtiraz elle konulmuş bir işaret olduğu
    /// için KORUNUR — tutar değişti diye sessizce silinmez.
    /// </summary>
    private void RefreshStatus()
    {
        if (Status == FundingTrancheStatus.Disputed)
        {
            return;
        }

        Status = DeriveStatus();
    }

    private FundingTrancheStatus DeriveStatus()
    {
        if (ReceivedAmount <= 0)
        {
            return FundingTrancheStatus.Pending;
        }

        return ReceivedAmount >= ExpectedAmount
            ? FundingTrancheStatus.Collected
            : FundingTrancheStatus.PartiallyCollected;
    }

    private static string? Truncate(string? value, int maxLength)
    {
        var clean = value?.Trim();
        if (string.IsNullOrEmpty(clean))
        {
            return null;
        }

        return clean.Length > maxLength ? clean[..maxLength] : clean;
    }
}
