namespace Apya.Platform.IssueTasks;

/// <summary>
/// Bir görevin hangi sinyalden doğduğu. Sayısal değerler DB'dedir; mevcutları
/// değiştirme, yenileri sona ekle.
/// </summary>
public enum IssueSourceType
{
    /// <summary>Kullanıcının gönderdiği geri bildirim (AppFeedbacks).</summary>
    Feedback = 1,

    /// <summary>Tarayıcıda oluşup raporlanan hata (AppClientErrors).</summary>
    ClientError = 2,

    /// <summary>
    /// Sunucu tarafı hata. Kaynağı AbpAuditLogs'tur; kalıcı bir aggregate DEĞİLDİR ve
    /// saklama süresiyle temizlenir — bu yüzden bağın SourceId'si boştur, teşhis metni
    /// görev açıklamasına kopyalanır.
    /// </summary>
    ServerError = 3
}
