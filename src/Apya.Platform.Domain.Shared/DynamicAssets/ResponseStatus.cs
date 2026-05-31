namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Review workflow status of an <see cref="AppResponse"/>.
/// Integer values are stable (persisted).
/// </summary>
public enum ResponseStatus
{
    Pending = 0,   // Yeni gelen, henüz incelenmemiş
    InReview = 1,  // İnceleniyor
    Reviewed = 2   // İncelendi / kapatıldı
}
