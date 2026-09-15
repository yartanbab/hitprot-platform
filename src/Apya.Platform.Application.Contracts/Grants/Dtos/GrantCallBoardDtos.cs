using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

public class GetGrantCallBoardInput
{
    public GrantCallBoardTab Tab { get; set; }

    /// <summary>Yalnız Yayında sekmesinde: true = kapanmış çağrılar (22 · "Kapanmış" sekme değil süzgeç).</summary>
    public bool Closed { get; set; }

    public string? Issuer { get; set; }

    public GrantCallBoardSort Sort { get; set; }
}

/// <summary>21a · Host Çağrılar: afişli kartlar + sekme sayaçları. Sayaçlar süzgeçten bağımsızdır.</summary>
public class GrantCallBoardDto
{
    public List<GrantCallCardDto> Items { get; set; } = new();

    public int LiveCount { get; set; }

    public int DraftCount { get; set; }

    public int ClosedCount { get; set; }

    public List<string> Issuers { get; set; } = new();
}

/// <summary>
/// Kart = çağrı + programı. Çağrısı olmayan program Taslak sekmesinde çağrısız kart olarak gelir
/// (<see cref="GrantCallId"/> null) ki kaybolmasın.
/// </summary>
public class GrantCallCardDto
{
    public Guid GrantId { get; set; }

    public Guid? GrantCallId { get; set; }

    public string GrantName { get; set; } = string.Empty;

    public string Issuer { get; set; } = string.Empty;

    public string? Period { get; set; }

    public string? Reference { get; set; }

    /// <summary>Çağrısız programda null.</summary>
    public GrantCallStatus? Status { get; set; }

    public DateTime? OpenDate { get; set; }

    public DateTime? Deadline { get; set; }

    public int? DaysRemaining { get; set; }

    public string? PosterFileName { get; set; }

    public decimal? MinAmount { get; set; }

    /// <summary>0 = üst limit yok (kolon NOT NULL).</summary>
    public decimal? MaxAmount { get; set; }

    public int? SupportRatePercent { get; set; }

    /// <summary>Yayındaki kartta: şartları karşılayan firma sayısı (Parametreler'deki "şu an kaç firma uygun" ile aynı hesap).</summary>
    public int? MatchingFirmCount { get; set; }

    /// <summary>Yayındaki kartta: çağrıya bırakılan ilgi talebi (geri çekilenler hariç).</summary>
    public int? InterestCount { get; set; }

    /// <summary>Taslak kartta: parametre tamamlanma yüzdesi (Parametreler'deki çubukla aynı hesap).</summary>
    public int? CompletionPercent { get; set; }

    /// <summary>Taslak kartta: yayını engelleyen zorunlu alanların anahtarları.</summary>
    public List<string> MissingRequiredFields { get; set; } = new();

    public DateTime CreationTime { get; set; }
}
