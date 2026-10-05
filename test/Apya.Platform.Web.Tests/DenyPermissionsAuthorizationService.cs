using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Authorization;

namespace Apya.Platform;

/// <summary>
/// Verilen izinleri reddeden, geri kalan her şeye izin veren yetkilendirme servisi.
/// <c>AlwaysAllowAuthorizationService</c>'in tek farkla kopyası: izin reddini gerçek
/// istek hattında ölçebilmek için.
///
/// <para>Test barındırıcısı normalde her izne "evet" der ve izin reddi hiç görülmez.
/// Bir test sınıfı <c>ConfigureServices</c> içinde <c>IAuthorizationService</c> ile
/// <c>IAbpAuthorizationService</c>'i bununla değiştirerek TEK izni reddeden bir barındırıcı
/// kurar; sayfa modeli, görünümdeki koşul ve uygulama servisi içi kontrol birlikte ölçülür.
/// Sınıf/metot düzeyi <c>[Authorize]</c> öznitelikleri bu yoldan geçmez, onlar "evet" kalır.</para>
/// </summary>
internal sealed class DenyPermissionsAuthorizationService : IAbpAuthorizationService
{
    private readonly HashSet<string> _denied;

    public DenyPermissionsAuthorizationService(params string[] denied)
    {
        _denied = denied.ToHashSet(StringComparer.Ordinal);
    }

    public IServiceProvider ServiceProvider { get; set; } = null!;

    public ClaimsPrincipal CurrentPrincipal => new(new ClaimsIdentity("Test"));

    public Task<AuthorizationResult> AuthorizeAsync(
        ClaimsPrincipal user, object? resource, IEnumerable<IAuthorizationRequirement> requirements)
        => Task.FromResult(AuthorizationResult.Success());

    public Task<AuthorizationResult> AuthorizeAsync(ClaimsPrincipal user, object? resource, string policyName)
        => Task.FromResult(_denied.Contains(policyName)
            ? AuthorizationResult.Failed()
            : AuthorizationResult.Success());
}
