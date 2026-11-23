namespace Apya.Platform.Grants;

/// <summary>
/// Öneri akışında firmanın verdiği tepki. 🔴 Sayı olarak saklanır — yeni tür SONA eklenir,
/// mevcut numaralar DEĞİŞTİRİLMEZ.
/// </summary>
public enum GrantRecommendationEventKind
{
    /// <summary>"İlgilenmiyorum": çağrı akıştan kalkar.</summary>
    Dismissed = 1,

    /// <summary>"Geri al": kapatılan çağrı akışa döner.</summary>
    Restored = 2
}
