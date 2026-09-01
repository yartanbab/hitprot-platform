using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Expenses;

/// <summary>
/// Gider/Masraf (APYA-135). Kasa zorunlu (nereden ödendi), proje ve cari opsiyonel.
/// Kaydedildiğinde ilgili kasaya otomatik bir çıkış (Out) CashMovement üretilir
/// (ExpenseAppService, Source=Expense, ReferenceId=Expense.Id).
/// </summary>
public class Expense : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Title { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public DateTime ExpenseDate { get; set; }
    public ExpenseCategory Category { get; set; } = ExpenseCategory.Other;

    /// <summary>Hangi kasadan ödendi — zorunlu.</summary>
    public Guid CashAccountId { get; set; }

    /// <summary>Opsiyonel proje ilişkisi (proje bütçesine yansıtmak için).</summary>
    public Guid? ProjectId { get; set; }

    /// <summary>APYA-143: Opsiyonel task etiketi — task bazlı maliyet kırılımı.</summary>
    public Guid? TaskId { get; set; }

    /// <summary>
    /// Harcamanın yazıldığı bütçe kalemi (<see cref="ProjectBudgets.ProjectBudgetLine"/>).
    /// Kalem tablosundaki "Harcanan" kolonu bunun üzerinden toplanır; kalemde
    /// denormalize bir toplam TUTULMAZ.
    ///
    /// Nullable: kalem modeli sonradan geldi, mevcut giderler kalemsiz. Bağlam
    /// şablonu zorunlu kılana kadar kalemsiz gider meşrudur (bordro, kira gibi
    /// proje geneli kalemler de öyle kalabilir).
    /// </summary>
    public Guid? BudgetLineId { get; set; }

    /// <summary>Opsiyonel cari ilişkisi.</summary>
    public Guid? CustomerId { get; set; }

    public string? Description { get; set; }

    protected Expense() { }

    public Expense(
        Guid id,
        string title,
        decimal amount,
        Guid cashAccountId,
        DateTime expenseDate,
        ExpenseCategory category = ExpenseCategory.Other,
        string currency = "TRY",
        Guid? projectId = null,
        Guid? customerId = null,
        string? description = null,
        Guid? taskId = null,
        Guid? tenantId = null) : base(id)
    {
        TenantId = tenantId;
        SetTitle(title);
        SetAmount(amount);
        if (cashAccountId == Guid.Empty)
            throw new BusinessException(PlatformDomainErrorCodes.ExpenseCashAccountRequired);
        CashAccountId = cashAccountId;
        ExpenseDate = expenseDate;
        Category = category;
        Currency = string.IsNullOrWhiteSpace(currency) ? "TRY" : currency.Trim().ToUpperInvariant();
        ProjectId = projectId;
        TaskId = taskId;
        CustomerId = customerId;
        Description = description;
    }

    public void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new BusinessException(PlatformDomainErrorCodes.ExpenseTitleRequired);
        if (title.Length > ExpenseConsts.MaxTitleLength)
            throw new BusinessException(PlatformDomainErrorCodes.ExpenseFieldTooLong)
                .WithData("Field", nameof(Title))
                .WithData("MaxLength", ExpenseConsts.MaxTitleLength);
        Title = title.Trim();
    }

    public void SetAmount(decimal amount)
    {
        if (amount <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.ExpenseAmountInvalid)
                .WithData("Amount", amount);
        Amount = amount;
    }
}
