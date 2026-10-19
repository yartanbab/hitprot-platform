using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ExchangeRates;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.ExchangeRates;

/// <summary>
/// F-06b · Günlük TCMB çekimi yalnız dövizli projesi olan kiracıya yazar (USD/EUR/GBP + projenin döviz kodu),
/// var olan kayda dokunmaz, ikinci çalıştırma kayıt eklemez. Ağa gidilmez: sahte bülten.
/// </summary>
public class TcmbDailySync_Tests : PlatformWebTestBase
{
    private const string Bulletin = """
        <?xml version="1.0" encoding="UTF-8"?>
        <Tarih_Date Tarih="16.10.2026" Date="10/16/2026" Bulten_No="2026/196">
          <Currency Kod="USD" CurrencyCode="USD"><Unit>1</Unit><ForexBuying>41.9012</ForexBuying></Currency>
          <Currency Kod="EUR" CurrencyCode="EUR"><Unit>1</Unit><ForexBuying>48.7020</ForexBuying></Currency>
          <Currency Kod="GBP" CurrencyCode="GBP"><Unit>1</Unit><ForexBuying>55.1000</ForexBuying></Currency>
          <Currency Kod="CHF" CurrencyCode="CHF"><Unit>1</Unit><ForexBuying>52.3000</ForexBuying></Currency>
        </Tarih_Date>
        """;

    private sealed class FakeClient : ITcmbRateClient
    {
        public int Calls;
        public Task<string?> FetchAsync(DateTime? date) { Calls++; return Task.FromResult<string?>(Bulletin); }
    }

    private readonly FakeClient _client = new();

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        services.Replace(ServiceDescriptor.Singleton<ITcmbRateClient>(_client));
    }

    private static readonly DateTime BulletinDate = new(2026, 10, 16);

    private async Task<Guid> TenantAsync(string? donorCurrency)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("Kur-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        using (GetRequiredService<ICurrentTenant>().Change(tenant.Id))
        {
            var suffix = Guid.NewGuid().ToString("N")[..6];
            var project = new Project(Guid.NewGuid(), tenant.Id, null, "Kur Projesi " + suffix, "KR-" + suffix[..4], "açıklama");
            if (donorCurrency != null) { project.SetFxBridge(donorCurrency, FxPolicy.SpendDate, null); }
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);
        }
        await uow.CompleteAsync();
        return tenant.Id;
    }

    private async Task<ExchangeRate[]> RatesAsync(Guid tenantId)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            return (await GetRequiredService<IRepository<ExchangeRate, Guid>>()
                .GetListAsync(r => r.RateDate == BulletinDate)).ToArray();
        }
    }

    private async Task<int> RunAsync()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var added = await GetRequiredService<TcmbDailySync>().RunAsync();
        await uow.CompleteAsync();
        return added;
    }

    [Fact]
    public async Task Yalniz_dovizli_projesi_olan_kiraciya_yazar_ve_tekrar_etmez()
    {
        var withFx = await TenantAsync("CHF");
        var withoutFx = await TenantAsync(null);

        await RunAsync();
        await RunAsync();

        var rates = await RatesAsync(withFx);
        rates.Select(r => r.FromCurrency).OrderBy(c => c).ShouldBe(new[] { "CHF", "EUR", "GBP", "USD" });
        rates.Single(r => r.FromCurrency == "EUR").Rate.ShouldBe(48.7020m, "ALIŞ kuru");
        rates.ShouldAllBe(r => r.Source == ExchangeRateSource.Tcmb && r.ToCurrency == "TRY");
        (await RatesAsync(withoutFx)).ShouldBeEmpty("dövizli projesi olmayan kiracıya kur yazılmaz");
    }

    [Fact]
    public async Task Elle_girilen_kura_dokunmaz()
    {
        var tenantId = await TenantAsync("EUR");
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenantId))
            {
                await GetRequiredService<IRepository<ExchangeRate, Guid>>().InsertAsync(new ExchangeRate(
                    Guid.NewGuid(), "EUR", "TRY", 50m, BulletinDate, ExchangeRateSource.Manual, tenantId), autoSave: true);
            }
            await uow.CompleteAsync();
        }

        await RunAsync();

        var eur = (await RatesAsync(tenantId)).Single(r => r.FromCurrency == "EUR");
        eur.Rate.ShouldBe(50m);
        eur.Source.ShouldBe(ExchangeRateSource.Manual);
    }
}
