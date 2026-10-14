using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Macros;
using Apya.Platform.Macros.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Macros;

/// <summary>
/// "Tüm haberler" (/Makro/Haberler, tasarım 1f): şeridin gösterdiği akışın tamamı, türe göre
/// süzülebilir. Akış <see cref="IMacroNewsAppService"/>'ten; her kaynak kendi kapısından geçer.
/// </summary>
[Authorize]
public class NewsModel : PlatformPageModel
{
    private readonly IMacroNewsAppService _news;

    public NewsModel(IMacroNewsAppService news)
    {
        _news = news;
    }

    /// <summary>Süzgeç: call · platform · result (boş = tümü). Bilinmeyen değer tümüne düşer.</summary>
    [BindProperty(SupportsGet = true)]
    public string? Kind { get; set; }

    public List<MacroNewsItemDto> All { get; private set; } = new();

    public MacroNewsKind? Selected =>
        Enum.TryParse<MacroNewsKind>(Kind, ignoreCase: true, out var kind) && Enum.IsDefined(kind) ? kind : null;

    public IEnumerable<MacroNewsItemDto> Items =>
        Selected is { } kind ? All.Where(item => item.Kind == kind) : All;

    public int CountOf(MacroNewsKind kind) => All.Count(item => item.Kind == kind);

    public async Task OnGetAsync()
    {
        All = await _news.GetListAsync(MacroNewsAppService.MaxResultCount);
    }

    /// <summary>Açık yönlendirme olmasın: yalnız "/x" biçimli uygulama yolu (sunucu da süzüyor).</summary>
    public static string SafeUrl(string? url)
        => url != null && url.StartsWith('/') && !url.StartsWith("//") && !url.StartsWith("/\\") ? url : "/Makro";
}
