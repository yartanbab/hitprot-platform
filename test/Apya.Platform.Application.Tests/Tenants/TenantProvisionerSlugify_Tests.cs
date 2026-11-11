using Apya.Platform.Tenants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Tenants;

/// <summary>
/// Kayıt talebiyle açılan kiracının adı kurum unvanından türetilir. Büyük 'İ' tanınmadığı için
/// canlıda "erkam-eg-t-m-gencl-k-ve-kultur-derneg", "huday-m" gibi adlar oluştu.
/// </summary>
public class TenantProvisionerSlugify_Tests
{
    [Theory]
    [InlineData("ERKAM EĞİTİM GENÇLİK VE KÜLTÜR DERNEĞİ", "erkam-egitim-genclik-ve-kultur-dernegi")]
    [InlineData("HÜDAYİM", "hudayim")]
    [InlineData("İstanbul İzcileri Derneği", "istanbul-izcileri-dernegi")]
    [InlineData("ŞAHSİYET ÖZEL IŞIK", "sahsiyet-ozel-isik")]
    [InlineData("lider eğitim gençlik derneği", "lider-egitim-genclik-dernegi")]
    public void Turkce_harfler_ASCII_karsiligina_iner(string unvan, string beklenen)
    {
        TenantProvisioner.Slugify(unvan).ShouldBe(beklenen);
    }
}
