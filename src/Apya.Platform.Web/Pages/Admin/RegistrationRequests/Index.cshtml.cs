using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;

namespace Apya.Platform.Web.Pages.Admin.RegistrationRequests;

/// <summary>
/// Giriş ekranından gelen kayıt taleplerinin değerlendirme paneli. Kayıtlar host'a
/// aittir (kiracıya bağlı değildir), bu yüzden izin yalnız host "admin" rolüne
/// tohumlanır.
/// </summary>
[Authorize(PlatformPermissions.RegistrationRequests.Default)]
public class IndexModel : PlatformPageModel
{
    private const int PageSize = 25;

    private readonly IRegistrationRequestAppService _registrationRequestAppService;

    [BindProperty(SupportsGet = true)]
    public RegistrationRequestStatus? Status { get; set; }

    [BindProperty(SupportsGet = true)]
    public string? Filter { get; set; }

    [BindProperty(SupportsGet = true)]
    public int PageIndex { get; set; } = 1;

    public IReadOnlyList<RegistrationRequestDto> Items { get; private set; } = Array.Empty<RegistrationRequestDto>();

    public RegistrationRequestSummaryDto Summary { get; private set; } = new();

    public long TotalCount { get; private set; }

    public int TotalPages => TotalCount == 0 ? 1 : (int)Math.Ceiling(TotalCount / (double)PageSize);

    public IndexModel(IRegistrationRequestAppService registrationRequestAppService)
    {
        _registrationRequestAppService = registrationRequestAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadAsync();
    }

    /// <summary>
    /// Kayıt talepleri (.xlsx), ekrandaki durum ve arama süzgeciyle. IP adresi bilerek dışarıda:
    /// dosya e-postayla dolaşabilir, IP değerlendirme için gerekmiyor.
    /// </summary>
    public async Task<IActionResult> OnGetExcelAsync()
    {
        var rows = await ExcelTable.CollectAsync((skip, take) => _registrationRequestAppService.GetListAsync(new RegistrationRequestListFilterDto
        {
            Status = Status,
            Filter = Filter,
            SkipCount = skip,
            MaxResultCount = take
        }));

        var columns = new List<ExcelColumn<RegistrationRequestDto>>
        {
            new(L["Export:Col:Reference"], r => r.Reference),
            new(L["Export:Col:Date"], r => r.CreationTime, "dd.MM.yyyy"),
            new(L["Export:Col:Firm"], r => r.CompanyName),
            new(L["Export:Col:CompanyType"], r => L[$"RegistrationRequest:CompanyType:{r.CompanyType}"].Value),
            new(L["Export:Col:TaxNumber"], r => r.TaxNumber),
            new(L["Export:Col:ContactName"], r => r.FullName),
            new(L["Export:Col:Email"], r => r.Email),
            new(L["Export:Col:Phone"], r => r.Phone),
            new(L["Export:Col:Plan"], r => L[$"RegistrationRequest:Plan:{r.EffectivePlan}"].Value),
            new(L["Export:Col:OfferedAmount"], r => r.OfferedAmount),
            new(L["Export:Col:Status"], r => L[$"RegistrationRequest:Status:{r.Status}"].Value),
            new(L["Export:Col:Note"], r => r.AdminNote),
        };

        var name = L["Export:RegistrationRequests:Name"].Value;
        var note = rows.Truncated ? L["Export:Truncated", ExcelTable.MaxRows].Value : null;
        return File(ExcelTable.Build(name, columns, rows.Items, note), ExcelTable.ContentType, ExcelTable.FileName(name, Clock.Now));
    }

