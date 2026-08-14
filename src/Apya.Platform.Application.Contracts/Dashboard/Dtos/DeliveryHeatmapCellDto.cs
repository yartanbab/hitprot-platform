using System;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>Teslim yoğunluğu ısı takviminin bir günü (4 hafta × 7 gün).</summary>
public class DeliveryHeatmapCellDto
{
    public DateTime Date { get; set; }

    /// <summary>O gün son tarihi dolan, kapanmamış görev sayısı.</summary>
    public int Count { get; set; }

    /// <summary>O gün bir hibe kilometre taşı ya da dilim son tarihi var mı — sarı gün.</summary>
    public bool IsGrantDeadline { get; set; }
}
