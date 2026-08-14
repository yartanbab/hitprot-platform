using System;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Permissions;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SimpleStateChecking;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Features;

/// <summary>
/// KİLİT SÖZLEŞME: root (host) hesabında hiçbir paket tavanı yoktur — Platform yetenek
/// feature'larının tümü açıktır, dolayısıyla onlara <c>RequireFeatures</c> ile bağlı izinler
/// root'un yetki ekranında görünür ve verilebilir.
/// <para>
/// Regresyon kaynağı: varsayılanı "false" olan feature'lar (AiAssist, AdvancedReports) host'ta
/// tenant değeri bulunmadığı için defaultValue'ya düşüyor ve root'ta ilgili tüm izinleri
/// sessizce yok ediyordu. Bkz. <see cref="HostFeatureValueProvider"/>.
/// </para>
/// Application.Tests değil bu proje: feature zinciri IFeatureStore üzerinden gerçek repository'ye
/// iner (TaskAppService_Tenant_Tests'teki not ile aynı sebep).
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class HostFeatureAccess_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFeatureChecker _featureChecker;
    private readonly ICurrentTenant _currentTenant;
    private readonly IPermissionDefinitionManager _permissionDefinitionManager;
    private readonly ISimpleStateCheckerManager<PermissionDefinition> _stateCheckerManager;

    public HostFeatureAccess_Tests()
    {
        _featureChecker = GetRequiredService<IFeatureChecker>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _permissionDefinitionManager = GetRequiredService<IPermissionDefinitionManager>();
        _stateCheckerManager = GetRequiredService<ISimpleStateCheckerManager<PermissionDefinition>>();
    }

    [Fact]
    public async Task Host_Should_Have_Every_Platform_Capability_Feature_Enabled()
    {
        _currentTenant.Id.ShouldBeNull();

        // Varsayılanı "false" olan ikisi — bug tam olarak buradaydı.
        (await _featureChecker.IsEnabledAsync(PlatformFeatures.AiAssist)).ShouldBeTrue();
        (await _featureChecker.IsEnabledAsync(PlatformFeatures.AdvancedReports)).ShouldBeTrue();

        // Varsayılanı zaten "true" olanlar bozulmamalı.
        (await _featureChecker.IsEnabledAsync(PlatformFeatures.Grants)).ShouldBeTrue();
        (await _featureChecker.IsEnabledAsync(PlatformFeatures.Finance)).ShouldBeTrue();
        (await _featureChecker.IsEnabledAsync(PlatformFeatures.Documents)).ShouldBeTrue();
        (await _featureChecker.IsEnabledAsync(PlatformFeatures.Forms)).ShouldBeTrue();
        (await _featureChecker.IsEnabledAsync(PlatformFeatures.Calendar)).ShouldBeTrue();
        (await _featureChecker.IsEnabledAsync(PlatformFeatures.MultiCurrency)).ShouldBeTrue();
    }

    [Fact]
    public async Task Host_Should_See_Feature_Gated_Permissions()
    {
        // AdvancedReports'a bağlı izinler: host'ta feature kapalıyken state checker bunları
        // devre dışı bırakıyor, yetki ekranında hiç listelenmiyorlardı.
        var trialBalance = await _permissionDefinitionManager.GetAsync(PlatformPermissions.Reports.TrialBalance);
        (await _stateCheckerManager.IsEnabledAsync(trialBalance)).ShouldBeTrue();

        var fxRevaluation = await _permissionDefinitionManager.GetAsync(PlatformPermissions.FxRevaluations.Default);
        (await _stateCheckerManager.IsEnabledAsync(fxRevaluation)).ShouldBeTrue();
    }

    [Fact]
    public async Task Host_Numeric_Limits_Should_Keep_Their_Definition_Defaults()
    {
        // Sayısal limitler host sağlayıcısının kapsamı dışında: tanım varsayılanı geçerli kalmalı.
        (await _featureChecker.GetAsync<int>(PlatformFeatures.MaxProjects)).ShouldBe(100000);
        (await _featureChecker.GetAsync<int>(PlatformFeatures.MaxUsers)).ShouldBe(100000);
    }

    [Fact]
    public async Task Tenant_Context_Should_Not_Inherit_Host_Ceiling()
    {
        // Feature değeri yazılmamış bir tenant, host sağlayıcısına DEĞİL kendi tanım
        // varsayılanına düşmeli — aksi halde paket tavanı anlamını yitirirdi.
        using (_currentTenant.Change(Guid.NewGuid(), "paketsiz-tenant"))
        {
            (await _featureChecker.IsEnabledAsync(PlatformFeatures.AiAssist)).ShouldBeFalse();
            (await _featureChecker.IsEnabledAsync(PlatformFeatures.AdvancedReports)).ShouldBeFalse();
        }
    }
}
