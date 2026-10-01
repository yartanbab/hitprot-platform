using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

    /// <summary>
    /// Bağlantı geçersiz (ACC-04, GRT-06): talep yok ya da çağrısı artık açık değil. İkisi AYNI yanıtı
    /// alır — 404 + kendi düzeninde durum; talep kimliğinin varlığı sızmaz.
    /// </summary>
    public bool LinkInvalid { get; private set; }

    public async Task<IActionResult> OnGetAsync()
    {
        if (LeadId == Guid.Empty) { return RedirectToPage("./Index"); }

        if (!await TryLoadPrefillAsync()) { return Page(); }

        Input.LeadId = LeadId;
        Input.Phone = Prefill.Phone;
        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!await TryLoadPrefillAsync()) { return Page(); }

        Input.LeadId = LeadId;

        if (!ModelState.IsValid) { return Page(); }

        try
        {
            await _public.RequestMeetingAsync(Input);
            Submitted = true;
        }
        catch (BusinessException ex)
        {
            // Kodla atılan iş hatasının ex.Message'ı İngilizce çerçeve metnidir; kullanıcı metni tr.json'dan.
            ErrorMessage = this.UserMessage(ex);
        }

        return Page();
    }

    /// <summary>
    /// Ön doldurmayı yükler; talep yok ya da çağrısı kapanmışsa durumu 404'e çevirir. GET/POST'un ilk
    /// adımı — hiçbir yazımdan önce, yakalamak güvenli. Gövdeli yanıt: üretimde /Error'a yönlenmez.
    /// </summary>
    private async Task<bool> TryLoadPrefillAsync()
    {
        try
        {
            Prefill = await _public.GetMeetingPrefillAsync(LeadId);
            return true;
        }
        catch (BusinessException ex) when (ex.Code is PlatformDomainErrorCodes.GrantLeadNotFound
                                               or PlatformDomainErrorCodes.GrantLeadCallNotOpen)
        {
            LinkInvalid = true;
            Response.StatusCode = StatusCodes.Status404NotFound;
            return false;
        }
    }
}
