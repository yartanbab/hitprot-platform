namespace Apya.Platform.Notifications;

/// <summary>
/// Bir kategorinin etkin kanal tercihi. Kullanıcının kaydı yoksa varsayılan
/// değerlerle döner — istemci "kayıt var mı" ayrımıyla uğraşmaz.
/// </summary>
public class NotificationPreferenceDto
{
    public NotificationCategory Category { get; set; }
    public bool InApp { get; set; }
    public bool Email { get; set; }
}

public class UpdateNotificationPreferenceInput
{
    public NotificationCategory Category { get; set; }
    public bool InApp { get; set; }
    public bool Email { get; set; }
}
