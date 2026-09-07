using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Accounts;

/// <summary>
/// Bir e-posta adresinin HERHANGİ bir kiracıda kullanıcıya tanımlı olup olmadığını söyler.
/// Aynı e-postayla ikinci bir hesap açılmasını engelleyen kuralın tek kaynağıdır.
///
/// <para><b>Neden gerekli:</b> kiracı yöneticisi ABP tarafından <c>UserName = "admin"</c> ile
/// tohumlanır; kiracılar arasında adayı ayırt eden tek alan e-postadır. Mükerrer e-posta,
/// kiracısız girişte <c>ProbeTenantsAsync</c>'i her aday kiracıda PBKDF2 denemeye zorlar
/// (ölçülen giriş yavaşlığının kaynağı) ve kullanıcı hangi hesabına düştüğünü bilemez.</para>
///
/// <para>🔴 Kiracı filtresi BİLEREK kapatılır — soru zaten "başka bir kiracıda var mı".
/// Yumuşak silinmiş kullanıcılar sayılmaz: silinen bir hesabın e-postası rezerve kalmamalı.</para>
///
/// <para>Bu bir AppService DEĞİL. <see cref="LoginTenantFinder"/> ile aynı gerekçe: REST ucu
/// olarak yayınlansaydı oturumsuz uçlardan "bu e-posta sistemde var mı" diye sorgulanabilen
/// bir kullanıcı sayım açığı doğardı.</para>
/// </summary>
public class RegisteredEmailChecker : DomainService
{
    private readonly IRepository<IdentityUser, Guid> _userRepository;
    private readonly ILookupNormalizer _lookupNormalizer;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;

    public RegisteredEmailChecker(
        IRepository<IdentityUser, Guid> userRepository,
        ILookupNormalizer lookupNormalizer,
        IDataFilter<IMultiTenant> multiTenantFilter)
    {
        _userRepository = userRepository;
        _lookupNormalizer = lookupNormalizer;
        _multiTenantFilter = multiTenantFilter;
    }

    /// <summary>
    /// E-posta bir kullanıcıya tanımlı mı? Boş adres <c>false</c> döner — boşluğu burada
    /// hata saymak, zorunluluk doğrulamasını iki yere dağıtmak olurdu.
    /// </summary>
    public async Task<bool> IsRegisteredAsync(string? email)
    {
        if (email.IsNullOrWhiteSpace())
        {
            return false;
        }

        // AbpUsers'ta arama normalize edilmiş sütun üzerinden yapılır; ham metinle
        // karşılaştırmak büyük/küçük harf yüzünden sessizce ıskalar.
        var normalizedEmail = _lookupNormalizer.NormalizeEmail(email!.Trim());

        using (_multiTenantFilter.Disable())
        {
            var queryable = await _userRepository.GetQueryableAsync();

            return await AsyncExecuter.AnyAsync(
                queryable.Where(u => u.NormalizedEmail == normalizedEmail));
        }
    }

    /// <summary>
    /// Tanımlıysa iş kuralı hatası atar. Çağıranların hepsi aynı kodu üretsin diye burada;
    /// mesaj hem host'a (yeni müşteri / davet) hem adaya (protokol onayı) uyar.
    /// </summary>
    public async Task CheckNotRegisteredAsync(string? email)
    {
        if (await IsRegisteredAsync(email))
        {
            // email! güvenli: IsRegisteredAsync boş adrese false döner, buraya gelinemez.
            throw new BusinessException(PlatformDomainErrorCodes.TenantAdminEmailAlreadyInUse)
                .WithData("Email", email!);
        }
    }
}
