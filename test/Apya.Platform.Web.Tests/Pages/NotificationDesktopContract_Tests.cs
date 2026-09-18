using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Masaüstü bildirimi zinciri iki sözleşmeye dayanıyor ve ikisini de derleyici
/// GÖRMÜYOR:
///
/// <para>1. <c>SignalRNotificationEventHandler</c> anonim nesne yolluyor,
/// <c>notification-bell.js</c> onu alan adıyla okuyor. Sunucuda bir alanı
/// yeniden adlandırmak istemcide sessizce <c>undefined</c> üretir — masaüstü
/// bildirimi başlıksız çıkar ya da hiç çıkmaz, hiçbir test kırılmaz.</para>
///
/// <para>2. Yeni metinler <c>abp.localization</c> üzerinden geliyor; anahtar
/// json'da yoksa ABP İSTİSNA ATMAZ, anahtarın kendisini basar ("Notifications:
/// Desktop:Prompt" yazan bir düğme).</para>
///
/// Bu testler iki tarafı da KAYNAKTAN okuyor; elle güncellenen liste değil.
/// </summary>
public class NotificationDesktopContract_Tests : PlatformWebTestBase
{
    private readonly IStringLocalizer<PlatformResource> _localizer;

    public NotificationDesktopContract_Tests()
    {
        _localizer = GetRequiredService<IStringLocalizer<PlatformResource>>();
    }

    private static string FindRepoFile(params string[] segments)
    {
        // Test çıktısından yukarı çıkıp repo kökünü bul.
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(new[] { dir.FullName }.Concat(segments).ToArray());
            if (File.Exists(candidate)) { return candidate; }
            dir = dir.Parent;
        }

