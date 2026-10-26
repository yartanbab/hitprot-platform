using System.Text.Encodings.Web;
using Apya.Platform.Web.Brand;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Apya.Platform.Web.TagHelpers;

/// <summary>
/// APYA işareti — asistanın dokunduğu yerde görünür; renk üst elemandan gelir (currentColor).
/// <para>Kullanım: <c>&lt;apya-mark size="20" state="thinking" /&gt;</c></para>
/// <para>
/// state: ready (varsayılan) · thinking · streaming · listening · suggest · off.
/// 16 px altında kendiliğinden 3 ışınlı mikro sürüme düşer. <c>print="true"</c> baskı ibresi
/// (opaklıksız). <c>label</c> verilmezse işaret süstür ve ekran okuyucudan gizlenir.
/// Ek öznitelikler (id, data-*, class) &lt;svg&gt;'ye geçer.
/// </para>
/// <para>JS karşılığı <c>apya.mark({...})</c>, React karşılığı <c>&lt;ApyaMark /&gt;</c>.</para>
/// </summary>
[HtmlTargetElement("apya-mark", TagStructure = TagStructure.WithoutEndTag)]
public class ApyaMarkTagHelper : TagHelper
{
    /// <summary>Piksel boyutu (kare).</summary>
    public int Size { get; set; } = 24;

    /// <summary>Asistan durumu; tanımsız değer ready sayılır.</summary>
    public string? State { get; set; }

    /// <summary>Baskı sürümü: güney ucu kontur, opaklık yok (PDF, kaşe).</summary>
    public bool Print { get; set; }

    /// <summary>Mikro sürümü zorla (true) ya da kapat (false); boşsa boyuta göre seçilir.</summary>
    public bool? Micro { get; set; }

    /// <summary>Ekran okuyucu adı. Boşsa işaret aria-hidden olur.</summary>
    public string? Label { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var state = ApyaMarkSvg.NormalizeState(State);

        output.TagName = "svg";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.AddClass("apya-mark", HtmlEncoder.Default);

        foreach (var (name, value) in ApyaMarkSvg.RootAttributes(Size, state, Label))
        {
            output.Attributes.SetAttribute(name, value);
        }

        output.Content.SetHtmlContent(ApyaMarkSvg.InnerMarkup(Size, state, Print, ApyaMarkSvg.IsMicro(Size, Micro)));
    }
}
