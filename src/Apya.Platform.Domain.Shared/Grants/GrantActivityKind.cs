namespace Apya.Platform.Grants;

/// <summary>
/// 2d · Başvuru akışındaki olay türü. Mesaj ve evrak sürümü AYRI tablolarda durur;
/// bu enum yalnızca başka yerde iz bırakmayan olayları kaydeder.
/// </summary>
public enum GrantActivityKind
{
    /// <summary>Başvuru panoda başka bir aşamaya taşındı.</summary>
    StageMoved = 0,

    /// <summary>Danışman ataması değişti.</summary>
    AssignmentChanged = 1,

    /// <summary>Sıra karşı tarafa devredildi.</summary>
    HandedOver = 2,

    /// <summary>Başvuru kuruma gönderildi.</summary>
    Submitted = 3,

    // ── Para olayları (denetim H-07): bağlamda eski → yeni tutar, sayılar tr biçiminde ──
    /// <summary>Onaylanan destek tutarı değişti.</summary>
    ApprovedAmountChanged = 4,
    /// <summary>Tahsilat dilimi eklendi.</summary>
    TrancheAdded = 5,
    /// <summary>Tahsilat diliminin tutarı değişti.</summary>
    TrancheAmountChanged = 6,
    /// <summary>Tahsilat dilimi silindi.</summary>
    TrancheRemoved = 7,
    /// <summary>Dilim tahsil edildi olarak işaretlendi.</summary>
    TranchePaid = 8
}
