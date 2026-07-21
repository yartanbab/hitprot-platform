using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Toolbars;

namespace Apya.Platform.Web.Theme;

/// <summary>
/// Tema değiştiriciyi LeptonX ana header toolbar'ına ekler (bildirim zili + dil
/// + kullanıcı menüsünün yanına). Modülde NotificationToolbarContributor'dan
/// ÖNCE kaydedilir → toggle bildirim zilinin solunda görünür.
/// </summary>
public class ThemeToggleToolbarContributor : IToolbarContributor
{
    public Task ConfigureToolbarAsync(IToolbarConfigurationContext context)
    {
        if (context.Toolbar.Name == StandardToolbars.Main)
        {
            context.Toolbar.Items.Add(new ToolbarItem(typeof(ThemeToggleViewComponent)));
        }

        return Task.CompletedTask;
    }
}
