using System;
using System.Linq;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Microsoft.Extensions.Localization;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Http;
using Volo.Abp.Validation;

namespace Apya.Platform.Web.Pages.Shared;

/// <summary>
/// Tam sayfa hata (Views/Error/Default.cshtml, SHL-19) ve erişim reddi (/AccessDenied; ROL-05, ACC-12,
/// SHL-11, GRT-14) durumlarının metin/eylem kararı — tek yerde ve SAF (birim test edilir). Çıktı ortak
/// <c>_EmptyState</c> partial'ının modelidir (<see cref="EmptyStateVariant.Page"/>): görsel dil boş
/// durumlar ve yükleme hatalarıyla aynı (.apya-console-state), yeni CSS yok.
/// </summary>
public static class ErrorStates
{
    /// <summary>
    /// "Genel Bakış'a dön"ün kapısı. Sayfa yalnız [Authorize] ama OnGet'teki DashboardAppService sınıf
    /// düzeyinde [Authorize(Projects.Default)] taşır → bu izni olmayan kullanıcıda Genel Bakış'ın
    /// kendisi 403 verir; düğme basılmaz ki hata/erişim sayfası döngüye girmesin. Ayrışmayı
    /// ErrorPage_Tests sözleşme testi yakalar.
    /// </summary>
    public const string DashboardPermission = PlatformPermissions.Projects.Default;

    public const string DashboardUrl = "/Dashboard";
    public const string SubscriptionUrl = "/Subscription";
    public const string LoginUrl = "/Account/Login";

    /// <summary>
    /// Hata sayfası. Sıra önemli: yetki istisnası → bulunamayan kayıt → iş kuralı (ABP iş kuralı
    /// istisnasını 403'e eşler; mesajı KORUNUR, "yetkiniz yok" yalnız gerçek yetki reddinde) →
    /// durum kodu. <paramref name="exception"/> yalnız istisna yeniden yürütmesinde doludur (durum
    /// kodu yönlendirmesinde ve doğrudan /Error?httpStatusCode= isteğinde null).
    /// </summary>
    public static EmptyStateModel ForStatusCode(
        int statusCode,
        Exception? exception,
        RemoteServiceErrorInfo? errorInfo,
        bool isAuthenticated,
        bool canOpenDashboard,
        bool isGetRequest,
        string? originalPath,
        IStringLocalizer l)
    {
        var state = NewPageState();

        switch (exception)
        {
            case AbpAuthorizationException:
                // ABP'nin teknik "Authorization failed…" metni gösterilmez.
                Apply(state, l, statusCode == 401 ? "Unauthorized" : "Forbidden",
                    statusCode == 401 ? "error-401" : "error-403",
                    statusCode == 401 ? "fa-right-to-bracket" : "fa-lock");
                break;
            case EntityNotFoundException:
                // Varlık tür adı ve kimliği sızmaz.
                Apply(state, l, "RecordNotFound", "error-404-record", "fa-compass");
                break;
            case IBusinessException or IUserFriendlyException or AbpValidationException or AbpDbConcurrencyException
                when !string.IsNullOrWhiteSpace(errorInfo?.Message):
                state.Kind = "error-business";
                state.Icon = "fa-triangle-exclamation";
                state.Title = l["ErrorPage:Business:Title"].Value;
                state.Description = errorInfo!.Message;
                state.Details = errorInfo.ValidationErrors?
                    .Select(error => error.Message)
                    .Where(message => !string.IsNullOrWhiteSpace(message))
                    .ToList();
                // Doğrulama istisnasında ABP Details'i maddelerden kurar ("…aşağıdaki hatalar… - A - B"):
                // maddeler basılıyorsa ipucu yok, hatalar iki kez yazılmasın.
                state.Hint = state.Details is { Count: > 0 } ? null : errorInfo.Details;
                break;
            default:
                switch (statusCode)
                {
                    case 400:
                        Apply(state, l, "BadRequest", "error-400", "fa-triangle-exclamation");
                        break;
                    case 401:
                        Apply(state, l, "Unauthorized", "error-401", "fa-right-to-bracket");
                        break;
                    case 403:
                        Apply(state, l, "Forbidden", "error-403", "fa-lock");
                        break;
                    case 404:
                        Apply(state, l, "NotFound", "error-404", "fa-compass");
                        break;
                    case >= 500:
                        Apply(state, l, "ServerError", "error-" + statusCode, "fa-circle-exclamation");
                        break;
                    default:
                        Apply(state, l, "Generic", "error-generic", "fa-triangle-exclamation");
                        break;
                }

                break;
        }

        if (statusCode == 401 || !isAuthenticated)
        {
            state.ActionText = l["ErrorPage:SignIn"].Value;
            state.ActionIcon = "fa-right-to-bracket";
            state.ActionUrl = statusCode == 401 && IsLocalPath(originalPath)
                ? LoginUrl + "?returnUrl=" + Uri.EscapeDataString(originalPath!)
                : LoginUrl;
        }
        else if (canOpenDashboard)
        {
            SetDashboardAction(state, l);
        }

        // Yalnız istisna yeniden yürütmesinde tarayıcı adresi ORİJİNAL sayfadır; durum kodu
        // yönlendirmesinde yenileme hata sayfasını yeniler. POST'u yeniden göndertmek mükerrer
        // kayıt riski → yalnız GET.
        if (statusCode >= 500 && exception != null && isGetRequest)
        {
            state.SecondaryActions.Add(EmptyStateAction.Retry(l["Common:Retry"].Value));
        }

        state.SecondaryActions.Add(EmptyStateAction.Back(l["ErrorPage:GoBack"].Value));
        state.Footnote = l["ErrorPage:StatusCode", statusCode].Value;
        return state;
    }

