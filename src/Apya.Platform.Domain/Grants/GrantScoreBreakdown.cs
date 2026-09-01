using System.Collections.Generic;

namespace Apya.Platform.Grants;

/// <summary>
/// 1e · Uyum skorunun boyut kırılımı. <see cref="GrantMatchManager.Explain"/> üretir;
/// kiracı detayındaki uyum barları ve host önizlemeleri aynı hesabı gösterir.
/// </summary>
/// <param name="Total">0-100 toplam skor — <c>Score()</c> ile birebir aynı.</param>
/// <param name="Dimensions">Yalnız skora GİREN boyutlar; kapalı ya da verisi olmayan boyut listede yoktur.</param>
/// <param name="SizePenaltyApplied">Ölçek uyuşmazlığı nedeniyle skor %30'a düşürüldü mü.</param>
public sealed record GrantScoreBreakdown(
    int Total,
    IReadOnlyList<GrantScoreDimension> Dimensions,
    bool SizePenaltyApplied);

/// <param name="Value">Boyutun 0-100 arası katkı değeri (ağırlıktan bağımsız).</param>
/// <param name="Weight">Boyutun çarpanı — barın yanında "×2" olarak gösterilebilir.</param>
public sealed record GrantScoreDimension(GrantMatchDimension Dimension, int Value, double Weight);
