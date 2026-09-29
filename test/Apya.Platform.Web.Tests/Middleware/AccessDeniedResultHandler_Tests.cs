using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Web.Middleware;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Volo.Abp.Authorization;
using Xunit;

namespace Apya.Platform.Middleware;

/// <summary>
/// Yetkilendirme sonucu kancası (ROL-05, SHL-11, GRT-14, ACC-12): yalnız "yasak + şemasız politika +
/// WebSocket değil + HTML gezinmesi" /AccessDenied'a eksik izin adıyla yönlenir; geri kalan HER ŞEY
/// varsayılan işleyiciye birebir gider (AJAX/ModalManager 403'ü, challenge, başarı, şemalı politika).
///
/// <para>Test host'u <c>AddAlwaysAllowAuthorization</c> kullandığı için gerçek "yasak" üretilemez;
/// kanca burada <see cref="DefaultHttpContext"/> ve çağrıları kaydeden sahte kimlik doğrulama
/// servisiyle ölçülür. Kaydın bizimki olduğu <see cref="Registration"/>'da host üzerinden.</para>
/// </summary>
public class AccessDeniedResultHandler_Tests
{
    private static readonly AuthorizationPolicy SchemelessPolicy =
        new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();

    private sealed class RecordingAuthenticationService : IAuthenticationService
    {
        public List<string?> Forbidden { get; } = new();
        public List<string?> Challenged { get; } = new();

        public Task<AuthenticateResult> AuthenticateAsync(HttpContext context, string? scheme)
            => Task.FromResult(AuthenticateResult.NoResult());

        public Task ChallengeAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
        {
            Challenged.Add(scheme);
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }

        public Task ForbidAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
        {
            Forbidden.Add(scheme);
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        }

        public Task SignInAsync(HttpContext context, string? scheme, ClaimsPrincipal principal, AuthenticationProperties? properties)
            => Task.CompletedTask;

        public Task SignOutAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
            => Task.CompletedTask;
    }

    private sealed class WebSocketRequestFeature : IHttpWebSocketFeature
    {
        public bool IsWebSocketRequest => true;

        public Task<System.Net.WebSockets.WebSocket> AcceptAsync(WebSocketAcceptContext context)
            => throw new System.NotSupportedException();
    }

    private static (DefaultHttpContext Context, RecordingAuthenticationService Auth) Request(
        string method = "GET",
        string path = "/Grants/Today",
        string? accept = "text/html,application/xhtml+xml",
        string? requestedWith = null,
        string? pathBase = null,
        string? query = null)
    {
        var auth = new RecordingAuthenticationService();
        var services = new ServiceCollection();
        services.AddSingleton<IAuthenticationService>(auth);

        var context = new DefaultHttpContext { RequestServices = services.BuildServiceProvider() };
        context.Request.Method = method;
        context.Request.Path = path;
        if (pathBase != null)
        {
            context.Request.PathBase = pathBase;
        }

        if (query != null)
        {
            context.Request.QueryString = new QueryString(query);
        }

        if (accept != null)
        {
            context.Request.Headers.Accept = accept;
        }

        if (requestedWith != null)
        {
            context.Request.Headers["X-Requested-With"] = requestedWith;
        }

        return (context, auth);
    }

    private static PolicyAuthorizationResult Forbid(params IAuthorizationRequirement[] failed)
        => PolicyAuthorizationResult.Forbid(AuthorizationFailure.Failed(failed));

    private static Task HandleAsync(HttpContext context, PolicyAuthorizationResult result,
        AuthorizationPolicy? policy = null, RequestDelegate? next = null)
        => new AccessDeniedResultHandler().HandleAsync(
            next ?? (_ => Task.CompletedTask), context, policy ?? SchemelessPolicy, result);

    private static string Location(HttpContext context) => context.Response.Headers.Location.ToString();

    [Fact]
    public async Task Yasakli_HTML_gezinmesi_eksik_izinle_AccessDenied_sayfasina_yonlenir()
    {
        var (context, auth) = Request();

        await HandleAsync(context, Forbid(new PermissionRequirement("Platform.Grants")));

        context.Response.StatusCode.ShouldBe(StatusCodes.Status302Found);
        Location(context).ShouldBe("/AccessDenied?returnUrl=%2FGrants%2FToday&permission=Platform.Grants");
        auth.Forbidden.ShouldBeEmpty("çerez işleyicisinin /Account/AccessDenied yönlendirmesi devreye girmemeli");
    }

    [Fact]
    public async Task Sorgu_dizgisi_donus_adresinde_korunur()
    {
        var (context, _) = Request(path: "/Invoices", query: "?projectId=7&tab=kalemler");

        await HandleAsync(context, Forbid(new PermissionRequirement("Platform.Invoices")));

        var query = QueryHelpers.ParseQuery(new System.Uri("http://x" + Location(context)).Query);
        query["returnUrl"].ToString().ShouldBe("/Invoices?projectId=7&tab=kalemler");
        query["permission"].ToString().ShouldBe("Platform.Invoices");
    }

