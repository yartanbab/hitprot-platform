using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Identity;
using Microsoft.Extensions.Localization;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Identity.Localization;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Identity;

/// <summary>
/// Kullanıcı adı host + bütün yaşayan kiracılarda tekil. Giriş ekranı kiracı sormadığı için
/// aynı ad iki kiracıda olunca doğru hesap yalnız şifreyle ayırt edilebiliyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class UniqueUserName_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static string NewName(string prefix) => prefix + Guid.NewGuid().ToString("N")[..8];

    private async Task<Guid> CreateTenantAsync()
    {
        var tenant = await WithUnitOfWorkAsync(async () =>
        {
            var t = await GetRequiredService<ITenantManager>().CreateAsync("tekil-" + Guid.NewGuid().ToString("N")[..8]);
            return await GetRequiredService<ITenantRepository>().InsertAsync(t, autoSave: true);
        });
        return tenant.Id;
    }

    private Task<Microsoft.AspNetCore.Identity.IdentityResult> CreateUserAsync(Guid? tenantId, string userName)
    {
        return WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenantId))
            {
                var user = new IdentityUser(Guid.NewGuid(), userName, Guid.NewGuid().ToString("N") + "@ornek.com", tenantId);
                return await GetRequiredService<IdentityUserManager>().CreateAsync(user);
            }
        });
    }

    /// <summary>Kuraldan önce açılmış çakışan hesabı canlandırır: doğrulayıcıyı atlayarak depoya yazar.</summary>
    private Task<IdentityUser> InsertLegacyUserAsync(Guid? tenantId, string userName)
    {
        return WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenantId))
            {
                var user = new IdentityUser(Guid.NewGuid(), userName, Guid.NewGuid().ToString("N") + "@ornek.com", tenantId);
                return await GetRequiredService<IRepository<IdentityUser, Guid>>().InsertAsync(user, autoSave: true);
            }
        });
    }

    [Fact]
    public async Task Baska_kiracidaki_ad_kullanilamaz()
    {
        var userName = NewName("ortak");
        (await CreateUserAsync(await CreateTenantAsync(), userName)).Succeeded.ShouldBeTrue();

        var result = await CreateUserAsync(await CreateTenantAsync(), userName);

        result.Succeeded.ShouldBeFalse();
        result.Errors.ShouldHaveSingleItem().Code.ShouldBe("DuplicateUserName");
    }

    [Fact]
    public async Task Host_adi_kiracida_kullanilamaz()
    {
        var result = await CreateUserAsync(await CreateTenantAsync(), "admin");

        result.Succeeded.ShouldBeFalse();
        result.Errors.ShouldHaveSingleItem().Code.ShouldBe("DuplicateUserName");
    }

    [Fact]
    public async Task Ayni_kiracida_cakisma_tek_mesaj_verir()
    {
        var tenantId = await CreateTenantAsync();
        var userName = NewName("ayni");
        (await CreateUserAsync(tenantId, userName)).Succeeded.ShouldBeTrue();

        var result = await CreateUserAsync(tenantId, userName);

        result.Errors.Count(e => e.Code == "DuplicateUserName").ShouldBe(1);
    }

    [Fact]
    public async Task Mesaj_turkce_bu_kullanici_adi_kullanilamaz()
    {
        using (CultureHelper.Use("tr"))
        {
            GetRequiredService<IStringLocalizer<IdentityResource>>()["Volo.Abp.Identity:DuplicateUserName"].Value
                .ShouldBe("Bu kullanıcı adı kullanılamaz.");
        }
    }

    /// <summary>
    /// 🔑 Eski çakışan hesap kilitlenmez: girişte, profilde, kilitlenme sayacında her kayıt
    /// doğrulayıcıdan geçer. Ad değişmiyorsa kural işlemez.
    /// </summary>
    [Fact]
    public async Task Adi_degismeyen_eski_cakisan_hesap_guncellenebilir()
    {
        var userName = NewName("eski");
        await InsertLegacyUserAsync(await CreateTenantAsync(), userName);
        var tenantId = await CreateTenantAsync();
        var legacy = await InsertLegacyUserAsync(tenantId, userName);

        var result = await WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenantId))
            {
                var manager = GetRequiredService<IdentityUserManager>();
                var user = await manager.GetByIdAsync(legacy.Id);
                user.Name = "Yeni Ad";
                return await manager.UpdateAsync(user);
            }
        });

        result.Succeeded.ShouldBeTrue();
    }

    [Fact]
    public async Task Ada_baska_kiracidaki_ada_gecilemez()
    {
        var taken = NewName("alinmis");
        (await CreateUserAsync(await CreateTenantAsync(), taken)).Succeeded.ShouldBeTrue();
        var tenantId = await CreateTenantAsync();
        var own = NewName("kendi");
        (await CreateUserAsync(tenantId, own)).Succeeded.ShouldBeTrue();

        // ABP'nin SetUserNameAsync'i hatayı döndürmez, fırlatır (kullanıcı yönetimi ekranı bu yolu kullanır).
        var exception = await Should.ThrowAsync<AbpIdentityResultException>(() => WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenantId))
            {
                var manager = GetRequiredService<IdentityUserManager>();
                var user = await manager.FindByNameAsync(own);
                return await manager.SetUserNameAsync(user!, taken);
            }
        }));

        exception.IdentityResult.Errors.ShouldHaveSingleItem().Code.ShouldBe("DuplicateUserName");
    }

    [Fact]
    public async Task Silinmis_kiracinin_adi_yeniden_kullanilabilir()
    {
        var userName = NewName("yetim");
        var deleted = await CreateTenantAsync();
        (await CreateUserAsync(deleted, userName)).Succeeded.ShouldBeTrue();
        await WithUnitOfWorkAsync(async () =>
        {
            var repo = GetRequiredService<ITenantRepository>();
            await repo.DeleteAsync(await repo.GetAsync(deleted), autoSave: true);
        });

        (await CreateUserAsync(await CreateTenantAsync(), userName)).Succeeded.ShouldBeTrue();
    }

    [Fact]
    public async Task Oneri_eposta_on_ekinden_turetilir_alinmissa_sayi_eklenir()
    {
        var unique = Guid.NewGuid().ToString("N")[..6];
        var checker = GetRequiredService<UniqueUserNameChecker>();

        var first = await WithUnitOfWorkAsync(() => checker.SuggestFromEmailAsync($"Şükrü.Öz{unique}@firma.com"));
        first.ShouldBe($"sukru.oz{unique}");

        (await CreateUserAsync(await CreateTenantAsync(), first)).Succeeded.ShouldBeTrue();

        var second = await WithUnitOfWorkAsync(() => checker.SuggestFromEmailAsync($"sukru.oz{unique}@baska.com"));
        second.ShouldBe($"sukru.oz{unique}2");
    }

    [Fact]
    public async Task Kiraci_tohumlamasi_yoneticiyi_epostadan_adlandirir()
    {
        var tenantId = await CreateTenantAsync();
        var local = NewName("yonetici");

        await WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenantId))
            {
                await GetRequiredService<IDataSeeder>().SeedAsync(new DataSeedContext(tenantId)
                    .WithProperty(IdentityDataSeedContributor.AdminEmailPropertyName, local + "@firma.com")
                    .WithProperty(IdentityDataSeedContributor.AdminPasswordPropertyName, "1q2w3E*asd"));
            }
        });

        var admin = await WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenantId))
            {
                return await GetRequiredService<IdentityUserManager>().FindByEmailAsync(local + "@firma.com");
            }
        });

        admin.ShouldNotBeNull();
        admin!.UserName.ShouldBe(local);
    }

    /// <summary>
    /// 🔴 DbMigrator her kiracıyı varsayılan e-postayla yeniden tohumlar. ABP orada "admin" bulamazsa
    /// varsayılan şifreli YENİ yönetici açardı; yönetici artık "admin" adını taşımadığı için bu her
    /// yayında olurdu.
    /// </summary>
    [Fact]
    public async Task Varsayilan_degerlerle_kiraci_tohumlamasi_yonetici_acmaz()
    {
        var tenantId = await CreateTenantAsync();

        var userCount = await WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenantId))
            {
                await GetRequiredService<IDataSeeder>().SeedAsync(new DataSeedContext(tenantId)
                    .WithProperty(IdentityDataSeedContributor.AdminEmailPropertyName, IdentityDataSeedContributor.AdminEmailDefaultValue)
                    .WithProperty(IdentityDataSeedContributor.AdminPasswordPropertyName, IdentityDataSeedContributor.AdminPasswordDefaultValue));

                return await GetRequiredService<IRepository<IdentityUser, Guid>>().GetCountAsync();
            }
        });

        userCount.ShouldBe(0);
    }
}
