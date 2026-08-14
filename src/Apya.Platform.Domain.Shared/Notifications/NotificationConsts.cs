namespace Apya.Platform.Notifications;

public static class NotificationConsts
{
    public const int MaxTitleLength   = 256;
    public const int MaxBodyLength    = 1024;
    public const int MaxEntityType    = 64;
    public const int MaxGroupKey      = 128;
    public const int MaxActorName     = 128;

    /// <summary>
    /// Okunmuş ve silinmiş bildirimler bu kadar gün sonra tablodan kalıcı olarak
    /// kaldırılır. Tablo bugüne kadar yalnızca büyüyordu.
    /// </summary>
    public const int RetentionDays = 90;

    /// <summary>Günlük özet e-postasının kapsadığı pencere.</summary>
    public const int DigestWindowHours = 24;
}
