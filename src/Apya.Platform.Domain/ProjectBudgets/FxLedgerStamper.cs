using System;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.ProjectBudgets;

/// <summary>Bir kaydın üç defterdeki karşılığı.</summary>
public sealed record FxStamp(decimal BookAmount, decimal BookRate, decimal? DonorAmount, decimal? DonorRate);

/// <summary>
/// Gelir/gider kaydının ₺ defter ve donör karşılığını hesaplar.
///
/// TEK GİRİŞ NOKTASI: gider ve gelir servisleri aynı metodu çağırır, çünkü kural
/// birebir aynı ve iki yerde yazılırsa biri güncellenmeden kalır.
///
/// Kur bulunamazsa hata fırlatmaz — donör alanı boş kalır ve ekranda öyle görünür.
/// Dövizli tek bir kayıt yüzünden gider girişini kilitlemek, eksik bir donör
/// rakamından daha zararlı olurdu.
/// </summary>
public class FxLedgerStamper : DomainService
{
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly FxRateResolver _rateResolver;

    public FxLedgerStamper(IRepository<Project, Guid> projectRepository, FxRateResolver rateResolver)
    {
        _projectRepository = projectRepository;
        _rateResolver = rateResolver;
    }

    public async Task<FxStamp> StampAsync(Guid? projectId, string currency, decimal amount, DateTime recordDate)
    {
        var cur = string.IsNullOrWhiteSpace(currency) ? FxLedgerCalculator.BookCurrency : currency.Trim().ToUpperInvariant();

        var project = projectId.HasValue ? await _projectRepository.FindAsync(projectId.Value) : null;

        // ₺ defter — projeden bağımsız, her kayıt için hesaplanır.
        var bookRate = project != null
            ? await _rateResolver.ResolveAsync(project, cur, FxLedgerCalculator.BookCurrency, recordDate)
            : await _rateResolver.ResolveByDateAsync(cur, FxLedgerCalculator.BookCurrency, recordDate);

        var effectiveBookRate = FxLedgerCalculator.EffectiveRate(cur, FxLedgerCalculator.BookCurrency, bookRate);
        var bookAmount = effectiveBookRate > 0
            ? FxLedgerCalculator.Convert(amount, cur, FxLedgerCalculator.BookCurrency, effectiveBookRate)
            : 0m;

        // Donör defteri — yalnız projenin donör PB'si varsa.
        if (project?.DonorCurrency == null)
        {
            return new FxStamp(bookAmount, effectiveBookRate, null, null);
        }

        var donorRate = await _rateResolver.ResolveAsync(project, cur, project.DonorCurrency, recordDate);
        var effectiveDonorRate = FxLedgerCalculator.EffectiveRate(cur, project.DonorCurrency, donorRate);

        if (effectiveDonorRate <= 0)
        {
            return new FxStamp(bookAmount, effectiveBookRate, null, null);
        }

        var donorAmount = FxLedgerCalculator.Convert(amount, cur, project.DonorCurrency, effectiveDonorRate);
        return new FxStamp(bookAmount, effectiveBookRate, donorAmount, effectiveDonorRate);
    }
}
