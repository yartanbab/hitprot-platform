using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;

namespace Apya.Platform.ExchangeRates;

/// <summary>
/// F-06b · Kullanıcı kararı (2026-10-19, seçenek a): TCMB kurları her iş günü otomatik çekilir, YALNIZ dövizli
/// projesi olan kiracılara (host dahil). "Dövizli": proje para birimi ya da donör para birimi TRY dışı. Her
/// kiracıya USD/EUR/GBP ile kendi projelerindeki döviz kodları yazılır.
///
/// <para>Var olan kayda DOKUNULMAZ (elle girilmiş kur ya da önceki çekim): yalnız bülten gününün eksik kaydı
/// eklenir. Kurlar sayfasındaki "TCMB'den Güncelle" düğmesi üzerine yazmaya devam eder (bilinçli eylem).</para>
/// </summary>
public class TcmbDailySync : ITransientDependency
{
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ExchangeRate, Guid> _rateRepository;
    private readonly ITcmbRateClient _client;
    private readonly IDataFilter<IMultiTenant> _tenantFilter;
    private readonly ICurrentTenant _currentTenant;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IClock _clock;

    public TcmbDailySync(
        IRepository<Project, Guid> projectRepository,
        IRepository<ExchangeRate, Guid> rateRepository,
        ITcmbRateClient client,
        IDataFilter<IMultiTenant> tenantFilter,
        ICurrentTenant currentTenant,
        IGuidGenerator guidGenerator,
        IClock clock)
    {
        _projectRepository = projectRepository;
        _rateRepository = rateRepository;
        _client = client;
        _tenantFilter = tenantFilter;
        _currentTenant = currentTenant;
        _guidGenerator = guidGenerator;
        _clock = clock;
    }

    /// <summary>Eklenen kur kaydı sayısı. Ağ hatası çağırana (işçiye) iletilir.</summary>
    public async Task<int> RunAsync()
    {
        Dictionary<Guid?, HashSet<string>> targets;
        using (_tenantFilter.Disable())
        {
            var projects = await _projectRepository.GetListAsync(p =>
                (p.DonorCurrency != null && p.DonorCurrency != "" && p.DonorCurrency != "TRY")
                || (p.Currency != null && p.Currency != "" && p.Currency != "TRY"));

            targets = projects
                .GroupBy(p => p.TenantId)
                .ToDictionary(g => g.Key, g =>
                {
                    var codes = new HashSet<string>(ExchangeRateAppService.TcmbCurrencies);
                    foreach (var p in g)
                    {
                        foreach (var code in new[] { p.Currency, p.DonorCurrency })
                        {
                            var c = code?.Trim().ToUpperInvariant();
                            if (!string.IsNullOrEmpty(c) && c != "TRY") { codes.Add(c); }
                        }
                    }
                    return codes;
                });
        }

        if (targets.Count == 0)
        {
            return 0;
        }

        var xml = await _client.FetchAsync(null);
        if (xml == null)
        {
            return 0;
        }

        var bulletin = TcmbRateParser.Parse(xml, targets.Values.SelectMany(c => c).Distinct(), _clock.Now.Date);
        var added = 0;
        foreach (var (tenantId, codes) in targets)
        {
            using (_currentTenant.Change(tenantId))
            {
                foreach (var code in codes)
                {
                    if (!bulletin.BuyingRates.TryGetValue(code, out var rate)) { continue; }

                    var existing = await _rateRepository.FirstOrDefaultAsync(x =>
                        x.FromCurrency == code && x.ToCurrency == "TRY" && x.RateDate == bulletin.Date);
                    if (existing != null) { continue; }

                    await _rateRepository.InsertAsync(new ExchangeRate(
                        _guidGenerator.Create(), code, "TRY", rate, bulletin.Date,
                        ExchangeRateSource.Tcmb, tenantId), autoSave: true);
                    added++;
                }
            }
        }

        return added;
    }
}
