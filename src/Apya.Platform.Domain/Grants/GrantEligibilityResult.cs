using System;
using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Grants;

/// <summary>Tek bir uygunluk kuralının tek firma için sonucu.</summary>
public sealed record GrantRuleResult(GrantEligibilityRule Rule, GrantRuleOutcome Outcome);

/// <summary>
/// Kurumun elle girdiği bir parametreye bağlı şartın sonucu. <paramref name="Criterion"/> null ise
/// şart programın kendi alanından türemiştir (eş finansman: destek oranı %100'ün altında).
/// Eleyici olmayan şart tutmasa da kovayı değiştirmez; yalnız uyarıdır.
/// </summary>
public sealed record GrantParameterRuleResult(
    Guid DefinitionId,
    GrantRuleOutcome Outcome,
    bool IsEliminating,
    GrantParameterCriterion? Criterion);

/// <summary>
/// Bir firmanın bir programın uygunluk şartlarına göre değerlendirmesi.
/// Listede YALNIZCA programın gerçekten tanımladığı kurallar bulunur — program bir şart
/// koymuyorsa o kural hiç üretilmez. <see cref="GrantRuleOutcome.Unknown"/> eleyici değildir.
/// </summary>
public sealed class GrantEligibilityResult
{
    public IReadOnlyList<GrantRuleResult> Rules { get; }

    /// <summary>Kurum parametrelerine bağlı şartlar (eş finansman ve host'un programa eklediği ölçütler).</summary>
    public IReadOnlyList<GrantParameterRuleResult> ParameterRules { get; }

    private bool AnyEliminated => Rules.Any(r => r.Outcome == GrantRuleOutcome.Failed)
                                  || ParameterRules.Any(r => r.IsEliminating && r.Outcome == GrantRuleOutcome.Failed);

    private bool AnyUnknown => Rules.Any(r => r.Outcome == GrantRuleOutcome.Unknown)
                               || ParameterRules.Any(r => r.Outcome == GrantRuleOutcome.Unknown);

    public bool IsEligible => !AnyEliminated;

    /// <summary>
    /// TÜM kurallar KANITLI biçimde geçti (Unknown yok). Host tarafındaki "kaç firma
    /// karşılıyor" sayacı bunu kullanır: verisi olmayan firma sayılmaz, "eksik veri
    /// kampanyası" ile kazanılır.
    /// </summary>
    public bool IsConfirmed => !AnyEliminated && !AnyUnknown;

    /// <summary>9a · Kiracının hangi kovada durduğu.</summary>
    public GrantEligibilityBucket Bucket =>
        AnyEliminated ? GrantEligibilityBucket.UygunDegil
        : AnyUnknown ? GrantEligibilityBucket.Kosullu
        : GrantEligibilityBucket.Uygun;

    /// <summary>
    /// 9a · "Sadece giderilebilir eksikleri göster" süzgeci: engel firmanın KENDİ
    /// elinde mi? Eksik veri daima giderilebilir (profili doldur). Eleyen şartlardan
    /// yalnız firmanın değiştirebilecekleri sayılır — şirket yaşı, ölçek ve ciro
    /// kısa vadede değiştirilemez, bu yüzden onlar giderilebilir SAYILMAZ.
    /// </summary>
    public bool IsFixable =>
        Rules.Where(r => r.Outcome == GrantRuleOutcome.Failed).All(r => FixableRules.Contains(r.Rule))
        // Parametre şartı tutmuyorsa (ör. eş finansman ayıramıyor) kısa vadede giderilebilir sayılmaz.
        && !ParameterRules.Any(r => r.IsEliminating && r.Outcome == GrantRuleOutcome.Failed);

    private static readonly GrantEligibilityRule[] FixableRules =
    {
        GrantEligibilityRule.Trl,
        GrantEligibilityRule.StaffCount,
        GrantEligibilityRule.RdStaffCount,
        GrantEligibilityRule.Consortium
    };

    /// <summary>Verisi olmadığı için değerlendirilemeyen kural sayısı — "eksik veri kampanyası" sinyali.</summary>
    public int UnknownCount => Rules.Count(r => r.Outcome == GrantRuleOutcome.Unknown)
                               + ParameterRules.Count(r => r.Outcome == GrantRuleOutcome.Unknown);

    public GrantEligibilityResult(
        IReadOnlyList<GrantRuleResult> rules,
        IReadOnlyList<GrantParameterRuleResult>? parameterRules = null)
    {
        Rules = rules;
        ParameterRules = parameterRules ?? Array.Empty<GrantParameterRuleResult>();
    }
}