    /// <summary>ModalManager/abp.ajax yolu DEĞİŞMEZ: çerez işleyicisi AJAX'a gövdesiz 403 döner.</summary>
    [Fact]
    public async Task AJAX_istegi_varsayilan_islemciye_gider()
    {
        var (context, auth) = Request(requestedWith: "XMLHttpRequest");

        await HandleAsync(context, Forbid(new PermissionRequirement("Platform.Grants")));

        auth.Forbidden.Count.ShouldBe(1);
        Location(context).ShouldNotContain(AccessDeniedResultHandler.Path);
        context.Response.StatusCode.ShouldBe(StatusCodes.Status403Forbidden);
    }

    [Theory]
    [InlineData("GET", "application/json")]
    [InlineData("PUT", "text/html")]
    [InlineData("DELETE", "text/html")]
    public async Task HTML_disi_ya_da_yontemi_koruyan_istek_varsayilan_islemciye_gider(string method, string accept)
    {
        var (context, auth) = Request(method: method, accept: accept);

        await HandleAsync(context, Forbid(new PermissionRequirement("Platform.Grants")));

        auth.Forbidden.Count.ShouldBe(1);
        Location(context).ShouldBeEmpty();
    }

    [Fact]
    public async Task WebSocket_istegi_varsayilan_islemciye_gider()
    {
        var (context, auth) = Request();
        context.Features.Set<IHttpWebSocketFeature>(new WebSocketRequestFeature());

        await HandleAsync(context, Forbid(new PermissionRequirement("Platform.Grants")));

        auth.Forbidden.Count.ShouldBe(1);
        Location(context).ShouldBeEmpty();
    }

    [Fact]
    public async Task Semali_politika_varsayilan_islemciye_gider()
    {
        var (context, auth) = Request();
        var bearerPolicy = new AuthorizationPolicyBuilder("Bearer").RequireAuthenticatedUser().Build();

        await HandleAsync(context, Forbid(new PermissionRequirement("Platform.Grants")), bearerPolicy);

        auth.Forbidden.ShouldBe(new[] { "Bearer" });
        Location(context).ShouldBeEmpty();
    }

    [Fact]
    public async Task Challenge_ve_basari_degismez()
    {
        var (challenged, auth) = Request();
        await HandleAsync(challenged, PolicyAuthorizationResult.Challenge());
        auth.Challenged.Count.ShouldBe(1);
        auth.Forbidden.ShouldBeEmpty();
        Location(challenged).ShouldBeEmpty();

        var (succeeded, _) = Request();
        var nextCalled = false;
        await HandleAsync(succeeded, PolicyAuthorizationResult.Success(), next: _ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        nextCalled.ShouldBeTrue();
        Location(succeeded).ShouldBeEmpty();
    }

    [Fact]
    public async Task En_fazla_bes_izin_adi_tasinir_ve_izin_disi_gereksinimler_atlanir()
    {
        var (context, _) = Request();
        var names = Enumerable.Range(1, 7).Select(i => "Platform.X" + i).ToArray();

        await HandleAsync(context, Forbid(
            new DenyAnonymousAuthorizationRequirement(),
            new PermissionsRequirement(names, requiresAll: false)));

        var permissions = QueryHelpers.ParseQuery(new System.Uri("http://x" + Location(context)).Query)["permission"];
        permissions.ToArray().ShouldBe(names.Take(5).ToArray());
    }

    [Fact]
    public async Task PathBase_korunur()
    {
        var (context, _) = Request(pathBase: "/app");

        await HandleAsync(context, Forbid(new PermissionRequirement("Platform.Grants")));

        Location(context).ShouldBe("/app/AccessDenied?returnUrl=%2Fapp%2FGrants%2FToday&permission=Platform.Grants");
    }

    [Fact]
    public void Basarisizlik_bilgisi_yoksa_izin_adi_tasinmaz()
    {
        AccessDeniedResultHandler.FailedPermissionNames(null).ShouldBeEmpty();

        var (context, _) = Request();
        AccessDeniedResultHandler.BuildRedirectUrl(context.Request, new List<string>())
            .ShouldBe("/AccessDenied?returnUrl=%2FGrants%2FToday");
    }

    /// <summary>
    /// Kabuk betikleri (kenar çubuğu, üst çubuk, komut paleti, tema…) /Account/* yolunda erken döner;
    /// erişim reddi sayfası oraya taşınırsa uygulama düzeni yarım kurulur.
    /// </summary>
    [Fact]
    public void Sayfa_yolu_Account_altinda_degildir()
    {
        AccessDeniedResultHandler.Path.ShouldStartWith("/");
        AccessDeniedResultHandler.Path.StartsWith("/Account/", System.StringComparison.OrdinalIgnoreCase).ShouldBeFalse();
    }

    /// <summary>Çerçevenin varsayılan kaydı yerine bizimki çözülür (Replace).</summary>
    public class Registration : PlatformWebTestBase
    {
        [Fact]
        public void Kayitli_islemci_AccessDeniedResultHandler()
        {
            GetRequiredService<IAuthorizationMiddlewareResultHandler>().ShouldBeOfType<AccessDeniedResultHandler>();
        }
    }
}
