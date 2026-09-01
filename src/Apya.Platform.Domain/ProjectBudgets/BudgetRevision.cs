using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Bütçenin bir sürümü. Kalemin <see cref="ProjectBudgetLine.ApprovedAmount"/>
/// alanı yalnız YÜRÜRLÜKTEKİ tutarı taşır; "neden değişti" sorusunun cevabı
/// burada durur.
///
/// Donör denetiminin ilk sorduğu şey budur: hangi kalem, ne zaman, hangi
/// gerekçeyle, kaçtan kaça indi.
/// </summary>
public class BudgetRevision : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid ProjectId { get; private set; }

    /// <summary>Rev.1, Rev.2… Proje içinde artan, tekil.</summary>
    public int RevisionNo { get; private set; }

    public string Reason { get; private set; } = null!;

    public DateTime EffectiveDate { get; private set; }

    /// <summary>
    /// Revizyon SONRASI kalem toplamı. Türetilebilir ama saklanır: kalemler
    /// sonradan silinirse geçmiş sürümün toplamı hesaplanamaz hâle gelir.
    /// </summary>
    public decimal TotalApprovedAmount { get; private set; }

    public ICollection<BudgetRevisionLine> Lines { get; private set; } = new List<BudgetRevisionLine>();

    /// <summary>EF Core için.</summary>
    protected BudgetRevision()
    {
    }

    /// <summary>
    /// Tek doğru üretici <see cref="ProjectBudgetManager.ApplyRevisionAsync"/>'dir —
    /// revizyon numarasını, satırları ve kalem tutarlarını birlikte tutan yer orası.
    /// Ctor yine de public: kapsülleme <c>AddLine</c>/<c>SealTotal</c> tarafında
    /// (internal), burada kilitlemek yalnız testleri yansımaya zorlardı.
    /// </summary>
    public BudgetRevision(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        int revisionNo,
        string reason,
        DateTime effectiveDate)
        : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        RevisionNo = revisionNo;
        SetReason(reason);
        EffectiveDate = effectiveDate;
    }

    public void SetReason(string reason)
    {
        var clean = (reason ?? string.Empty).Trim();
        Reason = clean.Length > ProjectBudgetConsts.MaxReasonLength
            ? clean[..ProjectBudgetConsts.MaxReasonLength]
            : clean;
    }

    internal void AddLine(Guid id, Guid budgetLineId, decimal previousAmount, decimal newAmount)
    {
        if (newAmount < 0)
            throw new BusinessException(PlatformDomainErrorCodes.BudgetRevisionAmountInvalid)
                .WithData("NewAmount", newAmount);

        Lines.Add(new BudgetRevisionLine(id, Id, budgetLineId, previousAmount, newAmount));
    }

    internal void SealTotal(decimal totalApprovedAmount) => TotalApprovedAmount = totalApprovedAmount;

    /// <summary>Bu revizyonun bütçeye net etkisi (eksi = küçültme).</summary>
    public decimal NetDelta => Lines.Sum(l => l.Delta);
}

/// <summary>
/// Revizyonun tek bir kalemdeki etkisi. Yalnız kendi revizyonu üzerinden okunur,
/// bu yüzden düz <see cref="Entity{TKey}"/>.
/// </summary>
public class BudgetRevisionLine : Entity<Guid>
{
    public Guid BudgetRevisionId { get; private set; }

    public Guid BudgetLineId { get; private set; }

    public decimal PreviousAmount { get; private set; }

    public decimal NewAmount { get; private set; }

    public decimal Delta => NewAmount - PreviousAmount;

    /// <summary>EF Core için.</summary>
    protected BudgetRevisionLine()
    {
    }

    internal BudgetRevisionLine(Guid id, Guid budgetRevisionId, Guid budgetLineId, decimal previousAmount, decimal newAmount)
        : base(id)
    {
        BudgetRevisionId = budgetRevisionId;
        BudgetLineId = budgetLineId;
        PreviousAmount = previousAmount;
        NewAmount = newAmount;
    }
}
