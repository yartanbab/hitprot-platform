using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using System.Text;

namespace Apya.Platform.Web.Brand;

/// <summary>
/// APYA işaretinin SVG'si — 13 ışın + pusula ibresi, tek renk (currentColor).
/// <para>
/// Aynı yapıyı üç üretici basar; geometri sabitleri üçünde de BİREBİR aynıdır
/// (BrandMarkParity_Tests kilitler):
/// Razor <c>&lt;apya-mark&gt;</c> (bu sınıf), jQuery <c>apya.mark()</c> (/js/apya-mark.js),
/// React <c>&lt;ApyaMark&gt;</c> (components/brand/ApyaMark.jsx).
/// </para>
/// <para>
/// Hareket SVG'de değil /css/apya-mark.css'te: yalnız <c>data-state</c> taşınır, ışın sırası
/// (<c>--i</c>) ve dinleme süresi (<c>--ld</c>) satır içi gelir.
/// Kaynak: docs/design/brand/kaynak/README.md.
/// </para>
/// </summary>
public static class ApyaMarkSvg
{
    /// <summary>HTML özel karakterlerini kodlar, Türkçe harfleri olduğu gibi bırakır.</summary>
    private static readonly HtmlEncoder Encoder = HtmlEncoder.Create(UnicodeRanges.All);

    public const string Ready = "ready";

    /// <summary>Asistan durum sözlüğü: ready (statik), thinking/streaming/listening (hareketli), suggest (kalın, statik), off (%40).</summary>
    public static readonly IReadOnlyList<string> States = new[] { Ready, "thinking", "streaming", "listening", "suggest", "off" };

    /// <summary>i × 360/13, iki basamak (paketteki toFixed(2) ile aynı).</summary>
    public static readonly IReadOnlyList<string> RayAngles = new[]
    {
        "0.00", "27.69", "55.38", "83.08", "110.77", "138.46", "166.15",
        "193.85", "221.54", "249.23", "276.92", "304.62", "332.31"
    };

    /// <summary>Dinleme süresi: 0.62 + |((i·5) mod 13) − 6| / 6 × 0.5 saniye.</summary>
    public static readonly IReadOnlyList<string> ListenDurations = new[]
    {
        "1.12s", "0.70s", "0.95s", "0.95s", "0.70s", "1.12s", "0.79s",
        "0.87s", "1.04s", "0.62s", "1.04s", "0.87s", "0.79s"
    };

    public const string NeedleNorth = "50,36 55.5,50 50,52 44.5,50";
    public const string NeedleSouth = "50,64 44.5,50 50,48 55.5,50";
    public const string PrintNeedleNorth = "50,34 56,50 50,52.5 44,50";
    public const string PrintNeedleSouth = "50,60 45.5,50 50,48 54.5,50";
    public const string MicroNeedleNorth = "50,26 60,50 50,55 40,50";
    public const string MicroNeedleSouth = "50,74 40,50 50,46 60,50";

    public static string NormalizeState(string? state)
    {
        var value = state?.Trim().ToLowerInvariant();
        return value != null && States.Contains(value) ? value : Ready;
    }

    /// <summary>16 px altında standart işaret okunmaz → 3 ışınlı mikro sürüm.</summary>
    public static bool IsMicro(int size, bool? micro) => micro ?? size < 16;

    /// <summary>Çizgi kalınlığı: 4.5; 32 px altında ve öneri rozetinde 6.</summary>
    public static string StrokeWidth(int size, string state) => state == "suggest" || size < 32 ? "6" : "4.5";

    /// <summary>
    /// &lt;svg&gt; kök öznitelikleri (sınıf hariç). Etiket yoksa işaret süstür: ekran okuyucudan gizlenir.
    /// </summary>
    public static IReadOnlyList<KeyValuePair<string, string>> RootAttributes(int size, string state, string? label)
    {
        var attributes = new List<KeyValuePair<string, string>>
        {
            new("width", size.ToString(System.Globalization.CultureInfo.InvariantCulture)),
            new("height", size.ToString(System.Globalization.CultureInfo.InvariantCulture)),
            new("viewBox", "0 0 100 100"),
            new("data-state", state),
        };

        if (string.IsNullOrWhiteSpace(label))
        {
            attributes.Add(new("aria-hidden", "true"));
            attributes.Add(new("focusable", "false"));
        }
        else
        {
            attributes.Add(new("role", "img"));
            attributes.Add(new("aria-label", label));
        }

        return attributes;
    }

    /// <summary>&lt;svg&gt;'nin iç işaretlemesi (ışınlar + ibre).</summary>
    public static string InnerMarkup(int size, string state, bool print, bool micro)
    {
        var sb = new StringBuilder();

        if (micro)
        {
            sb.Append("<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"9\">");
            foreach (var angle in new[] { "0", "120", "240" })
            {
                sb.Append("<line x1=\"50\" y1=\"18\" x2=\"50\" y2=\"4\" transform=\"rotate(").Append(angle).Append(" 50 50)\"/>");
            }
            sb.Append("</g>");
            sb.Append("<polygon points=\"").Append(MicroNeedleNorth).Append("\" fill=\"currentColor\"/>");
            sb.Append("<polygon points=\"").Append(MicroNeedleSouth).Append("\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\" stroke-linejoin=\"round\"/>");
            return sb.ToString();
        }

        sb.Append("<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"").Append(StrokeWidth(size, state)).Append("\">");
        for (var i = 0; i < RayAngles.Count; i++)
        {
            sb.Append("<g transform=\"rotate(").Append(RayAngles[i]).Append(" 50 50)\">")
              .Append("<line class=\"apya-mark__ray\" style=\"--i:").Append(i).Append(";--ld:").Append(ListenDurations[i]).Append("\" x1=\"50\" y1=\"20\" x2=\"50\" y2=\"4\"/>")
              .Append("</g>");
        }
        sb.Append("</g>");

        if (print)
        {
            sb.Append("<polygon points=\"").Append(PrintNeedleNorth).Append("\" fill=\"currentColor\"/>");
            sb.Append("<polygon points=\"").Append(PrintNeedleSouth).Append("\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/>");
        }
        else
        {
            sb.Append("<polygon points=\"").Append(NeedleNorth).Append("\" fill=\"currentColor\"/>");
            sb.Append("<polygon points=\"").Append(NeedleSouth).Append("\" fill=\"currentColor\" opacity=\".38\"/>");
        }

        return sb.ToString();
    }

    /// <summary>Tam &lt;svg&gt; dizesi — tag helper dışındaki sunucu kodu için.</summary>
    public static string Render(int size = 24, string? state = null, bool print = false, bool? micro = null, string? label = null, string? cssClass = null)
    {
        var normalized = NormalizeState(state);
        var sb = new StringBuilder("<svg class=\"apya-mark");
        if (!string.IsNullOrWhiteSpace(cssClass))
        {
            sb.Append(' ').Append(Encoder.Encode(cssClass.Trim()));
        }
        sb.Append('"');

        foreach (var (name, value) in RootAttributes(size, normalized, label))
        {
            sb.Append(' ').Append(name).Append("=\"").Append(Encoder.Encode(value)).Append('"');
        }

        sb.Append('>').Append(InnerMarkup(size, normalized, print, IsMicro(size, micro))).Append("</svg>");
        return sb.ToString();
    }
}
