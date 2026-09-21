using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Projects;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Kur politikasının tek işi: "hangi GÜNÜN kuru". Kurun kendisi her zaman
/// mevcut <see cref="ExchangeRate"/> kayıtlarından okunur — paralel bir kur
/// mekanizması kurulmadı (bu, handoff'un açık kuralı).
///
/// Kur bulunamazsa hata FIRLATILMAZ, null döner: dövizli bir kayıt yüzünden
/// gider girişinin tamamen bloke olması, eksik bir donör rakamından daha kötü.
/// Eksiklik ekranda görünür (donör kolonu boş kalır).
/// </summary>
public class FxRateResolver : DomainService
{
    private readonly IRepository<ExchangeRate, Guid> _rateRepository;
    private readonly IRepository<FundingTranche, Guid> _trancheRepository;

    public FxRateResolver(
        IRepository<ExchangeRate, Guid> rateRepository,
        IRepository<FundingTranche, Guid> trancheRepository)
    {
        _rateRepository = rateRepository;
        _trancheRepository = trancheRepository;
    }

    /// <summary>
    /// <paramref name="recordDate"/> tarihli bir kayıt için 1 <paramref name="fromCurrency"/>
    /// kaç <paramref name="toCurrency"/> eder. Aynı para biriminde 1 döner.
    /// </summary>
    public async Task<decimal?> ResolveAsync(
        Project project,
        string fromCurrency,
        string toCurrency,
        DateTime recordDate)
    {
        if (string.Equals(fromCurrency?.Trim(), toCurrency?.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            return 1m;
        }

        // Sabit sözleşme kuru hiç sorgu yapmaz — sözleşmede ne yazıyorsa o.
        if (project.FxPolicy == FxPolicy.FixedContract
            && string.Equals(toCurrency, project.DonorCurrency, StringComparison.OrdinalIgnoreCase))
        {
            return project.FixedDonorRate;
        }

        var effectiveDate = await ResolveEffectiveDateAsync(project, recordDate);
        return await FindRateAsync(fromCurrency!, toCurrency!, effectiveDate, project.FxPolicy);
    }

    /// <summary>
    /// Politikasız çözümleme — projesi olmayan kayıtlar için. "Hangi gün"
    /// sorusunun cevabı kaydın kendi günüdür.
    /// </summary>
    public Task<decimal?> ResolveByDateAsync(string fromCurrency, string toCurrency, DateTime date)
        => string.Equals(fromCurrency?.Trim(), toCurrency?.Trim(), StringComparison.OrdinalIgnoreCase)
            ? Task.FromResult<decimal?>(1m)
            : FindRateAsync(fromCurrency!, toCurrency!, date.Date, FxPolicy.SpendDate);

    /// <summary>Politikanın "hangi gün" cevabı.</summary>
    private async Task<DateTime> ResolveEffectiveDateAsync(Project project, DateTime recordDate)
    {
        if (project.FxPolicy != FxPolicy.TrancheDate)
        {
            return recordDate.Date;
        }

        // Dilim kuru: kayıt tarihine kadar TAHSİL EDİLMİŞ son dilimin tahsilat günü.
        // Dilim yoksa harcama günü kuruna düşer — sessizce yanlış bir kur seçmektense
        // en yakın makul davranış.
        var tranches = await _trancheRepository.GetListAsync(x =>
            x.ProjectId == project.Id && x.ReceivedDate != null && x.ReceivedDate <= recordDate);

        return tranches.Count == 0
            ? recordDate.Date
            : tranches.Max(x => x.ReceivedDate!.Value).Date;
    }

    /// <summary>
    /// Kur kaydı arar. Aylık politikada kayıt AYININ kurları, diğerlerinde
    /// tarihe kadarki en güncel kur kullanılır.
    /// </summary>
    private async Task<decimal?> FindRateAsync(string from, string to, DateTime date, FxPolicy policy)
    {
        var f = from.Trim().ToUpperInvariant();
        var t = to.Trim().ToUpperInvariant();

        var rates = await _rateRepository.GetListAsync(x =>
            x.FromCurrency == f && x.ToCurrency == t && x.RateDate <= date);

        var candidates = policy == FxPolicy.MonthlyDonor
            ? rates.Where(x => x.RateDate.Year == date.Year && x.RateDate.Month == date.Month).ToList()
            : rates;

        if (candidates.Count == 0)
        {
            // Aylık politikada o ay hiç kur girilmemişse tarihe kadarki en günceli
            // kullanılır: "kur yok" demek yerine en yakın gerçeğe düşülür.
            candidates = rates;
        }

        if (candidates.Count > 0)
        {
            return candidates.OrderByDescending(x => x.RateDate).First().Rate;
        }

        // Ters yönde kur girilmiş olabilir (EUR→TRY var ama TRY→EUR yok).
        var inverse = await _rateRepository.GetListAsync(x =>
            x.FromCurrency == t && x.ToCurrency == f && x.RateDate <= date);

        var best = inverse.OrderByDescending(x => x.RateDate).FirstOrDefault();
        return best is { Rate: > 0 } ? Math.Round(1m / best.Rate, 6, MidpointRounding.AwayFromZero) : null;
    }
}
