namespace Apya.Platform.Telemetry.Dtos;

/// <summary>
/// N-10 · Bildirim kanallarının sağlığı. Zil ve anlık balon uygulamanın içindedir, hep açıktır; telefon/masaüstü
/// push ve e-posta yapılandırmaya, kuyruk ise arka plan işçisine bağlıdır — üçü de sessizce bozulabilir.
/// </summary>
public class NotificationChannelHealthDto
{
    /// <summary>VAPID anahtarları ve konu tanımlı mı? Değilse abonelik alınmaz, push hiç gitmez.</summary>
    public bool WebPushEnabled { get; set; }

    /// <summary>Push almak için kayıtlı cihaz (tarayıcı/telefon) sayısı, tüm kiracılar.</summary>
    public int PushDeviceCount { get; set; }

    /// <summary>Etkin e-posta göndericisi: "Smtp", "FileDrop" (yerel geliştirme) ya da "Null" (kapalı).</summary>
    public string EmailSender { get; set; } = "";

    /// <summary>SMTP sunucusu ayarı (yalnız ad; parola asla).</summary>
    public string? EmailHost { get; set; }

    /// <summary>Kuyrukta bekleyen iş (push, e-posta…).</summary>
    public int PendingJobCount { get; set; }

    /// <summary>Zamanı bir dakikadan fazla geçmiş ama hâlâ bekleyen iş — işçi duruyor ya da yavaşlıyor.</summary>
    public int OverdueJobCount { get; set; }

    /// <summary>Son 24 saatte denemeden vazgeçilen iş — o bildirimler muhataba ulaşmadı.</summary>
    public int AbandonedJobCount24h { get; set; }

    public bool HasProblem => !WebPushEnabled || EmailSender == "Null" || OverdueJobCount > 0 || AbandonedJobCount24h > 0;
}
