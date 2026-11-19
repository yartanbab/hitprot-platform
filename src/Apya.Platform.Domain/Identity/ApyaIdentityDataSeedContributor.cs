using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;

namespace Apya.Platform.Identity;

/// <summary>
/// ABP'nin yönetici tohumlayıcısını, kullanıcı adının sistem genelinde tekil olması kuralına uyarlar.
///
/// <para><b>Kiracı kurulurken</b> (bağlamda gerçek bir yönetici e-postası var, ad verilmemiş):
/// yönetici "admin" yerine e-postasından türetilen boşta bir adla açılır
/// (<see cref="UniqueUserNameChecker.SuggestFromEmailAsync"/>). Kiracı hangi yoldan açılırsa
/// açılsın (Yeni Müşteri, protokol onayı, ABP'nin kendi kiracı ucu) ad tek yerde üretilir.</para>
///
/// <para><b>DbMigrator'ın yeniden tohumlaması</b> her kiracıya varsayılan e-postayla
/// (<c>admin@abp.io</c>) gelir. ABP bu durumda kiracıda "admin" adlı kullanıcı arar, bulamazsa
/// varsayılan şifreyle (<c>1q2w3E*</c>) YENİ bir yönetici açar. Yöneticinin adı artık "admin"
/// olmadığı için bu her yayında olurdu; kiracı bağlamında varsayılan e-postayla gelen çağrı bu
/// yüzden hiçbir şey yapmaz. Host aynen ABP'nin akışındadır.</para>
///
/// <para>Kayıt: ABP sözleşmesi tipi kendi sınıfıyla da listeye aldığı için tohumlama sırasında
/// bu sınıf iki kez çalışabilir; ikinci çalışma yöneticiyi bulup çıkar (zararsız).</para>
/// </summary>
[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(IdentityDataSeedContributor), IncludeSelf = true)]
public class ApyaIdentityDataSeedContributor : IdentityDataSeedContributor
{
    private readonly UniqueUserNameChecker _userNameChecker;

    public ApyaIdentityDataSeedContributor(
        IIdentityDataSeeder identityDataSeeder,
        UniqueUserNameChecker userNameChecker)
        : base(identityDataSeeder)
    {
        _userNameChecker = userNameChecker;
    }

    public override async Task SeedAsync(DataSeedContext context)
    {
        if (context?.TenantId != null && context[AdminUserNamePropertyName] is not string)
        {
            var email = context[AdminEmailPropertyName] as string;
            if (string.IsNullOrWhiteSpace(email) || email == AdminEmailDefaultValue)
            {
                return;
            }

            context.WithProperty(AdminUserNamePropertyName, await _userNameChecker.SuggestFromEmailAsync(email));
        }

        await base.SeedAsync(context!);
    }
}
