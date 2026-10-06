using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Volo.Abp.Authorization;
using Volo.Abp.Security.Claims;

namespace Apya.Platform;

/// <summary>
/// "Oturum açmışa evet, oturumsuza hayır" diyen test barındırıcısı kuralı.
///
/// <para>Test barındırıcısı normalde HER isteğe "evet" der; oturumsuz istek bile <c>[Authorize]</c>'dan
/// geçer ve "bu sayfa oturumsuz açılıyor mu" sorusu hiç ölçülemez. Bir test sınıfı
/// <c>ConfigureServices</c> içinde <see cref="Replace"/> çağırarak üretimdeki kuralın kaba hâlini kurar.</para>
///
/// <para>Üç kapı da değişir: sayfa/denetleyici <c>[Authorize]</c>'ı (<c>IAuthorizationService</c>),
/// ABP'nin izin denetimi (<c>IAbpAuthorizationService</c>) ve uygulama servisi <c>[Authorize]</c>'ı
/// (<c>IMethodInvocationAuthorizationService</c> — ayrı bir kapıdır, ilk ikisi yetmez).</para>
/// </summary>
internal static class SignedInOnlyAuthorization
{
    public static void Replace(IServiceCollection services)
    {
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(
            sp => new SignedInOnlyAuthorizationService(sp, sp.GetRequiredService<ICurrentPrincipalAccessor>())));
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(
            sp => sp.GetRequiredService<IAbpAuthorizationService>()));
        services.Replace(ServiceDescriptor.Transient<IMethodInvocationAuthorizationService, MethodInvocationAuthorizationService>());
    }

    private sealed class SignedInOnlyAuthorizationService : IAbpAuthorizationService
    {
        private readonly ICurrentPrincipalAccessor _principalAccessor;

        public SignedInOnlyAuthorizationService(IServiceProvider serviceProvider, ICurrentPrincipalAccessor principalAccessor)
        {
            ServiceProvider = serviceProvider;
            _principalAccessor = principalAccessor;
        }

        public IServiceProvider ServiceProvider { get; }

        public ClaimsPrincipal CurrentPrincipal => _principalAccessor.Principal;

        // Karar, isteğin taşıdığı kullanıcıya (HttpContext.User) göre DEĞİL, testin "kim çağırıyor"
        // dediği kimliğe göre verilir: test sunucusunda kimlik doğrulama ara katmanı çalışmaz,
        // HttpContext.User hep kimliksizdir; kimi taklit ettiğimizi erişimci taşır.
        private AuthorizationResult Decide() =>
            _principalAccessor.Principal?.Identity?.IsAuthenticated == true
                ? AuthorizationResult.Success()
                : AuthorizationResult.Failed();

        public Task<AuthorizationResult> AuthorizeAsync(
            ClaimsPrincipal user, object? resource, IEnumerable<IAuthorizationRequirement> requirements)
            => Task.FromResult(Decide());

        public Task<AuthorizationResult> AuthorizeAsync(ClaimsPrincipal user, object? resource, string policyName)
            => Task.FromResult(Decide());
    }
}
