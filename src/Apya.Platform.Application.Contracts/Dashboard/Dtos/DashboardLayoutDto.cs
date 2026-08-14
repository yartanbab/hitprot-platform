using System.Collections.Generic;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>Bir kartın ızgaradaki yeri. Birim: 12 kolon × 64px satır.</summary>
public class DashboardCardDto
{
    public string CardKey { get; set; } = string.Empty;

    public DashboardChartType ChartType { get; set; }

    public int X { get; set; }
    public int Y { get; set; }
    public int W { get; set; }
    public int H { get; set; }
}

/// <summary>Kullanıcının bir görünüm (view) için kaydettiği kart düzeni.</summary>
public class DashboardLayoutDto
{
    /// <summary>Görünüm anahtarı: "project-management" | "finance" | "today" | "grants".</summary>
    public string ViewKey { get; set; } = string.Empty;

    public List<DashboardCardDto> Cards { get; set; } = new();

    /// <summary>Kayıtlı düzen yok, rol varsayılanı döndü — UI "sıfırla" düğmesini gizler.</summary>
    public bool IsDefault { get; set; }
}

public class SaveDashboardLayoutInput
{
    public string ViewKey { get; set; } = string.Empty;

    public List<DashboardCardDto> Cards { get; set; } = new();
}
