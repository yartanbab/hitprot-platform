using System.Text;
using System.Text.Encodings.Web;
using Apya.Platform.Web.Bundling;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Apya.Platform.Web.TagHelpers;

/// <summary>
/// Bir React island'ının bağımlı chunk'larını <c>&lt;link rel="modulepreload"&gt;</c>
/// olarak basar — böylece tarayıcı onları entry ile paralel indirir, entry'yi
/// ayrıştırıp keşfetmeyi beklemez.
/// <para>Kullanım: <c>&lt;island-preload entry="dashboard" /&gt;</c></para>
/// <para>
/// SAYFANIN EN ÜSTÜNE koy — script etiketinin yanına değil. Kazanç tarayıcının
/// ön-tarayıcısının (preload scanner) bu satırları HTML ayrıştırmasının ERKEN
/// safhasında görmesinden gelir; sayfa sonuna konursa kazanç büyük ölçüde kaybolur.
/// </para>
/// <para>
/// Entry adı vite.config.js'teki <c>build.lib.entry</c> anahtarıdır ("dashboard",
/// "task-detail", ...). Manifest yoksa ya da ad tanınmazsa hiçbir şey basılmaz.
/// </para>
/// </summary>
[HtmlTargetElement("island-preload", TagStructure = TagStructure.WithoutEndTag)]
public class IslandPreloadTagHelper : TagHelper
{
    private readonly IslandAssetManifest _manifest;

    public IslandPreloadTagHelper(IslandAssetManifest manifest)
    {
        _manifest = manifest;
    }

    /// <summary>Island entry adı — vite.config.js'teki anahtarla birebir aynı.</summary>
    public string Entry { get; set; } = string.Empty;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Sarmalayıcı etiket YOK: yalnız link'ler basılır.
        output.TagName = null;

        var urls = _manifest.GetPreloadUrls(Entry);
        if (urls.Count == 0)
        {
            output.SuppressOutput();
            return;
        }

        var builder = new StringBuilder();
        foreach (var url in urls)
        {
            builder.Append("<link rel=\"modulepreload\" href=\"")
                   .Append(HtmlEncoder.Default.Encode(url))
                   .Append("\" />");
        }

        output.Content.SetHtmlContent(builder.ToString());
    }
}
