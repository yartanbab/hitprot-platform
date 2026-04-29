namespace Apya.Platform.Accounting.ValueObjects;

using System;
using System.Collections.Generic;
using System.Globalization;
using Volo.Abp;
using Volo.Abp.Domain.Values;

/// <summary>
/// Money — para birimine duyarlı, immutable, deterministic value object.
/// <para>
/// Ledger çekirdeğinde <see cref="decimal"/> kullanılır (banker's rounding'in
/// olmadığı, exact-precision aritmetik). Maksimum scale
/// <see cref="AccountingConsts.MoneyMaxScale"/> ile sınırlanır — sub-cent
/// drift ve "1 / 3" gibi periyodik kesirlerin kaçırdığı kuruşlar
/// ledger'a sızmasın diye.
/// </para>
/// <para>
/// Currency mismatch derhal <see cref="BusinessException"/> fırlatır;
/// silent corruption tehlikesini compile-time'a yaklaştırır.
/// </para>
/// <para>
/// EF Core mapping'i Owned Type olarak yapılır
/// (<c>builder.OwnsOne(x =&gt; x.Amount, ...)</c>).
/// Parametre-siz constructor sadece EF Core içindir.
/// </para>
/// </summary>
public sealed class Money : ValueObject
{
    public decimal Amount { get; private set; }

    public string Currency { get; private set; } = default!;

    /// <summary>EF Core için. Domain'de doğrudan kullanılmamalı.</summary>
    [Obsolete("EF Core internal use only.", error: false)]
    private Money()
    {
    }

    public Money(decimal amount, string currency)
    {
        ValidateCurrency(currency);
        ValidatePrecision(amount);

        Amount = amount;
        Currency = currency.ToUpperInvariant();
    }

    public static Money Zero(string currency) => new(0m, currency);

    public bool IsZero => Amount == 0m;
    public bool IsPositive => Amount > 0m;
    public bool IsNegative => Amount < 0m;

    public Money Add(Money other)
    {
        Check.NotNull(other, nameof(other));
        AssertSameCurrency(other);
        return new Money(Amount + other.Amount, Currency);
    }

    public Money Subtract(Money other)
    {
        Check.NotNull(other, nameof(other));
        AssertSameCurrency(other);
        return new Money(Amount - other.Amount, Currency);
    }

    public Money Negate() => new(-Amount, Currency);

    public Money Abs() => Amount < 0 ? new Money(-Amount, Currency) : this;

    public int CompareAmount(Money other)
    {
        Check.NotNull(other, nameof(other));
        AssertSameCurrency(other);
        return Amount.CompareTo(other.Amount);
    }

    public static Money operator +(Money left, Money right) => left.Add(right);
    public static Money operator -(Money left, Money right) => left.Subtract(right);
    public static Money operator -(Money value) => value.Negate();

    public override string ToString()
        => string.Create(CultureInfo.InvariantCulture, $"{Amount:0.####} {Currency}");

    protected override IEnumerable<object> GetAtomicValues()
    {
        yield return Amount;
        yield return Currency;
    }

    // ============================== Validation ==============================

    private static void ValidateCurrency(string currency)
    {
        if (string.IsNullOrWhiteSpace(currency) ||
            currency.Length != AccountingConsts.CurrencyCodeLength)
        {
            throw new BusinessException(PlatformDomainErrorCodes.MoneyCurrencyInvalid)
                .WithData("Currency", currency ?? "<null>");
        }

        for (var i = 0; i < currency.Length; i++)
        {
            var c = currency[i];
            if (c is not (>= 'A' and <= 'Z') and not (>= 'a' and <= 'z'))
            {
                throw new BusinessException(PlatformDomainErrorCodes.MoneyCurrencyInvalid)
                    .WithData("Currency", currency);
            }
        }
    }

    private static void ValidatePrecision(decimal amount)
    {
        // decimal.GetBits[3] içinde scale bit-shift ile encode edilir.
        // ToString round-trip'ten kaçınıp doğrudan bit'lere bakıyoruz —
        // hot path'te allocation yok.
        var scale = (decimal.GetBits(amount)[3] >> 16) & 0x7F;
        if (scale > AccountingConsts.MoneyMaxScale)
        {
            throw new BusinessException(PlatformDomainErrorCodes.MoneyAmountInvalidPrecision)
                .WithData("Amount", amount)
                .WithData("Scale", scale)
                .WithData("MaxScale", AccountingConsts.MoneyMaxScale);
        }
    }

    private void AssertSameCurrency(Money other)
    {
        if (!string.Equals(Currency, other.Currency, StringComparison.Ordinal))
        {
            throw new BusinessException(PlatformDomainErrorCodes.MoneyCurrencyMismatch)
                .WithData("Expected", Currency)
                .WithData("Actual", other.Currency);
        }
    }
}
