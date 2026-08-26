using System;
using System.Globalization;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.SettingManagement;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// PAKET SÜRESİ SÖZLEŞMESİ: süresi dolan kiracı Basic'e iner, süresi olmayan kiracı hiç
/// dokunulmaz, ek süre penceresi paketi açık tutar ve otomatik indirme ayardan kapatılabilir.
/// <para>
/// Saat ileri alınmaz — abonelikler GEÇMİŞ tarihli başlatılarak süresi dolmuş hâle getirilir.
/// Böylece <c>IClock</c> ile oynamadan gerçek akış ölçülür.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class SubscriptionExpiry_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly SubscriptionExpiryProcessor _processor;
    private readonly TenantSubscriptionManager _subscriptionManager;
    private readonly IRepository<TenantSubscription, Guid> _subscriptionRepository;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly ISettingManager _settingManager;
    private readonly IClock _clock;

    public SubscriptionExpiry_Tests()
    {
        _processor = GetRequiredService<SubscriptionExpiryProcessor>();
        _subscriptionManager = GetRequiredService<TenantSubscriptionManager>();
        _subscriptionRepository = GetRequiredService<IRepository<TenantSubscription, Guid>>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _settingManager = GetRequiredService<ISettingManager>();
        _clock = GetRequiredService<IClock>();
    }

    private async Task ConfigureAsync(bool autoDowngrade, int graceDays, string warningDays = "7,1")
    {
        await WithUnitOfWorkAsync(async () =>
        {
            await _settingManager.SetGlobalAsync(
                PlatformSettings.Subscription.AutoDowngradeEnabled,
                autoDowngrade.ToString().ToLowerInvariant());
            await _settingManager.SetGlobalAsync(
                PlatformSettings.Subscription.GraceDays,
                graceDays.ToString(CultureInfo.InvariantCulture));
            await _settingManager.SetGlobalAsync(
                PlatformSettings.Subscription.WarningDays,
                warningDays);
        });
    }

    private async Task CreateProfileAsync(Guid tenantId, PackageCode code)
    {
        var profile = new TenantProfile(
            Guid.NewGuid(), tenantId, CompanyType.Company,
            Guid.NewGuid().ToString("N")[..10], "a@b.com");
        profile.SetPackage(code);
        await _profileRepository.InsertAsync(profile, autoSave: true);
    }

    private async Task<Guid> AddSubscriptionAsync(
        Guid tenantId,
        PackageCode code,
        SubscriptionPeriod period,
        DateTime startDate,
        DateTime? graceEndsAt = null)
    {
        var subscription = new TenantSubscription(
            Guid.NewGuid(), tenantId, code, period, startDate, SubscriptionSource.Manual);

        if (graceEndsAt != null)
        {
            subscription.MarkInGrace(graceEndsAt.Value);
        }

        await _subscriptionRepository.InsertAsync(subscription, autoSave: true);
        return subscription.Id;
    }

    private async Task<PackageCode> GetPackageAsync(Guid tenantId)
    {
        var profile = await _profileRepository.FindAsync(p => p.TenantId == tenantId);
        return profile!.PackageCode;
    }

    [Fact]
    public async Task Expired_Subscription_Should_Downgrade_Tenant_To_Basic()
    {
        await ConfigureAsync(autoDowngrade: true, graceDays: 0);
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Premium);
            // Bir ay önce dolmuş aylık abonelik.
            await AddSubscriptionAsync(
                tenantId, PackageCode.Premium, SubscriptionPeriod.Monthly, _clock.Now.AddMonths(-2));
        });

        var result = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        result.Downgraded.ShouldBe(1);

        await WithUnitOfWorkAsync(async () =>
        {
            (await GetPackageAsync(tenantId)).ShouldBe(PackageCode.Basic);

            // Yerine SÜRESİZ Basic aboneliği açılır: kiracı bir daha bu taramaya girmez.
            var current = await _subscriptionManager.GetCurrentOrNullAsync(tenantId);
            current.ShouldNotBeNull();
            current!.PackageCode.ShouldBe(PackageCode.Basic);
            current.Period.ShouldBe(SubscriptionPeriod.Unlimited);
            current.EndDate.ShouldBeNull();
            current.Source.ShouldBe(SubscriptionSource.AutoDowngrade);
        });
    }

    [Fact]
    public async Task Unlimited_Subscription_Should_Never_Expire()
    {
        await ConfigureAsync(autoDowngrade: true, graceDays: 0);
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Enterprise);
            await AddSubscriptionAsync(
                tenantId, PackageCode.Enterprise, SubscriptionPeriod.Unlimited, _clock.Now.AddYears(-5));
        });

        var result = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        result.Downgraded.ShouldBe(0);
        await WithUnitOfWorkAsync(async () =>
            (await GetPackageAsync(tenantId)).ShouldBe(PackageCode.Enterprise));
    }

    /// <summary>
    /// Abonelik satırı olmayan kiracı SÜRESİZ sayılır. Özellik devreye girmeden önce
    /// kurulmuş müşterilerin deploy sonrası kendiliğinden düşmemesi buna bağlı.
    /// </summary>
    [Fact]
    public async Task Tenant_Without_Any_Subscription_Should_Be_Left_Alone()
    {
        await ConfigureAsync(autoDowngrade: true, graceDays: 0);
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(() => CreateProfileAsync(tenantId, PackageCode.Premium));

        var result = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        result.Downgraded.ShouldBe(0);
        await WithUnitOfWorkAsync(async () =>
            (await GetPackageAsync(tenantId)).ShouldBe(PackageCode.Premium));
    }

    [Fact]
    public async Task Grace_Period_Should_Keep_The_Package_Open()
    {
        await ConfigureAsync(autoDowngrade: true, graceDays: 7);
        var tenantId = Guid.NewGuid();
        Guid subscriptionId = Guid.Empty;

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Standard);
            // Dün dolmuş: ek süre penceresinin içinde.
            subscriptionId = await AddSubscriptionAsync(
                tenantId, PackageCode.Standard, SubscriptionPeriod.Monthly,
                _clock.Now.AddMonths(-1).AddDays(-1));
        });

        var result = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        result.MovedToGrace.ShouldBe(1);
        result.Downgraded.ShouldBe(0);

        await WithUnitOfWorkAsync(async () =>
        {
            (await GetPackageAsync(tenantId)).ShouldBe(PackageCode.Standard);

            var subscription = await _subscriptionRepository.GetAsync(subscriptionId);
            subscription.Status.ShouldBe(SubscriptionStatus.InGrace);
            subscription.GraceEndsAt.ShouldBe(subscription.EndDate!.Value.AddDays(7));
        });
    }

    [Fact]
    public async Task Downgrade_Should_Happen_When_Grace_Period_Is_Over()
    {
        await ConfigureAsync(autoDowngrade: true, graceDays: 7);
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Standard);
            var start = _clock.Now.AddMonths(-2);
            // Ek süre de bitmiş: bitişten 7 gün sonrası hâlâ geçmişte.
            await AddSubscriptionAsync(
                tenantId, PackageCode.Standard, SubscriptionPeriod.Monthly, start,
                graceEndsAt: start.AddMonths(1).AddDays(7));
        });

        var result = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        result.Downgraded.ShouldBe(1);
        await WithUnitOfWorkAsync(async () =>
            (await GetPackageAsync(tenantId)).ShouldBe(PackageCode.Basic));
    }

    [Fact]
    public async Task AutoDowngrade_Disabled_Should_Not_Change_The_Package()
    {
        await ConfigureAsync(autoDowngrade: false, graceDays: 0);
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Premium);
            await AddSubscriptionAsync(
                tenantId, PackageCode.Premium, SubscriptionPeriod.Annual, _clock.Now.AddYears(-2));
        });

        var result = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        result.Downgraded.ShouldBe(0);
        result.DowngradeSkipped.ShouldBe(1);
        await WithUnitOfWorkAsync(async () =>
            (await GetPackageAsync(tenantId)).ShouldBe(PackageCode.Premium));
    }

    /// <summary>Aynı eşik dönem başına bir kez uyarır; ikinci tur sessiz kalır.</summary>
    [Fact]
    public async Task Warning_Should_Be_Sent_Once_Per_Threshold()
    {
        await ConfigureAsync(autoDowngrade: true, graceDays: 0);
        var tenantId = Guid.NewGuid();
        Guid subscriptionId = Guid.Empty;

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Premium);
            // Bitişe 3 gün var → "7 gün kala" eşiği geçerli, "1 gün kala" değil.
            subscriptionId = await AddSubscriptionAsync(
                tenantId, PackageCode.Premium, SubscriptionPeriod.Monthly,
                _clock.Now.AddMonths(-1).AddDays(3));
        });

        var first = await WithUnitOfWorkAsync(() => _processor.RunAsync());
        first.Warned.ShouldBe(1);

        await WithUnitOfWorkAsync(async () =>
        {
            var subscription = await _subscriptionRepository.GetAsync(subscriptionId);
            subscription.LastWarningDaysBefore.ShouldBe(7);
            subscription.Status.ShouldBe(SubscriptionStatus.Active);
        });

        var second = await WithUnitOfWorkAsync(() => _processor.RunAsync());
        second.Warned.ShouldBe(0);

        await WithUnitOfWorkAsync(async () =>
            (await GetPackageAsync(tenantId)).ShouldBe(PackageCode.Premium));
    }

    [Fact]
    public async Task Starting_A_New_Period_Should_Supersede_The_Current_One()
    {
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            var first = await _subscriptionManager.StartAsync(
                tenantId, PackageCode.Standard, SubscriptionPeriod.Monthly, SubscriptionSource.Manual);

            await _subscriptionManager.StartAsync(
                tenantId, PackageCode.Premium, SubscriptionPeriod.Annual, SubscriptionSource.Manual);

            var closed = await _subscriptionRepository.GetAsync(first.Id);
            closed.Status.ShouldBe(SubscriptionStatus.Superseded);
            closed.EndedAt.ShouldNotBeNull();

            var current = await _subscriptionManager.GetCurrentOrNullAsync(tenantId);
            current!.PackageCode.ShouldBe(PackageCode.Premium);
            current.Period.ShouldBe(SubscriptionPeriod.Annual);
        });
    }

    /// <summary>
    /// ÖDEME KANCASI sözleşmesi: yenileme kalan süreyi YAKMAZ — yeni dönem, mevcut
    /// bitişin üstüne biner.
    /// </summary>
    [Fact]
    public async Task Renew_Should_Stack_On_Top_Of_The_Remaining_Time()
    {
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            var start = _clock.Now;
            var first = await _subscriptionManager.StartAsync(
                tenantId, PackageCode.Premium, SubscriptionPeriod.Monthly,
                SubscriptionSource.Manual, start);

            var renewed = await _subscriptionManager.RenewAsync(tenantId, SubscriptionPeriod.Monthly);

            renewed.PackageCode.ShouldBe(PackageCode.Premium);
            renewed.Source.ShouldBe(SubscriptionSource.Payment);
            renewed.StartDate.ShouldBe(first.EndDate!.Value);
            renewed.EndDate.ShouldBe(first.EndDate!.Value.AddMonths(1));
        });
    }
}
