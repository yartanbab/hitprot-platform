using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Billing;
using Apya.Platform.Billing.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Apya.Platform.Web.Billing;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Pages.Admin.Billing;

/// <summary>
/// Host'un kiracıya kestiği faturaların takip paneli: fatura açma, resmî belgeyi ekleme,
/// tahsilat kaydetme ve kiracının dekont beyanını onaylama.
///
/// <para>Kayıtlar host'a aittir; izin yalnız host "admin" rolüne tohumlanır.</para>
/// </summary>
[Authorize(PlatformPermissions.Billing.Default)]
public class IndexModel : PlatformPageModel
{
    private const int PageSize = 25;

    private readonly IBillingAppService _billingAppService;
    private readonly ITenantProfileAppService _tenantProfileAppService;
    private readonly BillingFileStorage _fileStorage;

    [BindProperty(SupportsGet = true)]
    public Guid? TenantId { get; set; }

    [BindProperty(SupportsGet = true)]
    public SubscriptionInvoiceStatus? Status { get; set; }

    [BindProperty(SupportsGet = true)]
    public bool OnlyOverdue { get; set; }

    [BindProperty(SupportsGet = true)]
    public bool OnlyPendingDeclaration { get; set; }

    [BindProperty(SupportsGet = true)]
    public string? Filter { get; set; }

    [BindProperty(SupportsGet = true)]
    public int PageIndex { get; set; } = 1;

    /// <summary>Yeni fatura formu.</summary>
    [BindProperty]
    public CreateSubscriptionInvoiceDto NewInvoice { get; set; } = new();

    public IReadOnlyList<SubscriptionInvoiceDto> Items { get; private set; } = Array.Empty<SubscriptionInvoiceDto>();

    public BillingSummaryDto Summary { get; private set; } = new();

    public List<SelectListItem> TenantOptions { get; private set; } = new();

    public long TotalCount { get; private set; }

    public int TotalPages => TotalCount == 0 ? 1 : (int)Math.Ceiling(TotalCount / (double)PageSize);

    public IndexModel(
        IBillingAppService billingAppService,
        ITenantProfileAppService tenantProfileAppService,
        BillingFileStorage fileStorage)
    {
        _billingAppService = billingAppService;
        _tenantProfileAppService = tenantProfileAppService;
        _fileStorage = fileStorage;
    }

    public async Task OnGetAsync()
    {
        await LoadAsync();
    }

    /// <summary>
    /// Resmî belgeyi indirir. Kayıt duruyor ama dosya diskte yoksa 404 — 2026-08-31'de
    /// yüklenen dosyalar bir deploy sırasında kaybolmuştu; bu durumda sayfa çökmemeli.
    /// </summary>
    public async Task<IActionResult> OnGetDownloadAsync(Guid id)
    {
        var invoice = await _billingAppService.GetAsync(id);
        var path = _fileStorage.ResolveExistingPath(await _billingAppService.GetStoredDocumentNameAsync(id));

        return path == null
            ? NotFound()
            : PhysicalFile(path, BillingFileStorage.ContentType(invoice.FileName), invoice.FileName);
    }

    /// <summary>Kiracının yüklediği dekontu indirir.</summary>
    public async Task<IActionResult> OnGetDownloadReceiptAsync(Guid id, Guid paymentId)
    {
        var invoice = await _billingAppService.GetAsync(id);
        var payment = invoice.Payments.FirstOrDefault(p => p.Id == paymentId);

        if (payment == null)
        {
            return NotFound();
        }

        var path = _fileStorage.ResolveExistingPath(await _billingAppService.GetStoredReceiptNameAsync(id, paymentId));

        return path == null
            ? NotFound()
            : PhysicalFile(path, BillingFileStorage.ContentType(payment.FileName), payment.FileName);
    }

    public async Task<IActionResult> OnPostCreateAsync()
    {
        if (!ModelState.IsValid)
        {
            await LoadAsync();
            return Page();
        }

        try
        {
            await _billingAppService.CreateAsync(NewInvoice);
            TempData["BillingSaved"] = "Fatura açıldı.";
        }
        catch (BusinessException ex)
        {
            TempData["BillingError"] = FriendlyMessage(ex);
        }

        return RedirectToPage(RouteValues());
    }

    public async Task<IActionResult> OnPostAttachAsync(Guid id, IFormFile? file)
    {
        try
        {
            var saved = await _fileStorage.SaveAsync(file);
            await _billingAppService.AttachDocumentAsync(id, saved);
            TempData["BillingSaved"] = "Fatura belgesi yüklendi.";
        }
        catch (BusinessException ex)
        {
            TempData["BillingError"] = FriendlyMessage(ex);
        }

        return RedirectToPage(RouteValues());
    }

