using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// "ŞİFRE BELİRLEME" SÖZLEŞMESİ: host, müşteri kullanıcısının şifresini eski şifreyi
/// BİLMEDEN yazabilir; ama yalnız o müşterinin kullanıcısına ve yalnız host bağlamında.
/// Müşteri şifresini unuttuğunda posta kanalı çalışmıyorsa tek kurtarma yolu budur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TenantUserPassword_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string InitialPassword = "1q2w3E*asd";
    private const string NewPassword = "Yeni9876!";

    private readonly ITenantProfileAppService _tenantProfileAppService;
    private readonly IdentityUserManager _userManager;
    private readonly ICurrentTenant _currentTenant;

    public TenantUserPassword_Tests()
    {
        _tenantProfileAppService = GetRequiredService<ITenantProfileAppService>();
        _userManager = GetRequiredService<IdentityUserManager>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task Kiracinin_kullanicilari_host_baglamindan_listelenir()
    {
        var tenantId = await CreateTenantAsync();

        var users = await _tenantProfileAppService.GetTenantUsersAsync(tenantId);

        // Yeni kurulan hesapta tek kullanıcı vardır: tohumlanan yönetici.
        var admin = users.ShouldHaveSingleItem();
        admin.UserName.ShouldBe("admin");
        admin.Email.ShouldNotBeNullOrWhiteSpace();
        admin.DisplayName.ShouldNotBeNullOrWhiteSpace();
    }

    /// <summary>
    /// Asıl sözleşme: yeni şifre GEÇER, eski şifre GEÇMEZ. Host hiçbir aşamada eski
    /// şifreyi bilmez.
    /// </summary>
    [Fact]
    public async Task Host_eski_sifreyi_bilmeden_yeni_sifre_belirler()
    {
        var tenantId = await CreateTenantAsync();
        var admin = (await _tenantProfileAppService.GetTenantUsersAsync(tenantId)).Single();

        await _tenantProfileAppService.SetTenantUserPasswordAsync(tenantId, admin.Id, NewPassword);

        using (_currentTenant.Change(tenantId))
        {
            var user = await _userManager.GetByIdAsync(admin.Id);

            (await _userManager.CheckPasswordAsync(user, NewPassword)).ShouldBeTrue();
            (await _userManager.CheckPasswordAsync(user, InitialPassword)).ShouldBeFalse();
        }
    }

    /// <summary>
    /// 🔴 Kullanıcı kimliği kiracı süzgecinin ALTINDA aranır: başka müşterinin kullanıcı
    /// kimliği gönderilse bile şifre yazılmaz. Aksi halde listeden kopyalanan bir GUID ile
    /// yanlış hesabın şifresi değiştirilebilirdi.
    /// </summary>
    [Fact]
    public async Task Baska_kiracinin_kullanicisina_sifre_yazilamaz()
    {
        var kurbanTenantId = await CreateTenantAsync();
        var kurbanAdmin = (await _tenantProfileAppService.GetTenantUsersAsync(kurbanTenantId)).Single();
        var digerTenantId = await CreateTenantAsync();

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _tenantProfileAppService.SetTenantUserPasswordAsync(
                digerTenantId, kurbanAdmin.Id, NewPassword));

        using (_currentTenant.Change(kurbanTenantId))
        {
            var user = await _userManager.GetByIdAsync(kurbanAdmin.Id);

            (await _userManager.CheckPasswordAsync(user, InitialPassword)).ShouldBeTrue();
        }
    }

    /// <summary>Kiracı bağlamındayken (ör. "Hesabına Gir" sonrası) uç kapalıdır.</summary>
    [Fact]
    public async Task Kiraci_baglaminda_sifre_belirlenemez()
    {
        var tenantId = await CreateTenantAsync();
        var admin = (await _tenantProfileAppService.GetTenantUsersAsync(tenantId)).Single();

        using (_currentTenant.Change(tenantId))
        {
            await Should.ThrowAsync<UserFriendlyException>(
                () => _tenantProfileAppService.SetTenantUserPasswordAsync(tenantId, admin.Id, NewPassword));
        }
    }

    // --- Yardımcılar ---

    /// <summary>Host'un "Yeni Müşteri" modalının yolu: kiracı + profil + yönetici.</summary>
    private async Task<Guid> CreateTenantAsync()
    {
        var email = "sifre-" + Guid.NewGuid().ToString("N") + "@ornek.com";

        var created = await _tenantProfileAppService.CreateTenantWithProfileAsync(new CreateTenantExtendedDto
        {
            Name = "sifre-" + Guid.NewGuid().ToString("N"),
            AdminEmailAddress = email,
            AdminPassword = InitialPassword,
            PackageCode = PackageCode.Basic,
            CompanyType = CompanyType.Company,
            TaxNumber = Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString(),
            CorporateEmail = email,
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul"
        });

        return created.TenantId;
    }
}
