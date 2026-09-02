using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

// ─────────────────────────────────────────────── 1f · Arama motoru

public class GrantPublicSearchInput
{
    [StringLength(160, ErrorMessage = "Arama metni en fazla 160 karakter olabilir.")]
    public string? Query { get; set; }

    public List<string> Issuers { get; set; } = new();

    /// <summary>Firma ölçeği süzgeci (CompanySize).</summary>
    public List<CompanySize> Sizes { get; set; } = new();

    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }

    /// <summary>Son başvuruya kalan gün üst sınırı (30 / 90 / null = tümü).</summary>
    public int? DeadlineWithinDays { get; set; }

    /// <summary>Zorluk seviyeleri (1-5). Boşsa süzülmez.</summary>
    public List<int> Difficulties { get; set; } = new();
}

public class GrantPublicSearchResultDto
{
    public List<GrantPublicCallDto> Items { get; set; } = new();

    /// <summary>Süzgeç uygulanmadan önceki toplam açık çağrı sayısı.</summary>
    public int TotalOpenCount { get; set; }

    public decimal TotalBudget { get; set; }

    /// <summary>30 gün içinde kapanan çağrı sayısı.</summary>
    public int ClosingSoonCount { get; set; }

    /// <summary>Katalogdaki en son değişiklik anı — "son güncelleme".</summary>
    public DateTime? LastUpdatedAt { get; set; }

    /// <summary>Kurum adı → açık çağrı sayısı (süzgeç panelindeki sayaçlar).</summary>
    public List<GrantPublicFacetDto> IssuerFacets { get; set; } = new();

    /// <summary>
    /// 7a · Sonuç boşken "hangi süzgeci gevşetirsen kaç sonuç çıkar". Yalnız
    /// sonuç sıfırken ve o süzgeç GERÇEKTEN uygulanmışken doldurulur — boş durum
    /// bir sonraki adımı söylemeli, genel bir "filtreleri gözden geçirin" değil.
    /// </summary>
    public List<GrantPublicRelaxationDto> Relaxations { get; set; } = new();
}

public class GrantPublicRelaxationDto
{
    /// <summary>Gevşetilecek süzgecin anahtarı; istemci yerelleştirir.</summary>
    public string Filter { get; set; } = string.Empty;

    /// <summary>O süzgeç kaldırılırsa çıkacak sonuç sayısı.</summary>
    public int Count { get; set; }
}

