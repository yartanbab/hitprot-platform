using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Macros;
using Apya.Platform.Macros.Dtos;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.Validation;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Macros;

/// <summary>
/// Host makro yönetimi (varsayılan açık model) ve ayarın okunduğu tek yer (MacroSettingsProvider):
/// kaydet / varsayılana dön, kapsam çözümü, varsayılan sabitleme, önbellek tazeliği.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class MacroAdmin_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IMacroAdminAppService _admin;
    private readonly MacroSettingsProvider _provider;
    private readonly ICurrentTenant _currentTenant;
    private readonly ICurrentPrincipalAccessor _principal;

    public MacroAdmin_Tests()
    {
        _admin = GetRequiredService<IMacroAdminAppService>();
        _provider = GetRequiredService<MacroSettingsProvider>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _principal = GetRequiredService<ICurrentPrincipalAccessor>();
    }

    private IDisposable As(params string[] roles)
    {
        var claims = new List<Claim>
        {
            new(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new(AbpClaimTypes.UserName, "makro-ayar")
        };
        claims.AddRange(roles.Select(r => new Claim(AbpClaimTypes.Role, r)));
        return _principal.Change(new ClaimsPrincipal(new ClaimsIdentity(claims, "Test")));
    }

    private static UpdateMacroSettingDto Input(Action<UpdateMacroSettingDto>? change = null)
    {
        var input = new UpdateMacroSettingDto();
        change?.Invoke(input);
        return input;
    }

    private Task<MacroAdminDto> UpdateAsync(string key, UpdateMacroSettingDto input)
        => WithUnitOfWorkAsync(() => _admin.UpdateAsync(key, input));

    private Task ResetAsync(string key) => WithUnitOfWorkAsync(() => _admin.ResetAsync(key));

    private async Task<MacroSettingViewDto?> ViewAsync(string key, params string[] roles)
    {
        using (As(roles))
        {
            return (await WithUnitOfWorkAsync(() => _provider.GetForCurrentUserAsync())).SingleOrDefault(s => s.Key == key);
        }
    }

    [Fact]
    public async Task Liste_katalogun_tamami_ayarsiz_makro_varsayilan_gelir()
    {
        var list = await WithUnitOfWorkAsync(() => _admin.GetListAsync());

        list.Select(m => m.Key).ShouldBe(MacroCatalog.All.Select(d => d.Key), ignoreOrder: true);
        var boards = list.Single(m => m.Key == "Boards");
        boards.MenuName.ShouldBe("Apya.Work.Boards");
        boards.Url.ShouldBeNull();
        boards.DefaultTitle.ShouldNotStartWith("Menu:");
        var task = list.Single(m => m.Key == "TaskCreate");
        task.Url.ShouldBe("/Tasks/CreateModal");
        task.Permission.ShouldNotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Kaydet_ve_varsayilana_don()
    {
        try
        {
            var saved = await UpdateAsync("ExpenseCreate", Input(i =>
            {
                i.DisplayName = "Masraf girişi";
                i.Icon = "fa fa-receipt";
                i.SortOrder = 1;
                i.Packages = new List<PackageCode> { PackageCode.Enterprise };
                i.Roles = new List<string> { "Muhasebe" };
            }));

            saved.IsCustomized.ShouldBeTrue();
            saved.DisplayName.ShouldBe("Masraf girişi");
            saved.Packages.ShouldBe(new[] { PackageCode.Enterprise });
            saved.Roles.ShouldBe(new[] { "Muhasebe" });

            // Liste host sırasıyla başlar.
            (await WithUnitOfWorkAsync(() => _admin.GetListAsync()))[0].Key.ShouldBe("ExpenseCreate");

            var reset = await WithUnitOfWorkAsync(() => _admin.ResetAsync("ExpenseCreate"));
            reset.IsCustomized.ShouldBeFalse();
            reset.DisplayName.ShouldBeNull();
        }
        finally
        {
            await ResetAsync("ExpenseCreate");
        }
    }

    [Fact]
    public async Task Katalogda_olmayan_anahtar_ve_hatali_girdi_reddedilir()
    {
        await Should.ThrowAsync<EntityNotFoundException>(() => UpdateAsync("Uydurma", Input()));
        await Should.ThrowAsync<UserFriendlyException>(() => UpdateAsync("TaskCreate",
            Input(i => i.Roles = new List<string> { "a,b" })));
        await Should.ThrowAsync<AbpValidationException>(() => UpdateAsync("TaskCreate",
            Input(i => i.Icon = "<script>")));
    }

    [Fact]
    public async Task Kiraci_baglaminda_yonetim_reddedilir()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await Should.ThrowAsync<AbpAuthorizationException>(() => WithUnitOfWorkAsync(() => _admin.GetListAsync()));
        }
    }

    /// <summary>Gizli ayar görünmez; rol kapsamı kullanıcının rolüne göre çözülür. Kayıt önbelleği hemen tazeler.</summary>
    [Fact]
    public async Task Saglayici_gizliyi_ve_rol_kapsamini_cozer()
    {
        try
        {
            await UpdateAsync("IncomeCreate", Input(i => i.IsHidden = true));
            await UpdateAsync("InvoiceCreate", Input(i => i.Roles = new List<string> { "Muhasebe" }));

            (await ViewAsync("IncomeCreate", "Muhasebe"))!.IsVisible.ShouldBeFalse();
            (await ViewAsync("InvoiceCreate", "muhasebe"))!.IsVisible.ShouldBeTrue();
            (await ViewAsync("InvoiceCreate", "Gözlemci"))!.IsVisible.ShouldBeFalse();
            (await ViewAsync("TaskCreate")).ShouldBeNull(); // ayarsız makro: varsayılan
        }
        finally
        {
            await ResetAsync("IncomeCreate");
            await ResetAsync("InvoiceCreate");
        }
    }

    /// <summary>
    /// Kendi listesini hiç kaydetmemiş kullanıcının sabitlemesi: varsayılan menü iğneleri + host'un
    /// "yeni kullanıcıya sabitli gelsin" dediği, kullanıcıya görünen makrolar.
    /// </summary>
    [Fact]
    public void Varsayilan_sabitleme_host_isaretli_gorunen_makrolari_ekler()
    {
        var pins = MacroSettingsProvider.DefaultPins(new[]
        {
            new MacroSettingViewDto { Key = "TaskCreate", DefaultPinned = true, IsVisible = true },
            new MacroSettingViewDto { Key = "Boards", DefaultPinned = true, IsVisible = true },
            new MacroSettingViewDto { Key = "IncomeCreate", DefaultPinned = true, IsVisible = false }
        });

        pins.ShouldContain(MacroDefinition.PinPrefix + "TaskCreate");
        pins.ShouldContain("Apya.Work.Boards");
        pins.ShouldNotContain(MacroDefinition.PinPrefix + "IncomeCreate");
        pins.ShouldContain("Apya.Finance.Hub"); // varsayılan menü iğnesi korunur
    }
}
