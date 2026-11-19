using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Identity;

namespace Apya.Platform.Identity;

/// <summary>
/// Kullanıcı adı başka bir kiracıda (ya da host'ta) zaten varsa kullanıcıyı reddeder.
/// ASP.NET Identity'nin kendi doğrulayıcısı yalnız AYNI kiracıya bakar; bu sınıf aradaki
/// boşluğu kapatır. Kural <see cref="UniqueUserNameChecker"/>'da.
///
/// <para>Hata kodu bilerek <c>DuplicateUserName</c>: ABP hatayı bu koda göre yerelleştirir
/// (tanımadığı kodda "bilinmeyen hata" basar) ve aynı kiracıdaki çakışma da aynı mesajı verir.
/// Metin <c>Localization/Identity/tr.json</c>'da: "Bu kullanıcı adı kullanılamaz."</para>
///
/// <para>🔑 Ad DEĞİŞMİYORSA kontrol edilmez. Bu kuraldan önce açılmış çakışan hesaplar var;
/// giriş, kilitlenme sayacı, profil kaydı gibi her güncelleme doğrulayıcıdan geçtiği için
/// aksi halde o kişiler hiçbir şeyini kaydedemezdi.</para>
/// </summary>
public class GlobalUniqueUserNameValidator : IUserValidator<IdentityUser>
{
    private readonly UniqueUserNameChecker _checker;

    public GlobalUniqueUserNameValidator(UniqueUserNameChecker checker)
    {
        _checker = checker;
    }

    public async Task<IdentityResult> ValidateAsync(UserManager<IdentityUser> manager, IdentityUser user)
    {
        var userName = await manager.GetUserNameAsync(user);
        if (string.IsNullOrWhiteSpace(userName))
        {
            // Boş adın uyarısını Identity'nin kendi doğrulayıcısı üretir.
            return IdentityResult.Success;
        }

        // Veritabanındaki ad yeni adla aynıysa değişiklik yok. Varlığın kendi NormalizedUserName'i
        // kullanılamaz: ABP onu kurucuda doldurur, yeni kullanıcı da "değişmemiş" görünürdü.
        var storedName = await _checker.FindStoredNormalizedUserNameAsync(user.Id);
        if (storedName != null && storedName == manager.NormalizeName(userName))
        {
            return IdentityResult.Success;
        }

        var owners = await _checker.FindOwnerTenantIdsAsync(userName, user.Id);

        // Aynı kiracıdaki çakışmayı Identity'nin doğrulayıcısı zaten bildirir; ikinci kez
        // eklenirse mesaj iki kere basılırdı.
        if (owners.All(tenantId => tenantId == user.TenantId))
        {
            return IdentityResult.Success;
        }

        return IdentityResult.Failed(manager.ErrorDescriber.DuplicateUserName(userName));
    }
}
