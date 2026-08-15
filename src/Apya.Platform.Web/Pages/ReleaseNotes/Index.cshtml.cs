using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using Apya.Platform.Web.ReleaseNotes;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Web.Pages.ReleaseNotes;

[Authorize]
public class IndexModel : AbpPageModel
{
    private readonly ISettingManager _settingManager;

    public IReadOnlyList<ReleaseNote> Releases { get; private set; } = new List<ReleaseNote>();

    public IndexModel(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    public async Task OnGetAsync()
    {
        Releases = ReleaseNoteCatalog.All;

        // Bu sayfayı görmek = en yeni sürümü görmek → görülme işaretle (popup tekrar açılmasın).
        if (CurrentUser.IsAuthenticated)
        {
            await _settingManager.SetForCurrentUserAsync(
                PlatformSettings.ReleaseNotes.LastSeenVersion, ReleaseNoteCatalog.Latest.Version);
        }
    }
}
