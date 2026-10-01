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
/// 1g · Hibe detayı ve uygunluk testi.
///
/// <para>🔴 E-POSTA DUVARI YOK: test sonucu <see cref="OnPostEvaluateAsync"/> ile
/// hiçbir kayıt açılmadan döner. Talep ancak ziyaretçi formu gönderince oluşur.</para>
///
/// <para>Yazma yolu YALNIZ burasıdır: servis HTTP API olarak açık değil, IP ve
/// tarayıcı bilgisi bu sınırda yakalanır.</para>
/// </summary>
[AllowAnonymous]
public class DetayModel : AbpPageModel
{
    private readonly IGrantPublicAppService _public;
    private readonly IGrantFunnelAppService _funnel;

    public DetayModel(IGrantPublicAppService publicService, IGrantFunnelAppService funnel)
    {
        _public = publicService;
        _funnel = funnel;
    }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public GrantPublicDetailDto Detail { get; private set; } = new();

    [BindProperty]
    public SubmitGrantLeadInput Lead { get; set; } = new();

    public Guid? SubmittedLeadId { get; private set; }
    public string? ErrorMessage { get; private set; }

    /// <summary>
    /// Çağrı kamuya açık değil (ACC-04, GRT-06): kapanmış, taslak ya da hiç olmayan çağrı AYNI yanıtı
    /// alır — 404 + kendi düzeninde "yayında değil" durumu. Ayrım yapılsaydı taslağın varlığı sızardı
    /// (servis sözleşmesi: taslak çağrı hiçbir kamu yüzeyinde görünmez).
    /// </summary>
    public bool CallUnavailable { get; private set; }

    public async Task<IActionResult> OnGetAsync()
    {
        if (Id == Guid.Empty) { return RedirectToPage("./Index"); }

        if (!await TryLoadDetailAsync()) { return Page(); }

        // 18c · Huni: yalnız sayfanın açılışı sayılır (form gönderimi sonrası yeniden çizim sayılmaz).
        // Açık olmayan çağrı sayılmaz.
        await _funnel.RecordPublicViewAsync(Id);
        return Page();
    }

    /// <summary>
    /// Detayı yükler; çağrı açık değilse (servis yok/kapalı/taslağı tek iş koduyla bildirir) durumu
    /// 404'e çevirir. GET/POST'un ilk adımı — hiçbir yazımdan önce, yakalamak güvenli. Gövdeli yanıt
    /// olduğu için üretimde /Error'a yönlendirilmez (durum sayfası ara katmanı yalnız gövdesizde çalışır).
    /// </summary>
    private async Task<bool> TryLoadDetailAsync()
    {
        try
        {
            Detail = await _public.GetDetailAsync(Id);
            return true;
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.GrantLeadCallNotOpen)
        {
            CallUnavailable = true;
            Response.StatusCode = StatusCodes.Status404NotFound;
            return false;
        }
    }

    /// <summary>Testin canlı sonucu. Kayıt AÇMAZ.</summary>
    public async Task<IActionResult> OnPostEvaluateAsync([FromBody] GrantPublicTestInput input)
    {
        input.CallId = Id;
        return new JsonResult(await _public.EvaluateAsync(input));
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!await TryLoadDetailAsync()) { return Page(); }

        if (!ModelState.IsValid) { return Page(); }

        Lead.CallId = Id;
        Lead.Answers.CallId = Id;

        // İstemciden gelen değere güvenilmez; sunucuda yakalanır.
        Lead.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        Lead.UserAgent = Request.Headers.UserAgent.ToString();

        try
        {
            var result = await _public.SubmitLeadAsync(Lead);
            return RedirectToPage("./Randevu", new { lead = result.LeadId });
        }
        catch (BusinessException ex)
        {
            // Kodla atılan iş hatasının ex.Message'ı İngilizce çerçeve metnidir; kullanıcı metni tr.json'dan.
            ErrorMessage = this.UserMessage(ex);
            return Page();
        }
    }
}
