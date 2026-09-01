using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>4b · Bir programın skorlama ayarı ve nereden geldiği.</summary>
public class GrantMatchWeightDto
{
    public Guid GrantId { get; set; }
    public string GrantName { get; set; } = string.Empty;

    /// <summary>true = programın kendi satırı yok, küresel varsayılandan geliyor.</summary>
    public bool IsInherited { get; set; }

    /// <summary>true = küresel satır da yok, kod varsayılanları kullanılıyor.</summary>
    public bool IsFactoryDefault { get; set; }

    public List<GrantDimensionWeightDto> Dimensions { get; set; } = new();

    public bool SizePenaltyEnabled { get; set; }
    public bool SkipMissingDimensions { get; set; }

    /// <summary>"Varsayılanı değiştirmek N çağrının eşleşmesini yeniden hesaplar" uyarısı için.</summary>
    public int PublishedCallCount { get; set; }
}

public class GrantDimensionWeightDto
{
    public GrantMatchDimension Dimension { get; set; }

    /// <summary>0 = kapalı. Ekran 0 / 0,5 / 1 / 1,5 / 2 kademelerini sunar.</summary>
    [Range(0, 2, ErrorMessage = "Ağırlık çarpanı 0 ile 2 arasında olmalıdır.")]
    public double Multiplier { get; set; } = 1.0;

    /// <summary>Boyutun neden bu ağırlıkta olduğunu açıklayan canlı not (salt-okunur).</summary>
    public string? Note { get; set; }
}

/// <summary>4b · yazma modeli.</summary>
public class UpdateGrantMatchWeightDto
{
    /// <summary>true = küresel varsayılana yaz (tüm programları etkiler), false = yalnız bu program.</summary>
    public bool ApplyToAllPrograms { get; set; }

    public List<GrantDimensionWeightDto> Dimensions { get; set; } = new();

    public bool SizePenaltyEnabled { get; set; } = true;
    public bool SkipMissingDimensions { get; set; } = true;
}

/// <summary>4b sağ panel · "Ağırlık Değişiminin Etkisi".</summary>
public class GrantWeightImpactDto
{
    /// <summary>Kayıtlı ağırlıkla uyum eşiğini geçen firma sayısı.</summary>
    public int CurrentMatchingFirms { get; set; }

    /// <summary>Formdaki (kaydedilmemiş) ağırlıkla eşiği geçen firma sayısı.</summary>
    public int NewMatchingFirms { get; set; }

    public int TotalFirms { get; set; }

    /// <summary>Skoru en çok değişen firmalar — yükselenler önce.</summary>
    public List<GrantWeightMoverDto> TopMovers { get; set; } = new();
}

public class GrantWeightMoverDto
{
    public string TenantName { get; set; } = string.Empty;
    public int CurrentScore { get; set; }
    public int NewScore { get; set; }
}

/// <summary>4b · Eksik Veri Kampanyası satırı.</summary>
public class GrantMissingDataRowDto
{
    public GrantFirmDataField Field { get; set; }

    /// <summary>Bu alanı boş bırakmış firma sayısı.</summary>
    public int FirmCount { get; set; }

    /// <summary>Bu alana şart koyan AÇIK çağrı sayısı.</summary>
    public int AffectedCallCount { get; set; }
}
