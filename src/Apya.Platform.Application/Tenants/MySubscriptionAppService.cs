using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Volo.Abp.Identity;
using Volo.Abp.Linq;
using Volo.Abp.Settings;
using Volo.Abp.Timing;

namespace Apya.Platform.Tenants;

/// <summary>
/// Kiracının kendi paketini görmesi. Host'un <see cref="PackageAppService"/>'i paket
/// İÇERİĞİNİ düzenler ve <c>Tenants.Update</c> ister; bu servis yalnız OKUR ve kiracı
/// yöneticisine açıktır.
///
/// <para>İki farklı kaynak bilinçli olarak ayrı okunur:
/// <list type="bullet">
/// <item><b>Kiracıda ne açık</b> → <see cref="IFeatureChecker"/>. Host bir kiracıya paketten
/// bağımsız istisna tanımlamış olabilir; ekran kiracının GERÇEĞİNİ göstermeli.</item>
/// <item><b>Üst paket ne getirir</b> → <see cref="PlatformPackage"/> satırları. Paket içeriği
/// host tarafından düzenlenebildiği için koddaki registry değil DB doğrudur; satır hiç yoksa
/// <see cref="PackageDefinitions"/>'a düşülür.</item>
/// </list></para>
/// </summary>
[Authorize(PlatformPermissions.TenantSettings.Default)]
public class MySubscriptionAppService : PlatformAppService, IMySubscriptionAppService
{
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly IRepository<PlatformPackage, Guid> _packageRepository;
    private readonly TenantSubscriptionManager _subscriptionManager;
    private readonly IFeatureChecker _featureChecker;
    private readonly IIdentityUserRepository _userRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IAsyncQueryableExecuter _asyncExecuter;
    private readonly ISettingProvider _settingProvider;
    private readonly IClock _clock;

    public MySubscriptionAppService(
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        IRepository<PlatformPackage, Guid> packageRepository,
        TenantSubscriptionManager subscriptionManager,
        IFeatureChecker featureChecker,
        IIdentityUserRepository userRepository,
        IRepository<Project, Guid> projectRepository,
        IAsyncQueryableExecuter asyncExecuter,
        ISettingProvider settingProvider,
        IClock clock)
    {
        _tenantProfileRepository = tenantProfileRepository;
        _packageRepository = packageRepository;
        _subscriptionManager = subscriptionManager;
        _featureChecker = featureChecker;
        _userRepository = userRepository;
        _projectRepository = projectRepository;
        _asyncExecuter = asyncExecuter;
        _settingProvider = settingProvider;
        _clock = clock;
    }

    public async Task<MySubscriptionDto> GetAsync()
    {
        // Host'un paketi yoktur (her şey açıktır, bkz. HostFeatureValueProvider). Ekrana giden
        // bağlantı zaten kiracıya özeldir; bu yalnız doğrudan URL'ye karşı kapı.
        var tenantId = CurrentTenant.Id
            ?? throw new BusinessException("Platform:Error:SubscriptionHostContext");

        // Kotalar kiracı bağlamında sayılmalı — profil/abonelik ise host-side satırlardır.
        var usedUsers = (int)await _userRepository.GetCountAsync();
        var usedProjects = (int)await _projectRepository.GetCountAsync();
        var maxUsers = await _featureChecker.GetAsync<int>(PlatformFeatures.MaxUsers);
        var maxProjects = await _featureChecker.GetAsync<int>(PlatformFeatures.MaxProjects);

        var capabilities = new List<PackageCapabilityDto>();
        foreach (var meta in PackageFeatureCatalog.Managed.Where(m => !m.IsNumeric))
        {
            capabilities.Add(new PackageCapabilityDto
            {
                Name = meta.Name,
                DisplayName = meta.DisplayName,
                Enabled = await _featureChecker.IsEnabledAsync(meta.Name)
            });
        }

        PackageCode packageCode;
        TenantSubscription? subscription;
        List<PlatformPackage> packages;

        using (CurrentTenant.Change(null))
        {
            var profile = await _tenantProfileRepository.FindAsync(p => p.TenantId == tenantId);
            packageCode = profile?.PackageCode ?? PackageCode.Basic;

            subscription = await _subscriptionManager.GetCurrentOrNullAsync(tenantId);

            var queryable = await _packageRepository.WithDetailsAsync(p => p.Features);
            packages = await _asyncExecuter.ToListAsync(queryable);
        }

        var dto = new MySubscriptionDto
        {
            PackageCode = packageCode,
            PackageName = NameOf(packages, packageCode),
            Quotas = new List<QuotaUsageDto>
            {
                BuildQuota(PlatformFeatures.MaxUsers, usedUsers, maxUsers),
                BuildQuota(PlatformFeatures.MaxProjects, usedProjects, maxProjects)
            },
            Capabilities = capabilities
        };

        ApplySubscription(dto, subscription);
        dto.UpgradeOptions = BuildUpgradeOptions(packageCode, packages, capabilities, maxUsers, maxProjects);

        dto.UpgradeContactEmail = await _settingProvider.GetOrNullAsync(
            PlatformSettings.Subscription.UpgradeContactEmail);
        dto.UpgradeContactPhone = await _settingProvider.GetOrNullAsync(
            PlatformSettings.Subscription.UpgradeContactPhone);
        dto.UpgradeUrl = await _settingProvider.GetOrNullAsync(
            PlatformSettings.Subscription.UpgradeUrl);

        return dto;
    }

