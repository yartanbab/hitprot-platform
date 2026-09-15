namespace Apya.Platform.Grants;

/// <summary>19b · Fikir davetinin alıcı kümesi: "Kime".</summary>
public enum GrantIdeaInvitationAudience
{
    /// <summary>Aranıp seçilen tek firma.</summary>
    Single = 0,

    /// <summary>Koşullarla süzülmüş grup: ölçek ve "havuzda fikri yok".</summary>
    Filtered = 1,

    /// <summary>Tüm firmalar.</summary>
    All = 2
}
