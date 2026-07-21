using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Toolbars;

namespace Apya.Platform.Web.Theme;

/// <summary>
/// Yoğunluk değiştiriciyi LeptonX ana header toolbar'ına ekler. Görsel sıra
/// apya-theme-bridge.css'teki flex `order` ile belirlenir (tema toggle'ın yanı).
/// </summary>
public class DensityToggleToolbarContributor : IToolbarContributor
{
    public Task ConfigureToolbarAsync(IToolbarConfigurationContext context)
    {
        if (context.Toolbar.Name == StandardToolbars.Main)
        {
            context.Toolbar.Items.Add(new ToolbarItem(typeof(DensityToggleViewComponent)));
        }

        return Task.CompletedTask;
    }
}
