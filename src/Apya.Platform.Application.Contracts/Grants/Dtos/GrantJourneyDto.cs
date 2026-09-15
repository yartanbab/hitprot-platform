using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>18d · Kiracı · Hibe Yolculuğum: firmanın bütün hibe ilişkileri tek zaman çizgisinde.</summary>
public class GrantJourneyDto
{
    public string? FirmName { get; set; }

    /// <summary>Süren ilişki: bekleyen ilgi, hazırlanan/kurumdaki başvuru, itiraz penceresi açık red.</summary>
    public int ActiveCount { get; set; }

    public int ProjectCount { get; set; }

    /// <summary>Başvuru gönderilmeden ya da talep yanıtlanmadan kapanan çağrılar.</summary>
    public int MissedCount { get; set; }

    /// <summary>Onaylı destek tutarlarının toplamı (₺).</summary>
    public decimal WonAmount { get; set; }

    public List<GrantJourneyItemDto> Items { get; set; } = new();
}

public class GrantJourneyItemDto
{
    public GrantJourneyItemKind Kind { get; set; }

    /// <summary>Havuzdaki fikirde (<see cref="GrantJourneyItemKind.IdeaPooled"/>) null.</summary>
    public Guid? GrantCallId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string? Issuer { get; set; }
    public string? Period { get; set; }
    public DateTime? Deadline { get; set; }
    public int? DaysRemaining { get; set; }

    /// <summary>İlişkinin son olay anı — sıralama ve "… tarihinde" cümlesi için.</summary>
    public DateTime At { get; set; }

    // --- İlgi talebi ---
    public Guid? InterestId { get; set; }

    /// <summary>Talebi incelemeye alan danışman; henüz alınmadıysa null.</summary>
    public string? ReviewerName { get; set; }

    public string? HostFeedback { get; set; }

    /// <summary>18e · Bekleyen talebin son görüşme önerisi.</summary>
    public GrantMeetingDto? Meeting { get; set; }

    // --- 19a · Havuzdaki fikir ---
    /// <summary>Proje fikrinin metni — çağrı adı olmadığı için kartın başlığı bu.</summary>
    public string? Idea { get; set; }

    /// <summary>Fikri kim girdi: firma kendisi mi, danışman firma adına mı.</summary>
    public GrantInterestSource? IdeaSource { get; set; }

    // --- Başvuru ---
    public Guid? ApplicationId { get; set; }
    public string? StageName { get; set; }
    public GrantApplicationStage? Stage { get; set; }
    public GrantNextAction? NextAction { get; set; }
    public int NextActionValue { get; set; }
    public string? ConsultantName { get; set; }
    public int DocumentsApproved { get; set; }
    public int DocumentsTotal { get; set; }
    public int? AppealDaysLeft { get; set; }

    // --- Proje / destek ---
    public Guid? ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public decimal CollectedAmount { get; set; }
    public int? NextTrancheNo { get; set; }
    public decimal? NextTrancheAmount { get; set; }
    public DateTime? NextTrancheDue { get; set; }
}
