using Microsoft.AspNetCore.Html;

namespace Apya.Platform.Web.Pages.Shared;

/// <summary>
/// _KpiCard partial'ının modeli. Reports ve AiCenter Dashboard gibi
/// gösterge sayfalarındaki KPI kartlarını tek tasarıma indirir.
/// </summary>
public class KpiCardModel
{
    /// <summary>Font Awesome ikon adı (örn. "fa-project-diagram").</summary>
    public string Icon { get; set; } = "fa-chart-line";

    /// <summary>
    /// Kartın ton adı. Tasarım sistemi tonları: accent/positive/negative/warning/brand/ai/neutral.
    /// Geriye uyumluluk için Bootstrap adları (primary/success/danger/info/secondary) da kabul edilir.
    /// </summary>
    public string Accent { get; set; } = "accent";

    /// <summary>
    /// <c>Accent</c>'in <c>.kpi-icon-box--*</c> ton sınıfına çözülmüş hali.
    /// Bootstrap renk adları tasarım sistemi tonlarına eşlenir.
    /// </summary>
    public string Tone => Accent switch
    {
        "primary"   => "accent",
        "success"   => "positive",
        "danger"    => "negative",
        "info"      => "brand",
        "secondary" => "neutral",
        _           => Accent
    };

    /// <summary>Kartın overline etiketi (örn. "Aktif Projeler").</summary>
    public string Label { get; set; } = string.Empty;

    /// <summary>Gösterilecek değer (düz metin).</summary>
    public string? Value { get; set; }

    /// <summary>Renkli/biçimli değer; set edilirse Value yerine bu basılır.</summary>
    public IHtmlContent? ValueHtml { get; set; }

    /// <summary>JS'in doldurduğu kartlarda değer elementinin id'si.</summary>
    public string? ValueId { get; set; }

    /// <summary>Değerin altındaki küçük açıklama satırı.</summary>
    public string? SubText { get; set; }
}
