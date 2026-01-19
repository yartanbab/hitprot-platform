using Apya.Platform.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class PlatformController : AbpControllerBase
{
    protected PlatformController()
    {
        LocalizationResource = typeof(PlatformResource);
    }
}
