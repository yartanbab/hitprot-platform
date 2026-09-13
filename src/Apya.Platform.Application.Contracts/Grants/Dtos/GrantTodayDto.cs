using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 11a/11b · "Bugün" — her rol için tek giriş ekranı. Üstte en fazla üç iş, gerisi katlı.
/// Sıra risk × tutar: en üstteki en pahalı ihmal.
/// </summary>
public class GrantTodayDto
{
    public bool IsHost { get; set; }

    /// <summary>Selamlama için ad — boşsa istemci adsız selamlar.</summary>
    public string? FirstName { get; set; }

    /// <summary>Bugün yapılacak iş sayısı (öne çıkan + katlı).</summary>
    public int ItemCount { get; set; }

    /// <summary>İşlerin dağıldığı dosya sayısı (başvuru, talep, çağrı).</summary>
    public int FileCount { get; set; }

    /// <summary>Son tarihi 7 gün içinde olan iş sayısı.</summary>
    public int NearDeadlineCount { get; set; }

    /// <summary>En yakın son tarihe kaç gün var ve hangi program.</summary>
    public int? NearestDeadlineDays { get; set; }

    public string? NearestGrantName { get; set; }

    /// <summary>Öne çıkan işler (kiracıda en fazla 3; host'ta son tarihi 30 gün içinde olanlar).</summary>
    public List<GrantTodayItemDto> Items { get; set; } = new();

    /// <summary>Katlı kalan işler.</summary>
    public List<GrantTodayItemDto> MoreItems { get; set; } = new();

    // --- Kiracı ---

    /// <summary>Tek fırsat: danışmanın önerdiği, henüz ilgi bildirilmemiş çağrı. Yoksa null.</summary>
    public GrantTodayOpportunityDto? Opportunity { get; set; }

    /// <summary>"Başvurularınız nerede" — aşama adı değil, sıradaki iş cümlesi.</summary>
    public List<GrantTodayApplicationDto> Applications { get; set; } = new();

    /// <summary>Danışmanın üstlendiği işler — bilgi için, firmadan aksiyon beklenmiyor.</summary>
    public List<GrantTodayConsultantItemDto> ConsultantItems { get; set; } = new();

    public int ConsultantItemCount { get; set; }

    /// <summary>En acil başvuruya atanmış danışman. Atama yoksa null.</summary>
    public GrantTodayConsultantDto? Consultant { get; set; }
}

public class GrantTodayItemDto
{
    public GrantTodayItemKind Kind { get; set; }

    public GrantTodayOwner Owner { get; set; }

    public string GrantName { get; set; } = string.Empty;

    /// <summary>Host görünümünde işin firması; kiracıda null.</summary>
    public string? FirmName { get; set; }

    public Guid? ApplicationId { get; set; }

    public Guid? GrantCallId { get; set; }

    public Guid? GrantId { get; set; }

    public Guid? LeadId { get; set; }

    /// <summary>Türe göre sayı: evrak / boş alan / rapor bölümü / talep sayısı / ısı skoru / eksik zorunlu alan.</summary>
    public int Value { get; set; }

    /// <summary>Öncelik için tutar: onaylanan destek ya da programın üst limiti.</summary>
    public decimal? Amount { get; set; }

    public DateTime? Deadline { get; set; }

    public int? DaysRemaining { get; set; }

    public string? AssignedUserName { get; set; }

    /// <summary>Risk × tutar — sunucu sıralar, istemci sırayı bozmaz.</summary>
    public double Priority { get; set; }
}

public class GrantTodayApplicationDto
{
    public Guid ApplicationId { get; set; }

    public Guid GrantCallId { get; set; }

    public string GrantName { get; set; } = string.Empty;

    public string? Period { get; set; }

    public GrantApplicationStage Stage { get; set; }

    public GrantNextAction NextAction { get; set; }

    public int NextActionValue { get; set; }

    public int? DaysRemaining { get; set; }

    public int? AppealDaysLeft { get; set; }

    public Guid? ProjectId { get; set; }

    public bool IsClosed { get; set; }
}

public class GrantTodayOpportunityDto
{
    public Guid GrantCallId { get; set; }

    public string GrantName { get; set; } = string.Empty;

    public string Issuer { get; set; } = string.Empty;

    public decimal? MaxAmount { get; set; }

    public int? SupportRatePercent { get; set; }

    public int? DaysRemaining { get; set; }
}

public class GrantTodayConsultantDto
{
    public Guid UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    /// <summary>Yazışma bağlantısı için: danışmanın atandığı en acil başvuru.</summary>
    public Guid ApplicationId { get; set; }
}

public class GrantTodayConsultantItemDto
{
    public Guid ApplicationId { get; set; }

    public string GrantName { get; set; } = string.Empty;

    /// <summary>Danışmanın yükleyeceği, henüz onaylanmamış zorunlu evrak sayısı.</summary>
    public int DocumentCount { get; set; }

    /// <summary>Top bütünüyle danışmanda (PendingParty = Danışman).</summary>
    public bool IsWholeApplication { get; set; }
}
