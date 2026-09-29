using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// Erişim reddinin SEBEBİ (ROL-05, SHL-11, GRT-14, ACC-12) gerçek paket tavanı ve feature kapılarıyla:
/// taraf (host'a özel ekran) → paket (modül adıyla) → rol → bilinmiyor.
///
/// <para>Sıra kilidi: ABP state'e taraftan ÖNCE bakar ve host'a özel izinler hiçbir paket tavanına
/// giremediği için kiracıda state de "kapalı" döner. Açıklayıcı o sırayı taklit etseydi
/// /TenantManagement için "paketinizde yok" derdi — hiçbir paket onu açmaz.</para>
///
/// <para>Açıklayıcı izin VERİLİ Mİ sorusunu sormaz; test host'unun AlwaysAllow'undan etkilenmez.
/// Profilsiz kiracı Basic sayılır; profil yine de kurulur (PackagePermissionCeiling_Tests deseni).</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class AccessDenialExplainer_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly AccessDenialExplainer _explainer;
    private readonly TenantPackageManager _packageManager;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly ICurrentTenant _currentTenant;

    public AccessDenialExplainer_Tests()
    {
        _explainer = GetRequiredService<AccessDenialExplainer>();
        _packageManager = GetRequiredService<TenantPackageManager>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateBasicTenantAsync()
    {
        var tenantId = Guid.Empty;
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            tenantId = Guid.NewGuid();
            var profile = new TenantProfile(Guid.NewGuid(), tenantId, CompanyType.Company, "1234567890", "a@b.com");
            profile.SetPackage(PackageCode.Basic);
            await _profileRepository.InsertAsync(profile, autoSave: true);
        });
        return tenantId;
    }

    private async Task<AccessDenialExplanation> ExplainInTenantAsync(Guid tenantId, params string[] names)
    {
        AccessDenialExplanation result = AccessDenialExplanation.Unknown;
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                result = await _explainer.ExplainAsync(names);
            }
        });
        return result;
    }

    [Fact]
    public async Task Paketin_kapattigi_modul_adiyla_aciklanir()
    {
        var tenantId = await CreateBasicTenantAsync();

        var grants = await ExplainInTenantAsync(tenantId, PlatformPermissions.Grants.Default);
        grants.Reason.ShouldBe(AccessDenialReason.Package);
        grants.ModuleDisplayName.ShouldBe("Hibe Yönetimi");

        // Kur değerleme Finans VE Gelişmiş Raporlar kapısının arkasında; Basic'te Finans açık →
        // kapalı olan kapsayıcı söylenir.
        var fx = await ExplainInTenantAsync(tenantId, PlatformPermissions.FxRevaluations.Default);
        fx.Reason.ShouldBe(AccessDenialReason.Package);
        fx.ModuleDisplayName.ShouldBe("Gelişmiş Raporlar");
    }

    [Fact]
    public async Task Paketin_actigi_izin_rol_sebebidir_ve_gorunen_adi_cozulur()
    {
        var tenantId = await CreateBasicTenantAsync();

        using (CultureHelper.Use("tr"))
        {
            var projects = await ExplainInTenantAsync(tenantId, PlatformPermissions.Projects.Default);

            projects.Reason.ShouldBe(AccessDenialReason.NotGranted);
            projects.PermissionName.ShouldBe(PlatformPermissions.Projects.Default);
            projects.PermissionDisplayName.ShouldBe("Projeler");
        }
    }

    /// <summary>SIRA KİLİDİ: kiracıda state de kapalı olduğu halde sebep paket DEĞİL, taraf.</summary>
    [Fact]
    public async Task Hosta_ozel_ekran_paket_diye_aciklanmaz()
    {
        var tenantId = await CreateBasicTenantAsync();

        (await ExplainInTenantAsync(tenantId, TenantManagementPermissions.Tenants.Default)).Reason
            .ShouldBe(AccessDenialReason.HostOnly);
        (await ExplainInTenantAsync(tenantId, PlatformPermissions.SystemHealth.Default)).Reason
            .ShouldBe(AccessDenialReason.HostOnly);
        (await ExplainInTenantAsync(tenantId, PlatformPermissions.Grants.Edit)).Reason
            .ShouldBe(AccessDenialReason.HostOnly);
    }

    [Fact]
    public async Task Birden_cok_adda_en_yapisal_sebep_kazanir()
    {
        var tenantId = await CreateBasicTenantAsync();

        (await ExplainInTenantAsync(tenantId, PlatformPermissions.Projects.Default, PlatformPermissions.Grants.Default))
            .Reason.ShouldBe(AccessDenialReason.Package);
        (await ExplainInTenantAsync(tenantId, PlatformPermissions.Grants.Default, PlatformPermissions.SystemHealth.Default))
            .Reason.ShouldBe(AccessDenialReason.HostOnly);
    }

    /// <summary>Host paket tavanından ve feature kapılarından muaf: sebep rol.</summary>
    [Fact]
    public async Task Host_baglaminda_paket_sebebi_yoktur()
    {
        AccessDenialExplanation result = AccessDenialExplanation.Unknown;
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            _currentTenant.Id.ShouldBeNull();
            result = await _explainer.ExplainAsync(new[] { PlatformPermissions.Grants.Default });
        });

        result.Reason.ShouldBe(AccessDenialReason.NotGranted);
    }

    [Fact]
    public async Task Taninmayan_ya_da_gecersiz_ad_bilinmiyor_doner()
    {
        var tenantId = await CreateBasicTenantAsync();

        (await _explainer.ExplainAsync(null)).Reason.ShouldBe(AccessDenialReason.Unknown);
        (await ExplainInTenantAsync(tenantId)).Reason.ShouldBe(AccessDenialReason.Unknown);
        (await ExplainInTenantAsync(tenantId, "", "   ", "yok.boyle.izin")).Reason.ShouldBe(AccessDenialReason.Unknown);

        // 128 karakteri aşan ad hiç değerlendirilmez (adres çubuğundan gelir).
        var tooLong = PlatformPermissions.Grants.Default + "." + new string('x', 129 - PlatformPermissions.Grants.Default.Length - 1);
        tooLong.Length.ShouldBe(129);
        (await ExplainInTenantAsync(tenantId, tooLong)).Reason.ShouldBe(AccessDenialReason.Unknown);
    }

    [Fact]
    public async Task Yalniz_ilk_bes_ad_degerlendirilir()
    {
        var tenantId = await CreateBasicTenantAsync();
        var names = new[]
        {
            PlatformPermissions.Projects.Default,
            PlatformPermissions.CashAccounts.Default,
            PlatformPermissions.Tasks.Default,
            PlatformPermissions.Tasks.Create,
            PlatformPermissions.Incomes.Default,
            // 6. ve 7. ad daha "yapısal" sebep taşısa da değerlendirilmez.
            PlatformPermissions.SystemHealth.Default,
            PlatformPermissions.Grants.Default
        };

        var result = await ExplainInTenantAsync(tenantId, names);

        result.Reason.ShouldBe(AccessDenialReason.NotGranted);
        names.Take(AccessDenialExplainer.MaxPermissionNames).ShouldContain(result.PermissionName);
    }
}
