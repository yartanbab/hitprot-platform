using System;
using System.Collections.Generic;
using System.Text;
using Apya.Platform.Localization;
using Volo.Abp.Application.Services;

namespace Apya.Platform;

/* Inherit your application services from this class.
 */
public abstract class PlatformAppService : ApplicationService
{
    protected PlatformAppService()
    {
        LocalizationResource = typeof(PlatformResource);
    }
}
