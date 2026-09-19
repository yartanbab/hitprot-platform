using System;
using System.Threading.Tasks;
using Apya.Platform.Identity;
using Shouldly;
using Volo.Abp.Identity;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Identity;

/// <summary>
/// KİLİT SÖZLEŞME: şifrenin baş/son boşluğu kırpılır, İÇİNDEKİ boşluk korunur.
/// <para>
/// Kırpma, şifrenin atandığı ve doğrulandığı yolların HEPSİNDE aynı anda geçerli olmalı.
/// Aksi hâlde sonu boşluklu şifre atanan kullanıcı girişte kırpılmış şifreyle aranır ve
/// bir daha giremez. Bu yüzden testler UserManager üzerinden koşuyor: hem
/// <c>CreateAsync</c> (atama) hem <c>CheckPasswordAsync</c> (doğrulama) tek sınıftan geçer.
/// </para>
/// Domain.Tests değil bu proje: kullanıcı oluşturmak gerçek IdentityUserStore ve
/// dolayısıyla EF Core gerektirir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class PasswordWhitespace_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IdentityUserManager _userManager;

    public PasswordWhitespace_Tests()
    {
        _userManager = GetRequiredService<IdentityUserManager>();
    }

    /// <summary>
    /// DI kaydı sessizce düşerse aşağıdaki davranış testleri de düşer ama sebebi belirsiz
    /// kalırdı; kaydı ayrıca ve açıkça bağlıyoruz. İki servis tipi de aynı sınıfa çözülmeli:
    /// giriş akışı UserManager&lt;IdentityUser&gt;'ı, ABP servisleri IdentityUserManager'ı ister.
    /// (ABP servisleri Castle proxy'siyle sarar; bu yüzden tip eşitliği değil kalıtım aranır.)
    /// </summary>
    [Fact]
    public void Both_UserManager_Registrations_Should_Resolve_To_Trimming_Manager()
    {
        GetRequiredService<IdentityUserManager>()
            .ShouldBeAssignableTo<ApyaIdentityUserManager>();

        GetRequiredService<Microsoft.AspNetCore.Identity.UserManager<IdentityUser>>()
            .ShouldBeAssignableTo<ApyaIdentityUserManager>();
    }

    [Fact]
    public async Task Trailing_Space_Should_Not_Be_Part_Of_The_Password()
    {
        var user = await CreateUserWithPasswordAsync("Apya 1!x ");

        // Atarken kırpıldığı için, kullanıcı boşluğu yazsa da yazmasa da girebilmeli.
        (await _userManager.CheckPasswordAsync(user, "Apya 1!x ")).ShouldBeTrue();
        (await _userManager.CheckPasswordAsync(user, "Apya 1!x")).ShouldBeTrue();
    }

    [Fact]
    public async Task Leading_Space_Should_Not_Be_Part_Of_The_Password()
    {
        var user = await CreateUserWithPasswordAsync(" Apya 1!x");

        (await _userManager.CheckPasswordAsync(user, " Apya 1!x")).ShouldBeTrue();
        (await _userManager.CheckPasswordAsync(user, "Apya 1!x")).ShouldBeTrue();
    }

    /// <summary>
    /// İstenen davranışın diğer yarısı: boşluk şifrenin İÇİNDE geçerli bir karakterdir.
    /// Kırpma "her boşluğu at" hâline gelirse bu test düşer.
    /// </summary>
    [Fact]
    public async Task Inner_Spaces_Should_Stay_Significant()
    {
        var user = await CreateUserWithPasswordAsync("Apya 1!x");

        (await _userManager.CheckPasswordAsync(user, "Apya 1!x")).ShouldBeTrue();
        (await _userManager.CheckPasswordAsync(user, "Apya1!x")).ShouldBeFalse();
    }

    private async Task<IdentityUser> CreateUserWithPasswordAsync(string password)
    {
        var id = Guid.NewGuid();
        var user = new IdentityUser(id, $"bosluk-test-{id:N}", $"{id:N}@test.local");

        (await _userManager.CreateAsync(user, password)).Succeeded.ShouldBeTrue();

        return user;
    }
}
