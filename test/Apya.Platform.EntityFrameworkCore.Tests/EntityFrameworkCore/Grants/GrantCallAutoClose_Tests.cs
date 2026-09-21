using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Threading;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 🔴 LIF-03 · SÖZLEŞME: son başvuru tarihi geçen çağrı kendiliğinden kapanır.
///
/// <para>Kapanış bugüne kadar TAMAMEN ELLEydi. Host unutunca tarihi geçmiş çağrı
/// "Açık" görünmeye devam ediyor, karara bağlanmamış ilgi talepleri süresiz
/// "Yeni/İnceleniyor"da kalıyor ve firmaya hiçbir cevap gitmiyordu.</para>
///
/// <para>Worker zinciri yeniden yazmaz, host'un elle kapatırken koşturduğu
/// <see cref="GrantCallClosingManager"/>'ı çağırır — iki kapanış yolu ayrışmasın diye.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantCallAutoClose_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantInterestAppService _interestAppService;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantCallAutoClose_Tests()
    {
        _interestAppService = GetRequiredService<IGrantInterestAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _interestRepository = GetRequiredService<IRepository<GrantInterest, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>
    /// <c>DoWorkAsync</c> korumalıdır; turu tetiklemek için tek amaçlı alt sınıf.
    /// 🔴 <c>public</c> ve <c>sealed</c> DEĞİL olmalı: ABP kapsayıcı kurulurken
    /// <c>[UnitOfWork]</c> taşıyan tipler için proxy üretir, erişilemeyen ya da
    /// mühürlü tipte bu "Can not create proxy" ile düşer.
    /// </summary>
    public class WorkerProbe : GrantDeadlineReminderWorker
    {
        public WorkerProbe(AbpAsyncTimer timer, IServiceScopeFactory scopeFactory)
            : base(timer, scopeFactory) { }

        public Task RunOnceAsync(IServiceProvider serviceProvider)
            => DoWorkAsync(new PeriodicBackgroundWorkerContext(serviceProvider));
    }

    private Task RunWorkerAsync() => WithUnitOfWorkAsync(() =>
    {
        var worker = new WorkerProbe(
            GetRequiredService<AbpAsyncTimer>(),
            GetRequiredService<IServiceScopeFactory>())
        {
            // 🔴 Elle kurulan worker'da özellik enjeksiyonu ÇALIŞMAZ; atanmazsa
            // ilk Logger erişiminde NullReferenceException gelir (üretimde worker
            // kapsayıcıdan çözüldüğü için bu alan dolu gelir).
            LazyServiceProvider = GetRequiredService<IAbpLazyServiceProvider>()
        };
        return worker.RunOnceAsync(ServiceProvider);
    });

    private async Task<GrantCall> CreateCallAsync(DateTime? deadline, GrantCallStatus status)
    {
        var grant = new Grant(Guid.NewGuid(), "Otomatik Kapanış " + Guid.NewGuid().ToString("N")[..6],
            "Kurum", maxAmount: 100_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);

        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", status);
        call.SetSchedule(null, deadline);
        await _callRepository.InsertAsync(call, autoSave: true);
        return call;
    }

    private async Task<Guid> CreateTenantAsync()
    {
        var tenant = await _tenantManager.CreateAsync("Kapanış Firması " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    [Fact]
    public async Task Tarihi_Gecen_Cagri_Kapanir_Ve_Bekleyen_Talep_Kacirildi_Olur()
    {
        var call = await CreateCallAsync(DateTime.Now.Date.AddDays(-1), GrantCallStatus.Acik);
        var tenantId = await CreateTenantAsync();

        Guid interestId;
        using (_currentTenant.Change(tenantId))
        {
            interestId = (await _interestAppService.ExpressAsync(new ExpressGrantInterestInput
            {
                GrantCallId = call.Id, Note = "Proje fikri", ProblemStatement = "Sorun"
            })).Id;
        }

        await RunWorkerAsync();

        (await _callRepository.GetAsync(call.Id)).Status.ShouldBe(GrantCallStatus.Kapandi,
            "tarihi geçen çağrı kendiliğinden kapanmalı");

        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestRepository.GetAsync(interestId);
            interest.Status.ShouldBe(GrantInterestStatus.Kacirildi,
                "kapanış zinciri koşmalı; talep süresiz 'Yeni'de kalmamalı");
        }
    }

    [Fact]
    public async Task Tarihi_Gelmemis_Cagri_Kapanmaz()
    {
        var call = await CreateCallAsync(DateTime.Now.Date.AddDays(7), GrantCallStatus.Acik);

        await RunWorkerAsync();

        (await _callRepository.GetAsync(call.Id)).Status.ShouldBe(GrantCallStatus.Acik);
    }

    /// <summary>
    /// Taslak yayımlanmamıştır: kapanış zinciri firmalara "çağrı kapandı" der ve
    /// o firmalar çağrıyı hiç görmemiştir. Tarihi geçmiş olsa bile dokunulmaz.
    /// </summary>
    [Fact]
    public async Task Taslak_Cagri_Tarihi_Gecse_De_Kapanmaz()
    {
        var call = await CreateCallAsync(DateTime.Now.Date.AddDays(-30), GrantCallStatus.Taslak);

        await RunWorkerAsync();

        (await _callRepository.GetAsync(call.Id)).Status.ShouldBe(GrantCallStatus.Taslak);
    }

    /// <summary>Son tarihi olmayan süresiz çağrı zamanla kapanmaz; host elle kapatır.</summary>
    [Fact]
    public async Task Son_Tarihsiz_Cagri_Kapanmaz()
    {
        var call = await CreateCallAsync(null, GrantCallStatus.Acik);

        await RunWorkerAsync();

        (await _callRepository.GetAsync(call.Id)).Status.ShouldBe(GrantCallStatus.Acik);
    }
}
