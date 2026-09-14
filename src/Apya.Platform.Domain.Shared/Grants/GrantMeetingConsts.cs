namespace Apya.Platform.Grants;

public static class GrantMeetingConsts
{
    /// <summary>Firma tam bu kadar saat önerir; danışman birini seçer.</summary>
    public const int SlotCount = 3;

    /// <summary>Ön görüşme süresi (dk). Ekranda ve bildirimde yazılır; saat aralığı olarak saklanmaz.</summary>
    public const int DurationMinutes = 30;

    /// <summary>Önerilebilecek en uzak gün.</summary>
    public const int MaxDaysAhead = 60;

    public const int MaxHostNoteLength = 500;
}
