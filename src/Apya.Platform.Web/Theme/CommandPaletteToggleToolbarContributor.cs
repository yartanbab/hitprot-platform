using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Toolbars;

namespace Apya.Platform.Web.Theme;

/// <summary>
/// Komut paleti tetikleyicisini LeptonX ana header toolbar'ına ekler.
/// ThemeToggleToolbarContributor'dan ÖNCE kaydedilir → sayfa başlığına en
/// yakın (toolbar ikon kümesinin solunda) görünür.
/// </summary>
public class CommandPaletteToggleToolbarContributor : IToolbarContributor
{
    public Task ConfigureToolbarAsync(IToolbarConfigurationContext context)
    {
        if (context.Toolbar.Name == StandardToolbars.Main)
        {
            context.Toolbar.Items.Add(new ToolbarItem(typeof(CommandPaletteToggleViewComponent)));
        }

        return Task.CompletedTask;
    }
}