    /// <summary>Paketin görünen adı — host adı düzenleyebildiği için DB satırı önce gelir.</summary>
    private static string NameOf(List<PlatformPackage> packages, PackageCode code)
        => packages.FirstOrDefault(p => p.Code == code)?.Name ?? code.ToString();

    private static QuotaUsageDto BuildQuota(string featureName, int used, int max)
    {
        var meta = PackageFeatureCatalog.Managed.First(m => m.Name == featureName);
        var isUnlimited = max >= MySubscriptionConsts.UnlimitedQuotaThreshold;

        return new QuotaUsageDto
        {
            Name = featureName,
            DisplayName = meta.DisplayName,
            Used = used,
            Max = max,
            IsUnlimited = isUnlimited,
            // Kotayı aşmış kiracı (paket düşürülünce olur) çubuğu taşırmasın.
            UsagePercent = isUnlimited || max <= 0 ? 0 : Math.Min(100, used * 100 / max)
        };
    }

    private void ApplySubscription(MySubscriptionDto dto, TenantSubscription? subscription)
    {
        if (subscription == null)
        {
            // Abonelik satırı YOK = süresiz. Süresi dolmuş DEĞİL — geri sayım gösterilmez.
            dto.IsUnlimited = true;
            return;
        }

        dto.Period = subscription.Period;
        dto.StartDate = subscription.StartDate;
        dto.Status = subscription.Status;
        dto.IsInGrace = subscription.Status == SubscriptionStatus.InGrace;

        var effectiveEnd = subscription.EffectiveEndDate;
        if (effectiveEnd == null)
        {
            dto.IsUnlimited = true;
            return;
        }

        dto.EndDate = effectiveEnd;
        // Gün farkı TARİH üzerinden ölçülür: saat 23:00'te "0 gün kaldı" yerine "1 gün" demek,
        // kullanıcının takvimde gördüğüyle uyuşur.
        var days = (effectiveEnd.Value.Date - _clock.Now.Date).Days;
        dto.DaysRemaining = Math.Max(0, days);
    }

    /// <summary>
    /// Üst paketlerin getirisi. Karşılaştırma kiracının BUGÜNKÜ durumuna göre yapılır:
    /// hâlihazırda açık olan bir yetenek "kazanım" olarak gösterilmez.
    /// </summary>
    private static List<UpgradeOptionDto> BuildUpgradeOptions(
        PackageCode currentCode,
        List<PlatformPackage> packages,
        List<PackageCapabilityDto> currentCapabilities,
        int currentMaxUsers,
        int currentMaxProjects)
    {
        var options = new List<UpgradeOptionDto>();

        foreach (var code in Enum.GetValues<PackageCode>().Where(c => c > currentCode).OrderBy(c => c))
        {
            var values = packages.FirstOrDefault(p => p.Code == code)?.ToFeatureValues()
                         ?? PackageDefinitions.For(code);

            var option = new UpgradeOptionDto
            {
                PackageCode = code,
                PackageName = NameOf(packages, code)
            };

            foreach (var capability in currentCapabilities.Where(c => !c.Enabled))
            {
                if (values.TryGetValue(capability.Name, out var value) && value == "true")
                {
                    option.UnlockedCapabilities.Add(capability.DisplayName);
                }
            }

            AddQuotaGain(option, values, PlatformFeatures.MaxUsers, currentMaxUsers);
            AddQuotaGain(option, values, PlatformFeatures.MaxProjects, currentMaxProjects);

            // Getirisi olmayan paket kart olarak basılmaz — host paketleri eşitlemiş olabilir.
            if (option.UnlockedCapabilities.Count > 0 || option.QuotaGains.Count > 0)
            {
                options.Add(option);
            }
        }

        return options;
    }

    private static void AddQuotaGain(
        UpgradeOptionDto option,
        IReadOnlyDictionary<string, string> values,
        string featureName,
        int currentMax)
    {
        if (!values.TryGetValue(featureName, out var raw)
            || !int.TryParse(raw, out var targetMax)
            || targetMax <= currentMax)
        {
            return;
        }

        var meta = PackageFeatureCatalog.Managed.First(m => m.Name == featureName);

        option.QuotaGains.Add(new QuotaGainDto
        {
            Name = featureName,
            DisplayName = meta.DisplayName,
            CurrentMax = currentMax,
            TargetMax = targetMax,
            TargetIsUnlimited = targetMax >= MySubscriptionConsts.UnlimitedQuotaThreshold
        });
    }
}
