using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Macros;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Apya.Platform.Web.Menus;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Admin.Macros;

/// <summary>
/// Host: Makro Ekran yönetimi (/Admin/Macros, tasarım docs/design/makro-ekran 2a). Varsayılan açık
/// model: katalogdaki her makro bir satır; host gizler, yeniden adlandırır, kapsamı daraltır, sıralar,
/// varsayılan sabitler. Liste ve kayıt istemcide (IMacroAdminAppService); sayfa yalnız iskeleti ve
/// seçenek listelerini basar.
/// </summary>
[Authorize(PlatformPermissions.Macros.Manage)]
public class IndexModel : PlatformPageModel
{
    private readonly PlatformNavigationResolver _navigation;

    public IndexModel(PlatformNavigationResolver navigation)
    {
        _navigation = navigation;
    }

    /// <summary>Kapsam seçimi için paketler.</summary>
    public IReadOnlyList<PackageCode> Packages { get; } = Enum.GetValues<PackageCode>();

    /// <summary>Rol adı önerileri: kiracı rol şablonları + yönetici. Serbest ad da yazılabilir.</summary>
    public IReadOnlyList<string> RoleSuggestions { get; } =
        new[] { "admin" }.Concat(TenantRoleTemplates.All.Select(t => t.Name)).ToList();

    /// <summary>
    /// Menüye bağlı makroların ikonu ve adresi menüde yaşar (Application katmanı menüyü bilmez).
    /// Host'un görebildiği menü bağlantılarından çözülür; kiracıya özgü menüde ikon yedeğe düşer.
    /// </summary>
    public Dictionary<string, MenuLinkInfo> MenuLinks { get; private set; } = new();

    public async Task<IActionResult> OnGetAsync()
    {
        // İzin host-only tanımlı; kiracı bağlamında yine de açılmasın (servis de reddeder).
        if (CurrentTenant.Id != null)
        {
            return Forbid();
        }

        var links = await _navigation.GetGrantedLinksAsync();
        MenuLinks = MacroCatalog.All
            .Where(d => d.MenuName != null && links.ContainsKey(d.MenuName))
            .ToDictionary(d => d.MenuName!, d => new MenuLinkInfo(links[d.MenuName!].Icon, links[d.MenuName!].Url));

        return Page();
    }

    public record MenuLinkInfo(string? Icon, string? Url);
}