    /// <summary>
    /// Oturumlu kullanıcının erişim reddi. "Paketimi görüntüle" yalnız Paketim'i açabilene
    /// (<paramref name="canViewSubscription"/>: kiracı + TenantSettings; apya-quota-upsell.js ile aynı
    /// kural), "Genel Bakış'a dön" yalnız <see cref="DashboardPermission"/> sahibine.
    /// </summary>
    public static EmptyStateModel ForAccessDenial(
        AccessDenialExplanation explanation,
        bool canOpenDashboard,
        bool canViewSubscription,
        IStringLocalizer l)
    {
        var state = NewPageState();
        state.Kind = "denied-" + explanation.Reason.ToString().ToLowerInvariant();
        state.Icon = explanation.Reason == AccessDenialReason.Package ? "fa-gem" : "fa-lock";
        state.Title = l["AccessDenied:Title"].Value;

        switch (explanation.Reason)
        {
            case AccessDenialReason.Package:
                state.Description = explanation.ModuleDisplayName != null
                    ? l["AccessDenied:Package", explanation.ModuleDisplayName].Value
                    : l["AccessDenied:Package:Generic"].Value;
                state.Hint = l[canViewSubscription ? "AccessDenied:Package:CanView" : "AccessDenied:Package:AskAdmin"].Value;
                if (canViewSubscription)
                {
                    SetSubscriptionAction(state, l);
                    if (canOpenDashboard)
                    {
                        state.SecondaryActions.Add(new EmptyStateAction(l["ErrorPage:BackToDashboard"].Value, DashboardUrl, "fa-chart-line"));
                    }
                }
                else if (canOpenDashboard)
                {
                    SetDashboardAction(state, l);
                }

                break;
            case AccessDenialReason.HostOnly:
            case AccessDenialReason.TenantOnly:
                state.Description = l[explanation.Reason == AccessDenialReason.HostOnly
                    ? "AccessDenied:HostOnly"
                    : "AccessDenied:TenantOnly"].Value;
                if (canOpenDashboard)
                {
                    SetDashboardAction(state, l);
                }

                break;
            case AccessDenialReason.NotGranted:
                state.Description = l["AccessDenied:NotGranted"].Value;
                state.Hint = (string.IsNullOrWhiteSpace(explanation.PermissionDisplayName)
                        ? string.Empty
                        : l["AccessDenied:NotGranted:Permission", explanation.PermissionDisplayName].Value + " ")
                    + l["AccessDenied:AskAdmin"].Value;
                if (canOpenDashboard)
                {
                    SetDashboardAction(state, l);
                }

                break;
            default:
                // Sebep bilinmiyor (açık Forbid(), eski yer imi): iki olasılık birlikte söylenir.
                state.Description = l["AccessDenied:Unknown"].Value;
                state.Hint = l[canViewSubscription ? "AccessDenied:Unknown:CanView" : "AccessDenied:AskAdmin"].Value;
                if (canOpenDashboard)
                {
                    SetDashboardAction(state, l);
                }

                if (canViewSubscription)
                {
                    state.SecondaryActions.Add(new EmptyStateAction(l["AccessDenied:ViewPackage"].Value, SubscriptionUrl, "fa-gem"));
                }

                break;
        }

        state.SecondaryActions.Add(EmptyStateAction.Back(l["ErrorPage:GoBack"].Value));
        return state;
    }

    private static EmptyStateModel NewPageState()
        => new() { Variant = EmptyStateVariant.Page, CssClass = "is-denied" };

    private static void Apply(EmptyStateModel state, IStringLocalizer l, string category, string kind, string icon)
    {
        state.Kind = kind;
        state.Icon = icon;
        state.Title = l["ErrorPage:" + category + ":Title"].Value;
        state.Description = l["ErrorPage:" + category + ":Description"].Value;
    }

    private static void SetDashboardAction(EmptyStateModel state, IStringLocalizer l)
    {
        state.ActionText = l["ErrorPage:BackToDashboard"].Value;
        state.ActionUrl = DashboardUrl;
        state.ActionIcon = "fa-chart-line";
    }

    private static void SetSubscriptionAction(EmptyStateModel state, IStringLocalizer l)
    {
        state.ActionText = l["AccessDenied:ViewPackage"].Value;
        state.ActionUrl = SubscriptionUrl;
        state.ActionIcon = "fa-gem";
    }

    /// <summary>Açık yönlendirme olmasın: yalnız "/x" biçimli yerel yol ("//" ve "/\" değil).</summary>
    private static bool IsLocalPath(string? path)
        => !string.IsNullOrEmpty(path)
           && path[0] == '/'
           && (path.Length == 1 || (path[1] != '/' && path[1] != '\\'));
}
