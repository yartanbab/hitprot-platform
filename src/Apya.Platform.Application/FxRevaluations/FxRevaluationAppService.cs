using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Permissions;

namespace Apya.Platform.FxRevaluations;

[Authorize(PlatformPermissions.FxRevaluations.Default)]
public class FxRevaluationAppService : ApplicationService, IFxRevaluationAppService
{
    private readonly IRepository<FxRevaluationSnapshot, Guid> _snapshotRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<ExchangeRate, Guid> _exchangeRateRepository;

    public FxRevaluationAppService(
        IRepository<FxRevaluationSnapshot, Guid> snapshotRepository,
        IRepository<CashAccount, Guid> cashAccountRepository,
        IRepository<CashMovement, Guid> cashMovementRepository,
        IRepository<ExchangeRate, Guid> exchangeRateRepository)
    {
        _snapshotRepository = snapshotRepository;
        _cashAccountRepository = cashAccountRepository;
        _cashMovementRepository = cashMovementRepository;
        _exchangeRateRepository = exchangeRateRepository;
    }

    public async Task<PagedResultDto<FxRevaluationSnapshotDto>> GetListAsync(GetFxRevaluationsInput input)
    {
        var query = await _snapshotRepository.GetQueryableAsync();
        var total = await AsyncExecuter.CountAsync(query);
        var items = await AsyncExecuter.ToListAsync(
            query.OrderByDescending(x => x.AsOfDate)
                 .Skip(input.SkipCount).Take(input.MaxResultCount));

        return new PagedResultDto<FxRevaluationSnapshotDto>(
            total,
            items.Select(MapHeader).ToList());
    }

    public async Task<FxRevaluationSnapshotDto> GetAsync(Guid id)
    {
        var snapshot = await _snapshotRepository.GetAsync(id, includeDetails: true);
        return Map(snapshot);
    }

    [Authorize(PlatformPermissions.FxRevaluations.Run)]
    public async Task<FxRevaluationSnapshotDto> RunAsync(RunFxRevaluationDto input)
    {
        var asOf = input.AsOfDate.Date;
        var snapshot = new FxRevaluationSnapshot(GuidGenerator.Create(), asOf, CurrentTenant.Id, input.Notes);

        var accounts = await _cashAccountRepository.GetListAsync(a => a.IsActive);
        // APYA-145 (BUG-2): Değerleme tarihine kadarki hareketler — sonraki tarihli
        // hareketler yıl-sonu bakiyesine girmemeli (kur zaten RateDate<=asOf kullanıyor).
        var movements = await _cashMovementRepository.GetListAsync(m => m.MovementDate <= asOf);
        var rates = await _exchangeRateRepository.GetListAsync(r => r.ToCurrency == FxRevaluationCalculator.BaseCurrency);

        foreach (var acc in accounts.OrderBy(a => a.Name))
        {
            var balance = acc.OpeningBalance + movements
                .Where(m => m.CashAccountId == acc.Id)
                .Sum(m => m.SignedAmount);

            decimal? rate = null;
            if (!string.Equals(acc.Currency.Trim(), FxRevaluationCalculator.BaseCurrency, StringComparison.OrdinalIgnoreCase))
            {
                rate = rates
                    .Where(r => r.FromCurrency == acc.Currency && r.RateDate <= asOf)
                    .OrderByDescending(r => r.RateDate)
                    .Select(r => (decimal?)r.Rate)
                    .FirstOrDefault();
            }

            var tryValue = FxRevaluationCalculator.ToBaseCurrency(balance, acc.Currency, rate);

            snapshot.AddLine(new FxRevaluationLine(
                GuidGenerator.Create(), acc.Id, acc.Name, acc.Currency, balance, rate, tryValue));
        }

        await _snapshotRepository.InsertAsync(snapshot, autoSave: true);
        return Map(snapshot);
    }

    [Authorize(PlatformPermissions.FxRevaluations.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _snapshotRepository.DeleteAsync(id);
    }

    private static FxRevaluationSnapshotDto MapHeader(FxRevaluationSnapshot s) => new()
    {
        Id = s.Id,
        TenantId = s.TenantId,
        AsOfDate = s.AsOfDate,
        TotalTryValue = s.TotalTryValue,
        Notes = s.Notes,
        CreationTime = s.CreationTime
    };

    private static FxRevaluationSnapshotDto Map(FxRevaluationSnapshot s)
    {
        var dto = MapHeader(s);
        dto.Lines = s.Lines
            .OrderBy(l => l.CashAccountName)
            .Select(l => new FxRevaluationLineDto
            {
                CashAccountId = l.CashAccountId,
                CashAccountName = l.CashAccountName,
                Currency = l.Currency,
                Balance = l.Balance,
                Rate = l.Rate,
                TryValue = l.TryValue
            }).ToList();
        return dto;
    }
}
