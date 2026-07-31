using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Apya.Platform.Web.TagHelpers;

/// <summary>
/// Bilgi ipucu ikonu (ⓘ) — buton/başlık/alan yanında işlevi anlatan küçük kutu.
/// İlk kullanıcı için; üzerine gelince (ya da Tab ile odaklanınca) açılır.
/// <para>Kullanım: <c>&lt;apya-hint text="Kur farkını hesaplar." /&gt;</c></para>
/// <para>
/// Kutu Bootstrap tooltip'idir; init tüm sayfalarda tek yerden gelir
/// (/js/apya-hint.js → body'ye delege). JS ile render edilen içerikte
/// karşılığı <c>apya.hint('…')</c>.
/// </para>
/// </summary>
[HtmlTargetElement("apya-hint", TagStructure = TagStructure.WithoutEndTag)]
public class HintTagHelper : TagHelper
{
    /// <summary>İpucu metni (Türkçe, düz metin — HTML kodlanır).</summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>Kutunun yönü: top (varsayılan) / bottom / left / right.</summary>
    public string Placement { get; set; } = "top";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "span";
        output.TagMode = TagMode.StartTagAndEndTag;

        output.Attributes.SetAttribute("class", "apya-hint");
        output.Attributes.SetAttribute("data-bs-toggle", "tooltip");
        output.Attributes.SetAttribute("data-bs-placement", Placement);
        output.Attributes.SetAttribute("data-bs-title", Text);
        // tabindex → klavye (Tab) ve dokunmatik erişim; metnin kendisini Bootstrap
        // açılışta aria-describedby ile bağlar, aria-label yalnız ikonu adlandırır.
        output.Attributes.SetAttribute("tabindex", "0");
        output.Attributes.SetAttribute("aria-label", "Bilgi");

        output.Content.SetHtmlContent("<i class=\"fa fa-circle-info\" aria-hidden=\"true\"></i>");
    }
}
