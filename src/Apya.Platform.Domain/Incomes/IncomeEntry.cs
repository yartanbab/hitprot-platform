using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Incomes;

/// <summary>
/// Faturasız gelir/fon kaydı (APYA-142d). Hibe, bağış, faturasız nakit gelir.
/// Kasa seçilirse otomatik giriş (In) CashMovement üretilir (Source=Income).
/// Proje/cari opsiyonel — proje K/Z ve cari için etiketlenebilir.
/// </summary>
public class IncomeEntry : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Title { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public DateTime IncomeDate { get; set; }
    public IncomeCategory Category { get; set; } = IncomeCategory.Other;

    /// <summary>Hangi kasaya girdi — opsiyonel (boşsa tahsil edilmemiş/beklenen).</summary>
    public Guid? CashAccountId { get; set; }

    public Guid? ProjectId { get; set; }
    /// <summary>APYA-143: Opsiyonel task etiketi — task bazlı maliyet kırılımı.</summary>
    public Guid? TaskId { get; set; }

    /// <summary>
    /// Gelirin yazıldığı bütçe kalemi. Giderdeki ile aynı gerekçe
    /// (bkz. <see cref="Expenses.Expense.BudgetLineId"/>): kalemde toplam
    /// saklanmaz, buradan toplanır.
    /// </summary>
    public Guid? BudgetLineId { get; set; }
    public Guid? CustomerId { get; set; }
    public string? Description { get; set; }

    protected IncomeEntry() { }

    public IncomeEntry(
        Guid id,
        string title,
        decimal amount,
        DateTime incomeDate,
        IncomeCategory category = IncomeCategory.Other,
        string currency = "TRY",
        Guid? cashAccountId = null,
        Guid? projectId = null,
        Guid? customerId = null,
        string? description = null,
        Guid? taskId = null,
        Guid? tenantId = null) : base(id)
    {
        TenantId = tenantId;
        SetTitle(title);
        SetAmount(amount);
        IncomeDate = incomeDate;
        Category = category;
        Currency = string.IsNullOrWhiteSpace(currency) ? "TRY" : currency.Trim().ToUpperInvariant();
        CashAccountId = cashAccountId;
        ProjectId = projectId;
        TaskId = taskId;
        CustomerId = customerId;
        Description = description;
    }

    public void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new BusinessException(PlatformDomainErrorCodes.IncomeTitleRequired);
        if (title.Length > IncomeConsts.MaxTitleLength)
            throw new BusinessException(PlatformDomainErrorCodes.IncomeFieldTooLong)
                .WithData("Field", nameof(Title))
                .WithData("MaxLength", IncomeConsts.MaxTitleLength);
        Title = title.Trim();
    }

    public void SetAmount(decimal amount)
    {
        if (amount <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.IncomeAmountInvalid)
                .WithData("Amount", amount);
        Amount = amount;
    }
}
