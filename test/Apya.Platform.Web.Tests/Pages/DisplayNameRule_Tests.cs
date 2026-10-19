using System.IO;
using System.Linq;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// QA-21/39/48 · Görev ve doküman ekranlarında kişi adı TEK kuraldan gelir (TaskPersonName: ad soyad,
/// yoksa kullanıcı adı). Kullanıcı adını görüntü adı olarak sözlüğe koyan eşleme kalmamalı.
/// </summary>
public class DisplayNameRule_Tests
{
    [Theory]
    [InlineData("Tasks")]
    [InlineData("Documents")]
    public void Kullanici_adi_goruntu_adi_olarak_eslenmez(string folder)
    {
        var dir = Path.Combine(WebSourceFiles.RepoRoot(), "src", "Apya.Platform.Application", folder);
        var offenders = Directory.GetFiles(dir, "*.cs", SearchOption.AllDirectories)
            .Where(f => File.ReadAllText(f).Contains("v => v.UserName)") || File.ReadAllText(f).Contains("u => u.UserName)"))
            .Select(Path.GetFileName)
            .ToList();

        offenders.ShouldBeEmpty();
    }
}
