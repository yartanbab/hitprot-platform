using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Grants;

/// <summary>Tek bir uygunluk kuralının tek firma için sonucu.</summary>
public sealed record GrantRuleResult(GrantEligibilityRule Rule, GrantRuleOutcome Outcome);

/// <summary>
/// Bir firmanın bir programın uygunluk şartlarına göre değerlendirmesi.
/// Listede YALNIZCA programın gerçekten tanımladığı kurallar bulunur — program bir şart
/// koymuyorsa o kural hiç üretilmez. <see cref="GrantRuleOutcome.Unknown"/> eleyici değildir.
/// </summary>
public sealed class GrantEligibilityResult
{
    public IReadOnlyList<GrantRuleResult> Rules { get; }

    public bool IsEligible => Rules.All(r => r.Outcome != GrantRuleOutcome.Failed);

    /// <summary>
    /// TÜM kurallar KANITLI biçimde geçti (Unknown yok). Host tarafındaki "kaç firma
    /// karşılıyor" sayacı bunu kullanır: verisi olmayan firma sayılmaz, "eksik veri
    /// kampanyası" ile kazanılır.
    /// </summary>
    public bool IsConfirmed => Rules.All(r => r.Outcome == GrantRuleOutcome.Passed);

    /// <summary>9a · Kiracının hangi kovada durduğu.</summary>
    public GrantEligibilityBucket Bucket =>
        Rules.Any(r => r.Outcome == GrantRuleOutcome.Failed) ? GrantEligibilityBucket.UygunDegil
        : Rules.Any(r => r.Outcome == GrantRuleOutcome.Unknown) ? GrantEligibilityBucket.Kosullu
        : GrantEligibilityBucket.Uygun;

    /// <summary>
    /// 9a · "Sadece giderilebilir eksikleri göster" süzgeci: engel firmanın KENDİ
    /// elinde mi? Eksik veri daima giderilebilir (profili doldur). Eleyen şartlardan
    /// yalnız firmanın değiştirebilecekleri sayılır — şirket yaşı, ölçek ve ciro
    /// kısa vadede değiştirilemez, bu yüzden onlar giderilebilir SAYILMAZ.
    /// </summary>
    public bool IsFixable =>
        Rules.Where(r => r.Outcome == GrantRuleOutcome.Failed).All(r => FixableRules.Contains(r.Rule));

    private static readonly GrantEligibilityRule[] FixableRules =
    {
        GrantEligibilityRule.Trl,
        GrantEligibilityRule.StaffCount,
        GrantEligibilityRule.RdStaffCount,
        GrantEligibilityRule.Consortium
    };

    /// <summary>Verisi olmadığı için değerlendirilemeyen kural sayısı — "eksik veri kampanyası" sinyali.</summary>
    public int UnknownCount => Rules.Count(r => r.Outcome == GrantRuleOutcome.Unknown);

    public GrantEligibilityResult(IReadOnlyList<GrantRuleResult> rules)
    {
        Rules = rules;
    }
}
