using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashMovements;
using Apya.Platform.ExchangeRates;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.CashAccounts;

/// <summary>
/// Kasalar arası transfer — iki CashAccount aggregate'i arasındaki koordinasyonun TEK kapısı.
/// InvoiceManager.RecordPaymentAsync ile aynı desen: hem giriş hem çıkış CashMovement'i
/// burada, tek UoW'da (ApplicationService metodları varsayılan otomatik UoW içinde çalışır).
/// </summary>
public class CashTransferManager : DomainService
{
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<ExchangeRate, Guid> _exchangeRateRepository;

    public CashTransferManager(
        IRepository<CashAccount, Guid> cashAccountRepository,
        IRepository<CashMovement, Guid> cashMovementRepository,
        IRepository<ExchangeRate, Guid> exchangeRateRepository)
    {
        _cashAccountRepository = cashAccountRepository;
        _cashMovementRepository = cashMovementRepository;
        _exchangeRateRepository = exchangeRateRepository;
    }

    public async Task<CashTransferResult> TransferAsync(
        Guid fromCashAccountId,
        Guid toCashAccountId,
        decimal amount,
        DateTime transferDate,
        string? description)
    {
        if (fromCashAccountId == toCashAccountId)
            throw new BusinessException(PlatformDomainErrorCodes.CashMovementTransferSameAccount);

        var from = await _cashAccountRepository.GetAsync(fromCashAccountId);
        var to = await _cashAccountRepository.GetAsync(toCashAccountId);

        if (!from.IsActive || !to.IsActive)
            throw new BusinessException(PlatformDomainErrorCodes.CashMovementTransferAccountInactive);

        var rate = await ResolveRateAsync(from.Currency, to.Currency);
        var convertedAmount = ConvertAmount(amount, from.Currency, to.Currency, rate);

        var transferId = GuidGenerator.Create();
        var description1 = string.IsNullOrWhiteSpace(description)
            ? $"Transfer: {from.Name} → {to.Name}"
            : description!;

        var outMovement = new CashMovement(
            GuidGenerator.Create(), from.Id, CashMovementDirection.Out, amount, transferDate,
            description1, CashMovementSource.Transfer, transferId, CurrentTenant.Id);
        await _cashMovementRepository.InsertAsync(outMovement, autoSave: true);

        var inMovement = new CashMovement(
            GuidGenerator.Create(), to.Id, CashMovementDirection.In, convertedAmount, transferDate,
            description1, CashMovementSource.Transfer, transferId, CurrentTenant.Id);
        await _cashMovementRepository.InsertAsync(inMovement, autoSave: true);

        return new CashTransferResult(outMovement, inMovement, convertedAmount, rate);
    }

    /// <summary>
    /// En güncel kur kaydı, DB-side ordering + LIMIT 1 (InvoiceManager.CreateCashMovementAsync
    /// ile aynı ARCH-012 deseni — composite index TenantId/FromCurrency/ToCurrency/RateDate).
    /// </summary>
    private async Task<decimal?> ResolveRateAsync(string fromCurrency, string toCurrency)
    {
        if (string.Equals(fromCurrency.Trim(), toCurrency.Trim(), StringComparison.OrdinalIgnoreCase))
            return null;

        var query = await _exchangeRateRepository.GetQueryableAsync();
        var er = await AsyncExecuter.FirstOrDefaultAsync(
            query.Where(x => x.FromCurrency == fromCurrency && x.ToCurrency == toCurrency)
                 .OrderByDescending(x => x.RateDate));
        return er?.Rate;
    }

    /// <summary>1 fromCurrency = rate toCurrency. Aynı para biriminde tutar aynen kalır.</summary>
    private static decimal ConvertAmount(decimal amount, string fromCurrency, string toCurrency, decimal? rate)
    {
        if (string.Equals(fromCurrency.Trim(), toCurrency.Trim(), StringComparison.OrdinalIgnoreCase))
            return amount;

        if (rate is null || rate <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.CashMovementTransferRateMissing)
                .WithData("From", fromCurrency)
                .WithData("To", toCurrency);

        return Math.Round(amount * rate.Value, 2, MidpointRounding.AwayFromZero);
    }
}

public class CashTransferResult
{
    public CashMovement OutMovement { get; }
    public CashMovement InMovement { get; }
    public decimal ConvertedAmount { get; }
    public decimal? RateApplied { get; }

    public CashTransferResult(CashMovement outMovement, CashMovement inMovement, decimal convertedAmount, decimal? rateApplied)
    {
        OutMovement = outMovement;
        InMovement = inMovement;
        ConvertedAmount = convertedAmount;
        RateApplied = rateApplied;
    }
}
