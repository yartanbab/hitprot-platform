using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Toolbars;

namespace Apya.Platform.Web.Theme;

/// <summary>
/// Kenar çubuğu modu seçicisini LeptonX ana header toolbar'ına ekler.
/// Görsel sıra flex order ile veriliyor (apya-theme-bridge.css), bu yüzden
/// kayıt sırası kritik değil; yine de diğer görünüm tercihlerinin (tema,
/// yoğunluk) yanına kaydedilir.
/// </summary>
public class SidebarModeToolbarContributor : IToolbarContributor
{
    public Task ConfigureToolbarAsync(IToolbarConfigurationContext context)
    {
        if (context.Toolbar.Name == StandardToolbars.Main)
        {
            context.Toolbar.Items.Add(new ToolbarItem(typeof(SidebarModeViewComponent)));
        }

        return Task.CompletedTask;
    }
}
