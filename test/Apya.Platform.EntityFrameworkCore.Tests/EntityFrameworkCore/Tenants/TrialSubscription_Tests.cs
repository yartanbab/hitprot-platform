using System;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// SÜRELİ DENEME SÖZLEŞMESİ: bitiş GÜN olarak hesaplanır, yürürlükteki dönem kapanır, gün sınırı
/// sunucuda denetlenir ve biten deneme sonradan bulunabilir (şeritteki tarih).
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TrialSubscription_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly TenantSubscriptionManager _subscriptionManager;
    private readonly IRepository<TenantSubscription, Guid> _subscriptionRepository;
    private readonly IClock _clock;
    private readonly ITenantProfileAppService _tenantProfileAppService;
    private readonly TenantPackageManager _packageManager;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;

    public TrialSubscription_Tests()
    {
        _subscriptionManager = GetRequiredService<TenantSubscriptionManager>();
        _subscriptionRepository = GetRequiredService<IRepository<TenantSubscription, Guid>>();
        _clock = GetRequiredService<IClock>();
        _tenantProfileAppService = GetRequiredService<ITenantProfileAppService>();
        _packageManager = GetRequiredService<TenantPackageManager>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
    }

    /// <summary>
    /// Host "Denemeye al": paket uygulanır (salt okunur kilit de kalkar) ve deneme dönemi açılır.
    /// </summary>
    [Fact]
    public async Task Host_StartTrial_Applies_Package_Clears_ReadOnly_And_Opens_Trial()
    {
        var tenantId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            var profile = new TenantProfile(
                Guid.NewGuid(), tenantId, CompanyType.Company,
                Guid.NewGuid().ToString("N")[..10], "a@b.com");
            await _profileRepository.InsertAsync(profile, autoSave: true);
            await _packageManager.SetReadOnlyAsync(tenantId, true);
        });

        var dto = await _tenantProfileAppService.StartTrialAsync(tenantId, PackageCode.Premium, 14);

        dto.PackageCode.ShouldBe(PackageCode.Premium);
        dto.IsTrial.ShouldBeTrue();
        dto.SubscriptionEndDate.ShouldNotBeNull();

        await WithUnitOfWorkAsync(async () =>
        {
            (await _packageManager.IsReadOnlyAsync(tenantId)).ShouldBeFalse();
            (await _subscriptionManager.GetCurrentOrNullAsync(tenantId))!.Source.ShouldBe(SubscriptionSource.Trial);
        });
    }

    [Fact]
    public async Task StartTrial_Sets_EndDate_In_Days_And_Source_Trial()
    {
        var tenantId = Guid.NewGuid();

        var trial = await WithUnitOfWorkAsync(
            () => _subscriptionManager.StartTrialAsync(tenantId, PackageCode.Premium, 14));

        trial.Source.ShouldBe(SubscriptionSource.Trial);
        trial.PackageCode.ShouldBe(PackageCode.Premium);
        trial.Status.ShouldBe(SubscriptionStatus.Active);
        trial.EndDate.ShouldBe(trial.StartDate.AddDays(14));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(91)]
    public async Task StartTrial_Rejects_Out_Of_Range_Days(int days)
    {
        var ex = await Should.ThrowAsync<BusinessException>(() => WithUnitOfWorkAsync(
            () => _subscriptionManager.StartTrialAsync(Guid.NewGuid(), PackageCode.Premium, days)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TrialDaysOutOfRange);
    }

    [Fact]
    public async Task StartTrial_Supersedes_Current_Subscription()
    {
        var tenantId = Guid.NewGuid();
        var paid = await WithUnitOfWorkAsync(() => _subscriptionManager.StartAsync(
            tenantId, PackageCode.Standard, SubscriptionPeriod.Annual, SubscriptionSource.Manual));

        await WithUnitOfWorkAsync(() => _subscriptionManager.StartTrialAsync(tenantId, PackageCode.Premium, 14));

        await WithUnitOfWorkAsync(async () =>
        {
            (await _subscriptionRepository.GetAsync(paid.Id)).Status.ShouldBe(SubscriptionStatus.Superseded);
            (await _subscriptionManager.GetCurrentOrNullAsync(tenantId))!.Source.ShouldBe(SubscriptionSource.Trial);
        });
    }

    [Fact]
    public async Task GetLatestEndedTrial_Returns_Expired_Trial_Only()
    {
        var tenantId = Guid.NewGuid();
        var ended = TenantSubscription.CreateTrial(
            Guid.NewGuid(), tenantId, PackageCode.Premium, _clock.Now.AddDays(-20), 14);
        ended.Expire(_clock.Now.AddDays(-6));

        await WithUnitOfWorkAsync(async () =>
        {
            (await _subscriptionManager.GetLatestEndedTrialOrNullAsync(tenantId)).ShouldBeNull();
            await _subscriptionRepository.InsertAsync(ended, autoSave: true);
        });

        var found = await WithUnitOfWorkAsync(() => _subscriptionManager.GetLatestEndedTrialOrNullAsync(tenantId));

        found.ShouldNotBeNull();
        found!.Id.ShouldBe(ended.Id);
    }
}
