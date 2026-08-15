using System;
using System.Collections.Generic;
using Apya.Platform.Consents;

namespace Apya.Platform.Consents.Dtos;

/// <summary>Rıza kaydı girişi. Web sınırında doldurulur (IP/UA/özne sunucuda set edilir).</summary>
public class RecordConsentInput
{
    public ConsentType Type { get; set; }

    public bool Granted { get; set; } = true;

    /// <summary>Boş bırakılırsa türe göre güncel politika sürümü atanır.</summary>
    public string? PolicyVersion { get; set; }

    public ConsentSubjectKind SubjectKind { get; set; }

    public string? SubjectId { get; set; }

    public string? AcceptedCategories { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public string? SourceRef { get; set; }
}

/// <summary>Analiz sorgusu filtresi.</summary>
public class ConsentAnalyticsFilter
{
    /// <summary>Trend penceresi (gün). Varsayılan 30.</summary>
    public int WindowDays { get; set; } = 30;

    /// <summary>Belirli bir türle sınırla (null = tümü).</summary>
    public ConsentType? Type { get; set; }
}

public class ConsentTypeCountDto
{
    public ConsentType Type { get; set; }
    public int Granted { get; set; }
    public int Declined { get; set; }
    public int Total => Granted + Declined;
}

public class ConsentTrendPointDto
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}

/// <summary>Admin analiz ekranının beslendiği özet.</summary>
public class ConsentAnalyticsDto
{
    public int TotalRecords { get; set; }
    public int GrantedCount { get; set; }
    public int DeclinedCount { get; set; }
    public int WindowDays { get; set; }
    public List<ConsentTypeCountDto> ByType { get; set; } = new();
    public List<ConsentTrendPointDto> Trend { get; set; } = new();
}
