using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Toolbars;

namespace Apya.Platform.Web.Feedbacks;

/// <summary>
/// "Geri Bildirim" linkini header toolbar'ına, bildirim zilinin yanına ekler.
/// Modülde NotificationToolbarContributor'dan SONRA kaydedilir → linki zilin sağında gösterir.
/// </summary>
public class FeedbackToolbarContributor : IToolbarContributor
{
    public Task ConfigureToolbarAsync(IToolbarConfigurationContext context)
    {
        if (context.Toolbar.Name == StandardToolbars.Main)
        {
            context.Toolbar.Items.Add(new ToolbarItem(typeof(FeedbackWidgetViewComponent)));
        }

        return Task.CompletedTask;
    }
}
