using System.Collections.Generic;
using System.Linq;
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
    Locked,

    /// <summary>
    /// Tam sayfa durum — hata sayfası (Views/Error) ve erişim reddi (/AccessDenied): soluk balon,
    /// başlık sayfanın başlığıdır (role="heading" aria-level="1"); sayfa yüklenişinde role="alert"
    /// basılmaz. Metin/eylem kararı <see cref="ErrorStates"/>'te.
    /// </summary>
    Page
}

/// <summary>
/// İkincil eylem — birincil eylemden (<see cref="EmptyStateModel.ActionText"/>) sonra basılır; varsayılan
/// görünüm btn btn-sm btn-outline-secondary. Url verilirse a href, yoksa button type="button";
/// Attributes'taki "class" varsayılanın yerine geçer.
/// </summary>
public sealed record EmptyStateAction(
    string Text,
    string? Url = null,
    string? Icon = null,
    IDictionary<string, string>? Attributes = null)
{
    /// <summary>Tarayıcı geçmişinde geri: başta gizli, partial'ın betiği geçmiş varsa açar.</summary>
    public const string BackHook = "data-apya-back";

    /// <summary>Sayfayı yeniden yükler.</summary>
    public const string RetryHook = "data-apya-retry";

    /// <summary>"Geri dön" — yeni sekmede (geçmiş yok) ve JS yokken görünmez.</summary>
    public static EmptyStateAction Back(string text) => new(text, Icon: "fa-arrow-left",
        Attributes: new Dictionary<string, string> { [BackHook] = "", ["hidden"] = "hidden" });

    /// <summary>Kanonik "Tekrar dene" (karar 10: btn-outline-primary + fa-rotate-right) — sayfayı yeniler.</summary>
    public static EmptyStateAction Retry(string text) => new(text, Icon: "fa-rotate-right",
        Attributes: new Dictionary<string, string> { [RetryHook] = "", ["class"] = "btn btn-sm btn-outline-primary" });

    /// <summary>Partial'ın küçük betiğine bağlanan eylem mi (geri / yeniden yükle)?</summary>
    public bool IsClientHook => Attributes != null
        && (Attributes.ContainsKey(BackHook) || Attributes.ContainsKey(RetryHook));
}

/// <summary>
/// _EmptyState partial'ının modeli — boş liste/veri, yükleme hatası, kilit ve tam sayfa hata/erişim
/// durumları için ortak görünüm (ikon balonu + başlık + isteğe bağlı açıklama/madde/ipucu + eylemler
/// + dipnot). Görsel sözleşme apya-shell.css .apya-console-state; JS karşılığı apya.loadState.errorHtml,
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

    /// <summary>Kültürden bağımsız durum işareti (köke data-apya-state) — test ve canlı doğrulama anahtarı.</summary>
    public string? Kind { get; set; }

    /// <summary>Madde listesi (ör. doğrulama hataları); açıklamanın altında.</summary>
    public IReadOnlyList<string>? Details { get; set; }

    /// <summary>İkinci satır (ipucu/yönlendirme); maddelerin altında.</summary>
    public string? Hint { get; set; }

    /// <summary>En altta küçük dipnot (ör. "Hata kodu 404").</summary>
    public string? Footnote { get; set; }

    /// <summary>Birincil eylemden sonra basılan ikincil eylemler.</summary>
    public IList<EmptyStateAction> SecondaryActions { get; } = new List<EmptyStateAction>();

    /// <summary>Partial geri/yeniden yükle betiğini basmalı mı?</summary>
    public bool HasClientHooks => SecondaryActions.Any(action => action.IsClientHook);

    /// <summary>Balondaki ikon: <see cref="Icon"/> ya da türün varsayılanı.</summary>
    public string IconClass => !string.IsNullOrWhiteSpace(Icon)
        ? Icon
        : Variant switch
        {
            EmptyStateVariant.Error or EmptyStateVariant.Page => "fa-triangle-exclamation",
            EmptyStateVariant.Locked => "fa-lock",
            _ => "fa-inbox"
        };

    /// <summary>Soluk balon: hata ve kilit durumları (boş durum accent).</summary>
    public bool IsMuted => Variant != EmptyStateVariant.Default;

    /// <summary>Erişilebilirlik rolü: yalnız hata "alert"; diğerlerinde öznitelik basılmaz.</summary>
    public string? Role => Variant == EmptyStateVariant.Error ? "alert" : null;

    /// <summary>Başlık sayfanın başlığı mı (role="heading" aria-level="1")? Yalnız <see cref="EmptyStateVariant.Page"/>.</summary>
    public bool IsPageHeading => Variant == EmptyStateVariant.Page;

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

        var icon = !string.IsNullOrWhiteSpace(ActionIcon)
            ? ActionIcon
            : Variant == EmptyStateVariant.Error ? "fa-rotate-right" : null;

        return Build(
            ActionText,
            ActionUrl,
            icon,
            ActionAttributes,
            Variant == EmptyStateVariant.Error ? "btn btn-sm btn-outline-primary" : "btn btn-sm btn-primary");
    }

    /// <summary>İkincil eylemler (metni boş olanlar atlanır); kodlama ve öznitelik kuralı birincilinkiyle aynı.</summary>
    public IReadOnlyList<TagBuilder> BuildSecondaryActions()
        => SecondaryActions
            .Where(action => !string.IsNullOrWhiteSpace(action.Text))
            .Select(action => Build(
                action.Text,
                action.Url,
                string.IsNullOrWhiteSpace(action.Icon) ? null : action.Icon,
                action.Attributes,
                "btn btn-sm btn-outline-secondary"))
            .ToList();

    private static TagBuilder Build(
        string text,
        string? url,
        string? icon,
        IDictionary<string, string>? attributes,
        string defaultClass)
    {
        var isLink = !string.IsNullOrEmpty(url);
        var action = new TagBuilder(isLink ? "a" : "button");
        if (isLink)
        {
            action.Attributes["href"] = url;
        }
        else
        {
            action.Attributes["type"] = "button";
        }

        action.Attributes["class"] = defaultClass;

        if (attributes != null)
        {
            // Aynı ad varsa verilen kazanır (MergeAttributes replaceExisting: true ile eşdeğer).
            foreach (var attribute in attributes)
            {
                action.Attributes[attribute.Key] = attribute.Value;
            }
        }

        if (icon != null)
        {
            var i = new TagBuilder("i");
            i.Attributes["class"] = "fa " + icon + " me-1";
            i.Attributes["aria-hidden"] = "true";
            action.InnerHtml.AppendHtml(i);
        }

        action.InnerHtml.Append(text);
        return action;
    }
}
