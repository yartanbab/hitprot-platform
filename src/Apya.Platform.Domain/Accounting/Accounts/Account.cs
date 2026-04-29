namespace Apya.Platform.Accounting.Accounts;

using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

/// <summary>
/// Account — chart-of-accounts'taki tek bir hesap. Aggregate root.
/// <para>
/// Önemli: <b>Account hiçbir zaman BAKİYE TUTMAZ</b>. Bakiye, journal entry
/// satırlarından deterministic olarak türetilir. Bu sayede:
/// </para>
/// <list type="bullet">
///   <item>Account ile JournalEntry arasında race condition kaynağı yoktur.</item>
///   <item>Replay/rebuild ile bakiye her zaman regenerate edilebilir.</item>
///   <item>"Hesap güncellemek için kilitleme" antipattern'i yok — high concurrency.</item>
/// </list>
/// <para>
/// Account, JournalEntry'nin aksine append-only DEĞİLDİR — chart yönetimi
/// (rename, deactivate, parent değiştirme) operasyonel bir gerekliliktir.
/// Ancak <see cref="AccountType"/> ve <see cref="Currency"/> immutable'dır:
/// hesabın tipini veya para birimini değiştirmek geçmiş postingleri
/// retroaktif anlamsızlaştırır. Bu durumlarda yeni hesap açılır,
/// eskisi deaktive edilir, gerekiyorsa journal-level reversal+repost yapılır.
/// </para>
/// <para>
/// <see cref="FullAuditedAggregateRoot{TKey}"/> yerine
/// <see cref="AuditedAggregateRoot{TKey}"/> seçildi: soft-delete (IsDeleted)
/// chart-of-accounts üzerinde anlamsız — ya aktiftir ya değildir,
/// "silinmiş ama gizli" durum financial sistemde tehlikelidir.
/// </para>
/// </summary>
public class Account : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public virtual Guid? TenantId { get; private set; }

    /// <summary>
    /// Hesap kodu — tenant içinde unique, kullanıcı tarafından belirlenir
    /// (ör. "100.01.001"). EF Core layer'da
    /// <c>HasIndex(x =&gt; new { x.TenantId, x.Code }).IsUnique()</c> ile zorlanır.
    /// </summary>
    public virtual string Code { get; private set; } = default!;

    public virtual string Name { get; private set; } = default!;

    public virtual AccountType Type { get; private set; }

    public virtual NormalBalance NormalBalance { get; private set; }

    /// <summary>
    /// Hesabın kabul ettiği para birimi (ISO 4217).
    /// Bir kez set edilince değişmez. Multi-currency işlemler için
    /// her currency başına ayrı hesap açılır (ör. "Bank-TRY", "Bank-USD").
    /// </summary>
    public virtual string Currency { get; private set; } = default!;

    public virtual Guid? ParentAccountId { get; private set; }

    public virtual bool IsActive { get; private set; }

    /// <summary>EF Core için.</summary>
    protected Account()
    {
    }

    public Account(
        Guid id,
        Guid? tenantId,
        string code,
        string name,
        AccountType type,
        string currency,
        Guid? parentAccountId = null)
        : base(id)
    {
        TenantId = tenantId;
        SetCode(code);
        SetName(name);
        Type = type;
        NormalBalance = ResolveNormalBalance(type);
        Currency = ValidateCurrency(currency);
        SetParent(parentAccountId, currentId: id);
        IsActive = true;
    }

    public void Rename(string name) => SetName(name);

    public void ChangeParent(Guid? parentAccountId)
        => SetParent(parentAccountId, currentId: Id);

    public void Deactivate()
    {
        // Idempotent — already inactive ise no-op (event flood'undan kaçınır).
        if (!IsActive)
        {
            return;
        }
        IsActive = false;
    }

    public void Reactivate()
    {
        if (IsActive)
        {
            return;
        }
        IsActive = true;
    }

    /// <summary>
    /// Bir journal posting denenirken çağrılır. Hesap inactive ise
    /// posting reddedilir — defensive, guard içinde de tekrar kontrol edilir.
    /// </summary>
    public void EnsureCanReceivePostings()
    {
        if (!IsActive)
        {
            throw new BusinessException(PlatformDomainErrorCodes.AccountInactive)
                .WithData("AccountId", Id)
                .WithData("Code", Code);
        }
    }

    // ============================== Internals ==============================

    private void SetCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            throw new BusinessException(PlatformDomainErrorCodes.AccountCodeRequired);
        }
        Code = code.Trim();
    }

    private void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new BusinessException(PlatformDomainErrorCodes.AccountNameRequired);
        }
        Name = name.Trim();
    }

    private void SetParent(Guid? parentAccountId, Guid currentId)
    {
        if (parentAccountId.HasValue && parentAccountId.Value == currentId)
        {
            throw new BusinessException(PlatformDomainErrorCodes.AccountParentSelfReference)
                .WithData("AccountId", currentId);
        }
        ParentAccountId = parentAccountId;
    }

    private static string ValidateCurrency(string currency)
    {
        if (string.IsNullOrWhiteSpace(currency) ||
            currency.Length != AccountingConsts.CurrencyCodeLength)
        {
            throw new BusinessException(PlatformDomainErrorCodes.MoneyCurrencyInvalid)
                .WithData("Currency", currency ?? "<null>");
        }
        return currency.ToUpperInvariant();
    }

    private static NormalBalance ResolveNormalBalance(AccountType type) => type switch
    {
        AccountType.Asset => NormalBalance.Debit,
        AccountType.Expense => NormalBalance.Debit,
        AccountType.Liability => NormalBalance.Credit,
        AccountType.Equity => NormalBalance.Credit,
        AccountType.Revenue => NormalBalance.Credit,
        _ => throw new ArgumentOutOfRangeException(nameof(type), type, "Unknown AccountType.")
    };
}
