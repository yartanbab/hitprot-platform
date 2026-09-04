using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Tenant çağrı feed öğesi — canlı hesaplanır (kalıcı değil).</summary>
public class GrantRecommendationDto
{
    public Guid GrantCallId { get; set; }
    public Guid GrantId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public int? DaysRemaining { get; set; }
    public decimal? MaxAmount { get; set; }
    public int Score { get; set; }
    public bool AlreadyApplied { get; set; }

    /// <summary>
    /// Kiracının bu çağrıya bıraktığı SON ilgi talebinin durumu; hiç talep yoksa null.
    /// Kart CTA'sı buna bakar: talep sürüyorsa buton yerine rozet çıkar.
    /// </summary>
    public GrantInterestStatus? InterestStatus { get; set; }

    /// <summary>Host bu çağrıyı bu firmaya bilinçli olarak gönderdi mi (B3 host-push).</summary>
    public bool IsHostRecommended { get; set; }

    /// <summary>Çağrı firmaya önerilir mi: skor >= program eşiği ya da host-push.
    /// False olanlar da kiracıya listelenir ("Diğer Açık Çağrılar"), yalnız ayrı blokta.</summary>
    public bool IsRecommended { get; set; }

    // --- 1d/9a · kiracı yüzeyi ---
    /// <summary>Destek oranı — kartlardaki tutar/oran kutusu.</summary>
    public int? SupportRatePercent { get; set; }

    /// <summary>Kiracının bu çağrıya göre durduğu kova (Uygun / Koşullu / Uygun değil).</summary>
    public GrantEligibilityBucket Bucket { get; set; }

    /// <summary>Kartlardaki "neden uygun" maddeleri — kanıtlı sağlanan şartlar.</summary>
    public List<GrantEligibilityRule> PassedRules { get; set; } = new();

    /// <summary>Açıkça sağlanmayan şartlar.</summary>
    public List<GrantEligibilityRule> FailedRules { get; set; } = new();

    /// <summary>Firma verisi eksik olduğu için ölçülemeyen şartlar.</summary>
    public List<GrantEligibilityRule> UnknownRules { get; set; } = new();

    /// <summary>Tek satırlık gerekçenin dayandığı şart. Uygun çağrılarda null.</summary>
    public GrantEligibilityRule? ReasonRule { get; set; }

    /// <summary>Gerekçedeki firma değeri ("7 yıl").</summary>
    public string? ReasonFirmValue { get; set; }

    /// <summary>Gerekçedeki program eşiği ("2").</summary>
    public string? ReasonGrantValue { get; set; }

    /// <summary>Engel firmanın kendi elinde mi — "sadece giderilebilir eksikler" süzgeci.</summary>
    public bool IsFixable { get; set; }

    /// <summary>Başvuru zorluğu (1-5).</summary>
    public int Difficulty { get; set; }

    public bool IsBookmarked { get; set; }
}
