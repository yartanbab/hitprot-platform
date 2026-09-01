namespace Apya.Platform.Grants;

/// <summary>6b · Kurumun başvuruya verdiği karar.</summary>
public enum GrantDecisionOutcome
{
    Reddedildi = 0,
    Onaylandi = 1,

    /// <summary>Kısmi onay: tutar indirilerek kabul.</summary>
    KismiOnay = 2
}
