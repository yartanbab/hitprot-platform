using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Macros;
using Apya.Platform.Permissions;
using Apya.Platform.Shell;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Menus;

/// <summary>
/// "+ Yeni" menüsü ve komut paletinin "OLUŞTUR" grubu TEK listeden beslenir: kabuk durumundaki
/// <c>Creates</c> (Makro Ekran kataloğunun adresli satırları, izne göre süzülmüş). Eskiden iki
/// betikte elle eşit tutulan iki kopya vardı.
/// </summary>
public class ShellCreates_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Izinli_adresli_makrolar_katalog_sirasiyla_gelir()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var creates = (await GetRequiredService<IShellAppService>().GetStateAsync()).Creates;

        creates.Select(c => c.Key).ShouldBe(MacroCatalog.All.Where(d => d.Url != null).Select(d => d.Key));
        creates.Single(c => c.Key == "TaskCreate").IsModal.ShouldBeTrue();
        creates.Single(c => c.Key == "TaskCreate").Url.ShouldBe("/Tasks/CreateModal");
        creates.Single(c => c.Key == "ExpenseCapture").IsModal.ShouldBeFalse();
        creates.ShouldAllBe(c => !c.Title.StartsWith("Macro:"), "başlık yerelleştirilmemiş");
    }

    /// <summary>İki betik de aynı alanları okur; C#→JS sözleşmesi derleyiciden geçmez.</summary>
    [Fact]
    public void Kabuk_betikleri_ayni_listeyi_okur()
    {
        var js = Path.Combine(WebSourceFiles.RepoRoot(), "src", "Apya.Platform.Web", "wwwroot", "js");
        var actions = File.ReadAllText(Path.Combine(js, "apya-shell-actions.js"));
        var palette = File.ReadAllText(Path.Combine(js, "command-palette.js"));

        actions.ShouldContain("state.creates");
        palette.ShouldContain("apyaShellStateValue.creates");
        foreach (var field in new[] { "c.key", "c.title", "c.url", "c.isModal" })
        {
            actions.ShouldContain(field, Case.Sensitive);
        }

        foreach (var field in new[] { "c.title", "c.url", "c.isModal", "c.icon" })
        {
            palette.ShouldContain(field, Case.Sensitive);
        }

        // Eski elle yazılmış kopyalar kalmadı.
        actions.ShouldNotContain("can.createTask", Case.Sensitive);
        palette.ShouldNotContain("can.createTask", Case.Sensitive);
    }
}

/// <summary>Gider oluşturma izni reddedilen barındırıcı: o izne bağlı iki satır listeye girmez.</summary>
public class ShellCreatesPermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.Expenses.Create);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    [Fact]
    public async Task Izni_olmayan_olusturma_eylemi_listeye_girmez()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var keys = (await GetRequiredService<IShellAppService>().GetStateAsync()).Creates.Select(c => c.Key).ToList();

        keys.ShouldNotContain("ExpenseCreate");
        keys.ShouldNotContain("ExpenseCapture");
        keys.ShouldContain("TaskCreate");
    }
}
