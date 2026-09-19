using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Volo.Abp.Caching;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.Identity;
using Volo.Abp.Security.Claims;
using Volo.Abp.Settings;
using Volo.Abp.Threading;

namespace Apya.Platform.Identity;

/// <summary>
/// Şifrenin baştaki ve sondaki boşluklarını kırpar. Kopyala-yapıştırla gelen görünmez
/// boşluk yüzünden doğru şifre "geçersiz" sayılmasın diye.
/// Şifrenin İÇİNDEKİ boşluklar aynen korunur — "gizli anahtar 42" geçerli bir şifredir.
///
/// <para>
/// Kırpmanın neden burada olduğu: şifrenin ATANDIĞI yer çoktur (kayıt, şifre sıfırlama,
/// profil ekranı, kiracı oluşturma, kullanıcı yönetimi, tohumlama) ama DOĞRULANDIĞI yer
/// tektir. Kırpma bunların yalnız bir kısmına konsaydı asimetri doğardı: sonu boşluklu
/// şifre atanmış bir kullanıcı girişte kırpılmış şifreyle aranır ve BİR DAHA GİREMEZDİ.
/// Atama ve doğrulama tek çatı altında kırpılınca ikisinin aynı değeri görmesi garanti olur.
/// </para>
///
/// <para>
/// DİKKAT: bu davranış geriye dönük değildir. Bu değişiklikten ÖNCE şifresi boşlukla
/// başlayan/biten bir kullanıcı varsa hash'i o boşlukla üretilmiştir ve artık eşleşmez;
/// şifresini sıfırlaması gerekir. Hash tek yönlü olduğu için taşıma yapılamaz.
/// </para>
///
/// Kayıt: <see cref="PlatformDomainModule"/> — <c>UserManager&lt;IdentityUser&gt;</c> ve
/// <c>IdentityUserManager</c> kayıtları bu sınıfla değiştirilir.
/// </summary>
public class ApyaIdentityUserManager : IdentityUserManager
{
    public ApyaIdentityUserManager(
        IdentityUserStore store,
        IIdentityRoleRepository roleRepository,
        IIdentityUserRepository userRepository,
        IOptions<IdentityOptions> optionsAccessor,
        IPasswordHasher<IdentityUser> passwordHasher,
        IEnumerable<IUserValidator<IdentityUser>> userValidators,
        IEnumerable<IPasswordValidator<IdentityUser>> passwordValidators,
        ILookupNormalizer keyNormalizer,
        IdentityErrorDescriber errors,
        IServiceProvider services,
        ILogger<IdentityUserManager> logger,
        ICancellationTokenProvider cancellationTokenProvider,
        IOrganizationUnitRepository organizationUnitRepository,
        ISettingProvider settingProvider,
        IDistributedEventBus distributedEventBus,
        IIdentityLinkUserRepository identityLinkUserRepository,
        IDistributedCache<AbpDynamicClaimCacheItem> dynamicClaimCache)
        : base(
            store,
            roleRepository,
            userRepository,
            optionsAccessor,
            passwordHasher,
            userValidators,
            passwordValidators,
            keyNormalizer,
            errors,
            services,
            logger,
            cancellationTokenProvider,
            organizationUnitRepository,
            settingProvider,
            distributedEventBus,
            identityLinkUserRepository,
            dynamicClaimCache)
    {
    }

    // --- Doğrulama: girişin tek kapısı (SignInManager buraya iner) ---

    public override Task<bool> CheckPasswordAsync(IdentityUser user, string password)
    {
        return base.CheckPasswordAsync(user, TrimPassword(password));
    }

    // --- Atama: şifrenin hash'lendiği bütün yollar ---

    public override Task<IdentityResult> CreateAsync(IdentityUser user, string password)
    {
        return base.CreateAsync(user, TrimPassword(password));
    }

    /// <summary>ABP'nin kendi eklediği aşırı yüklemesi — kullanıcı yönetimi ekranı bunu çağırır.</summary>
    public override Task<IdentityResult> CreateAsync(IdentityUser user, string password, bool validatePassword)
    {
        return base.CreateAsync(user, TrimPassword(password), validatePassword);
    }

    public override Task<IdentityResult> AddPasswordAsync(IdentityUser user, string password)
    {
        return base.AddPasswordAsync(user, TrimPassword(password));
    }

    public override Task<IdentityResult> ChangePasswordAsync(IdentityUser user, string currentPassword, string newPassword)
    {
        return base.ChangePasswordAsync(user, TrimPassword(currentPassword), TrimPassword(newPassword));
    }

    public override Task<IdentityResult> ResetPasswordAsync(IdentityUser user, string token, string newPassword)
    {
        return base.ResetPasswordAsync(user, token, TrimPassword(newPassword));
    }

    /// <summary>
    /// Karmaşıklık kuralları da kırpılmış değer üzerinden koşsun — yoksa "  abc  " sekiz
    /// karakter sayılıp geçer, saklanan şifre ise üç karakter olurdu.
    /// </summary>
    public override Task<IdentityResult> CallValidatePasswordAsync(IdentityUser user, string password)
    {
        return base.CallValidatePasswordAsync(user, TrimPassword(password));
    }

    /// <summary>
    /// Yalnız boşluktan oluşan girdi KIRPILMAZ: kırpılsa boş dizeye dönerdi ve kullanıcı
    /// "şifre zorunludur" yerine "en az N karakter" gibi alakasız bir uyarı görürdü.
    /// Boş bırakılmış alanın uyarısını formların <c>[Required]</c> doğrulaması üretir.
    /// </summary>
    private static string TrimPassword(string password)
    {
        if (password is null)
        {
            return password!;
        }

        var trimmed = password.Trim();
        return trimmed.Length == 0 ? password : trimmed;
    }
}