        return null;
    }

    private static string BellJsPath() => FindRepoFile(
        "src", "Apya.Platform.Web", "wwwroot", "Pages", "Notifications", "notification-bell.js");

    private static string CenterJsPath() => FindRepoFile(
        "src", "Apya.Platform.Web", "Pages", "Notifications", "Index.js");

    private static string HandlerPath() => FindRepoFile(
        "src", "Apya.Platform.Web", "Notifications", "SignalRNotificationEventHandler.cs");

    /// <summary>
    /// <c>SendAsync("ReceiveNotification", new { ... })</c> içindeki alan adları.
    /// </summary>
    private static List<string> ExtractServerFields(string source)
    {
        var start = source.IndexOf("\"ReceiveNotification\"", StringComparison.Ordinal);
        if (start < 0) { return new List<string>(); }

        var end = source.IndexOf("});", start, StringComparison.Ordinal);
        if (end < 0) { return new List<string>(); }

        return Regex.Matches(source[start..end], @"^\s*(\w+)\s*=", RegexOptions.Multiline)
            .Select(m => m.Groups[1].Value)
            .Distinct()
            .OrderBy(k => k, StringComparer.Ordinal)
            .ToList();
    }

    /// <summary>
    /// İstemcinin bildirim nesnesinden okuduğu alanlar. Değişken adı akışa göre
    /// değişiyor (<c>notificationDto</c> hub'dan gelen, <c>payload</c> masaüstü
    /// gösterimine giren, <c>dto</c> uyarı biçimini seçen) — üçü de aynı nesne.
    /// </summary>
    private static List<string> ExtractClientFields(string source)
    {
        return Regex.Matches(source, @"(?:notificationDto|payload|dto)\.(\w+)")
            .Select(m => m.Groups[1].Value)
            .Distinct()
            .OrderBy(k => k, StringComparer.Ordinal)
            .ToList();
    }

    private static List<string> ExtractLocalizationKeys(string source)
    {
        // (?<![\w$.]) — `.html('...')` gibi çağrılar da "l('" ile bitiyor.
        // Sonu ":" olan anahtarlar birleştirmedir (l('X:' + v)); statik olarak
        // doğrulanamaz, bu yüzden dışarıda bırakılıyor.
        return Regex.Matches(source, @"(?<![\w$.])l\('([^']+)'")
            .Select(m => m.Groups[1].Value)
            .Where(k => !k.EndsWith(":", StringComparison.Ordinal))
            .Distinct()
            .OrderBy(k => k, StringComparer.Ordinal)
            .ToList();
    }

    [Fact]
    public void Istemcinin_okudugu_her_bildirim_alani_sunucu_payloadinda_var()
    {
        var handlerPath = HandlerPath();
        var bellPath = BellJsPath();

        handlerPath.ShouldNotBeNull("SignalRNotificationEventHandler.cs bulunamadı; test yolu bozulmuş.");
        bellPath.ShouldNotBeNull("notification-bell.js bulunamadı; test yolu bozulmuş.");

        var serverFields = ExtractServerFields(File.ReadAllText(handlerPath));
        var clientFields = ExtractClientFields(File.ReadAllText(bellPath));

        // Sözleşmenin boş çıkmadığının kanıtı: ayrıştırma bozulursa test sessizce
        // geçmesin.
        serverFields.Count.ShouldBeGreaterThan(4,
            "ReceiveNotification payload'ı ayrıştırılamadı: " + string.Join(", ", serverFields));
        clientFields.ShouldNotBeEmpty();

        var missing = clientFields.Except(serverFields).ToList();

        missing.ShouldBeEmpty(
            "notification-bell.js bu alanları okuyor ama sunucu YOLLAMIYOR (istemcide undefined olur): " +
            string.Join(", ", missing));
    }

    /// <summary>
    /// Masaüstü bildiriminin çalışması için gereken üç alan: kimlik (çoklu sekmede
    /// tekilleştirme etiketi), aciliyet (kritikte kendiliğinden kapanmama) ve
    /// derin link (tıklamada doğru sayfa). Biri düşerse bildirim yine görünür ama
    /// davranışı sessizce bozulur — bu yüzden ayrıca çakılıyor.
    /// </summary>
    [Theory]
    [InlineData("id")]
    [InlineData("severity")]
    [InlineData("deepLinkUrl")]
    public void Masaustu_bildirimi_icin_gereken_alanlar_payloadda_kalir(string field)
    {
        var serverFields = ExtractServerFields(File.ReadAllText(HandlerPath()));

        serverFields.ShouldContain(field,
            $"'{field}' payload'dan düşmüş; masaüstü bildirimi sessizce yanlış davranır.");
    }

    [Fact]
    public void Bildirim_ekranlarindaki_tum_localization_anahtarlari_cozulur()
    {
        var paths = new[] { BellJsPath(), CenterJsPath() };

        foreach (var path in paths)
        {
            path.ShouldNotBeNull("Bildirim JS dosyası bulunamadı; test yolu bozulmuş.");

            var keys = ExtractLocalizationKeys(File.ReadAllText(path));
            keys.ShouldNotBeEmpty($"{Path.GetFileName(path)} içinde hiç l('...') çağrısı bulunamadı.");

            var missing = keys.Where(k => _localizer[k].ResourceNotFound).ToList();

            missing.ShouldBeEmpty(
                $"{Path.GetFileName(path)} şu anahtarları kullanıyor ama localization'da YOK " +
                "(ekranda anahtarın kendisi görünür): " + string.Join(", ", missing));
        }
    }

    /// <summary>
    /// Service worker'daki push işleyicisi bir zamanlar <c>/api/app/approvals/...</c>
    /// uçlarına POST atan onay/red düğmeleri taşıyordu; o uçlar kod tabanında hiç
    /// var olmadı. Abonelik (Faz 2) açıldığı gün kullanıcıya 404 üreten düğme
    /// göstermemek için çıkarıldı — geri sızmasın.
    /// </summary>
    [Fact]
    public void ServiceWorker_var_olmayan_onay_ucuna_istek_atmaz()
    {
        var path = FindRepoFile("src", "Apya.Platform.Web", "wwwroot", "sw.js");
        path.ShouldNotBeNull("sw.js bulunamadı; test yolu bozulmuş.");

        var source = File.ReadAllText(path);

        // Yorumlar tarihçeyi ANLATIYOR (neden çıkarıldığı yazılı); ölçülen şey
        // çalışan kod. Blok yorumları tek tek satır başına bakarak ayıklamak
        // yetmez — devam satırları boşlukla başlıyor.
        var code = Regex.Replace(source, @"/\*.*?\*/", string.Empty, RegexOptions.Singleline);
        code = Regex.Replace(code, @"//.*$", string.Empty, RegexOptions.Multiline);

        // customMessage ADLANDIRILARAK geçiliyor: Shouldly'nin string aşırı yüklemesinde
        // ikinci konumsal parametre `Case`, mesaj değil (konumsal verilince derleyici
        // IEnumerable<char> aşırı yüklemesine düşüyor).
        code.ShouldNotContain("/api/app/approvals",
            customMessage: "sw.js var olmayan onay ucuna istek atıyor — kullanıcı 404 alır.");
    }
}
