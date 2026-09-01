using System.Collections.Generic;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 1e/9a · Başvuru zorluğu (1-5). Tasarımın saydığı etkenlerden türetilir: evrak sayısı,
/// e-imza/noter gereksinimi, konsorsiyum şartı, süreç karmaşıklığı ve son tarih baskısı.
///
/// <para>Her etken bir puan ekler; taban 1'dir, tavan 5. Ölçek bilinçle kaba: amaç
/// "bu başvuru tek başına yürütülür mü" sorusuna dürüst bir işaret vermek, sahte bir
/// hassasiyet üretmek değil. Saf hesap — kalıcılık yok, DI'sız test edilebilir.</para>
/// </summary>
public class GrantDifficultyCalculator : DomainService
{
    /// <summary>Bu sayıdan itibaren evrak yükü zorluk sayılır.</summary>
    public const int ManyDocumentsThreshold = 5;

    /// <summary>Bu aşama sayısından itibaren süreç "karmaşık" sayılır.</summary>
    public const int ComplexStageThreshold = 6;

    /// <summary>Bu ay sayısından itibaren proje süresi "karmaşık" sayılır.</summary>
    public const int LongProjectMonths = 24;

    /// <summary>Bu gün sayısının altında son tarih baskısı vardır.</summary>
    public const int DeadlinePressureDays = 20;

    public GrantDifficulty Calculate(
        Grant grant,
        int documentCount,
        bool requiresESignature,
        int stageStepCount,
        int? daysRemaining)
    {
        var reasons = new List<GrantDifficultyReason>();

        if (documentCount >= ManyDocumentsThreshold)
        {
            reasons.Add(GrantDifficultyReason.ManyDocuments);
        }
        if (requiresESignature)
        {
            reasons.Add(GrantDifficultyReason.ESignature);
        }
        if (grant.RequiresConsortium)
        {
            reasons.Add(GrantDifficultyReason.Consortium);
        }
        if (stageStepCount >= ComplexStageThreshold
            || grant.ProjectDurationMonths >= LongProjectMonths)
        {
            reasons.Add(GrantDifficultyReason.ComplexProcess);
        }
        if (daysRemaining is >= 0 and <= DeadlinePressureDays)
        {
            reasons.Add(GrantDifficultyReason.DeadlinePressure);
        }

        return new GrantDifficulty(1 + reasons.Count, reasons);
    }
}

/// <summary>Zorluk seviyesi (1-5) ve onu yükselten etkenler.</summary>
public sealed record GrantDifficulty(int Level, IReadOnlyList<GrantDifficultyReason> Reasons)
{
    /// <summary>4 ve üstü: "tek başınıza yürütmenizi önermiyoruz" eşiği (tasarım 1e).</summary>
    public bool IsHard => Level >= 4;
}
