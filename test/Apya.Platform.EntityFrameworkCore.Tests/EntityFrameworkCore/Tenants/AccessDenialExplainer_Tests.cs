using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Microsoft.Extensions.Localization;
using NSubstitute;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SimpleStateChecking;
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
/// <para>Rol sebebi izin VERİLİ Mİ diye sorar; test host'u AddAlwaysAllowAuthorization ile her izni
/// verdiği için açıklayıcı sahte <see cref="IPermissionChecker"/> ile kurulur (varsayılan: hiçbir izin
/// verilmemiş). Profilsiz kiracı Basic sayılır; profil yine de kurulur (PackagePermissionCeiling_Tests
/// deseni). Kiracıya feature değeri YAZILMAZ (paket uygulanmaz): modül feature'ları varsayılanında —
/// Hibe/Finans açık, Gelişmiş Raporlar kapalı (ROL-07'deki profilsiz demo kiracının durumu).</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class AccessDenialExplainer_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly AccessDenialExplainer _explainer;
    private readonly IPermissionChecker _permissionChecker = Substitute.For<IPermissionChecker>();
    private readonly TenantPackageManager _packageManager;
    private readonly IPackageAppService _packageAppService;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly ICurrentTenant _currentTenant;

    public AccessDenialExplainer_Tests()
    {
        _packageManager = GetRequiredService<TenantPackageManager>();
        _packageAppService = GetRequiredService<IPackageAppService>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _explainer = new AccessDenialExplainer(
            GetRequiredService<IPermissionDefinitionManager>(),
            GetRequiredService<ISimpleStateCheckerManager<PermissionDefinition>>(),
            GetRequiredService<IFeatureChecker>(),
            _currentTenant,
            GetRequiredService<IStringLocalizerFactory>(),
            _permissionChecker,
            GetRequiredService<PackageCeilingStore>());
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

        // Hibe feature'ı varsayılanla AÇIK; modül, kapısının arkasındaki hiçbir izin Basic tavanında
        // olmadığı için pakette yok sayılır.
        var grants = await ExplainInTenantAsync(tenantId, PlatformPermissions.Grants.Default);
        grants.Reason.ShouldBe(AccessDenialReason.Package);
        grants.ModuleDisplayName.ShouldBe("Hibe Yönetimi");

        // Kur değerleme Finans VE Gelişmiş Raporlar kapısının arkasında; Basic'te Finans açık →
        // kapalı olan kapsayıcı söylenir.
        var fx = await ExplainInTenantAsync(tenantId, PlatformPermissions.FxRevaluations.Default);
        fx.Reason.ShouldBe(AccessDenialReason.Package);
        fx.ModuleDisplayName.ShouldBe("Gelişmiş Raporlar");
    }

    /// <summary>
    /// Host paket tavanından TEK bir izni çıkardıysa modül pakette kalır (Finans'ın diğer izinleri
    /// tavanda, feature açık): Faturalar'ı açamayan kullanıcıya "Finans &amp; Muhasebe paketinizde yer
    /// almıyor" denmez — sebep yine paket, metin modülsüz genel cümle.
    /// </summary>
    [Fact]
    public async Task Tavandan_tek_izin_cikarilmissa_modul_adlandirilmaz()
    {
        var tenantId = await CreateBasicTenantAsync();
        await WithUnitOfWorkAsync(async () =>
        {
            var tree = await _packageAppService.GetPermissionsAsync(PackageCode.Basic);
            await _packageAppService.UpdatePermissionsAsync(new UpdatePackagePermissionsDto
            {
                Code = PackageCode.Basic,
                PermissionNames = tree.Groups
                    .SelectMany(g => g.Permissions)
                    .Where(p => p.IsIncluded && p.Name != PlatformPermissions.Invoices.Default)
                    .Select(p => p.Name)
                    .ToList()
            });
        });

        var invoices = await ExplainInTenantAsync(tenantId, PlatformPermissions.Invoices.Default);

        invoices.Reason.ShouldBe(AccessDenialReason.Package);
        invoices.ModuleDisplayName.ShouldBeNull("Finans modülü pakette: Gelirler/Giderler hâlâ tavanda");
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

    /// <summary>Alt iznin adı ("Düzenleme") tek başına ekranı söylemez: üst izinle birlikte yazılır.</summary>
    [Fact]
    public async Task Alt_iznin_gorunen_adi_ust_izinle_birlikte_yazilir()
    {
        var tenantId = await CreateBasicTenantAsync();

        using (CultureHelper.Use("tr"))
        {
            var create = await ExplainInTenantAsync(tenantId, PlatformPermissions.Projects.Create);

            create.Reason.ShouldBe(AccessDenialReason.NotGranted);
            create.PermissionDisplayName.ShouldStartWith("Projeler › ");
            create.PermissionDisplayName!.Length.ShouldBeGreaterThan("Projeler › ".Length);
        }
    }

    /// <summary>
    /// Rol sebebi yalnız izin GERÇEKTEN verilmemişse: elle yazılan adres sahip olunan yetki için
    /// "tanımlı değil" yazdıramaz; çoklu gereksinimde karşılanmış ad "gereken yetki" diye seçilmez.
    /// </summary>
    [Fact]
    public async Task Verilmis_izin_rol_sebebi_sayilmaz()
    {
        var tenantId = await CreateBasicTenantAsync();
        _permissionChecker.IsGrantedAsync(PlatformPermissions.Projects.Default).Returns(true);

        (await ExplainInTenantAsync(tenantId, PlatformPermissions.Projects.Default)).Reason
            .ShouldBe(AccessDenialReason.Unknown);

        var mixed = await ExplainInTenantAsync(tenantId, PlatformPermissions.Projects.Default, PlatformPermissions.CashAccounts.Default);
        mixed.Reason.ShouldBe(AccessDenialReason.NotGranted);
        mixed.PermissionName.ShouldBe(PlatformPermissions.CashAccounts.Default);
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
