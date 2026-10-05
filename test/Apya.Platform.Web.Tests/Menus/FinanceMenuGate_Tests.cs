using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Menus;
using Apya.Platform.Web.Pages.Finance;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.UI.Navigation;
using Xunit;

namespace Apya.Platform.Menus;

/// <summary>
/// FUX-06 · Finans menü öğesi, /Finance sayfasını açabilen HER kullanıcıya görünür.
///
/// <para>Menü kapısı gelir | gider | fatura izniydi; sayfanın kendi kapısı ise bunlara ek olarak
/// bütçe görme ve kasa iznini de kabul ediyor. Yalnız bütçe görme izni olan proje yöneticisi
/// sayfayı açabiliyor, sekmelerini görebiliyor ama menüde sayfanın kendisini bulamıyordu.</para>
///
/// <para>Menü çözücü gerçek barındırıcıdan alınır; yalnız izin denetleyicisi, testin o an
/// verdiği TEK izne "evet" diyen bir sahteyle değiştirilir.</para>
/// </summary>
public class FinanceMenuGate_Tests : PlatformWebTestBase
{
    private const string HubMenuName = "Apya.Finance.Hub";

    private readonly SingleGrantPermissionChecker _permissions = new();

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        services.Replace(ServiceDescriptor.Singleton<IPermissionChecker>(_permissions));
    }

    private async Task<bool> HubVisibleWithOnlyAsync(string permission)
    {
        _permissions.Granted = permission;

        // Çözücü istek başına yaşar ve sonucunu saklar; her ölçüm kendi kapsamında.
        using var scope = ServiceProvider.CreateScope();
        var resolution = await scope.ServiceProvider.GetRequiredService<PlatformNavigationResolver>().ResolveAsync();

        return Flatten(resolution.Sidebar).Any(item => item.Name == HubMenuName);
    }

    private static IEnumerable<ApplicationMenuItem> Flatten(IEnumerable<ApplicationMenuItem> items)
        => items.SelectMany(item => new[] { item }.Concat(Flatten(item.Items)));

    [Fact]
    public async Task Sayfayi_acabilen_her_izin_menude_de_gorur()
    {
        foreach (var permission in FinanceContext.PageAnyOfPermissions)
        {
            (await HubVisibleWithOnlyAsync(permission))
                .ShouldBeTrue($"yalnız '{permission}' izni olan kullanıcı /Finance'ı açabiliyor ama menüde göremiyor");
        }
    }

    /// <summary>
    /// Ters yön: sayfayı açamayan kullanıcıya menü öğesi de basılmaz (yasak sayfaya çağrı olmaz).
    /// Belge izni sayfa kapısında bilerek yok.
    /// </summary>
    [Fact]
    public async Task Sayfayi_acamayan_menude_de_gormez()
    {
        (await HubVisibleWithOnlyAsync(PlatformPermissions.Documents.Default)).ShouldBeFalse();
    }

    /// <summary>Yalnız <see cref="Granted"/> iznine "evet" diyen izin denetleyicisi.</summary>
    private sealed class SingleGrantPermissionChecker : IPermissionChecker
    {
        public string? Granted { get; set; }

        public Task<bool> IsGrantedAsync(string name) => Task.FromResult(name == Granted);

        public Task<bool> IsGrantedAsync(ClaimsPrincipal? claimsPrincipal, string name) => IsGrantedAsync(name);

        public Task<MultiplePermissionGrantResult> IsGrantedAsync(string[] names)
        {
            var result = new MultiplePermissionGrantResult();
            foreach (var name in names)
            {
                result.Result[name] = name == Granted ? PermissionGrantResult.Granted : PermissionGrantResult.Undefined;
            }

            return Task.FromResult(result);
        }

        public Task<MultiplePermissionGrantResult> IsGrantedAsync(ClaimsPrincipal? claimsPrincipal, string[] names)
            => IsGrantedAsync(names);
    }
}
