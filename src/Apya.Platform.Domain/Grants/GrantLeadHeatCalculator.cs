using System;
using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Grants;

/// <summary>Isı hesabının çıktısı — puan ve puanı üreten sinyaller.</summary>
public sealed record GrantLeadHeat(int Score, IReadOnlyList<GrantLeadSignal> Signals);

/// <summary>
/// 5a · Talebin "danışmanlığa ne kadar ihtiyacı var" puanı.
///
/// <para>DI'sız ve saf. Puan sinyallerin TOPLAMIDIR; her sinyalin katkısı burada
/// tek yerde yazılı, böylece 5a'daki "neden nitelikli" listesi puanla birebir
/// tutar. Gizli bir formül olsaydı host, ekranda gördüğü gerekçelerle sıralamanın
/// neden uyuşmadığını hiç çözemezdi.</para>
///
/// <para>🔴 Yön ÖNEMLİ: puan "bu firma iyi müşteri" demez, "bu firma bu işi tek
/// başına yapamaz" der. Kolay çağrıya uygun ve şartları zaten karşılayan firma
/// BİLİNÇLİ olarak düşük ısı alır — tasarımın kuralı bu.</para>
/// </summary>
public static class GrantLeadHeatCalculator
{
    /// <summary>Bu puanın üstü randevuya çağrılır.</summary>
    public const int QualifiedThreshold = 70;

    /// <summary>Bu puanın altı aranmaz; firma işi tek başına yapabilir.</summary>
    public const int CallThreshold = 40;

    /// <summary>Son başvuruya bu kadar gün kaldıysa "son tarih baskısı" sayılır.</summary>
    public const int DeadlinePressureDays = 45;

    /// <summary>Cironun alt eşiğin bu katından fazlası "eşiğin belirgin üstünde".</summary>
    public const decimal RevenueComfortMultiplier = 2m;

    /// <summary>Bu değerin altı "TRL düşük".</summary>
    public const int LowTrlCeiling = 4;

    private static readonly IReadOnlyDictionary<GrantLeadSignal, int> Weights =
        new Dictionary<GrantLeadSignal, int>
        {
            // Konsorsiyum kurgusu reddedilmenin bir numaralı sebebi; tek başına
            // en ağır sinyal.
            [GrantLeadSignal.HighAmountNeedsConsortium] = 34,

            // Zorluk zaten ayrıca puanlanıyor; süre baskısı onu keskinleştirir.
            [GrantLeadSignal.DeadlinePressure] = 18,

            // Birden çok çağrıya uyan firma hangisine gireceğini seçemez.
            [GrantLeadSignal.MultipleEligible] = 14,

            // Ödeme gücü — işi yaptırabilir demek, yapamaz demek değil.
            [GrantLeadSignal.RevenueAboveThreshold] = 10,

            // Ekip var ama proje olgunlaşmamış: kurgu desteği gerekir.
            [GrantLeadSignal.RdStaffLowTrl] = 14
        };

    /// <summary>
    /// Zorluğun katkısı. 1-2 (kolay) puan EKLEMEZ: tasarımın açık kuralı
    /// "kolay çağrılarda size destek gerekmez".
    /// </summary>
    private static int DifficultyPoints(int difficulty) => difficulty switch
    {
        5 => 20,
        4 => 14,
        3 => 6,
        _ => 0
    };

    public static GrantLeadHeat Calculate(
        Grant grant,
        GrantCall call,
        FirmSignals answers,
        GrantEligibilityResult eligibility,
        int difficulty,
        int otherEligibleCallCount,
        DateTime today)
    {
        var signals = new List<GrantLeadSignal>();

        // 1) Yüksek tutar + konsorsiyum şartı, ortağı yok.
        if (grant.RequiresConsortium && answers.HasConsortiumPartner == false)
        {
            signals.Add(GrantLeadSignal.HighAmountNeedsConsortium);
        }

        // 2) Son tarih baskısı.
        if (call.Deadline.HasValue)
        {
            var daysLeft = (call.Deadline.Value.Date - today.Date).Days;
            if (daysLeft >= 0 && daysLeft <= DeadlinePressureDays)
            {
                signals.Add(GrantLeadSignal.DeadlinePressure);
            }
        }

        // 3) Çoklu uygunluk.
        if (otherEligibleCallCount > 0)
        {
            signals.Add(GrantLeadSignal.MultipleEligible);
        }

        // 4) Ciro eşiğin belirgin üstünde.
        if (answers.AnnualRevenue.HasValue && grant.MinRevenue.HasValue && grant.MinRevenue.Value > 0
            && answers.AnnualRevenue.Value >= grant.MinRevenue.Value * RevenueComfortMultiplier)
        {
            signals.Add(GrantLeadSignal.RevenueAboveThreshold);
        }

        // 5) Ar-Ge personeli var ama TRL düşük.
        if (answers.RdStaffCount is > 0 && answers.Trl is > 0 and <= LowTrlCeiling)
        {
            signals.Add(GrantLeadSignal.RdStaffLowTrl);
        }

        var score = signals.Sum(s => Weights[s]) + DifficultyPoints(difficulty);

        // Açıkça uygun DEĞİLSE ısı yarıya iner: danışmanlık şartı doğuramaz.
        // Sıfırlanmaz — şart giderilebilir olabilir, host görmeye devam etsin.
        if (eligibility.Bucket == GrantEligibilityBucket.UygunDegil)
        {
            score /= 2;
        }

        return new GrantLeadHeat(Math.Clamp(score, 0, 100), signals);
    }
}
