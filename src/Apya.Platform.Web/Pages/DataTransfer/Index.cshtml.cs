using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Apya.Platform.Web.Transfer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Web.Pages.DataTransfer;

/// <summary>
/// İçe / Dışa Aktarma çalışma alanı: kişinin görebildiği bütün modüllerin aktarım uçları tek yerde.
/// Liste <see cref="TransferCatalog"/>'dan gelir; host yalnız host'ta, kiracı yalnız kiracıda yaşayan
/// modülleri görür. Sayfa veri okumaz — her işlem modülün kendi ucuna gider, izinleri ve kiracı
/// süzgeci orada uygulanır.
/// </summary>
[Authorize]
public class IndexModel : PlatformPageModel
{
    public const string ExportTab = "export";
    public const string ImportTab = "import";

    private readonly TransferAccess _access;
    private readonly ISettingManager _settingManager;

    public IndexModel(TransferAccess access, ISettingManager settingManager)
    {
        _access = access;
        _settingManager = settingManager;
    }

    public sealed record ModuleRow(TransferScreen Screen, string Name, bool CanImport);

    public sealed record ModuleGroup(string Name, List<ModuleRow> Rows);

    [BindProperty(SupportsGet = true)]
    public string? Tab { get; set; }

    public string ActiveTab => Tab == ImportTab ? ImportTab : ExportTab;

    public List<ModuleGroup> Groups { get; private set; } = [];

    /// <summary>"Tek anahtar" açık mı (aktarım izinleri denetleniyor mu)?</summary>
    public bool Enforced { get; private set; }

    /// <summary>Anahtarı yalnız host, ilgili izinle çevirir.</summary>
    public bool CanManageAccess { get; private set; }

    public async Task<IActionResult> OnGetAsync()
    {
        if (!await _access.IsGrantedAsync(PlatformPermissions.DataTransfer.Default))
        {
            return Forbid();
        }

        var host = CurrentTenant.Id == null;
        var canExport = await _access.CanAsync(TransferDirection.Export);
        var canImport = await _access.CanAsync(TransferDirection.Import);

        var rows = new List<(string Group, ModuleRow Row)>();
        foreach (var screen in TransferCatalog.Screens.Where(s => s.Module.IsOn(host)))
        {
            var module = screen.Module;
            if (!await AuthorizationService.IsGrantedAsync(module.Permission))
            {
                continue;
            }

            var importable = canImport && screen.HasImport
                && (module.ImportPermission == null || await AuthorizationService.IsGrantedAsync(module.ImportPermission));
            if ((canExport && screen.HasExport) || importable)
            {
                rows.Add((screen.Group, new ModuleRow(screen, L[module.NameKey], importable)));
            }
        }

        Groups = rows.GroupBy(r => r.Group)
            .Select(g => new ModuleGroup(L[g.Key], g.Select(r => r.Row).ToList()))
            .ToList();
        CanExport = canExport;
        Enforced = await _access.IsEnforcedAsync();
        CanManageAccess = host && await AuthorizationService.IsGrantedAsync(PlatformPermissions.DataTransfer.ManageAccess);
        return Page();
    }

    public bool CanExport { get; private set; }

    /// <summary>"Tek anahtar"ı çevirir; ayar geneldir, bütün kiracıları etkiler.</summary>
    public async Task<IActionResult> OnPostAccessAsync(bool enforce)
    {
        if (CurrentTenant.Id != null || !await AuthorizationService.IsGrantedAsync(PlatformPermissions.DataTransfer.ManageAccess))
        {
            return Forbid();
        }

        await _settingManager.SetGlobalAsync(PlatformSettings.DataTransfer.EnforcePermissions, enforce ? "true" : "false");
        return RedirectToPage(new { tab = Tab });
    }
}
