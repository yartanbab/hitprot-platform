using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Volo.Abp;

namespace Apya.Platform.Web.Services;

/// <summary>
/// <c>[RemoteService(IsEnabled = false)]</c> ile işaretli METOT HTTP'den hiç çağrılamaz.
///
/// <para>ABP bu işareti metot düzeyinde gördüğünde eylemi SİLMEZ, yalnız API rotasını vermez
/// (<c>/api/app/…</c> 404 olur). Eylem denetleyici modelinde rotasız kalır ve uygulamanın genel
/// <c>{controller}/{action}</c> rotasına düşer: <c>/DraftTask/UploadPdfForExtraction</c>,
/// <c>/GrantFunnel/RecordPublicView</c> gibi adreslerle çağrılabilir. "Uzaktan kapalı" denen metot
/// böylece uzaktan açık kalıyordu — üstelik bu metotlar, çağıranına güvendiği için kapatılmıştı
/// (biri saklanan dosyanın sunucudaki yolunu parametre olarak alıyor).</para>
///
/// <para>Bu kural eylemi modelden çıkarır; metot yalnız süreç içinden çağrılır.</para>
/// </summary>
public class RemoveDisabledRemoteActionsConvention : IApplicationModelConvention
{
    public void Apply(ApplicationModel application)
    {
        foreach (var controller in application.Controllers)
        {
            var disabled = controller.Actions
                .Where(action => action.ActionMethod
                    .GetCustomAttributes<RemoteServiceAttribute>(inherit: true)
                    .Any(attribute => !attribute.IsEnabled))
                .ToList();

            foreach (var action in disabled)
            {
                controller.Actions.Remove(action);
            }
        }
    }
}
