using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Derleyicinin ve sayfa testlerinin göremediği, yalnız tarayıcıda patlayan bir form
/// sözleşmesini kaynak üzerinden kilitler (2026-09-28 UX denetimi, CUS-02).
/// </summary>
public class DynamicFormMarkup_Tests
{
    /// <summary>
    /// <c>&lt;abp-dynamic-form&gt;</c>, içinde <c>&lt;abp-form-content /&gt;</c> yoksa modelin
    /// TÜM alanlarını formun başına ikinci kez basar. Model bağlama skaler alanda İLK değeri
    /// aldığı için elle yazılan alanlara girilen değerler yok sayılır: yeni fatura hiç
    /// kaydedilemiyordu, AI Merkezi ve hibe modalları boş/eski kopyayı kaydediyordu.
    /// Doğru desen düz form: <c>&lt;form method="post" action="@Url.Page(...)"&gt;</c>.
    /// </summary>
    [Fact]
    public void Dinamik_form_elle_alanla_kullanilmaz()
    {
        var offenders = RazorPages()
            .Where(f =>
            {
                var text = File.ReadAllText(f);
                return Regex.IsMatch(text, "<abp-dynamic-form\\b")
                       && !text.Contains("<abp-form-content", StringComparison.Ordinal);
            })
            .Select(Relative)
            .ToList();

        offenders.ShouldBeEmpty(
            "abp-dynamic-form içinde <abp-form-content /> yok; alanlar çift basılır ve girilen " +
            "değerler kaydedilmez. Düz <form method=\"post\"> kullanın:" +
            Environment.NewLine + string.Join(Environment.NewLine, offenders));
    }

    /// <summary>
    /// ABP ModalManager pencere açılınca ilk <c>&lt;input&gt;</c>'a odaklanıp <c>setSelectionRange</c>
    /// çağırır; sayı alanında bu çağrı InvalidStateError fırlatır (her açılışta yakalanmamış hata +
    /// istemci hata telemetrisi). Dinamik form başa metin alanları basıyordu; düz formda Yeni Form
    /// Bağlama'nın ilk input'u sayı alanı "Sıra" (öncekiler <c>&lt;select&gt;</c>). Odak açıkça ilk
    /// alana verilir.
    /// </summary>
    [Fact]
    public void Ilk_inputu_sayi_olan_pencere_odagi_ilk_alana_verir()
    {
        var bindings = Path.Combine(WebRoot(), "Pages", "AiCenter", "Bindings");
        var markup = File.ReadAllText(Path.Combine(bindings, "CreateModal.cshtml"));

        var firstInput = Regex.Match(markup, "<(abp-input|input)\\b[^>]*asp-for=\"([^\"]+)\"");
        firstInput.Groups[2].Value.ShouldBe("Binding.Order", "senaryo değişti: ilk input artık sayı alanı değilse bu pin gereksiz");
        markup.ShouldContain("<abp-select asp-for=\"Binding.DocumentId\"");

        File.ReadAllText(Path.Combine(bindings, "Index.js"))
            .ShouldContain("focusElement: '#Binding_DocumentId'");
    }

    private static IEnumerable<string> RazorPages()
        => Directory.EnumerateFiles(Path.Combine(WebRoot(), "Pages"), "*.cshtml", SearchOption.AllDirectories);

    private static string Relative(string file) => Path.GetRelativePath(WebRoot(), file);

    private static string WebRoot()
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
