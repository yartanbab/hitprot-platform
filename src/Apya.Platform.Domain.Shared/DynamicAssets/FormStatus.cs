namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Lifecycle status of an <see cref="AppDocument"/> form.
/// Integer values are stable (persisted).
/// </summary>
public enum FormStatus
{
    Draft = 0,      // Taslak — düzenlenebilir, public erişime kapalı
    Published = 1,  // Yayında — public slug üzerinden erişilebilir
    Archived = 2    // Arşiv — yanıt toplamaz, listede gizli
}
