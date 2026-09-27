using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Parametre sayfasının alt çubuğundaki "N zorunlu alan boş — …" adları, sunucunun
/// <c>GrantParameterAppService.Field*</c> anahtarlarına ADLA bağlı <c>MISSING_TARGETS</c>
/// tablosuyla alanlarına götürür. Hedefi olmayan anahtar sessizce düz metin kalır;
/// sunucuya yeni zorunlu alan eklenip JS unutulursa bu test kırmızı verir.
/// </summary>
public class GrantParametersMissingJump_Tests
{
    private static string FindRepoFile(params string[] relativeSegments)
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(new[] { dir.FullName }.Concat(relativeSegments).ToArray());
            if (File.Exists(candidate)) { return candidate; }
            dir = dir.Parent;
        }

        return null;
    }

    [Fact]
    public void Her_zorunlu_alanin_sayfada_bir_hedefi_var()
    {
        var jsPath = FindRepoFile("src", "Apya.Platform.Web", "Pages", "Grants", "Parameters.js");
        jsPath.ShouldNotBeNull("Parameters.js bulunamadı; test yolu bozulmuş olabilir.");

        var table = Regex.Match(File.ReadAllText(jsPath), @"var MISSING_TARGETS = \{(.*?)\};", RegexOptions.Singleline);
        table.Success.ShouldBeTrue("Parameters.js'te MISSING_TARGETS tablosu bulunamadı.");

        var fields = typeof(GrantParameterAppService)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(f => f.IsLiteral && f.Name.StartsWith("Field"))
            .Select(f => (string)f.GetRawConstantValue()!)
            .ToList();
        fields.ShouldNotBeEmpty();

        foreach (var field in fields)
        {
            Regex.IsMatch(table.Groups[1].Value, $@"\b{field}\s*:").ShouldBeTrue(
                $"'{field}' zorunlu alanının MISSING_TARGETS'ta hedefi yok — eksik alan adı tıklanamaz kalır.");
        }
    }
}
