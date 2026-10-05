using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Localization;

/// <summary>
/// 🔴 Sessiz tuzak: ABP'de <c>ApplicationService.L</c>, <c>LocalizationResource</c>
/// ayarlanmadıysa içi BOŞ olan <c>DefaultResource</c>'u kullanır —
/// <c>AbpLocalizationOptions.DefaultResourceType</c>'a bakmaz. Yani
/// <c>PlatformAppService</c>'ten türemeyen bir serviste <c>L["Anahtar"]</c> çeviriyi değil
/// ANAHTARIN KENDİSİNİ döndürür. Derleme yeşil kalır, istisna atılmaz.
///
/// <para>2026-10-05'te dört serviste bulundu: firmaya giden aşama bildirimi
/// "Grants:Stage:Odeme", gönderim izi "Grants:Notify:Trigger:ApplicationSubmitted:…",
/// devretme izi "Grants:Party:Danisman", rapordaki ekip satırı
/// "Documents:Report:UnknownContributor" yazıyordu. Testleri yeşildi çünkü hepsi
/// yalnız "boş değil" diye ölçüyordu.</para>
///
/// <para>Kaynak okuyan bir sözleşme: çalışma zamanında "bu servis L kullanıyor mu"
/// sorulamaz, ama kaynakta sorulabilir.</para>
/// </summary>
public class AppServiceLocalizationContract_Tests
{
    // GetFullPath ŞART: ham yol test çıktı klasöründen ("bin/Debug/net10.0/../..") başlar ve
    // içinde bin klasörü geçer; aşağıdaki bin/obj süzgeci o zaman HER dosyayı atlar ve test
    // hiçbir şey ölçmeden yeşil verir. İlk yazımda tam olarak bu oldu — bu yüzden taranan
    // dosya sayısı da doğrulanıyor.
    private static readonly string SourceRoot = Path.GetFullPath(Path.Combine(
        Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "src"));

    /// <summary>
    /// Bir dosya <c>L[…]</c> kullanıyorsa yerelleştiricinin NEREDEN geldiği belli olmalı:
    /// kaynağı ayarlayan tabandan türemek, kaynağı kendisi ayarlamak ya da tipli bir
    /// yerelleştirici enjekte etmek.
    /// </summary>
    private static bool HasLocalizerSource(string code) =>
        Regex.IsMatch(code, @":\s*PlatformAppService\b")
        || Regex.IsMatch(code, @":\s*PlatformController\b")
        || Regex.IsMatch(code, @"LocalizationResource\s*=")
        || Regex.IsMatch(code, @"I(String|Html)Localizer<");

    [Theory]
    [InlineData("Apya.Platform.Application")]
    [InlineData("Apya.Platform.Ai.Application")]
    [InlineData("Apya.Platform.HttpApi")]
    [InlineData("Apya.Platform.Ai.HttpApi")]
    public void L_kullanan_her_servis_yerellestirme_kaynagini_biliyor(string project)
    {
        var root = Path.Combine(SourceRoot, project);
        Directory.Exists(root).ShouldBeTrue($"Proje bulunamadı: {Path.GetFullPath(root)}");

        var offenders = new List<string>();
        var scanned = 0;

        foreach (var file in Directory.EnumerateFiles(root, "*.cs", SearchOption.AllDirectories))
        {
            if (file.Contains($"{Path.DirectorySeparatorChar}obj{Path.DirectorySeparatorChar}")
                || file.Contains($"{Path.DirectorySeparatorChar}bin{Path.DirectorySeparatorChar}"))
            {
                continue;
            }

            scanned++;
            var code = File.ReadAllText(file);

            if (Regex.IsMatch(code, @"\bL\[") && !HasLocalizerSource(code))
            {
                offenders.Add(Path.GetRelativePath(root, file));
            }
        }

        scanned.ShouldBeGreaterThan(0, $"{project}: hiç dosya taranmadı — yol ya da süzgeç bozuk");

        offenders.ShouldBeEmpty(
            "Bu dosyalar L[…] kullanıyor ama yerelleştirme kaynağı yok — L çeviri yerine ham anahtarı "
            + "döndürür. Sınıfı PlatformAppService'ten türetin: " + string.Join(", ", offenders));
    }

    /// <summary>Sözleşmenin dayandığı taban gerçekten kaynağı ayarlıyor mu.</summary>
    [Fact]
    public void PlatformAppService_kaynagi_ayarliyor()
    {
        var path = Path.Combine(SourceRoot, "Apya.Platform.Application", "PlatformAppService.cs");
        File.Exists(path).ShouldBeTrue();

        Regex.IsMatch(File.ReadAllText(path), @"LocalizationResource\s*=\s*typeof\(PlatformResource\)")
            .ShouldBeTrue("PlatformAppService yerelleştirme kaynağını ayarlamayı bırakırsa tüm servisler ham anahtar döndürür");
    }
}
