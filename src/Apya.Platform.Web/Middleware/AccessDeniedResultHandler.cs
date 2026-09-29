using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Volo.Abp.Authorization;

namespace Apya.Platform.Web.Middleware;

/// <summary>
/// Yetkilendirme sonucu kancası (ROL-05, SHL-11, GRT-14, ACC-12): oturumlu kullanıcının YASAKLI TAM
/// SAYFA gezinmesi çerez işleyicisinin /Account/AccessDenied yönlendirmesi yerine uygulama kabuğundaki
/// /AccessDenied'a, başarısız izin adlarıyla yönlenir. Reddin paket tavanından mı rolden mi host'a özel
/// izinden mi geldiğini kesin ayırmanın tek güvenilir yolu, başarısız gereksinimi yetkilendirme anında
/// yakalamaktır (açıklama: <see cref="Apya.Platform.Tenants.AccessDenialExplainer"/>).
///
/// <para>Kural dar: yalnız "yasak + şemasız politika + WebSocket değil + HTML gezinmesi"
/// (<see cref="PlatformWebModule.IsHtmlNavigation"/> — hata sayfası dalıyla TEK tanım). Geri kalan HER
/// ŞEY (AJAX/ModalManager 403'ü, challenge, başarı, şemalı politika) varsayılan işleyiciye birebir
/// devredilir. ABP bağımlılık işaretçisi arayüzü UYGULANMAZ: kayıt yalnız
/// PlatformWebModule.ConfigureAuthentication'daki Replace'tir (çift kayıt olmasın).</para>
/// </summary>
public sealed class AccessDeniedResultHandler : IAuthorizationMiddlewareResultHandler
{
    /// <summary>Uygulama kabuğundaki erişim reddi sayfası — /Account/ ALTINDA OLAMAZ (kabuk betikleri orada erken döner).</summary>
    public const string Path = "/AccessDenied";

    /// <summary>Adrese taşınan en fazla izin adı.</summary>
    internal const int MaxPermissionNames = 5;

    private readonly AuthorizationMiddlewareResultHandler _default = new();

    public Task HandleAsync(
        RequestDelegate next,
        HttpContext context,
        AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizeResult)
    {
        if (authorizeResult.Forbidden
            && policy.AuthenticationSchemes.Count == 0
            && !context.WebSockets.IsWebSocketRequest
            && PlatformWebModule.IsHtmlNavigation(context))
        {
            context.Response.Redirect(BuildRedirectUrl(
                context.Request,
                FailedPermissionNames(authorizeResult.AuthorizationFailure)));
            return Task.CompletedTask;
        }

        return _default.HandleAsync(next, context, policy, authorizeResult);
    }

    /// <summary>Başarısız izin gereksinimlerinin adları (tekil, en fazla <see cref="MaxPermissionNames"/>).</summary>
    internal static IReadOnlyList<string> FailedPermissionNames(AuthorizationFailure? failure)
    {
        if (failure == null)
        {
            return Array.Empty<string>();
        }

        return failure.FailedRequirements
            .SelectMany(requirement => requirement switch
            {
                PermissionRequirement single => new[] { single.PermissionName },
                PermissionsRequirement multiple => multiple.PermissionNames,
                _ => Array.Empty<string>()
            })
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Distinct(StringComparer.Ordinal)
            .Take(MaxPermissionNames)
            .ToList();
    }

    /// <summary>/AccessDenied?returnUrl=&lt;istenen adres&gt;&amp;permission=… (PathBase korunur).</summary>
    internal static string BuildRedirectUrl(HttpRequest request, IEnumerable<string> permissionNames)
    {
        var url = QueryHelpers.AddQueryString(
            request.PathBase + Path,
            "returnUrl",
            request.PathBase + request.Path + request.QueryString);

        foreach (var permissionName in permissionNames)
        {
            url = QueryHelpers.AddQueryString(url, "permission", permissionName);
        }

        return url;
    }
}
