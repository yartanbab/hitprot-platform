using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>19a · Fikir Havuzu süzgeci.</summary>
public class GetGrantIdeaPoolInput
{
    /// <summary>null = tüm kaynaklar.</summary>
    public GrantInterestSource? Source { get; set; }

    public GrantIdeaPoolSort Sort { get; set; }
}

public class GrantIdeaPoolDto
{
    public List<GrantIdeaRowDto> Items { get; set; } = new();

    /// <summary>Süzgeçten bağımsız: havuzdaki bekleyen fikir sayısı (menü rozeti ve boş durum ayrımı).</summary>
    public int TotalCount { get; set; }

    /// <summary>"Fikir ekle" penceresinin firma seçenekleri.</summary>
    public List<GrantRequestOptionDto> Firms { get; set; } = new();

    /// <summary>22 · "Eşleşme bekleyen" şeridi: en az bir açık çağrıyla eşiği geçen fikir sayısı (süzgeçten bağımsız).</summary>
    public int AwaitingMatchCount { get; set; }
}

/// <summary>20a · Fikrin bir çağrıyla uyumu (havuz listesindeki "Çağrı eşleşmesi" hücresi).</summary>
public class GrantIdeaCallMatchDto
{
    public Guid GrantCallId { get; set; }

    public string GrantName { get; set; } = string.Empty;

    public string? Period { get; set; }

    public int Score { get; set; }
}

public class GrantIdeaRowDto
{
    public Guid Id { get; set; }

    public Guid TenantId { get; set; }

    public string FirmName { get; set; } = string.Empty;

    /// <summary>Proje fikri — formun ilk sorusu.</summary>
    public string? Idea { get; set; }

    public GrantInterestSource Source { get; set; }

    /// <summary>Kaydı giren kişi: firma kullanıcısı ya da danışman.</summary>
    public string? CreatorName { get; set; }

    public DateTime CreationTime { get; set; }

    public decimal? EstimatedBudget { get; set; }

    public DateTime? TargetStartDate { get; set; }

    /// <summary>20a · Açık çağrılar içinde eşiği geçen en güçlü eşleşme; null = "açık çağrı yok, izleniyor".</summary>
    public GrantIdeaCallMatchDto? BestMatch { get; set; }

    /// <summary>Eşiği geçen diğer açık çağrı sayısı ("+2 çağrı").</summary>
    public int OtherMatchCount { get; set; }
}

/// <summary>19a · Fikrin tamamı — dokuz sorunun cevapları.</summary>
public class GrantIdeaDetailDto : GrantIdeaRowDto
{
    public string? ProblemStatement { get; set; }
    public string? TargetAudience { get; set; }
    public string? PlannedActivities { get; set; }
    public string? DurationAndPartners { get; set; }
    public string? SupportNeeds { get; set; }
    public string? PriorExperience { get; set; }
    public string? TeamStructure { get; set; }
    public string? Stakeholders { get; set; }
}

/// <summary>20a · Eşleştirme ekranı › Havuzdaki fikirler: fikrin bu çağrıyla uyumu ve gerekçesi.</summary>
public class GrantIdeaMatchDto : GrantIdeaRowDto
{
    /// <summary>Fikir metni + firma profili birleşik puanı (0-100).</summary>
    public int Score { get; set; }

    /// <summary>Metin payı; null = programın metni yok, puan firma skorudur.</summary>
    public int? TextScore { get; set; }

    /// <summary>Firma profili payı; null = program hedeflenmemiş (etiketsiz), puan metin payıdır.</summary>
    public int? FirmScore { get; set; }

    /// <summary>Eşiği geçti mi — geçmeyen fikir ayrı ve soluk listelenir.</summary>
    public bool IsMatch { get; set; }

    /// <summary>Programın dilinden fikirde geçen ilk kelimeler ("kadın, dijital, eğitim").</summary>
    public List<string> MatchedTerms { get; set; } = new();

    /// <summary>null = kıyaslanamaz · true = çağrı aralığında · false = tavanı aşıyor.</summary>
    public bool? BudgetFits { get; set; }
}

/// <summary>20a · Bir çağrı için havuz taraması.</summary>
public class GrantCallIdeaMatchesDto
{
    public Guid GrantCallId { get; set; }

    /// <summary>Çağrı yayında mı — yalnız açık çağrıyla ilişkilendirilir.</summary>
    public bool IsOpen { get; set; }

    /// <summary>Eşiği geçen fikir sayısı (şerit ve sekme sayacı).</summary>
    public int MatchCount { get; set; }

    /// <summary>"Uyan fikir" eşiği — ekran eşik altı ipucunda yazar, ayrımı <see cref="GrantIdeaMatchDto.IsMatch"/> taşır.</summary>
    public int Threshold { get; set; }

    /// <summary>Puana göre azalan; eşik altındakiler de dahil.</summary>
    public List<GrantIdeaMatchDto> Items { get; set; } = new();
}

/// <summary>20a · "Bu çağrıyla ilişkilendir" / "N'ünü de ilişkilendir".</summary>
public class LinkGrantIdeasInput
{
    [Required(ErrorMessage = "Çağrı seçilmedi.")]
    public Guid GrantCallId { get; set; }

    [Required(ErrorMessage = "Fikir seçilmedi.")]
    public List<Guid> InterestIds { get; set; } = new();
}

public class GrantIdeaLinkResultDto
{
    public int LinkedCount { get; set; }

    /// <summary>Artık havuzda olmayan ya da firmanın bu çağrıda süren talebi/başvurusu olduğu için atlanan fikir.</summary>
    public int SkippedCount { get; set; }
}
