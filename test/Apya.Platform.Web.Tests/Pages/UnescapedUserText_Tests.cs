using System.IO;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kullanıcının (ya da kullanıcının yüklediği belgenin) yazdığı metin HTML'e KAÇIŞLA eklenir.
///
/// <para>Üç yerde metin dizgi birleştirmeyle doğrudan HTML'e basılıyordu:
/// <list type="bullet">
/// <item>Projeler listesinde <b>kategori adı</b> — kiracının serbest yazdığı metin (64 karakter).
/// Kategori yönetme izni olan biri, listeyi açan HERKESİN oturumunda betik çalıştırabiliyordu.</item>
/// <item>AI görev üreticisinde öneri başlığı ve bölüm adı — yüklenen belgeden türer.</item>
/// <item>Görev düzenleme penceresinde yüklenen dosyanın adı.</item>
/// </list>
/// Betikler jQuery/ABP kabuğuna bağlı olduğu için sözleşme kaynaktan kilitlenir.</para>
/// </summary>
public class UnescapedUserText_Tests
{
    private static string Read(params string[] relative)
    {
        var path = Path.Combine(WebSourceFiles.RepoRoot(), Path.Combine(relative));
        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {path}");
        return File.ReadAllText(path);
    }

    [Fact]
    public void Projeler_Listesi_Kategori_Adini_Kacisla_Basar()
    {
        var script = Read("src", "Apya.Platform.Web", "Pages", "Projects", "Index.js");

        // Satır ve kart görünümü: iki yerde basılır.
        Regex.Matches(script, @"esc\(cat\.label\)").Count.ShouldBe(2);
        Regex.IsMatch(script, @"\+\s*cat\.label\s*\+").ShouldBeFalse("kategori adı kaçışsız basılıyor");
    }

    [Fact]
    public void Ai_Gorev_Onerileri_Belgeden_Gelen_Metni_Kacisla_Basar()
    {
        var page = Read("src", "Apya.Platform.Web", "Pages", "Projects", "AiTaskGeneratorModal.cshtml");

        page.ShouldContain("${escapeHtml(s.title)}");
        page.ShouldContain("${escapeHtml(s.sourceSection)}");
        page.ShouldContain("escapeHtml(t.title)");
        Regex.IsMatch(page, @"\$\{s\.(title|sourceSection)\}").ShouldBeFalse("öneri metni kaçışsız basılıyor");
        Regex.IsMatch(page, @"\+\s*t\.title\s*\+").ShouldBeFalse("oluşturulan görev başlığı kaçışsız basılıyor");
    }

    [Fact]
    public void Gorev_Duzenleme_Yuklenen_Dosya_Adini_Kacisla_Basar()
    {
        var page = Read("src", "Apya.Platform.Web", "Pages", "Tasks", "EditModal.cshtml");

        Regex.IsMatch(page, @"'\s*\+\s*file\.name\s*\+\s*'").ShouldBeFalse("dosya adı kaçışsız basılıyor");
        page.ShouldContain("$('<div>').text(file.name).html()");
    }
}
