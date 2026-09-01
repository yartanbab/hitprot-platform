namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Bir kesintinin nasıl kapatıldığı. Kesinti kaydı tek başına "para eksildi"
/// der; bu alan o eksiğin bütçeye ne yaptığını söyler.
/// </summary>
public enum DeductionResolution
{
    /// <summary>Karar verilmedi — bütçe hâlâ eski hâliyle duruyor.</summary>
    Open = 0,

    /// <summary>
    /// Bütçe revize edildi; kalem tutarları düşürüldü.
    /// <c>TrancheDeduction.BudgetRevisionId</c> hangi revizyon olduğunu söyler.
    /// </summary>
    AppliedToBudget = 1,

    /// <summary>
    /// Bütçe aynı bırakıldı: iş yapılacak ama karşılığı gelmeyecek.
    /// Tasarımın "finanse edilmeyen" kalemi budur.
    /// </summary>
    Unfunded = 2,
}
