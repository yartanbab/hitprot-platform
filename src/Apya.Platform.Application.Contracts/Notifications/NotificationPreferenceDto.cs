namespace Apya.Platform.Notifications;

/// <summary>
/// Bir kategorinin etkin kanal tercihi. Kullanıcının kaydı yoksa varsayılan
/// değerlerle döner — istemci "kayıt var mı" ayrımıyla uğraşmaz.
/// </summary>
public class NotificationPreferenceDto
{
    public NotificationCategory Category { get; set; }
    public bool InApp { get; set; }

    /// <summary>Kritik bildirimlerin anlık e-postası.</summary>
    public bool Email { get; set; }

    /// <summary>Kritik olmayanların günlük özet e-postası.</summary>
    public bool Digest { get; set; }
}

public class UpdateNotificationPreferenceInput
{
    public NotificationCategory Category { get; set; }
    public bool InApp { get; set; }
    public bool Email { get; set; }

    /// <summary>Gönderilmezse e-posta tercihini izler (alan eklenmeden önceki istemciler).</summary>
    public bool? Digest { get; set; }
}
