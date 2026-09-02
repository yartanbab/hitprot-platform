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

    public DetayModel(IGrantPublicAppService publicService)
    {
        _public = publicService;
    }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public GrantPublicDetailDto Detail { get; private set; } = new();

    [BindProperty]
    public SubmitGrantLeadInput Lead { get; set; } = new();

    public Guid? SubmittedLeadId { get; private set; }
    public string? ErrorMessage { get; private set; }

    public async Task<IActionResult> OnGetAsync()
    {
        if (Id == Guid.Empty) { return RedirectToPage("./Index"); }

        Detail = await _public.GetDetailAsync(Id);
        return Page();
    }

    /// <summary>Testin canlı sonucu. Kayıt AÇMAZ.</summary>
    public async Task<IActionResult> OnPostEvaluateAsync([FromBody] GrantPublicTestInput input)
    {
        input.CallId = Id;
        return new JsonResult(await _public.EvaluateAsync(input));
    }

    public async Task<IActionResult> OnPostAsync()
    {
        Detail = await _public.GetDetailAsync(Id);

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
            ErrorMessage = ex.Message;
            return Page();
        }
    }
}
