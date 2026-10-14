using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Macros.Dtos;
using Apya.Platform.Shell;
using Shouldly;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Macros;

/// <summary>
/// Host makro yönetimi (/Admin/Macros) ve ayarın yüzeylere yansıması: Makro Ekran, "+ Yeni" /
/// komut paleti listesi (kabuk durumu) ve kendi listesini kaydetmemiş kullanıcının sabitlemesi.
/// Test barındırıcısı host bağlamında ve her izni verir.
/// </summary>
public class MacroAdminPage_Tests : PlatformWebTestBase
{
    private async Task UpdateAsync(string key, UpdateMacroSettingDto input)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IMacroAdminAppService>().UpdateAsync(key, input);
        await uow.CompleteAsync();
    }

    [Fact]
    public async Task Yonetim_ekrani_ve_menu_girdisi_hostta_acilir()
    {
        var html = await GetResponseAsStringAsync("/Admin/Macros");

        html.ShouldContain("id=\"MacroAdminMd\"");
        html.ShouldContain("id=\"apya-macro-admin-options\"");
        html.ShouldContain("MenuItem_Apya_Platform_MacrosAdmin");
        // Menüye bağlı makronun ikonu/adresi menüden çözülüp seçeneklere basılır.
        html.ShouldContain("\"Apya.Work.Boards\":{\"icon\":");
    }

    [Fact]
    public async Task Gizlenen_makro_ekrandan_ve_yeni_listesinden_duser_ad_degisikligi_yansir()
    {
        await UpdateAsync("TaskCreate", new UpdateMacroSettingDto { IsHidden = true });
        await UpdateAsync("ExpenseCreate", new UpdateMacroSettingDto { DisplayName = "Harcama Gir X", Icon = "fa fa-receipt" });

        var html = await GetResponseAsStringAsync("/Makro");
        html.ShouldNotContain("data-macro-key=\"TaskCreate\"");
        html.ShouldContain("Harcama Gir X");
        html.ShouldContain("fa fa-receipt");

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var creates = (await GetRequiredService<IShellAppService>().GetStateAsync()).Creates;
        creates.ShouldNotContain(c => c.Key == "TaskCreate");
        creates.Single(c => c.Key == "ExpenseCreate").Title.ShouldBe("Harcama Gir X");
    }

    [Fact]
    public async Task Yeni_kullaniciya_sabitli_makro_varsayilan_iglerde_gelir()
    {
        await UpdateAsync("IncomeCreate", new UpdateMacroSettingDto { DefaultPinned = true });

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var pins = (await GetRequiredService<IShellAppService>().GetStateAsync()).Pins;

        pins.ShouldContain(MacroDefinition.PinPrefix + "IncomeCreate");
    }
}
