using System;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>Tüm dashboard uçlarının ortak filtresi. Aralık varsayılanı "bu ay".</summary>
public class DashboardQueryDto
{
    public DashboardDateRange Range { get; set; } = DashboardDateRange.Month;

    /// <summary>Boşsa tenant'ın tüm projeleri.</summary>
    public Guid? ProjectId { get; set; }
}
