using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Settings;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SettingManagement;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// "PAKETİM" SÖZLEŞMESİ: kiracı kendi paketini, kalan süresini ve kota kullanımını görür;
/// üst paketin getirisi BUGÜNKÜ durumuna göre hesaplanır. Ekran salt okunurdur ve host'a
/// kapalıdır.
/// <para>
/// Testler <c>WithUnitOfWorkAsync</c> ile sarmalanır: paket okuması <c>WithDetailsAsync</c>
/// kullanıyor, IQueryable UoW kapanınca DbContext'iyle birlikte düşer.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class MySubscription_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IMySubscriptionAppService _mySubscriptionAppService;
    private readonly TenantPackageManager _packageManager;
    private readonly TenantSubscriptionManager _subscriptionManager;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly IRepository<TenantSubscription, Guid> _subscriptionRepository;
    private readonly ISettingManager _settingManager;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public MySubscription_Tests()
    {
        _mySubscriptionAppService = GetRequiredService<IMySubscriptionAppService>();
        _packageManager = GetRequiredService<TenantPackageManager>();
        _subscriptionManager = GetRequiredService<TenantSubscriptionManager>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _subscriptionRepository = GetRequiredService<IRepository<TenantSubscription, Guid>>();
        _settingManager = GetRequiredService<ISettingManager>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    /// <summary>Paket satırları + profil + kiracıya uygulanmış feature seti.</summary>
    private async Task<Guid> CreateTenantAsync(PackageCode code)
    {
        var tenantId = Guid.NewGuid();

        await _packageManager.EnsureDefaultPackagesAsync();

        var profile = new TenantProfile(
            Guid.NewGuid(), tenantId, CompanyType.Company,
            Guid.NewGuid().ToString("N")[..10], "a@b.com");
        profile.SetPackage(code);
        await _profileRepository.InsertAsync(profile, autoSave: true);

        await _packageManager.ApplyPackageAsync(tenantId, code);

        return tenantId;
    }

    [Fact]
    public async Task Host_Should_Not_Have_A_Package_Screen()
    {
        // Host'ta her feature açıktır (HostFeatureValueProvider); "paketim" sorusunun
        // karşılığı yok. Ekran host'ta zaten basılmaz, bu doğrudan URL'ye karşı kapı.
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(null))
            {
                await Should.ThrowAsync<BusinessException>(
                    async () => await _mySubscriptionAppService.GetAsync());
            }
        });
    }

    [Fact]
    public async Task Should_Report_The_Current_Package_And_Its_Quota_Limits()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var tenantId = await CreateTenantAsync(PackageCode.Basic);

            using (_currentTenant.Change(tenantId))
            {
                var dto = await _mySubscriptionAppService.GetAsync();

                dto.PackageCode.ShouldBe(PackageCode.Basic);
                dto.PackageName.ShouldNotBeNullOrWhiteSpace();

                var projects = dto.Quotas.Single(q => q.Name == PlatformFeatures.MaxProjects);
                projects.Max.ShouldBe(5);
                projects.IsUnlimited.ShouldBeFalse();

                var users = dto.Quotas.Single(q => q.Name == PlatformFeatures.MaxUsers);
                users.Max.ShouldBe(3);
            }
        });
    }

    [Fact]
    public async Task Closed_Modules_Should_Be_Listed_As_Locked_Not_Hidden()
    {
        // Yükseltmenin gerekçesi bu liste: kapalı olanı hiç göstermezsek kiracı neyi
        // kaçırdığını bilemez.
        await WithUnitOfWorkAsync(async () =>
        {
            var tenantId = await CreateTenantAsync(PackageCode.Basic);

            using (_currentTenant.Change(tenantId))
            {
                var dto = await _mySubscriptionAppService.GetAsync();

                dto.Capabilities.Single(c => c.Name == PlatformFeatures.Grants).Enabled.ShouldBeFalse();
                dto.Capabilities.Single(c => c.Name == PlatformFeatures.Documents).Enabled.ShouldBeFalse();
                dto.Capabilities.Single(c => c.Name == PlatformFeatures.Finance).Enabled.ShouldBeTrue();

                // Sayısal limitler yetenek listesinde DEĞİL, kota listesinde yaşar.
                dto.Capabilities.ShouldNotContain(c => c.Name == PlatformFeatures.MaxUsers);
            }
        });
    }

    [Fact]
    public async Task Upgrade_Options_Should_Only_Promise_What_The_Tenant_Lacks()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var tenantId = await CreateTenantAsync(PackageCode.Basic);

            using (_currentTenant.Change(tenantId))
            {
                var dto = await _mySubscriptionAppService.GetAsync();

                var standard = dto.UpgradeOptions.Single(o => o.PackageCode == PackageCode.Standard);
                standard.UnlockedCapabilities.ShouldContain("Hibe Yönetimi");
                standard.UnlockedCapabilities.ShouldContain("Doküman Yönetimi");

                // Finans Basic'te de açık — "kazanım" diye sayılmamalı.
                standard.UnlockedCapabilities.ShouldNotContain("Finans & Muhasebe");

                var projectGain = standard.QuotaGains.Single(g => g.Name == PlatformFeatures.MaxProjects);
                projectGain.CurrentMax.ShouldBe(5);
                projectGain.TargetMax.ShouldBe(25);
                projectGain.TargetIsUnlimited.ShouldBeFalse();

                // Enterprise limitleri 100.000 — ekranda sayı değil "sınırsız" yazılır.
                var enterprise = dto.UpgradeOptions.Single(o => o.PackageCode == PackageCode.Enterprise);
                enterprise.QuotaGains.ShouldAllBe(g => g.TargetIsUnlimited);
            }
        });
    }

    [Fact]
    public async Task Top_Tier_Should_Have_Nothing_To_Sell()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var tenantId = await CreateTenantAsync(PackageCode.Enterprise);

            using (_currentTenant.Change(tenantId))
            {
                var dto = await _mySubscriptionAppService.GetAsync();

                dto.UpgradeOptions.ShouldBeEmpty();
                dto.Quotas.ShouldAllBe(q => q.IsUnlimited);
            }
        });
    }

    [Fact]
    public async Task Tenant_Without_A_Subscription_Row_Should_Read_As_Unlimited()
    {
        // "Abonelik satırı yok" = süresiz. "Süresi dolmuş" ile karıştırılırsa özellik
        // öncesi kurulmuş kiracılara ekranda yanlışlıkla geri sayım gösterilir.
        await WithUnitOfWorkAsync(async () =>
        {
            var tenantId = await CreateTenantAsync(PackageCode.Standard);

            using (_currentTenant.Change(tenantId))
            {
                var dto = await _mySubscriptionAppService.GetAsync();

                dto.IsUnlimited.ShouldBeTrue();
                dto.DaysRemaining.ShouldBeNull();
                dto.EndDate.ShouldBeNull();
                dto.Period.ShouldBeNull();
            }
        });
    }

    [Fact]
    public async Task Timed_Subscription_Should_Report_The_Remaining_Days()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var tenantId = await CreateTenantAsync(PackageCode.Premium);

            // 1 aylık dönem 25 gün önce başladı → 5 gün kaldı.
            await _subscriptionManager.StartAsync(
                tenantId, PackageCode.Premium, SubscriptionPeriod.Monthly,
                SubscriptionSource.Manual, _clock.Now.AddDays(-25));

            using (_currentTenant.Change(tenantId))
            {
                var dto = await _mySubscriptionAppService.GetAsync();

                dto.IsUnlimited.ShouldBeFalse();
                dto.Period.ShouldBe(SubscriptionPeriod.Monthly);
                dto.Status.ShouldBe(SubscriptionStatus.Active);
                dto.EndDate.ShouldNotBeNull();
                // Ay uzunluğu 28–31 gün: gün sayısı yerine makul aralık ölçülür.
                dto.DaysRemaining!.Value.ShouldBeInRange(3, 7);
            }
        });
    }

    [Fact]
    public async Task Grace_Window_Should_Be_Visible_As_Its_Own_State()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var tenantId = await CreateTenantAsync(PackageCode.Premium);

            var subscription = new TenantSubscription(
                Guid.NewGuid(), tenantId, PackageCode.Premium, SubscriptionPeriod.Monthly,
                _clock.Now.AddDays(-35), SubscriptionSource.Manual);
            subscription.MarkInGrace(_clock.Now.AddDays(3));
            await _subscriptionRepository.InsertAsync(subscription, autoSave: true);

            using (_currentTenant.Change(tenantId))
            {
                var dto = await _mySubscriptionAppService.GetAsync();

                dto.IsInGrace.ShouldBeTrue();
                dto.Status.ShouldBe(SubscriptionStatus.InGrace);
                // Geri sayım ek sürenin bitişine göre yapılır, dönem bitişine göre DEĞİL.
                dto.DaysRemaining.ShouldBe(3);
            }
        });
    }

    [Fact]
    public async Task Upgrade_Call_To_Action_Should_Stay_Silent_Until_Host_Configures_A_Channel()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var tenantId = await CreateTenantAsync(PackageCode.Basic);

            await _settingManager.SetGlobalAsync(PlatformSettings.Subscription.UpgradeContactEmail, string.Empty);
            await _settingManager.SetGlobalAsync(PlatformSettings.Subscription.UpgradeContactPhone, string.Empty);
            await _settingManager.SetGlobalAsync(PlatformSettings.Subscription.UpgradeUrl, string.Empty);

            using (_currentTenant.Change(tenantId))
            {
                var dto = await _mySubscriptionAppService.GetAsync();
                dto.HasUpgradeChannel.ShouldBeFalse();
            }

            await _settingManager.SetGlobalAsync(
                PlatformSettings.Subscription.UpgradeContactEmail, "satis@ornek.com");

            using (_currentTenant.Change(tenantId))
            {
                var dto = await _mySubscriptionAppService.GetAsync();
                dto.HasUpgradeChannel.ShouldBeTrue();
                dto.UpgradeContactEmail.ShouldBe("satis@ornek.com");
            }
        });
    }
}
