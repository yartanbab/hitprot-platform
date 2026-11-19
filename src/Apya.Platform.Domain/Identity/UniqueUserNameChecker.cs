using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;

namespace Apya.Platform.Identity;

/// <summary>
/// Kullanıcı adının BÜTÜN sistemde (host + bütün yaşayan kiracılar) tekil olması kuralının
/// tek kaynağı. Giriş ekranı kiracı sormadan kullanıcı adıyla kişiyi bulur
/// (<see cref="Accounts.LoginTenantFinder"/>); aynı ad iki kiracıda olursa doğru hesabı
/// ayırt etmenin tek yolu şifre denemektir ve aynı şifre yanlış hesaba girer.
///
/// <para>Sayılmayanlar: yumuşak silinmiş kullanıcılar (süzgeç açık) ve silinmiş kiracıların
/// kullanıcıları — ikisi de giriş yapamaz, adlarını rezerve etmemeli.</para>
///
/// <para>Bu bir AppService DEĞİL: oturumsuz bir uçtan "bu ad var mı" diye sorulabilseydi
/// kullanıcı sayım açığı doğardı.</para>
/// </summary>
public class UniqueUserNameChecker : DomainService
{
    private const string FallbackUserName = "kullanici";

    private readonly IRepository<IdentityUser, Guid> _userRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ILookupNormalizer _lookupNormalizer;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;

    public UniqueUserNameChecker(
        IRepository<IdentityUser, Guid> userRepository,
        ITenantRepository tenantRepository,
        ILookupNormalizer lookupNormalizer,
        IDataFilter<IMultiTenant> multiTenantFilter)
    {
        _userRepository = userRepository;
        _tenantRepository = tenantRepository;
        _lookupNormalizer = lookupNormalizer;
        _multiTenantFilter = multiTenantFilter;
    }

    /// <summary>
    /// Bu adı taşıyan, giriş yapabilecek kullanıcıların kiracı kimlikleri (host = <c>null</c>).
    /// <paramref name="exceptUserId"/> kendi kaydını saymamak içindir.
    /// </summary>
    [UnitOfWork]
    public virtual async Task<List<Guid?>> FindOwnerTenantIdsAsync(string userName, Guid? exceptUserId = null)
    {
        var normalized = _lookupNormalizer.NormalizeName(userName);

        List<Guid?> tenantIds;
        using (_multiTenantFilter.Disable())
        {
            var queryable = await _userRepository.GetQueryableAsync();
            tenantIds = await AsyncExecuter.ToListAsync(
                queryable
                    .Where(u => u.NormalizedUserName == normalized && u.Id != exceptUserId)
                    .Select(u => u.TenantId)
                    .Distinct());
        }

        var owners = new List<Guid?>();
        foreach (var tenantId in tenantIds)
        {
            // Kiracı kataloğu yumuşak silme süzgeciyle okunur: silinmiş kiracı bulunmaz.
            if (tenantId == null || await _tenantRepository.FindAsync(tenantId.Value, includeDetails: false) != null)
            {
                owners.Add(tenantId);
            }
        }

        return owners;
    }

    /// <summary>Kullanıcının veritabanındaki normalize adı; kayıt henüz yoksa <c>null</c>.</summary>
    [UnitOfWork]
    public virtual async Task<string?> FindStoredNormalizedUserNameAsync(Guid userId)
    {
        using (_multiTenantFilter.Disable())
        {
            var queryable = await _userRepository.GetQueryableAsync();
            return await AsyncExecuter.FirstOrDefaultAsync(
                queryable.Where(u => u.Id == userId).Select(u => u.NormalizedUserName));
        }
    }

    /// <summary>
    /// E-postanın @ öncesinden boşta bir kullanıcı adı türetir: "Şükrü.Öz@firma.com" → "sukru.oz";
    /// alınmışsa "sukru.oz2", "sukru.oz3"… Ad ABP'nin varsayılan izinli karakterleriyle sınırlıdır.
    /// </summary>
    [UnitOfWork]
    public virtual Task<string> SuggestFromEmailAsync(string email)
    {
        var baseName = ToSlug((email ?? string.Empty).Split('@')[0]);
        return SuggestAvailableAsync(baseName.Length == 0 ? FallbackUserName : baseName);
    }

    /// <summary><paramref name="baseName"/> boştaysa kendisi; değilse "ad2", "ad3"… ilk boştaki.</summary>
    [UnitOfWork]
    public virtual async Task<string> SuggestAvailableAsync(string baseName)
    {
        var candidate = baseName;
        for (var suffix = 2; (await FindOwnerTenantIdsAsync(candidate)).Count > 0; suffix++)
        {
            candidate = baseName + suffix;
        }

        return candidate;
    }

    /// <summary>Küçük harf, Türkçe harfler sadeleşir, yalnız <c>[a-z0-9._-]</c> kalır: "Marmara Ltd." → "marmaraltd".</summary>
    public static string ToSlug(string text)
    {
        var builder = new StringBuilder(text.Length);
        foreach (var c in text.Trim().ToLowerInvariant())
        {
            var mapped = c switch
            {
                'ç' => 'c', 'ğ' => 'g', 'ı' => 'i', 'ö' => 'o', 'ş' => 's', 'ü' => 'u',
                'â' => 'a', 'î' => 'i', 'û' => 'u',
                _ => c
            };

            // Geri kalan her şey (boşluk, "+", "İ"nin küçültülünce bıraktığı birleşik nokta…) atılır.
            if (mapped is (>= 'a' and <= 'z') or (>= '0' and <= '9') or '.' or '-' or '_')
            {
                builder.Append(mapped);
            }
        }

        return builder.ToString().Trim('.', '-', '_');
    }
}
