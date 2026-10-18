using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// X-05 · Vaat süpürmesi (geliştirme taraması 2026-10-18): arayüz arkasında karşılığı olmayan
/// bir işlevi vaat etmesin.
/// </summary>
public class ComingSoonToast_Tests
{
    /// <summary>
    /// Tıklanınca yalnız "yakında" bildirimi gösteren düğme işlev varmış gibi görünür: fatura
    /// "Gönder", cari "Ekstre Gönder" ve "Dışa Aktar", görev menüsündeki "Şablon olarak kaydet"
    /// ve "Alt göreve dönüştür" böyleydi. Hazır olmayan eylem gizlenir ya da tıklanamaz biçimde
    /// "Yakında" etiketiyle durur (görev başlığındaki devre dışı maddeler gibi).
    /// </summary>
    [Fact]
    public void Hicbir_dugme_yalniz_yakinda_bildirimi_gostermez()
    {
        var pattern = new Regex(
            @"(notify(\?\.|\.)info(\?\.)?\(|abpNotify\(\s*'info'\s*,)\s*['""`][^'""`]*yakında",
            RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
        var offenders = new List<string>();

        foreach (var file in WebSourceFiles.HandWrittenScripts().Concat(WebSourceFiles.ReactSources()))
        {
            var text = File.ReadAllText(file);
            foreach (Match m in pattern.Matches(text))
            {
                var line = text.Take(m.Index).Count(c => c == '\n') + 1;
                offenders.Add($"{WebSourceFiles.Relative(file)}:{line}");
            }
        }

        offenders.ShouldBeEmpty(
            "Yalnız \"yakında\" bildirimi gösteren eylem kalmamalı; gizleyin ya da devre dışı bırakıp etiketleyin:" +
            Environment.NewLine + string.Join(Environment.NewLine, offenders));
    }
}
