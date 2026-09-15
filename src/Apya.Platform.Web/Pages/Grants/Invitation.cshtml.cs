using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Domain.Entities;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 19b · Fikir daveti bildiriminin açtığı adres. Davet bağlamına göre yönlendirir: çağrıdan bağımsız davet
/// "Proje fikrimi paylaş" formuna (davet notuyla), çağrı daveti çağrının detayına (İlgileniyorum formu). Bildirim
/// kaydı tek bir derin bağlantı şablonu taşıdığı için karar burada verilir.
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class InvitationModel : PlatformPageModel
{
    private readonly IGrantInterestAppService _interests;

    public InvitationModel(IGrantInterestAppService interests)
    {
        _interests = interests;
    }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public async Task<IActionResult> OnGetAsync()
    {
        // Host'un firması yok; davetleri Fikir Havuzu'ndan gönderir.
        if (CurrentTenant.Id == null)
        {
            return Redirect("/Grants/Ideas");
        }

        try
        {
            var invitation = await _interests.GetInvitationAsync(Id);
            return Redirect(invitation.GrantCallId is { } callId
                ? $"/Grants/Detail?id={callId}"
                : $"/Grants/Idea?invitation={invitation.Id}");
        }
        catch (EntityNotFoundException)
        {
            // Firmaya ait olmayan ya da silinmiş davet: yolculuk ekranına düşer, hata sayfasına değil.
            return Redirect("/Grants/Journey");
        }
    }
}
