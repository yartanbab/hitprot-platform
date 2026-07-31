using System;
using System.Collections.Generic;

namespace Apya.Platform.Feedbacks.Dtos;

/// <summary>Analiz panelinin tek seferde ihtiyaç duyduğu bütün özetler.</summary>
public class FeedbackStatsDto
{
    public int TotalCount { get; set; }

    /// <summary>Henüz kapatılmamış (New/InReview/Planned) kayıt sayısı — menü rozeti.</summary>
    public int OpenCount { get; set; }

    /// <summary>Cevap bekleyen kayıt sayısı.</summary>
    public int UnansweredCount { get; set; }

    public double? AverageRating { get; set; }
    public int RatingCount { get; set; }

    /// <summary>Gönderim → ilk kullanıcıya görünen cevap arası ortalama (saat). Cevaplanmış kayıtlar üzerinden.</summary>
    public double? AverageFirstResponseHours { get; set; }

    /// <summary>Gönderim → kapanış arası ortalama (saat). Kapanmış kayıtlar üzerinden.</summary>
    public double? AverageResolutionHours { get; set; }

    public List<FeedbackCountByKeyDto> ByType { get; set; } = new();
    public List<FeedbackCountByKeyDto> ByStatus { get; set; } = new();

    /// <summary>Günlük kayıt sayısı — zaman serisi grafiği.</summary>
    public List<FeedbackTrendPointDto> Trend { get; set; } = new();

    /// <summary>Sayfa bazlı ısı haritası: en çok geri bildirim alan ekranlar.</summary>
    public List<FeedbackPageStatDto> TopPages { get; set; } = new();
}

public class FeedbackCountByKeyDto
{
    /// <summary>Enum'un sayısal değeri — etiketi UI tarafında lokalize edilir.</summary>
    public int Key { get; set; }
    public int Count { get; set; }
}

public class FeedbackTrendPointDto
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}

public class FeedbackPageStatDto
{
    public string PageUrl { get; set; } = string.Empty;
    public string? PageTitle { get; set; }
    public int Count { get; set; }

    /// <summary>Bunlardan kaçı hata bildirimi — sorunlu ekranı öne çıkarır.</summary>
    public int BugCount { get; set; }

    public double? AverageRating { get; set; }
}
