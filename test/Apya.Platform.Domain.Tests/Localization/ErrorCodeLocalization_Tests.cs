using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Localization;

/// <summary>
/// SÖZLEŞME: <see cref="PlatformDomainErrorCodes"/> içindeki her kodun tr.json'da
/// karşılığı olmalı.
///
/// <para><c>BusinessException</c> bu repoda daima tek argümanla — yalnız kodla —
/// fırlatılır; kullanıcıya çıkan cümlenin TEK kaynağı yerelleştirme kaydıdır.
/// Kayıt yoksa ABP anahtarın kendisini döndürür ve kullanıcı "İtiraz süresi doldu."
/// yerine ham <c>Platform:Grant:AppealWindowClosed</c> görür.</para>
///
/// <para>Ölçüldü 2026-09-02: 190 kodun 37'sinde karşılık yoktu (kapsam %81). Boşluk
/// sessizce açıldı çünkü derleme de testler de kodu bir dizge olarak görür — hiçbiri
/// karşılığın varlığını kontrol etmez. Bu test o kapıyı kapatır.</para>
/// </summary>
public class ErrorCodeLocalization_Tests
{
    [Fact]
    public void Her_hata_kodunun_Turkce_karsiligi_olmali()
    {
        var texts = LoadTexts("tr");
        var missing = ErrorCodes().Where(c => !texts.ContainsKey(c)).ToList();

        missing.ShouldBeEmpty(
            "tr.json'da karşılığı olmayan hata kodu var; kullanıcı ham kodu görür:" +
            Environment.NewLine + string.Join(Environment.NewLine, missing));
    }

    [Fact]
    public void Hata_metni_bos_ya_da_kodun_kendisi_olmamali()
    {
        var texts = LoadTexts("tr");

        // Anahtarı değere kopyalamak boşluğu "doldurulmuş" gösterir ama kullanıcıya
        // yine ham kod gider — bu test onu da yakalar.
        var offenders = ErrorCodes()
            .Where(c => texts.TryGetValue(c, out var v) &&
                        (string.IsNullOrWhiteSpace(v) || v == c))
            .ToList();

        offenders.ShouldBeEmpty(
            "hata metni boş ya da kodun kendisi:" +
            Environment.NewLine + string.Join(Environment.NewLine, offenders));
    }

    /// <summary>
    /// Metindeki <c>{Alan}</c> yer tutucusu iki dilde aynı olmalı; biri eksikse o dilde
    /// cümle yarım kalır (ör. "en fazla dosya yükleyebilirsiniz" — sayı düşer).
    /// İngilizcesi hiç yazılmamış kodlar bu kuralın dışında: uygulama Türkçe önceliklidir.
    /// </summary>
    [Fact]
    public void Iki_dildeki_yer_tutucular_ayni_olmali()
    {
        var tr = LoadTexts("tr");
        var en = LoadTexts("en");

        var offenders = new List<string>();

        foreach (var code in ErrorCodes())
        {
            if (!tr.TryGetValue(code, out var trText) || !en.TryGetValue(code, out var enText))
            {
                continue;
            }

            if (Placeholders(trText) != Placeholders(enText))
            {
                offenders.Add($"{code}  tr=[{Placeholders(trText)}]  en=[{Placeholders(enText)}]");
            }
        }

        offenders.ShouldBeEmpty(
            "tr ve en yer tutucuları farklı:" +
            Environment.NewLine + string.Join(Environment.NewLine, offenders));
    }

    private static string Placeholders(string text) =>
        string.Join(",", Regex.Matches(text, @"\{(\w+)\}")
            .Select(m => m.Groups[1].Value)
            .OrderBy(x => x, StringComparer.Ordinal));

    private static IEnumerable<string> ErrorCodes()
    {
        var file = Path.Combine(SharedProjectRoot(), "PlatformDomainErrorCodes.cs");
        return Regex.Matches(File.ReadAllText(file), @"public const string \w+\s*=\s*""([^""]+)""")
            .Select(m => m.Groups[1].Value)
            .ToList();
    }

    private static Dictionary<string, string> LoadTexts(string culture)
    {
        var file = Path.Combine(SharedProjectRoot(), "Localization", "Platform", culture + ".json");
        using var doc = JsonDocument.Parse(File.ReadAllText(file));

        return doc.RootElement.GetProperty("texts")
            .EnumerateObject()
            .ToDictionary(p => p.Name, p => p.Value.GetString() ?? string.Empty);
    }

    private static string SharedProjectRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Apya.Platform.Domain.Shared");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Apya.Platform.Domain.Shared bulunamadı.");
    }
}
