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

    /// <summary>Bootstrap tema rengi: primary/success/danger/warning/info.</summary>
    public string Accent { get; set; } = "primary";

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
