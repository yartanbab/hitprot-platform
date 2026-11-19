using System;
using System.Threading.Tasks;
using Apya.Platform.Accounts;
using Shouldly;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Accounts;

/// <summary>
/// Giriş ekranı kullanıcı adı / e-postadan kiracıyı bulur. Silinmiş kiracının kullanıcıları
/// AbpUsers'ta kalır; aday sayılırlarsa kullanıcı adıyla giriş var olmayan kiracıya yönlenir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class LoginTenantFinder_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string Password = "1q2w3E*asd";

    private async Task<Guid> TenantWithUserAsync(string userName)
    {
        var tenant = await WithUnitOfWorkAsync(async () =>
        {
            var t = await GetRequiredService<ITenantManager>().CreateAsync("giris-" + Guid.NewGuid().ToString("N")[..8]);
            return await GetRequiredService<ITenantRepository>().InsertAsync(t, autoSave: true);
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenant.Id))
            {
                var user = new IdentityUser(
                    Guid.NewGuid(), userName, Guid.NewGuid().ToString("N") + "@ornek.com", tenant.Id);
                (await GetRequiredService<IdentityUserManager>().CreateAsync(user, Password)).Succeeded.ShouldBeTrue();
            }
        });

        return tenant.Id;
    }

    private async Task DeleteTenantAsync(Guid tenantId)
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var repo = GetRequiredService<ITenantRepository>();
            await repo.DeleteAsync(await repo.GetAsync(tenantId), autoSave: true);
        });
    }

    [Fact]
    public async Task Ayni_kullanici_adi_iki_kiracida_ise_ikisi_de_aday()
    {
        var userName = "ortak" + Guid.NewGuid().ToString("N")[..8];
        var first = await TenantWithUserAsync(userName);
        var second = await TenantWithUserAsync(userName);

        var candidates = await WithUnitOfWorkAsync(
            () => GetRequiredService<LoginTenantFinder>().FindTenantIdsAsync(userName));

        candidates.Count.ShouldBe(2);
        candidates.ShouldContain(first);
        candidates.ShouldContain(second);
    }

    [Fact]
    public async Task Silinmis_kiracinin_kullanicisi_aday_sayilmaz()
    {
        var userName = "ortak" + Guid.NewGuid().ToString("N")[..8];
        var deleted = await TenantWithUserAsync(userName);
        var live = await TenantWithUserAsync(userName);
        await DeleteTenantAsync(deleted);

        var candidates = await WithUnitOfWorkAsync(
            () => GetRequiredService<LoginTenantFinder>().FindTenantIdsAsync(userName));

        candidates.ShouldHaveSingleItem().ShouldBe(live);
    }

    [Fact]
    public async Task Yalniz_silinmis_kiracida_olan_kullanici_icin_aday_yok()
    {
        var userName = "yetim" + Guid.NewGuid().ToString("N")[..8];
        var deleted = await TenantWithUserAsync(userName);
        await DeleteTenantAsync(deleted);

        var candidates = await WithUnitOfWorkAsync(
            () => GetRequiredService<LoginTenantFinder>().FindTenantIdsAsync(userName));

        candidates.ShouldBeEmpty();
    }
}
