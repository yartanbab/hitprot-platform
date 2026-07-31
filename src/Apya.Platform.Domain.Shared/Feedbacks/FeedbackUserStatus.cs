namespace Apya.Platform.Feedbacks;

/// <summary>
/// Kullanıcıya gösterilen sadeleşmiş durum. İç durumların (FeedbackStatus) teknik
/// detayı kullanıcıyı ilgilendirmez; eşleme <see cref="FeedbackStatusMap"/>'te.
/// </summary>
public enum FeedbackUserStatus
{
    Received   = 1, // Alındı
    InReview   = 2, // İnceleniyor
    NeedsInfo  = 3, // Sizden ek bilgi bekleniyor — kullanıcı aksiyonu gerekli
    Planned    = 4, // Planlandı
    InProgress = 5, // Geliştiriliyor (InDevelopment + Testing)
    Completed  = 6, // Tamamlandı
    Released   = 7, // Yayınlandı
    Closed     = 8  // Kapatıldı (Rejected/Duplicate/OutOfScope/Archived)
}

/// <summary>İç durum → kullanıcı görünür durum eşlemesi. TEK yer; başka yerde switch yazma.</summary>
public static class FeedbackStatusMap
{
    public static FeedbackUserStatus ToUserStatus(this FeedbackStatus status) => status switch
    {
        FeedbackStatus.New           => FeedbackUserStatus.Received,
        FeedbackStatus.InReview      => FeedbackUserStatus.InReview,
        FeedbackStatus.NeedsInfo     => FeedbackUserStatus.NeedsInfo,
        FeedbackStatus.Planned       => FeedbackUserStatus.Planned,
        FeedbackStatus.InDevelopment => FeedbackUserStatus.InProgress,
        FeedbackStatus.Testing       => FeedbackUserStatus.InProgress,
        FeedbackStatus.Completed     => FeedbackUserStatus.Completed,
        FeedbackStatus.Released      => FeedbackUserStatus.Released,
        _                            => FeedbackUserStatus.Closed
    };

    /// <summary>Açık (henüz sonuçlanmamış) iç durumlar — rozet/istatistik sayımları için.</summary>
    public static bool IsOpen(this FeedbackStatus status) => status is
        FeedbackStatus.New or
        FeedbackStatus.InReview or
        FeedbackStatus.NeedsInfo or
        FeedbackStatus.Planned or
        FeedbackStatus.InDevelopment or
        FeedbackStatus.Testing;
}