    /// <summary>
    /// Host'un kaydettiği tahsilat DOĞRUDAN onaylıdır (banka ekstresine bakarak giriliyor).
    /// <para>
    /// Alan adları <c>payment*</c> ön ekli: sayfa süzgeç değerlerini de gizli alanlarla
    /// taşıyor ve model bağlama alan adlarında büyük/küçük harfe DUYARSIZ — aynı adı
    /// kullanmak süzgecin değerini forma sızdırırdı.
    /// </para>
    /// </summary>
    public async Task<IActionResult> OnPostRecordPaymentAsync(
        Guid id,
        DateTime paymentPaidAt,
        decimal paymentAmount,
        PaymentMethod paymentMethod,
        string? paymentReference)
    {
        try
        {
            await _billingAppService.RecordPaymentAsync(id, new RecordPaymentDto
            {
                PaidAt = paymentPaidAt,
                Amount = paymentAmount,
                Method = paymentMethod,
                Reference = paymentReference
            });
            TempData["BillingSaved"] = "Tahsilat kaydedildi.";
        }
        catch (BusinessException ex)
        {
            TempData["BillingError"] = FriendlyMessage(ex);
        }

        return RedirectToPage(RouteValues());
    }

    public async Task<IActionResult> OnPostConfirmPaymentAsync(Guid id, Guid paymentId)
    {
        try
        {
            await _billingAppService.ConfirmPaymentAsync(id, paymentId);
            TempData["BillingSaved"] = "Tahsilat onaylandı.";
        }
        catch (BusinessException ex)
        {
            TempData["BillingError"] = FriendlyMessage(ex);
        }

        return RedirectToPage(RouteValues());
    }

    public async Task<IActionResult> OnPostRemovePaymentAsync(Guid id, Guid paymentId)
    {
        try
        {
            await _billingAppService.RemovePaymentAsync(id, paymentId);
            TempData["BillingSaved"] = "Tahsilat kaydı silindi.";
        }
        catch (BusinessException ex)
        {
            TempData["BillingError"] = FriendlyMessage(ex);
        }

        return RedirectToPage(RouteValues());
    }

    public async Task<IActionResult> OnPostCancelAsync(Guid id)
    {
        try
        {
            await _billingAppService.CancelAsync(id);
            TempData["BillingSaved"] = "Fatura iptal edildi.";
        }
        catch (BusinessException ex)
        {
            TempData["BillingError"] = FriendlyMessage(ex);
        }

        return RedirectToPage(RouteValues());
    }

    private async Task LoadAsync()
    {
        if (PageIndex < 1)
        {
            PageIndex = 1;
        }

        var result = await _billingAppService.GetListAsync(new SubscriptionInvoiceFilterDto
        {
            TenantId = TenantId,
            Status = Status,
            OnlyOverdue = OnlyOverdue,
            OnlyPendingDeclaration = OnlyPendingDeclaration,
            Filter = Filter,
            MaxResultCount = PageSize,
            SkipCount = (PageIndex - 1) * PageSize
        });

        Items = result.Items;
        TotalCount = result.TotalCount;
        Summary = await _billingAppService.GetSummaryAsync();

        var tenants = await _tenantProfileAppService.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 });
        TenantOptions = tenants.Items
            .OrderBy(t => t.TenantName)
            .Select(t => new SelectListItem(t.TenantName, t.TenantId.ToString()))
            .ToList();

        if (NewInvoice.IssueDate == null)
        {
            NewInvoice.IssueDate = DateTime.Today;
        }
    }

    /// <summary>Süzgeci koruyan yönlendirme değerleri — kaydettikten sonra liste kaymasın.</summary>
    private object RouteValues()
        => new { TenantId, Status, OnlyOverdue, OnlyPendingDeclaration, Filter, PageIndex };

    private string FriendlyMessage(BusinessException ex)
    {
        if (string.IsNullOrWhiteSpace(ex.Code))
        {
            return ex.Message;
        }

        var localized = L[ex.Code];

        return localized.ResourceNotFound ? ex.Message : localized.Value;
    }

    public static string StatusBadgeClass(SubscriptionInvoiceDto invoice)
    {
        if (invoice.Status == SubscriptionInvoiceStatus.Cancelled) return "bg-secondary";
        if (invoice.Status == SubscriptionInvoiceStatus.Paid) return "bg-success";
        if (invoice.IsOverdue) return "bg-danger";
        return invoice.Status == SubscriptionInvoiceStatus.PartiallyPaid ? "bg-warning text-dark" : "bg-primary";
    }
}
