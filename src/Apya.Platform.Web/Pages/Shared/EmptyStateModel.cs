using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Apya.Platform.Web.Pages.Shared;

/// <summary>
/// Boş durumun türü — balon rengi, varsayılan ikon ve erişilebilirlik rolü buna göre seçilir.
/// </summary>
public enum EmptyStateVariant
{
    /// <summary>Boş liste/veri: accent balon, varsayılan ikon "fa-inbox".</summary>
    Default,

    /// <summary>
    /// Yükleme hatası: soluk balon, "fa-triangle-exclamation", role="alert"; eylem kanonik
    /// "Tekrar dene" görünümünde. JS karşılığı apya.loadState.errorHtml.
    /// </summary>
    Error,

    /// <summary>Yetki/paket kilidi: soluk balon, "fa-lock".</summary>
    Locked
}

/// <summary>
/// _EmptyState partial'ının modeli — boş liste/veri, yükleme hatası ve kilit durumları için
/// ortak görünüm (ikon balonu + başlık + isteğe bağlı açıklama + isteğe bağlı eylem).
/// Görsel sözleşme apya-shell.css .apya-console-state; JS karşılığı apya.loadState.errorHtml,
/// React karşılığı components/ui/EmptyState.jsx.
/// </summary>
public class EmptyStateModel
{
    /// <summary>Görünüm türü.</summary>
    public EmptyStateVariant Variant { get; set; } = EmptyStateVariant.Default;

    /// <summary>Font Awesome ikon adı (örn. "fa-comments"); boşsa türün varsayılanı.</summary>
    public string? Icon { get; set; }

    /// <summary>Kısa başlık (örn. "Henüz yorum yapılmamış.").</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>İsteğe bağlı açıklama/yönlendirme satırı.</summary>
    public string? Description { get; set; }

    /// <summary>JS'in bulup kaldırdığı placeholder'lar için element id'si (köke basılır).</summary>
    public string? Id { get; set; }

    /// <summary>Ek CSS class'ları (örn. JS'in aradığı marker class; köke basılır).</summary>
    public string? CssClass { get; set; }

    /// <summary>Eylem (CTA) metni; boşsa eylem basılmaz.</summary>
    public string? ActionText { get; set; }

    /// <summary>Verilirse eylem bağlantıdır (a href); yoksa button type="button".</summary>
    public string? ActionUrl { get; set; }

    /// <summary>Eylem ikonu (örn. "fa-plus"); Error'da verilmezse "fa-rotate-right".</summary>
    public string? ActionIcon { get; set; }

    /// <summary>
    /// Eyleme eklenecek öznitelikler (data-* JS kancaları). "class" verilirse varsayılan düğme
    /// sınıfının YERİNE geçer.
    /// </summary>
    public IDictionary<string, string>? ActionAttributes { get; set; }

    /// <summary>Balondaki ikon: <see cref="Icon"/> ya da türün varsayılanı.</summary>
    public string IconClass => !string.IsNullOrWhiteSpace(Icon)
        ? Icon
        : Variant switch
        {
            EmptyStateVariant.Error => "fa-triangle-exclamation",
            EmptyStateVariant.Locked => "fa-lock",
            _ => "fa-inbox"
        };

    /// <summary>Soluk balon: hata ve kilit durumları (boş durum accent).</summary>
    public bool IsMuted => Variant != EmptyStateVariant.Default;

    /// <summary>Erişilebilirlik rolü: yalnız hata "alert"; diğerlerinde öznitelik basılmaz.</summary>
    public string? Role => Variant == EmptyStateVariant.Error ? "alert" : null;

    /// <summary>
    /// Eylem düğmesi/bağlantısı; <see cref="ActionText"/> boşsa null. Metin ve öznitelik
    /// değerleri TagBuilder ile kodlanır. Varsayılan sınıf: Error → kanonik "Tekrar dene"
    /// (btn btn-sm btn-outline-primary + fa-rotate-right), diğerleri btn btn-sm btn-primary.
    /// </summary>
    public TagBuilder? BuildAction()
    {
        if (string.IsNullOrWhiteSpace(ActionText))
        {
            return null;
        }

        var isLink = !string.IsNullOrEmpty(ActionUrl);
        var action = new TagBuilder(isLink ? "a" : "button");
        if (isLink)
        {
            action.Attributes["href"] = ActionUrl;
        }
        else
        {
            action.Attributes["type"] = "button";
        }

        action.Attributes["class"] = Variant == EmptyStateVariant.Error
            ? "btn btn-sm btn-outline-primary"
            : "btn btn-sm btn-primary";

        if (ActionAttributes != null)
        {
            // Aynı ad varsa verilen kazanır (MergeAttributes replaceExisting: true ile eşdeğer).
            foreach (var attribute in ActionAttributes)
            {
                action.Attributes[attribute.Key] = attribute.Value;
            }
        }

        var icon = !string.IsNullOrWhiteSpace(ActionIcon)
            ? ActionIcon
            : Variant == EmptyStateVariant.Error ? "fa-rotate-right" : null;
        if (icon != null)
        {
            var i = new TagBuilder("i");
            i.Attributes["class"] = "fa " + icon + " me-1";
            i.Attributes["aria-hidden"] = "true";
            action.InnerHtml.AppendHtml(i);
        }

        action.InnerHtml.Append(ActionText);
        return action;
    }
}
