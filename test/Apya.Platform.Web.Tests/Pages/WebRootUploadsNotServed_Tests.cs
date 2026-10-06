using System;
using System.IO;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 🔴 <c>wwwroot/uploads</c> altına düşen dosya oturumsuz servis EDİLMEZ.
///
/// <para>Yüklemeler <c>App_Data/uploads</c>'ta durur ve yalnız sahiplik kontrolü yapan
/// uçlardan okunur. Ama <c>wwwroot</c> altındaki her dosya statik varlıktır: 2026-08-08'de
/// bir commit'le yanlışlıkla depoya giren on belge, o günden sonraki her dağıtımda
/// <c>/uploads/…</c> adresinden kimlik sorulmadan indirilebiliyordu.</para>
///
/// <para>Dosyaları silmek o olayı kapatır; bu test sınıfın tamamını kapatır: klasöre bir
/// dosya yeniden düşse bile (yanlış işlenen dosya, eski sürümden kalan, yanlış bağlanan
/// birim) adres cevap vermez.</para>
/// </summary>
public class WebRootUploadsNotServed_Tests : PlatformWebTestBase
{
    private const string Secret = "kimseye servis edilmemesi gereken içerik";

    /// <summary>
    /// Klasöre GERÇEK bir dosya konur ve istenir. Cevap, hiç var olmayan bir dosyanın
    /// cevabından ayırt edilemez olmalı: içerik gelmez, "burada bir dosya var" bilgisi de sızmaz.
    /// Adresin büyük/küçük harfle yazılması kapıyı aşmaz.
    /// </summary>
    [Theory]
    [InlineData("/uploads/")]
    [InlineData("/Uploads/")]
    [InlineData("/UPLOADS/")]
    public async Task Wwwroot_uploads_altindaki_dosya_servis_edilmez(string prefix)
    {
        // Test barındırıcısı statik dosyaları Web projesinin KAYNAK wwwroot'undan servis eder.
        var folder = Path.Combine(WebProjectRoot(), "wwwroot", "uploads");
        var folderExisted = Directory.Exists(folder);
        Directory.CreateDirectory(folder);

        var name = Guid.NewGuid().ToString("N") + ".txt";
        var path = Path.Combine(folder, name);
        await File.WriteAllTextAsync(path, Secret);

        try
        {
            var missing = await Client.GetAsync("/boyle-bir-dosya-yok-" + Guid.NewGuid().ToString("N") + ".txt");
            var response = await Client.GetAsync(prefix + name);

            response.IsSuccessStatusCode.ShouldBeFalse("wwwroot/uploads altındaki dosya servis edildi");
            (await response.Content.ReadAsStringAsync()).ShouldNotContain(Secret);
            response.StatusCode.ShouldBe(missing.StatusCode);
            response.Headers.Location.ShouldBe(missing.Headers.Location);
        }
        finally
        {
            File.Delete(path);
            if (!folderExisted)
            {
                Directory.Delete(folder);
            }
        }
    }

    private static string WebProjectRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Apya.Platform.Web");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Apya.Platform.Web proje kökü bulunamadı.");
    }
}
