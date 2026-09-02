using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Hibeler;

/// <summary>
/// 1f · Kamuya açık hibe arama motoru.
///
/// <para>Sunucuda render edilir ve süzgeçler GET ile taşınır: sayfa arama
/// motorlarına açık, paylaşılan bağlantı aynı sonucu getirir ve JavaScript
/// kapalıyken de çalışır.</para>
/// </summary>
[AllowAnonymous]
public class IndexModel : AbpPageModel
{
    private readonly IGrantPublicAppService _public;

    public IndexModel(IGrantPublicAppService publicService)
    {
        _public = publicService;
    }

    [BindProperty(SupportsGet = true, Name = "q")]
    public string? Query { get; set; }

    [BindProperty(SupportsGet = true, Name = "kurum")]
    public List<string> Issuers { get; set; } = new();

    [BindProperty(SupportsGet = true, Name = "min")]
    public decimal? MinAmount { get; set; }

    [BindProperty(SupportsGet = true, Name = "max")]
    public decimal? MaxAmount { get; set; }

    [BindProperty(SupportsGet = true, Name = "gun")]
    public int? DeadlineWithinDays { get; set; }

    [BindProperty(SupportsGet = true, Name = "olcek")]
    public List<CompanySize> Sizes { get; set; } = new();

    [BindProperty(SupportsGet = true, Name = "zorluk")]
    public List<int> Difficulties { get; set; } = new();

    public GrantPublicSearchResultDto Result { get; private set; } = new();

    public async Task OnGetAsync()
    {
        Result = await _public.SearchAsync(new GrantPublicSearchInput
        {
            Query = Query,
            Issuers = Issuers,
            MinAmount = MinAmount,
            MaxAmount = MaxAmount,
            DeadlineWithinDays = DeadlineWithinDays,
            Sizes = Sizes,
            Difficulties = Difficulties
        });
    }

    public bool HasFilter =>
        !string.IsNullOrWhiteSpace(Query) || Issuers.Count > 0 || MinAmount.HasValue
        || MaxAmount.HasValue || DeadlineWithinDays.HasValue || Sizes.Count > 0 || Difficulties.Count > 0;
}
