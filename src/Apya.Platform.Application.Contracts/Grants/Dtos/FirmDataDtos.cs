using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Kurumun elle girdiği kurumsal veriler: gruplu parametre listesi ve doluluk özeti.</summary>
public class FirmDataDto
{
    public List<FirmDataGroupDto> Groups { get; set; } = new();

    /// <summary>Değeri girilmiş parametre sayısı (0 ve "hayır" girilmiş sayılır).</summary>
    public int FilledCount { get; set; }

    public int TotalCount { get; set; }
}

public class FirmDataGroupDto
{
    public FirmParameterGroup Group { get; set; }
    public List<FirmDataItemDto> Items { get; set; } = new();
}

public class FirmDataItemDto
{
    public Guid DefinitionId { get; set; }
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public FirmParameterDataType DataType { get; set; }
    public FirmParameterRequirement Requirement { get; set; }
    public List<string> Options { get; set; } = new();
    public decimal? MinNumber { get; set; }
    public decimal? MaxNumber { get; set; }
    public int? MaxLength { get; set; }

    /// <summary>false = bilgi BİLİNMİYOR (satır yok). true ise değer 0 ya da "hayır" da olabilir.</summary>
    public bool HasValue { get; set; }

    /// <summary>
    /// Değerin kültürden bağımsız yazımı: sayı "1234.5", tarih "yyyy-MM-dd", evet/hayır
    /// "true"/"false", metin olduğu gibi. Çoklu seçimde boş; seçimler <see cref="Choices"/>'ta.
    /// </summary>
    public string? RawValue { get; set; }

    public List<string> Choices { get; set; } = new();

    public FirmParameterSource? Source { get; set; }
    public FirmParameterVerification? Verification { get; set; }
    public DateTime? ConfirmedAt { get; set; }

    /// <summary>Tanımın geçerlilik süresi dolmuş: değer duruyor ama güncel sayılmıyor.</summary>
    public bool IsStale { get; set; }

    public FirmParameterReliability? Reliability { get; set; }
}

public class SaveFirmDataDto
{
    public List<SaveFirmDataItemDto> Items { get; set; } = new();
}

/// <summary>
/// Tek parametrenin gönderilen değeri. <see cref="RawValue"/> boş ve <see cref="Choices"/>
/// boşsa bilgi "bilinmiyor"a döner — sıfır yazmak için "0" gönderilir.
/// </summary>
public class SaveFirmDataItemDto
{
    public Guid DefinitionId { get; set; }
    public string? RawValue { get; set; }
    public List<string> Choices { get; set; } = new();
}
