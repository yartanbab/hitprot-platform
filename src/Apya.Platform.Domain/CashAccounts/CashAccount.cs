using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.CashAccounts;

/// <summary>
/// Kasa Aggregate Root (APYA-133). Tenant-scoped, çok para birimli.
/// Güncel bakiye CashMovement'lerden hesaplanır (APYA-134); burada sadece açılış bakiyesi tutulur.
/// </summary>
public class CashAccount : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public string Name { get; set; } = null!;

    public CashAccountType Type { get; set; } = CashAccountType.Cash;

    /// <summary>ISO 4217 (TRY, USD, EUR...). Şimdilik TL ana takip.</summary>
    public string Currency { get; set; } = "TRY";

    public decimal OpeningBalance { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    protected CashAccount() { }

    public CashAccount(
        Guid id,
        string name,
        CashAccountType type = CashAccountType.Cash,
        string currency = "TRY",
        decimal openingBalance = 0,
        Guid? tenantId = null) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
        Type = type;
        SetCurrency(currency);
        OpeningBalance = openingBalance;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.CashAccountNameRequired);
        if (name.Length > CashAccountConsts.MaxNameLength)
            throw new BusinessException(PlatformDomainErrorCodes.CashAccountFieldTooLong)
                .WithData("Field", nameof(Name))
                .WithData("MaxLength", CashAccountConsts.MaxNameLength);
        Name = name.Trim();
    }

    public void SetCurrency(string currency)
    {
        if (string.IsNullOrWhiteSpace(currency) || currency.Trim().Length != CashAccountConsts.CurrencyLength)
            throw new BusinessException(PlatformDomainErrorCodes.CashAccountCurrencyInvalid)
                .WithData("Currency", currency ?? string.Empty);
        Currency = currency.Trim().ToUpperInvariant();
    }

    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;
}
