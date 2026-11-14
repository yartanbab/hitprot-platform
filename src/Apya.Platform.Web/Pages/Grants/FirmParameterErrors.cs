using Microsoft.Extensions.Localization;
using Volo.Abp;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>Kurum parametresi hata kodunun metnini, istisnanın taşıdığı değerlerle ({Name}…) doldurur.</summary>
public static class FirmParameterErrors
{
    public static string Localize(IStringLocalizer localizer, BusinessException exception)
    {
        var text = localizer[exception.Code!].Value;
        foreach (var key in exception.Data.Keys)
        {
            text = text.Replace("{" + key + "}", exception.Data[key]?.ToString());
        }
        return text;
    }
}
