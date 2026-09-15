namespace Apya.Platform.Grants;

/// <summary>19b · Fikir daveti sınırları.</summary>
public static class GrantIdeaInvitationConsts
{
    public const int MaxMessageLength = 1000;

    /// <summary>Ekranın önerdiği hatırlatma günü (tasarım: "10 gün sonra hatırlat").</summary>
    public const int DefaultRemindAfterDays = 10;

    public const int MinRemindAfterDays = 1;

    public const int MaxRemindAfterDays = 60;
}
