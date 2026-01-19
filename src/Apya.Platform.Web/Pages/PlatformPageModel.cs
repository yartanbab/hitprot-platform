using Apya.Platform.Localization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages;

/* Inherit your PageModel classes from this class.
 */
public abstract class PlatformPageModel : AbpPageModel
{
    protected PlatformPageModel()
    {
        LocalizationResourceType = typeof(PlatformResource);
    }
}
