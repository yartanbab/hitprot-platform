using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Proje bütçesinin bir kalemi ("1. Personel", "3. Ekipman &amp; malzeme").
///
/// <see cref="Projects.Project.TotalBudget"/> tek skalerdir ve olduğu gibi kalır;
/// kalemler onun KIRILIMIDIR. İkisi zorla eşitlenmez — sözleşme bütçesi ile
/// kalemlerin toplamı farklı olabilir (henüz dağıtılmamış tutar, kesinti sonrası
/// açık) ve bu fark ekranda gösterilecek bir bilgidir, bastırılacak bir hata değil.
///
/// HARCANAN/KALAN BURADA TUTULMAZ. Harcanan, kaleme bağlı gider kayıtlarından
/// toplanır (<c>Expense.BudgetLineId</c>); denormalize edilirse ilk tutarsızlıkta
/// hangisinin doğru olduğu bilinemez.
///
/// Kalemler DÜZ bir listedir (kullanıcı kararı 2026-09-01): alt kalem yok.
/// </summary>
public class ProjectBudgetLine : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid ProjectId { get; private set; }

    /// <summary>Kalem kodu — donör kodlaması da buraya yazılır. Proje içinde tekildir.</summary>
    public string Code { get; private set; } = null!;

    public string Name { get; private set; } = null!;

    /// <summary>Tablodaki sıra. Kod alfabetik sıralamaya güvenilmez ("10" &lt; "2").</summary>
    public int Order { get; private set; }

    /// <summary>Sözleşmedeki ilk tutar. Revizyon bunu DEĞİŞTİRMEZ — kıyas noktasıdır.</summary>
    public decimal PlannedAmount { get; private set; }

    /// <summary>Yürürlükteki tutar. Bütçe revizyonu yalnız bunu değiştirir.</summary>
    public decimal ApprovedAmount { get; private set; }

    /// <summary>
    /// Kalemler arası aktarım sınırı (donör kuralı, ör. %15). Boşsa sınır yok.
    /// Bu adımda yalnız SAKLANIR ve gösterilir; aktarım akışı henüz yok.
    /// </summary>
    public decimal? TransferLimitPercent { get; private set; }

    /// <summary>EF Core için.</summary>
    protected ProjectBudgetLine()
    {
    }

    public ProjectBudgetLine(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        string code,
        string name,
        decimal plannedAmount,
        decimal approvedAmount,
        int order = 0,
        decimal? transferLimitPercent = null)
        : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        SetCode(code);
        SetName(name);
        SetAmounts(plannedAmount, approvedAmount);
        Order = order;
        SetTransferLimit(transferLimitPercent);
    }

    public void SetCode(string? code)
    {
        var clean = (code ?? string.Empty).Trim();
        Code = clean.Length > ProjectBudgetConsts.MaxCodeLength
            ? clean[..ProjectBudgetConsts.MaxCodeLength]
            : clean;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.BudgetLineNameRequired);

        var clean = name.Trim();
        Name = clean.Length > ProjectBudgetConsts.MaxNameLength
            ? clean[..ProjectBudgetConsts.MaxNameLength]
            : clean;
    }

    public void SetAmounts(decimal plannedAmount, decimal approvedAmount)
    {
        if (plannedAmount < 0 || approvedAmount < 0)
            throw new BusinessException(PlatformDomainErrorCodes.BudgetLineAmountInvalid)
                .WithData("PlannedAmount", plannedAmount)
                .WithData("ApprovedAmount", approvedAmount);

        PlannedAmount = plannedAmount;
        ApprovedAmount = approvedAmount;
    }

    public void SetTransferLimit(decimal? percent)
    {
        if (percent.HasValue && (percent.Value < 0 || percent.Value > 100))
            throw new BusinessException(PlatformDomainErrorCodes.BudgetTransferLimitInvalid)
                .WithData("TransferLimitPercent", percent);

        TransferLimitPercent = percent;
    }

    public void SetOrder(int order) => Order = order;

    /// <summary>
    /// Onaylanan tutarı revizyonla değiştirir. Yalnız <see cref="ProjectBudgetManager"/>
    /// çağırmalı — revizyon kaydı üretmeden tutar değiştirmek geçmişi koparır.
    /// </summary>
    internal void ApplyRevisedAmount(decimal newAmount)
    {
        if (newAmount < 0)
            throw new BusinessException(PlatformDomainErrorCodes.BudgetRevisionAmountInvalid)
                .WithData("NewAmount", newAmount);

        ApprovedAmount = newAmount;
    }
}
