using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SimpleStateChecking;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// GRH-03 · "Müşteriye dönüştür" iki kez gelince (çift tık, eski sekme) ikinci istek kiracıyı ve firma
/// profilini YAZDIKTAN SONRA "zaten dönüştürüldü" diyordu: farklı adla ikinci bir kiracı açılıyor, aynı adla
/// ABP'nin "kiracı adı kullanımda" hatası (yanlış metin) çıkıyordu. Denetim artık yan etkilerden önce.
///
/// <para>Test modülünde işlem (transaction) kapalı: düzeltme geri alınırsa ikinci kiracı veritabanında kalır
/// ve ilk test kırmızıya döner.</para>
///
/// <para>Yetki burada ölçülmez (<c>AddAlwaysAllowAuthorization</c> <c>IPermissionChecker</c>'ı her şeye
/// "evet" diyen sürümle değiştirir); hibe modülünün açıklığı bu yüzden tek tek ölçülür: feature, paket
/// izin tavanı ve yönetici rolündeki izin kaydı.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantLeadConversion_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string AdminPassword = "1q2w3E*asd";

    private readonly IGrantLeadAppService _leads;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantLead, Guid> _leadRepository;
    private readonly ITenantRepository _tenantRepository;

    public GrantLeadConversion_Tests()
    {
        _leads = GetRequiredService<IGrantLeadAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _leadRepository = GetRequiredService<IRepository<GrantLead, Guid>>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
    }

    private async Task<GrantLead> InsertLeadAsync(string firm)
    {
        var grant = new Grant(Guid.NewGuid(), "Dönüştürme Programı " + Guid.NewGuid().ToString("N")[..4], "Kurum", maxAmount: 100_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = await _callRepository.InsertAsync(new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik), autoSave: true);

        var lead = new GrantLead(Guid.NewGuid(), call.Id, firm, "Ayşe Kaya", "ayse@" + Guid.NewGuid().ToString("N")[..6] + ".test");
        return await _leadRepository.InsertAsync(lead, autoSave: true);
    }

    private static ConvertGrantLeadInput ConvertInput(Guid leadId, string? tenantName = null) => new()
    {
        LeadId = leadId,
        TenantName = tenantName,
        AdminPassword = AdminPassword
    };

    [Fact]
    public async Task Donusturulmus_talep_ikinci_kez_kiraci_acmaz()
    {
        var suffix = Guid.NewGuid().ToString("N")[..6];
        var lead = await InsertLeadAsync("donusum-" + suffix);
        var secondName = "donusum-ikinci-" + suffix;

        var first = await _leads.ConvertToTenantAsync(ConvertInput(lead.Id));

        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _leads.ConvertToTenantAsync(ConvertInput(lead.Id, secondName)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantLeadAlreadyConverted);
        (await _tenantRepository.GetListAsync()).ShouldNotContain(t => t.Name == secondName, "ikinci istek kiracı açmamalı");
        (await _leadRepository.GetAsync(lead.Id)).ConvertedTenantId.ShouldBe(first.TenantId);
    }

    [Fact]
    public async Task Ayni_adla_ikinci_donusturme_LeadAlreadyConverted_verir()
    {
        var lead = await InsertLeadAsync("donusum-ayni-" + Guid.NewGuid().ToString("N")[..6]);

        await _leads.ConvertToTenantAsync(ConvertInput(lead.Id));

        // Düzeltmeden önce ABP'nin "kiracı adı kullanımda" hatası dönüyordu (yanlış kod, yanlış metin).
        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _leads.ConvertToTenantAsync(ConvertInput(lead.Id)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantLeadAlreadyConverted);
    }

    /// <summary>
    /// 🔴 Dönüştürülen firma GİREBİLMELİ ve hibe modülünü GÖREBİLMELİ. Düzeltmeden önce ölçüldü:
    /// kiracıda 0 kullanıcı, 0 kurum profili, 0 abonelik; profil olmadığı için paket Basic sayılıyor ve
    /// hibe izni paket tavanında KAPALI (feature değeri tanım varsayılanından "true" geldiği için feature
    /// tek başına bunu göstermiyordu). Kurulum artık <see cref="TenantProvisioner"/>'dan geçiyor.
    /// </summary>
    [Fact]
    public async Task Donusturulen_kiracida_giris_yapabilen_yonetici_var_ve_hibe_modulu_acik()
    {
        // Gerçek bir unvan: boşluklu ve Türkçe harfli. Kiracı adı bundan türetilir.
        var lead = await InsertLeadAsync("Dönüşüm Teknoloji A.Ş. " + Guid.NewGuid().ToString("N")[..6]);

        var result = await _leads.ConvertToTenantAsync(ConvertInput(lead.Id));
        var tenantId = result.TenantId;

        var currentTenant = GetRequiredService<ICurrentTenant>();
        var userManager = GetRequiredService<IdentityUserManager>();

        await WithUnitOfWorkAsync(async () =>
        {
            var profile = await GetRequiredService<IRepository<TenantProfile, Guid>>().GetAsync(p => p.TenantId == tenantId);
            profile.PackageCode.ShouldBe(PackageCode.Standard, "varsayılan paket hibe modülü açık olan Standart");
            profile.LegalName.ShouldBe(lead.FirmName);

            var subscription = (await GetRequiredService<IRepository<TenantSubscription, Guid>>()
                .GetListAsync(s => s.TenantId == tenantId)).ShouldHaveSingleItem();
            subscription.PackageCode.ShouldBe(PackageCode.Standard);
            subscription.Period.ShouldBe(SubscriptionPeriod.Unlimited);

            using (currentTenant.Change(tenantId))
            {
                // Giriş: talepteki e-postayla açılmış, etkin, host'un yazdığı şifreyi kabul eden yönetici.
                var admin = await userManager.FindByEmailAsync(lead.Email);
                admin.ShouldNotBeNull("yönetici talepteki e-postayla açılmalı");
                admin.IsActive.ShouldBeTrue();
                (await userManager.CheckPasswordAsync(admin, AdminPassword)).ShouldBeTrue("host'un yazdığı şifreyle girilebilmeli");
                admin.Name.ShouldBe("Ayşe");
                admin.Surname.ShouldBe("Kaya");
                (await userManager.GetRolesAsync(admin)).ShouldContain("admin");

                // Hibe modülü: feature açık + paket tavanı izni bırakıyor + yönetici rolü izni taşıyor.
                (await GetRequiredService<IFeatureChecker>().IsEnabledAsync(PlatformFeatures.Grants)).ShouldBeTrue();

                var grantsPermission = await GetRequiredService<IPermissionDefinitionManager>()
                    .GetAsync(PlatformPermissions.Grants.Default);
                (await GetRequiredService<ISimpleStateCheckerManager<PermissionDefinition>>()
                    .IsEnabledAsync(grantsPermission)).ShouldBeTrue("hibe izni paket tavanında açık olmalı");

                (await GetRequiredService<IPermissionGrantRepository>().GetListAsync("R", "admin"))
                    .ShouldContain(g => g.Name == PlatformPermissions.Grants.Default, "yönetici rolü hibe iznini taşımalı");
            }
        });
    }

    /// <summary>Host'un formda seçtiği paket ve süre kuruluma gerçekten gider (varsayılanlar ezilmez).</summary>
    [Fact]
    public async Task Secilen_paket_ve_sure_kuruluma_uygulanir()
    {
        var lead = await InsertLeadAsync("donusum-paket-" + Guid.NewGuid().ToString("N")[..6]);

        var input = ConvertInput(lead.Id);
        input.PackageCode = PackageCode.Premium;
        input.SubscriptionPeriod = SubscriptionPeriod.Annual;

        var result = await _leads.ConvertToTenantAsync(input);

        await WithUnitOfWorkAsync(async () =>
        {
            (await GetRequiredService<IRepository<TenantProfile, Guid>>().GetAsync(p => p.TenantId == result.TenantId))
                .PackageCode.ShouldBe(PackageCode.Premium);

            var subscription = (await GetRequiredService<IRepository<TenantSubscription, Guid>>()
                .GetListAsync(s => s.TenantId == result.TenantId)).ShouldHaveSingleItem();
            subscription.Period.ShouldBe(SubscriptionPeriod.Annual);
            subscription.EndDate.ShouldNotBeNull("1 yıllık abonelikte bitiş tarihi olmalı");
        });
    }
}
