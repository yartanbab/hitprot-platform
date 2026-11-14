using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DataTransfers;
using Apya.Platform.DataTransfers.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Apya.Platform.Web.Transfer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Application.Dtos;
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
    public const string HistoryTab = "history";

    /// <summary>Geçmiş sekmesinde gösterilen en yeni kayıt sayısı.</summary>
    public const int HistorySize = 100;

    private readonly TransferAccess _access;
    private readonly ISettingManager _settingManager;
    private readonly IDataTransferRunAppService _runAppService;

    public IndexModel(TransferAccess access, ISettingManager settingManager, IDataTransferRunAppService runAppService)
    {
        _runAppService = runAppService;
        _access = access;
        _settingManager = settingManager;
    }

    public sealed record ModuleRow(TransferScreen Screen, string Name, bool CanImport);

    public sealed record ModuleGroup(string Name, List<ModuleRow> Rows);

    [BindProperty(SupportsGet = true)]
    public string? Tab { get; set; }

    public string ActiveTab => Tab is ImportTab or HistoryTab ? Tab : ExportTab;

    /// <summary>Geçmiş sekmesi: bu tarafın (host ya da kiracı) son işlemleri; modül adı sözlükten.</summary>
    public List<(DataTransferRunDto Run, string Module)> History { get; private set; } = [];

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

        if (ActiveTab == HistoryTab)
        {
            var runs = await _runAppService.GetListAsync(new PagedResultRequestDto { MaxResultCount = HistorySize });
            History = runs.Items
                .Select(r => (r, DataTransferModules.Find(r.ModuleKey) is { } module ? L[module.NameKey].Value : r.ModuleKey))
                .ToList();
        }
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
