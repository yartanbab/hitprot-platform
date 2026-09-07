using System;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>
/// "Efor dağılımı" kartının bir satırı — dönem içinde bir kişinin kaydettiği süre.
/// <para>
/// Süresi kaydedilmemiş görev bu toplama KATKI VERMEZ; kart harcanan eforu değil,
/// <b>kaydedilmiş</b> eforu gösterir. Dönemde hiç kaydı olmayan kullanıcı listede yer almaz.
/// </para>
/// </summary>
public class EffortDistributionDto
{
    public Guid UserId { get; set; }

    /// <summary>Ad soyad; ikisi de boşsa kullanıcı adı.</summary>
    public string UserName { get; set; } = string.Empty;

    /// <summary>Dönemde kaydedilen toplam süre, saat (bir ondalık).</summary>
    public decimal Hours { get; set; }

    /// <summary>Kişinin dönemde süre işlediği ayrı görev sayısı.</summary>
    public int TaskCount { get; set; }
}
