using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 1b sağ panel · Canlı Eşleşme. Kaydedilmemiş parametrelerle hesaplanır — formdaki
/// her değişiklikten sonra yeniden istenir (istemci tarafında debounce'lanır).
/// </summary>
public class GrantMatchPreviewDto
{
    /// <summary>Değerlendirmeye giren toplam firma (kiracı) sayısı.</summary>
    public int TotalFirms { get; set; }

    /// <summary>Hiçbir şartta ELENMEYEN firma sayısı. Verisi eksik olan firma elenmez.</summary>
    public int MatchingFirms { get; set; }

    public List<GrantSizeBreakdownDto> SizeBreakdown { get; set; } = new();

    public List<GrantRuleImpactDto> RuleImpacts { get; set; } = new();

    /// <summary>Sol navdaki tamamlanma yüzdesi — kaydetmeden, formdaki güncel değerlere göre.</summary>
    public int CompletionPercent { get; set; }

    /// <summary>Yayın için eksik zorunlu alanların anahtarları.</summary>
    public List<string> MissingRequiredFields { get; set; } = new();

    /// <summary>Yayınlanmayı bekleyen taslak çağrı sayısı.</summary>
    public int DraftCallCount { get; set; }

    /// <summary>Yayınla düğmesinin canlı durumu.</summary>
    public bool CanPublish { get; set; }

    /// <summary>En çok firma eleyen şart — sağ paneldeki uyarı kutusunu besler. Eleyen şart yoksa null.</summary>
    public GrantEligibilityRule? TopEliminatingRule { get; set; }
}

public class GrantSizeBreakdownDto
{
    public CompanySize Size { get; set; }
    public int Count { get; set; }
}

/// <summary>Tek bir şartın eleme etkisi — form alanının yanındaki "−N firma" değeri.</summary>
public class GrantRuleImpactDto
{
    public GrantEligibilityRule Rule { get; set; }

    /// <summary>Bu şartın TEK BAŞINA elediği firma sayısı (diğer şartlardan bağımsız).</summary>
    public int EliminatedCount { get; set; }

    /// <summary>Bu şart için verisi olmayan firma sayısı — "eksik veri kampanyası" sinyali.</summary>
    public int MissingDataCount { get; set; }
}
