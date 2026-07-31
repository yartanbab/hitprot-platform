using System;

namespace Apya.Platform.Web.Feedbacks;

/// <summary>
/// _FeedbackLink.cshtml partial'ının modeli. Bağlam kodları geri bildirim formuna
/// data-* öznitelikleriyle taşınır (apya-feedback.js okur) ve kayda yapılandırılmış
/// alanlar olarak yazılır — açıklama metnine gömülmez.
/// </summary>
public record FeedbackLinkContext(
    string? Module = null,
    string? Component = null,
    string? Action = null,
    string? EntityType = null,
    Guid? EntityId = null,
    // true → "Bu bölümle ilgili..." metni (varsayılan sayfa metni yerine)
    bool SectionLabel = false);
