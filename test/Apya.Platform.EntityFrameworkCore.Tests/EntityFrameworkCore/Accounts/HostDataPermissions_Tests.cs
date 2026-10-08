using System;
using System.Threading.Tasks;
using Apya.Platform.Accounts;
using Apya.Platform.Accounts.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Accounts;

/// <summary>
/// Host verisine dokunan izinler kiracıya verilemez; servisler de kiracı bağlamını reddeder.
///
/// <para>Giriş ekranı ayarı GLOBAL yazılır (bütün kiracıların giriş ekranı); kayıt talepleri kiracı
/// sütunu taşımayan HOST kayıtlarıdır (başvuranın adı, vergi numarası, e-postası, telefonu). İkisinin
/// izni de taraf belirtilmeden tanımlıydı: kiracıya verilebiliyor, yeni açılan kiracının yönetici
/// rolüne kendiliğinden iniyordu. Yerel veritabanında giriş ekranı izni üç kiracının, kayıt talepleri
/// izni bir kiracının yönetici rolünde bulundu; giriş ekranı izni kiracı yöneticisinde gerçekten
/// AÇIK ölçüldü.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class HostDataPermissions_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Tenant = Guid.Parse("55550000-cccc-4000-8000-0000000000c4");

    private readonly ILoginScreenSettingsAppService _loginScreen;
    private readonly IRegistrationRequestAppService _registrationRequests;
    private readonly ICurrentTenant _currentTenant;

    public HostDataPermissions_Tests()
    {
        _loginScreen = GetRequiredService<ILoginScreenSettingsAppService>();
        _registrationRequests = GetRequiredService<IRegistrationRequestAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Theory]
    [InlineData(PlatformPermissions.LoginScreen.Default)]
    [InlineData(PlatformPermissions.RegistrationRequests.Default)]
    [InlineData(PlatformPermissions.RegistrationRequests.Manage)]
    public async Task Host_verisi_izni_kiraciya_verilemez(string permissionName)
    {
        var permission = await GetRequiredService<IPermissionDefinitionManager>().GetAsync(permissionName);

        permission.MultiTenancySide.ShouldBe(MultiTenancySides.Host);
    }

    [Fact]
    public async Task Kiraci_baglamindan_giris_ekrani_ayari_degistirilemez()
    {
        var before = await WithUnitOfWorkAsync(() => _loginScreen.GetAsync());

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                await Should.ThrowAsync<AbpAuthorizationException>(async () =>
                    await _loginScreen.UpdateAsync(new LoginScreenSettingsDto
                    {
                        ShowTenantSwitch = !before.ShowTenantSwitch,
                        ShowSocialLogin = !before.ShowSocialLogin,
                    }));
            }
        });

        // Bütün kiracıların gördüğü ayar yerinde.
        var after = await WithUnitOfWorkAsync(() => _loginScreen.GetAsync());
        after.ShowTenantSwitch.ShouldBe(before.ShowTenantSwitch);
        after.ShowSocialLogin.ShouldBe(before.ShowSocialLogin);
    }

    [Fact]
    public async Task Host_giris_ekrani_ayarini_degistirmeye_devam_eder()
    {
        var before = await WithUnitOfWorkAsync(() => _loginScreen.GetAsync());
        try
        {
            await WithUnitOfWorkAsync(() => _loginScreen.UpdateAsync(new LoginScreenSettingsDto
            {
                ShowTenantSwitch = !before.ShowTenantSwitch,
                ShowSocialLogin = before.ShowSocialLogin,
            }));

            (await WithUnitOfWorkAsync(() => _loginScreen.GetAsync())).ShowTenantSwitch.ShouldBe(!before.ShowTenantSwitch);
        }
        finally
        {
            // Ayar koleksiyondaki öbür testlerle ortak; eski hâline döner.
            await WithUnitOfWorkAsync(() => _loginScreen.UpdateAsync(before));
        }
    }

    [Fact]
    public async Task Kiraci_baglamindan_kayit_talepleri_okunamaz_ve_degistirilemez()
    {
        var id = await WithUnitOfWorkAsync(() => _registrationRequests.CreateAsync(new CreateRegistrationRequestDto
        {
            RequestedPlan = Apya.Platform.Tenants.SalesPlan.Standard,
            CompanyName = "Yalıtım Sınaması A.Ş.",
            CompanyType = Apya.Platform.Tenants.CompanyType.Association,
            TaxNumber = "1234567890",
            TaxOffice = "Halkalı",
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul",
            CorporateEmail = "info@ornek.com",
            CompanySize = RegistrationRequestCompanySize.From11To50,
            FullName = "Ayşe Yılmaz",
            AuthorizedTitle = "Yönetim Kurulu Başkanı",
            Email = $"aday-{Guid.NewGuid():N}@ornek.com",
            Phone = "05551112233",
        }));

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                await Should.ThrowAsync<AbpAuthorizationException>(async () =>
                    await _registrationRequests.GetListAsync(new RegistrationRequestListFilterDto()));
                await Should.ThrowAsync<AbpAuthorizationException>(async () => await _registrationRequests.GetAsync(id));
                await Should.ThrowAsync<AbpAuthorizationException>(async () => await _registrationRequests.GetSummaryAsync());
                await Should.ThrowAsync<AbpAuthorizationException>(async () => await _registrationRequests.IssueInviteAsync(id));
            }
        });

        // Host okumaya devam eder.
        (await WithUnitOfWorkAsync(() => _registrationRequests.GetAsync(id))).CompanyName.ShouldBe("Yalıtım Sınaması A.Ş.");
    }
}
