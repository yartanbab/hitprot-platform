using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.DemoRequests;
using Apya.Platform.DemoRequests.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Admin.DemoRequests;

/// <summary>
/// Giriş ekranından gelen demo taleplerinin takip paneli. Kayıtlar host'a aittir
/// (kiracıya bağlı değildir), bu yüzden izin yalnız host "admin" rolüne tohumlanır.
/// </summary>
[Authorize(PlatformPermissions.DemoRequests.Default)]
public class IndexModel : PlatformPageModel
{
    private const int PageSize = 25;

    private readonly IDemoRequestAppService _demoRequestAppService;

    [BindProperty(SupportsGet = true)]
    public DemoRequestStatus? Status { get; set; }

    [BindProperty(SupportsGet = true)]
    public string? Filter { get; set; }

    [BindProperty(SupportsGet = true)]
    public int PageIndex { get; set; } = 1;

    public IReadOnlyList<DemoRequestDto> Items { get; private set; } = Array.Empty<DemoRequestDto>();

    public DemoRequestSummaryDto Summary { get; private set; } = new();

    public long TotalCount { get; private set; }

    public int TotalPages => TotalCount == 0 ? 1 : (int)Math.Ceiling(TotalCount / (double)PageSize);

    public IndexModel(IDemoRequestAppService demoRequestAppService)
    {
        _demoRequestAppService = demoRequestAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadAsync();
    }

    /// <summary>
    /// Takip durumunu ve iç notu kaydeder. Yetki <see cref="IDemoRequestAppService"/>
    /// tarafında (DemoRequests.Manage) ayrıca denetlenir.
    /// <para>
    /// Parametre <c>newStatus</c>, <c>status</c> DEĞİL: model bağlama alan adlarında
    /// büyük/küçük harfe DUYARSIZDIR ve form, süzgeci korumak için ayrıca
    /// <c>Status</c> gizli alanını taşır. Aynı adı kullansaydık iki değer tek
    /// parametreye düşer ve bağlama İLKİNİ alırdı — gizli alan formda seçiciden
    /// önce geldiği için satır, seçilen duruma değil SÜZGECİN durumuna geçerdi.
    /// (Ölçüldü: süzgeç "Yeni" iken satırı "İletişime geçildi" yapmak sessizce
    /// "Yeni" olarak kaydediyordu.)
    /// </para>
    /// </summary>
    public async Task<IActionResult> OnPostUpdateAsync(Guid id, DemoRequestStatus newStatus, string? adminNote)
    {
        await _demoRequestAppService.UpdateAsync(id, new UpdateDemoRequestDto
        {
            Status = newStatus,
            AdminNote = adminNote
        });

        TempData["Saved"] = true;

        return RedirectToPage(new { Status, Filter, PageIndex });
    }

    private async Task LoadAsync()
    {
        if (PageIndex < 1)
        {
            PageIndex = 1;
        }

        var result = await _demoRequestAppService.GetListAsync(new DemoRequestListFilterDto
        {
            Status = Status,
            Filter = Filter,
            MaxResultCount = PageSize,
            SkipCount = (PageIndex - 1) * PageSize
        });

        Items = result.Items;
        TotalCount = result.TotalCount;
        Summary = await _demoRequestAppService.GetSummaryAsync();
    }

    /// <summary>Rozet rengi — "yeni" göze çarpsın, kapanan sönsün.</summary>
    public static string StatusBadgeClass(DemoRequestStatus status) => status switch
    {
        DemoRequestStatus.New => "bg-primary",
        DemoRequestStatus.Contacted => "bg-warning text-dark",
        DemoRequestStatus.Closed => "bg-secondary",
        _ => "bg-secondary"
    };

}
