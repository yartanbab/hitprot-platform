using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Accounts;

/// <summary>
/// Giriş ekranına yazılan kullanıcı adı / e-posta hangi kiracıya aitse onu bulur.
/// Kullanıcı kiracı adı yazmak zorunda kalmasın diye var.
///
/// GÜVENLİK: Bu bir AppService DEĞİL — bilerek. IApplicationService olsaydı ABP
/// bunu otomatik REST ucu olarak yayınlardı ve giriş ekranı oturumsuz olduğu için
/// herkesin "bu e-posta sistemde var mı, hangi müşteride" diye sorgulayabildiği
/// bir kullanıcı sayım açığı doğardı. Düz domain servisi olarak kalmalı; sonucu
/// yalnız giriş akışı kullanır, hiçbir yanıta yansımaz.
/// </summary>
public class LoginTenantFinder : DomainService
{
    private readonly IRepository<IdentityUser, Guid> _userRepository;
    private readonly ILookupNormalizer _lookupNormalizer;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;

    public LoginTenantFinder(
        IRepository<IdentityUser, Guid> userRepository,
        ILookupNormalizer lookupNormalizer,
        IDataFilter<IMultiTenant> multiTenantFilter)
    {
        _userRepository = userRepository;
        _lookupNormalizer = lookupNormalizer;
        _multiTenantFilter = multiTenantFilter;
    }

    /// <summary>
    /// Girilen kullanıcı adı veya e-posta ile eşleşen kullanıcıların kiracı
    /// kimliklerini döner. Host kullanıcısı <c>null</c> eleman olarak gelir.
    /// Hiç eşleşme yoksa boş liste döner.
    /// </summary>
    public async Task<List<Guid?>> FindTenantIdsAsync(string userNameOrEmailAddress)
    {
        if (string.IsNullOrWhiteSpace(userNameOrEmailAddress))
        {
            return new List<Guid?>();
        }

        // AbpUsers'ta arama normalize edilmiş sütunlar üzerinden yapılır; ham metinle
        // karşılaştırmak büyük/küçük harf yüzünden sessizce ıskalar.
        var normalizedUserName = _lookupNormalizer.NormalizeName(userNameOrEmailAddress);
        var normalizedEmail = _lookupNormalizer.NormalizeEmail(userNameOrEmailAddress);

        // Giriş anında hangi kiracıda olduğumuzu HENÜZ bilmiyoruz — aradığımız şey
        // zaten bu. Bu yüzden kiracı filtresi kapatılıp bütün kiracılara bakılır.
        using (_multiTenantFilter.Disable())
        {
            var queryable = await _userRepository.GetQueryableAsync();

            var tenantIds = await AsyncExecuter.ToListAsync(
                queryable
                    .Where(u => u.NormalizedUserName == normalizedUserName
                             || u.NormalizedEmail == normalizedEmail)
                    .Select(u => u.TenantId)
                    .Distinct());

            // Sıra deterministik olsun (birden fazla eşleşmede hep aynı kiracı önce
            // denensin); host (null) en başta kalır ki mevcut host girişi bozulmasın.
            return tenantIds.OrderBy(id => id.HasValue).ThenBy(id => id).ToList();
        }
    }
}
