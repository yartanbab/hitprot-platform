namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Fonlama diliminin tahsilat durumu.
///
/// İlk üç değer tutardan TÜREBİLİR ve <c>FundingTranche.RegisterCollection</c>
/// bunları kendisi set eder; elle set edilen tek durum <see cref="Disputed"/>'dır
/// (bir tutar hareketi değil, bir süreç bilgisidir).
/// </summary>
public enum FundingTrancheStatus
{
    /// <summary>Henüz tahsilat yok.</summary>
    Pending = 0,

    /// <summary>Planlanandan az tahsil edildi.</summary>
    PartiallyCollected = 1,

    /// <summary>Planlanan tutar (ve varsa kesinti düşüldükten sonrası) tahsil edildi.</summary>
    Collected = 2,

    /// <summary>Kesintiye/eksik ödemeye itiraz sürüyor. Tutardan türemez, elle işaretlenir.</summary>
    Disputed = 3,
}
