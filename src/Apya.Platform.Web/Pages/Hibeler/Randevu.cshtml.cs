using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Hibeler;

/// <summary>
/// 5b · Randevu ekranı — 1g CTA'sının vardığı yer.
///
/// <para>🔴 MÜSAİTLİK TAKVİMİ YOK: repoda danışman müsaitliği tutulmuyor.
/// Ziyaretçi bir gün/saat TERCİHİ bildirir, onay danışmandan gelir. Boş görünen
/// slot listesi göstermek, dolu olabilecek bir saati "ayrıldı" sanmasına yol
/// açardı — ekran bunu açıkça yazıyor.</para>
/// </summary>
[AllowAnonymous]
public class RandevuModel : AbpPageModel
{
    private readonly IGrantPublicAppService _public;

    public RandevuModel(IGrantPublicAppService publicService)
    {
        _public = publicService;
    }

    [BindProperty(SupportsGet = true, Name = "lead")]
    public Guid LeadId { get; set; }

    public GrantMeetingPrefillDto Prefill { get; private set; } = new();

    [BindProperty]
    public RequestGrantMeetingInput Input { get; set; } = new();

    public bool Submitted { get; private set; }
    public string? ErrorMessage { get; private set; }

    public async Task<IActionResult> OnGetAsync()
    {
        if (LeadId == Guid.Empty) { return RedirectToPage("./Index"); }

        Prefill = await _public.GetMeetingPrefillAsync(LeadId);
        Input.LeadId = LeadId;
        Input.Phone = Prefill.Phone;
        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        Prefill = await _public.GetMeetingPrefillAsync(LeadId);
        Input.LeadId = LeadId;

        if (!ModelState.IsValid) { return Page(); }

        try
        {
            await _public.RequestMeetingAsync(Input);
            Submitted = true;
        }
        catch (BusinessException ex)
        {
            ErrorMessage = ex.Message;
        }

        return Page();
    }
}