public class GrantPublicFacetDto
{
    public string Value { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class GrantPublicCallDto
{
    public Guid CallId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string? Period { get; set; }
    public decimal? MaxAmount { get; set; }
    public int? SupportRatePercent { get; set; }
    public DateTime? Deadline { get; set; }
    public int? DaysRemaining { get; set; }

    /// <summary>1-5. İstemci etiketi yerelleştirir.</summary>
    public int Difficulty { get; set; }

    /// <summary>Uygun firma ölçekleri; boşsa kısıt yok.</summary>
    public List<CompanySize> EligibleSizes { get; set; } = new();
}

// ─────────────────────────────────────────────── 1g · Detay + test

public class GrantPublicDetailDto
{
    public Guid CallId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Period { get; set; }
    public DateTime? Deadline { get; set; }
    public int? DaysRemaining { get; set; }

    // Dörtlü metrik şeridi
    public decimal? MaxAmount { get; set; }
    public int? SupportRatePercent { get; set; }
    public int? ProjectDurationMonths { get; set; }
    public GrantRepaymentType RepaymentType { get; set; }

    /// <summary>"Kimler başvurabilir" kutuları — şart + değeri.</summary>
    public List<GrantPublicCriterionDto> Criteria { get; set; } = new();

    /// <summary>"Hangi harcamalar destekleniyor" tablosu.</summary>
    public List<GrantPublicCostItemDto> CostItems { get; set; } = new();

    public string? SourceUrl { get; set; }

    public int Difficulty { get; set; }
    public List<GrantDifficultyReason> DifficultyReasons { get; set; } = new();

    /// <summary>Benzer hibeler — aynı kurumun ya da aynı ölçeğin diğer açık çağrıları.</summary>
    public List<GrantPublicCallDto> SimilarCalls { get; set; } = new();

    /// <summary>Bu çağrının GERÇEKTEN ölçtüğü şartlar için sorular.</summary>
    public List<GrantPublicQuestionDto> Questions { get; set; } = new();
}

public class GrantPublicCriterionDto
{
    public GrantEligibilityRule Rule { get; set; }

    /// <summary>Şartın değeri — istemci sayıyı biçimlendirir, metni yerelleştirir.</summary>
    public string? Value { get; set; }
}

public class GrantPublicCostItemDto
{
    /// <summary>Kalem türü; istemci yerelleştirir (Grants:CostItem:{Kind}).</summary>
    public GrantCostItemKind Kind { get; set; }

    public int? LimitPercent { get; set; }
}

/// <summary>
/// Testin tek sorusu. Yalnız çağrının BEYAN ETTİĞİ şartlar için üretilir —
/// sabit beş soru sorulsaydı çağrının ölçmediği şey de sorulmuş olurdu.
/// </summary>
public class GrantPublicQuestionDto
{
    public GrantEligibilityRule Rule { get; set; }

    /// <summary>Seçenekli soruda değerler; serbest sayıda boş.</summary>
    public List<GrantPublicOptionDto> Options { get; set; } = new();
}

public class GrantPublicOptionDto
{
    /// <summary>Sunucuya dönecek değer.</summary>
    public string Value { get; set; } = string.Empty;

    /// <summary>Yerelleştirme anahtarının son parçası.</summary>
    public string LabelKey { get; set; } = string.Empty;
}

public class GrantPublicTestInput
{
    [Required(ErrorMessage = "Çağrı seçilmedi.")]
    public Guid CallId { get; set; }

    public CompanySize? Size { get; set; }
    public int? CompanyAgeYears { get; set; }

    [StringLength(96, ErrorMessage = "Sektör en fazla 96 karakter olabilir.")]
    public string? Sector { get; set; }

    public int? RdStaffCount { get; set; }
    public int? StaffCount { get; set; }
    public int? Trl { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public bool? HasConsortiumPartner { get; set; }
}

public class GrantPublicTestResultDto
{
    public Guid CallId { get; set; }

    public int PassedRuleCount { get; set; }
    public int TotalRuleCount { get; set; }

    public List<GrantPublicRuleResultDto> Rules { get; set; } = new();

    /// <summary>Tahmini destek — üst limit ve destek oranından.</summary>
    public decimal? EstimatedSupport { get; set; }

    public int Difficulty { get; set; }
    public List<GrantDifficultyReason> DifficultyReasons { get; set; } = new();

    /// <summary>Karşılanmayan İLK şart — "Eksik: ..." uyarısının konusu.</summary>
    public GrantEligibilityRule? BlockingRule { get; set; }

    /// <summary>
    /// Danışmanlık önerilsin mi. Kolay çağrıda ve şartları zaten karşılayan
    /// firmada BİLİNÇLİ olarak false döner — tasarımın "dürüst değerlendirme" kuralı.
    /// </summary>
    public bool RecommendConsulting { get; set; }
}

public class GrantPublicRuleResultDto
{
    public GrantEligibilityRule Rule { get; set; }
    public GrantRuleOutcome Outcome { get; set; }
}

// ─────────────────────────────────────────────── 1g CTA / 5b · Talep

public class SubmitGrantLeadInput
{
    [Required(ErrorMessage = "Çağrı seçilmedi.")]
    public Guid CallId { get; set; }

    [Required(ErrorMessage = "Firma adı zorunludur.")]
    [StringLength(160, ErrorMessage = "Firma adı en fazla 160 karakter olabilir.")]
    public string FirmName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ad soyad zorunludur.")]
    [StringLength(120, ErrorMessage = "Ad soyad en fazla 120 karakter olabilir.")]
    public string ContactName { get; set; } = string.Empty;

    [StringLength(96, ErrorMessage = "Ünvan en fazla 96 karakter olabilir.")]
    public string? ContactTitle { get; set; }

    [Required(ErrorMessage = "E-posta zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi girin.")]
    [StringLength(160, ErrorMessage = "E-posta en fazla 160 karakter olabilir.")]
    public string Email { get; set; } = string.Empty;

    [StringLength(32, ErrorMessage = "Telefon en fazla 32 karakter olabilir.")]
    public string? Phone { get; set; }

    /// <summary>Testte verilen cevaplar — skorlar bunlardan hesaplanır.</summary>
    public GrantPublicTestInput Answers { get; set; } = new();

    /// <summary>
    /// SUNUCUDA doldurulur (Razor sayfası). İstemciden gelen değere güvenilmez;
    /// servis HTTP API olarak açılmadığı için tek yazma sınırı sayfadır.
    /// </summary>
    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }
}

public class GrantLeadSubmittedDto
{
    public Guid LeadId { get; set; }
    public int HeatScore { get; set; }
}

public class RequestGrantMeetingInput
{
    [Required(ErrorMessage = "Talep bulunamadı.")]
    public Guid LeadId { get; set; }

    [Required(ErrorMessage = "Görüşme için bir gün ve saat seçin.")]
    public DateTime PreferredAt { get; set; }

    [StringLength(1000, ErrorMessage = "Not en fazla 1000 karakter olabilir.")]
    public string? Note { get; set; }

    [StringLength(32, ErrorMessage = "Telefon en fazla 32 karakter olabilir.")]
    public string? Phone { get; set; }
}

/// <summary>5b'nin formu testten önden dolu gelsin diye.</summary>
public class GrantMeetingPrefillDto
{
    public Guid LeadId { get; set; }
    public string FirmName { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public bool AlreadyRequested { get; set; }
}
