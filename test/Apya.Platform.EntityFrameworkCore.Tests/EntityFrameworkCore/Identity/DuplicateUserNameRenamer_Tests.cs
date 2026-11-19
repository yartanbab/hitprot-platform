using System;
using System.Threading.Tasks;
using Apya.Platform.Identity;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Identity;

/// <summary>
/// DbMigrator'ın kuraldan önce açılmış çakışan adları ayırması: biri adını korur (host, yoksa en
/// eski), ötekiler "ad.kiracı" olur; silinmiş kiracılar sayılmaz.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DuplicateUserNameRenamer_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static string NewName(string prefix) => prefix + Guid.NewGuid().ToString("N")[..8];

    private async Task<(Guid Id, string Name)> CreateTenantAsync()
    {
        var name = "Ayir " + Guid.NewGuid().ToString("N")[..6];
        var tenant = await WithUnitOfWorkAsync(async () =>
        {
            var t = await GetRequiredService<ITenantManager>().CreateAsync(name);
            return await GetRequiredService<ITenantRepository>().InsertAsync(t, autoSave: true);
        });
        return (tenant.Id, name);
    }

    /// <summary>Kuraldan önceki hesabı canlandırır: doğrulayıcıyı atlayarak depoya yazar.</summary>
    private async Task<Guid> InsertLegacyUserAsync(Guid? tenantId, string userName)
    {
        var user = await WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenantId))
            {
                var u = new IdentityUser(Guid.NewGuid(), userName, Guid.NewGuid().ToString("N") + "@ornek.com", tenantId);
                return await GetRequiredService<IRepository<IdentityUser, Guid>>().InsertAsync(u, autoSave: true);
            }
        });
        // Yaş sırası CreationTime'a bağlı: aynı tik içinde iki kayıt olmasın.
        await Task.Delay(20);
        return user.Id;
    }

    private Task<string> GetUserNameAsync(Guid userId)
    {
        return WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<IDataFilter<IMultiTenant>>().Disable())
            {
                return (await GetRequiredService<IRepository<IdentityUser, Guid>>().GetAsync(userId)).UserName;
            }
        });
    }

    private Task<int> RenameAsync() => GetRequiredService<DuplicateUserNameRenamer>().RenameAsync();

    [Fact]
    public async Task En_eski_hesap_adini_korur_oteki_kiraci_adini_alir()
    {
        var userName = NewName("cift");
        var older = await InsertLegacyUserAsync((await CreateTenantAsync()).Id, userName);
        var (tenantId, tenantName) = await CreateTenantAsync();
        var newer = await InsertLegacyUserAsync(tenantId, userName);

        (await RenameAsync()).ShouldBeGreaterThanOrEqualTo(1);

        (await GetUserNameAsync(older)).ShouldBe(userName);
        (await GetUserNameAsync(newer)).ShouldBe(userName + "." + UniqueUserNameChecker.ToSlug(tenantName));
    }

    [Fact]
    public async Task Host_hesabi_daha_yeni_olsa_da_adini_korur()
    {
        var userName = NewName("hostcift");
        var tenantUser = await InsertLegacyUserAsync((await CreateTenantAsync()).Id, userName);
        var hostUser = await InsertLegacyUserAsync(null, userName);

        await RenameAsync();

        (await GetUserNameAsync(hostUser)).ShouldBe(userName);
        (await GetUserNameAsync(tenantUser)).ShouldNotBe(userName);
    }

    [Fact]
    public async Task Silinmis_kiracinin_hesabi_sayilmaz_ve_dokunulmaz()
    {
        var userName = NewName("silcift");
        var deleted = await CreateTenantAsync();
        var orphan = await InsertLegacyUserAsync(deleted.Id, userName);
        var live = await InsertLegacyUserAsync((await CreateTenantAsync()).Id, userName);
        await WithUnitOfWorkAsync(async () =>
        {
            var repo = GetRequiredService<ITenantRepository>();
            await repo.DeleteAsync(await repo.GetAsync(deleted.Id), autoSave: true);
        });

        await RenameAsync();

        (await GetUserNameAsync(orphan)).ShouldBe(userName);
        (await GetUserNameAsync(live)).ShouldBe(userName);
    }

    [Fact]
    public async Task Ikinci_calistirmada_degisiklik_yapmaz()
    {
        var userName = NewName("tekrar");
        await InsertLegacyUserAsync((await CreateTenantAsync()).Id, userName);
        await InsertLegacyUserAsync((await CreateTenantAsync()).Id, userName);

        await RenameAsync();

        (await RenameAsync()).ShouldBe(0);
    }
}
