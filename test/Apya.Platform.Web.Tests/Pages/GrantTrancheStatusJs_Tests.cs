using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Hibe ekranları sunucu enum'larını istemcide ELLE yazılmış dizilerle eşliyor
/// (<c>var trancheKeys = ['Planlandi', ...]</c>). Bu sözleşmeyi hiçbir derleyici
/// denetlemiyor: enum'a değer eklenir ya da sıra değişirse JS sessizce yanlış
/// etiketi basar.
///
/// <para>🔴 Gerçek regresyon (2026-09-17 denetiminde bulundu): dizi
/// <c>['Planlandi','Odendi','Iptal']</c> yazıyordu, enum ise
/// <c>Planlandi=0, TalepEdildi=1, Odendi=2</c>. <c>MarkPaid()</c> durumu 2 yaptığı
/// için ÖDENMİŞ dilim ekranda "İptal" görünüyordu — üstelik "Iptal" enum'da hiç
/// yok. Aynı dosyada <c>paid = trancheStatus === 1</c> olduğu için ödenen dilim
/// hiçbir zaman ödenmiş biçimini de almıyordu.</para>
///
/// <para>Bu test diziyi enum'a kilitler. Aynı desen diğer 19 hibe enum'u için de
/// geçerli; durum sözlüğü tek kaynağa taşınana kadar en azından bu ikisi korunur.</para>
/// </summary>
public class GrantTrancheStatusJs_Tests
{
    /// <summary>Dizi tanımının bulunduğu dosyalar: değişken adı dosyadan dosyaya farklı.</summary>
    private static readonly string[] Files =
    {
        "Implementation.js",
        "DetailHost.js"
    };

    private static string FindGrantsJs(string fileName)
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Apya.Platform.Web", "Pages", "Grants", fileName);
            if (File.Exists(candidate)) { return candidate; }
            dir = dir.Parent;
        }

        return null;
    }

    /// <summary>
    /// <c>trancheKeys</c> / <c>trancheStatus</c> adlı dizi atamasını bulup
    /// tırnaklı öğeleri sırasıyla döndürür.
    /// </summary>
    private static List<string> ExtractTrancheArray(string source)
    {
        var match = Regex.Match(source, @"var\s+(?:trancheKeys|trancheStatus)\s*=\s*\[([^\]]*)\]");
        if (!match.Success) { return null; }

        return Regex.Matches(match.Groups[1].Value, @"'([^']+)'")
            .Select(m => m.Groups[1].Value)
            .ToList();
    }

    [Theory]
    [InlineData("Implementation.js")]
    [InlineData("DetailHost.js")]
    public void Dilim_durumu_dizisi_enum_sirasiyla_birebir(string fileName)
    {
        var path = FindGrantsJs(fileName);

        // Dosya bulunamazsa test SESSİZCE geçmemeli — aksi halde hiçbir şey ölçmez.
        path.ShouldNotBeNull($"{fileName} bulunamadı; test yolu bozulmuş olabilir.");

        var keys = ExtractTrancheArray(File.ReadAllText(path));
        keys.ShouldNotBeNull($"{fileName} içinde trancheKeys/trancheStatus dizisi bulunamadı.");

        var expected = Enum.GetNames(typeof(GrantDisbursementTrancheStatus));

        // ignoreOrder ADLANDIRILARAK veriliyor: Shouldly'nin IEnumerable<string>
        // aşırı yüklemesi üçüncü argümanı aksi halde Case sanıyor.
        keys.ShouldBe(
            expected,
            ignoreOrder: false,
            customMessage: $"{fileName} içindeki dilim durumu dizisi GrantDisbursementTrancheStatus " +
            "sırasıyla birebir olmalı; kayarsa ekran yanlış durumu yazar.");
    }

    /// <summary>
    /// Diziden üretilen <c>Grants:Tranche:&lt;Ad&gt;</c> anahtarlarının hepsinin
    /// yerelleştirmede karşılığı olmalı — yoksa ABP istisna atmaz, ham anahtarı basar.
    /// </summary>
    [Fact]
    public void Her_dilim_durumunun_yerellestirme_anahtari_var()
    {
        var trPath = FindLocalization("tr.json");
        trPath.ShouldNotBeNull("tr.json bulunamadı.");

        var tr = File.ReadAllText(trPath);

        foreach (var name in Enum.GetNames(typeof(GrantDisbursementTrancheStatus)))
        {
            tr.ShouldContain(
                $"\"Grants:Tranche:{name}\"",
                Case.Sensitive,
                $"Grants:Tranche:{name} anahtarı tr.json'da yok; ekranda ham anahtar görünür.");
        }
    }

    private static string FindLocalization(string fileName)
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(
                dir.FullName, "src", "Apya.Platform.Domain.Shared", "Localization", "Platform", fileName);
            if (File.Exists(candidate)) { return candidate; }
            dir = dir.Parent;
        }

        return null;
    }
}
