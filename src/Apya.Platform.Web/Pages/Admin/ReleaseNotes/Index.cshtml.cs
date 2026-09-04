using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.ReleaseNotes;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.ReleaseNotes;

/// <summary>
/// Sürüm notu yayın onayı (host). Katalogdaki her madde için "yayınlansın mı, nerede
/// görünsün, hangi pakete ve kime" kararı burada verilir. Karar verilmemiş madde
/// kullanıcılara GİTMEZ; host onu bu ekranda ve kendi ekranlarında rozetle görür.
/// </summary>
[Authorize(PlatformPermissions.ReleaseNotes.Manage)]
public class IndexModel : AbpPageModel
{
    private readonly IReleaseNotePublicationAppService _publicationAppService;

    public IndexModel(IReleaseNotePublicationAppService publicationAppService)
    {
        _publicationAppService = publicationAppService;
    }

    /// <summary>Ekranın çizimi için katalog + mevcut kararlar (yalnız GET'te dolar).</summary>
    public IReadOnlyList<ReleaseNoteAdminDto> Releases { get; private set; } = new List<ReleaseNoteAdminDto>();

    public int PendingCount { get; private set; }

    /// <summary>Form gövdesi — katalog sırasıyla düz liste; ekranda sürüm sürüm gruplanır.</summary>
    [BindProperty]
    public List<ItemInput> Items { get; set; } = new();

    public async Task OnGetAsync()
    {
        Releases = await _publicationAppService.GetForManagementAsync();
        PendingCount = Releases.Sum(r => r.Items.Count(i => i.IsPending));

        Items = Releases
            .SelectMany(r => r.Items.Select(i => new ItemInput
            {
                Version = r.Version,
                ItemKey = i.Key,
                IsApproved = i.IsApproved,
                ShowInModal = i.ShowInModal,
                ShowInHistory = i.ShowInHistory,
                Basic = i.Packages.Contains(PackageCode.Basic),
                Standard = i.Packages.Contains(PackageCode.Standard),
                Premium = i.Packages.Contains(PackageCode.Premium),
                Enterprise = i.Packages.Contains(PackageCode.Enterprise),
                Audience = i.Audience
            }))
            .ToList();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _publicationAppService.SaveAsync(new SaveReleaseNotePublicationsInput
        {
            Items = Items.Select(i => new ReleaseNotePublicationInput
            {
                Version = i.Version,
                ItemKey = i.ItemKey,
                IsApproved = i.IsApproved,
                ShowInModal = i.ShowInModal,
                ShowInHistory = i.ShowInHistory,
                Packages = i.SelectedPackages(),
                Audience = i.Audience
            }).ToList()
        });

        return RedirectToPage();
    }

    public class ItemInput
    {
        public string Version { get; set; } = string.Empty;
        public string ItemKey { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public bool ShowInModal { get; set; }
        public bool ShowInHistory { get; set; }

        // Paketler ayrı bool alan: çoklu seçim listesi yerine dört onay kutusu, böylece
        // asp-for gizli "false" alanını kendisi üretir (işaretsiz kutu POST'a girmez).
        public bool Basic { get; set; }
        public bool Standard { get; set; }
        public bool Premium { get; set; }
        public bool Enterprise { get; set; }

        public ReleaseNoteAudience Audience { get; set; }

        public List<PackageCode> SelectedPackages()
        {
            var list = new List<PackageCode>();
            if (Basic) list.Add(PackageCode.Basic);
            if (Standard) list.Add(PackageCode.Standard);
            if (Premium) list.Add(PackageCode.Premium);
            if (Enterprise) list.Add(PackageCode.Enterprise);
            return list;
        }
    }
}
