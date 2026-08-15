namespace Apya.Platform.Consents;

/// <summary>Rızayı veren öznenin türü.</summary>
public enum ConsentSubjectKind
{
    /// <summary>Oturumsuz ziyaretçi — SubjectId anonim çerez kimliğidir (yoksa null).</summary>
    Anonymous = 0,

    /// <summary>Giriş yapmış kullanıcı — SubjectId kullanıcı kimliğidir.</summary>
    User = 1
}
