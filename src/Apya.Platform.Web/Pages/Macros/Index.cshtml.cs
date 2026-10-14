using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
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

    public async Task OnGetAsync()
    {
        Screen = await _launcher.GetAsync();
    }
}
