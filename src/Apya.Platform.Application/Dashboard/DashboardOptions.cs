namespace Apya.Platform.Dashboard;

/// <summary>Dashboard hesaplama eşikleri. <c>Configure&lt;DashboardOptions&gt;</c> ile ezilebilir.</summary>
public class DashboardOptions
{
    /// <summary>Bir görev kaç gündür değişmemişse "tıkanmış" sayılır.</summary>
    public int StaleAfterDays { get; set; } = 3;

    /// <summary>Proje sağlığında "riskli" eşiği (zaman veya bütçe oranı).</summary>
    public decimal RiskyRatio { get; set; } = 0.90m;

    /// <summary>Proje sağlığında "dikkat" eşiği.</summary>
    public decimal AttentionRatio { get; set; } = 0.70m;

    /// <summary>Teslim / sağlık / onay listelerinin döndüğü azami satır sayısı.</summary>
    public int MaxListRows { get; set; } = 50;

    /// <summary>Gelir-gider grafiğinin kaç ay geriye gideceği.</summary>
    public int IncomeExpenseMonths { get; set; } = 6;

    /// <summary>Isı takviminin kaç haftalık pencere göstereceği.</summary>
    public int HeatmapWeeks { get; set; } = 4;
}
