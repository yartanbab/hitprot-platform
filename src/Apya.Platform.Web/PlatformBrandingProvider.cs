using Microsoft.Extensions.Localization;
using Apya.Platform.Localization;
using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Web;

[Dependency(ReplaceServices = true)]
public class PlatformBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<PlatformResource> _localizer;

    public PlatformBrandingProvider(IStringLocalizer<PlatformResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