    /// <summary>
    /// Değerlendirme kararını kaydeder. Yetki <see cref="IRegistrationRequestAppService"/>
    /// tarafında (RegistrationRequests.Manage) ayrıca denetlenir.
    /// <para>
    /// Parametre <c>newStatus</c>, <c>status</c> DEĞİL: model bağlama alan adlarında
    /// büyük/küçük harfe DUYARSIZDIR ve form, süzgeci korumak için ayrıca
    /// <c>Status</c> gizli alanını taşır. Aynı adı kullansaydık iki değer tek
    /// parametreye düşer ve bağlama İLKİNİ alırdı — gizli alan formda seçiciden
    /// önce geldiği için satır, seçilen duruma değil SÜZGECİN durumuna geçerdi.
    /// (Demo talebi panelinde ölçüldü; aynı tuzak buraya taşınmasın.)
    /// </para>
    /// <para>
    /// <c>offeredAmount</c> elle <c>name=</c> ile yazıldığı için sayfada yanında
    /// <c>__Invariant</c> işaretçisi vardır — onsuz tr-TR bağlaması noktayı binlik
    /// ayracı sayar ve tutar bin kat sapar.
    /// </para>
    /// </summary>
    public async Task<IActionResult> OnPostUpdateAsync(
        Guid id,
        RegistrationRequestStatus newStatus,
        SalesPlan? approvedPlan,
        decimal? offeredAmount,
        string? adminNote)
    {
        await _registrationRequestAppService.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = newStatus,
            ApprovedPlan = approvedPlan,
            OfferedAmount = offeredAmount,
            AdminNote = adminNote
        });

        TempData["Saved"] = true;

        return RedirectToPage(new { Status, Filter, PageIndex });
    }

    /// <summary>
    /// Protokol adımının davet bağlantısını üretir.
    /// <para>
    /// 🔐 Ham jeton veritabanında DURMAZ; yalnız burada, bir kez, host'un ekranına düşer.
    /// Bağlantı <c>TempData</c> ile taşınır: sorgu dizesine konsaydı tarayıcı geçmişine ve
    /// sunucu erişim loglarına yazılır, oradan da yetkisiz birine ulaşabilirdi.
    /// </para>
    /// </summary>
    public async Task<IActionResult> OnPostIssueInviteAsync(Guid id)
    {
        await IssueInviteAsync(id);
        return RedirectToPage(new { Status, Filter, PageIndex });
    }

    /// <summary>
    /// K-03 · Karar ve davet tek adımda: talep formdaki paket, bedel ve notla "Onaylandı" kaydedilir, davet
    /// bağlantısı aynı istekte üretilip postalanır. Eskiden önce durum seçilip kaydediliyor, sonra ayrı
    /// formdan davet üretiliyordu; ikinci adım unutulunca aday bekliyordu.
    /// </summary>
    public async Task<IActionResult> OnPostApproveAndInviteAsync(
        Guid id,
        SalesPlan? approvedPlan,
        decimal? offeredAmount,
        string? adminNote)
    {
        await _registrationRequestAppService.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            ApprovedPlan = approvedPlan,
            OfferedAmount = offeredAmount,
            AdminNote = adminNote
        });

        TempData["Saved"] = true;
        await IssueInviteAsync(id);
        return RedirectToPage(new { Status, Filter, PageIndex });
    }

    private async Task IssueInviteAsync(Guid id)
    {
        try
        {
            var invite = await _registrationRequestAppService.IssueInviteAsync(id);
            var url = Url.Page("/Account/Protokol", null, new { token = invite.Token }, Request.Scheme)!;

            TempData["InviteLink"] = url;
            TempData["InviteExpiresAt"] = invite.ExpiresAt.ToString("dd.MM.yyyy");
            TempData["InviteRequestId"] = id.ToString();

            // E-posta BAŞARISIZ olsa da bağlantı ekranda kalır: host'un elinde geçerli bir
            // davet var, gönderim düştü diye onu kaybetmemeli.
            TempData["InviteMailSent"] = await _registrationRequestAppService.SendInviteMailAsync(id, url);
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.RegistrationRequestNotApproved)
        {
            TempData["InviteError"] = "Davet bağlantısı yalnız ONAYLANMIŞ talep için üretilebilir. Önce durumu \"Onaylandı\" yapın.";
        }
    }

    private async Task LoadAsync()
    {
        if (PageIndex < 1)
        {
            PageIndex = 1;
        }

        var result = await _registrationRequestAppService.GetListAsync(new RegistrationRequestListFilterDto
        {
            Status = Status,
            Filter = Filter,
            MaxResultCount = PageSize,
            SkipCount = (PageIndex - 1) * PageSize
        });

        Items = result.Items;
        TotalCount = result.TotalCount;
        Summary = await _registrationRequestAppService.GetSummaryAsync();
    }

    /// <summary>Rozet rengi — bekleyen göze çarpsın, sonuçlanan sönsün.</summary>
    public static string StatusBadgeClass(RegistrationRequestStatus status) => status switch
    {
        RegistrationRequestStatus.New => "bg-primary",
        RegistrationRequestStatus.InReview => "bg-warning text-dark",
        RegistrationRequestStatus.Approved => "bg-success",
        RegistrationRequestStatus.Rejected => "bg-danger",
        RegistrationRequestStatus.AwaitingProtocol => "bg-info text-dark",
        RegistrationRequestStatus.AccountCreated => "bg-dark",
        RegistrationRequestStatus.Closed => "bg-secondary",
        _ => "bg-secondary"
    };

    /// <summary>
    /// Host'un ELLE seçebileceği durumlar. Protokol bekleme ve hesap açıldı durumları
    /// akışa aittir: elle "hesap açıldı" işaretlemek, ortada kiracı yokken süreci bitmiş
    /// gösterir ve davet bağlantısı üretmeyi de kilitlerdi.
    /// </summary>
    public static readonly RegistrationRequestStatus[] SelectableStatuses =
    {
        RegistrationRequestStatus.New,
        RegistrationRequestStatus.InReview,
        RegistrationRequestStatus.Approved,
        RegistrationRequestStatus.Rejected,
        RegistrationRequestStatus.Closed
    };
}
