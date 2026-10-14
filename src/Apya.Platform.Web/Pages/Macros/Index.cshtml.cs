using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Macros;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Macros;

/// <summary>
/// Makro Ekran (/Makro) — sık işleri tek tıkla başlatan ekran. Tasarım:
/// docs/design/makro-ekran (kararlar uygulama-notlari.md'de).
///
/// <para>Genel Bakış gibi yalnız oturum ister; her makro kendi izniyle süzülür
/// (<see cref="MacroLauncher"/>). Kartlar sunucuda basılır: yetkisi olmayan makro
/// sayfaya hiç girmez, istemci yalnız tıklamayı ve sabitlemeyi yönetir.</para>
///
/// <para>Paneller (bildirimler, bana ait kayıtlar, bekleyen işler) istemcide mevcut uçlardan
/// dolar. HANGİ kaynağın çekileceğine burada karar verilir: istemci izni ve host/kiracı tarafını
/// ikinci kez yorumlamaz, yasak bir uca istek atıp 403 almaz.</para>
/// </summary>
[Authorize]
public class IndexModel : PlatformPageModel
{
    /// <summary>"Senin için" şeridindeki kart sayısı (şartname: 4 + 12).</summary>
    public const int ForYouCount = 4;

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly MacroLauncher _launcher;

    public IndexModel(MacroLauncher launcher)
    {
        _launcher = launcher;
    }

    public MacroScreen Screen { get; private set; } = new();

    public IReadOnlyList<MacroItem> ForYou => Screen.Items.Take(ForYouCount).ToList();

    public IReadOnlyList<MacroItem> Rest => Screen.Items.Skip(ForYouCount).ToList();

    /// <summary>İstemcinin sabitleme listesini bütün olarak geri yazabilmesi için (bkz. Index.js).</summary>
    public string PinStateJson => JsonSerializer.Serialize(
        new { pins = Screen.Pins, max = Screen.MaxPins }, JsonOptions);

    /// <summary>"Bana ait kayıtlar" grupları: projects · interests · applications.</summary>
    public List<string> RecordGroups { get; } = new();

    /// <summary>
    /// "Bekleyen işler" kaynakları: overdueTasks · grantInterests · grantApplications (kabuk
    /// rozetleri, ek istek yok) · grantToday · draftInvoices.
    /// </summary>
    public List<string> PendingSources { get; } = new();

    /// <summary>Panel kararına giren izinler — sayfa bunları bir kez sorar, karar saf fonksiyonda.</summary>
    public static readonly string[] PanelPermissions =
    {
        PlatformPermissions.Projects.Default,
        PlatformPermissions.Grants.Default,
        PlatformPermissions.Grants.Edit,
        PlatformPermissions.Tasks.Default,
        PlatformPermissions.Invoices.Default
    };

    public async Task OnGetAsync()
    {
        Screen = await _launcher.GetAsync();

        var granted = new HashSet<string>();
        foreach (var permission in PanelPermissions)
        {
            if (await AuthorizationService.IsGrantedAsync(permission))
            {
                granted.Add(permission);
            }
        }

        var (groups, sources) = ResolvePanels(CurrentTenant.Id == null, granted);
        RecordGroups.AddRange(groups);
        PendingSources.AddRange(sources);
    }

    /// <summary>
    /// Hangi kayıt grubunun ve bekleyen iş sayacının basılacağı. Kaynağın kendi kapısıyla AYNI:
    /// kiracı tarafı hibe ekranları Grants.Default, host tarafı ek olarak Grants.Edit ister
    /// (GrantTodayAppService, GrantInterestHostAppService); taslak fatura sayısı Genel Bakış'ın onay
    /// kartından gelir ve o servis Projects.Default ister. Yetkisiz kullanıcıya "0" basmak yanlış söz
    /// olurdu — hücre hiç basılmaz.
    /// </summary>
    public static (List<string> Groups, List<string> Sources) ResolvePanels(bool isHost, IReadOnlySet<string> granted)
    {
        var canProjects = granted.Contains(PlatformPermissions.Projects.Default);
        var canGrants = granted.Contains(PlatformPermissions.Grants.Default);
        var grantsTenant = !isHost && canGrants;
        var grantsHost = isHost && canGrants && granted.Contains(PlatformPermissions.Grants.Edit);

        var groups = new List<string>();
        if (canProjects) { groups.Add("projects"); }
        if (grantsTenant) { groups.AddRange(new[] { "interests", "applications" }); }

        // Kabuk rozetleri (geciken görevlerim, talepler, başvurular) ShellAppService'in kendi
        // kapısından geçer; burada yalnız hücrenin basılıp basılmayacağına bakılır.
        var sources = new List<string>();
        if (granted.Contains(PlatformPermissions.Tasks.Default)) { sources.Add("overdueTasks"); }
        if (grantsHost) { sources.AddRange(new[] { "grantInterests", "grantApplications" }); }
        if (grantsTenant || grantsHost) { sources.Add("grantToday"); }
        if (canProjects && granted.Contains(PlatformPermissions.Invoices.Default)) { sources.Add("draftInvoices"); }

        return (groups, sources);
    }
}
