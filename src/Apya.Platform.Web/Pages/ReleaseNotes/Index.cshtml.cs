using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.ReleaseNotes;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.ReleaseNotes;

[Authorize]
public class IndexModel : AbpPageModel
{
    private readonly IReleaseNotePublicationAppService _publicationAppService;

    public IReadOnlyList<ReleaseNoteViewDto> Releases { get; private set; } = new List<ReleaseNoteViewDto>();

    /// <summary>Host'a gösterilen onay bekleyen madde sayısı (kiracıda daima 0).</summary>
    public int PendingCount { get; private set; }

    /// <summary>Yayın onayı ekranına bağlantı basılsın mı?</summary>
    public bool CanManage { get; private set; }

    public IndexModel(IReleaseNotePublicationAppService publicationAppService)
    {
        _publicationAppService = publicationAppService;
    }

    public async Task OnGetAsync()
    {
        Releases = await _publicationAppService.GetHistoryAsync();
        PendingCount = Releases.Sum(r => r.Items.Count(i => i.IsPendingApproval));
        CanManage = await AuthorizationService.IsGrantedAsync(PlatformPermissions.ReleaseNotes.Manage);

        // Bu sayfayı görmek = en yeni sürümü görmek → görülme işaretle (pencere tekrar açılmasın).
        await _publicationAppService.MarkSeenAsync();
    }
}
