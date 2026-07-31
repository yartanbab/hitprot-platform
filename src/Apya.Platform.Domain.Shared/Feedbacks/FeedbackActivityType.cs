namespace Apya.Platform.Feedbacks;

/// <summary>
/// Zaman çizelgesinde gösterilen olay türleri. Her kayıt FeedbackActivity satırıdır;
/// FeedbackManager ilgili işlemde otomatik yazar, elle eklenmez.
/// </summary>
public enum FeedbackActivityType
{
    Created         = 1,  // Geri bildirim oluşturuldu
    StatusChanged   = 2,  // Durum değişti (OldValue/NewValue enum sayısal değeri)
    PriorityChanged = 3,
    ImpactChanged   = 4,
    Assigned        = 5,  // Atama değişti (NewValue: kullanıcı adı)
    CommentAdded    = 6,  // Yorum/cevap eklendi (IsInternal bayrağına bak)
    AttachmentAdded = 7,
    TagsChanged     = 8,
    UserCommented   = 9   // Kullanıcının kendi eklediği açıklama
}
