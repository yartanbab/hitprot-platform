using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Host yönetim ekranındaki bir parametre tanımı.</summary>
public class FirmParameterDefinitionDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public FirmParameterDataType DataType { get; set; }
    public FirmParameterGroup Group { get; set; }
    public FirmParameterRequirement Requirement { get; set; }
    public FirmParameterAudience Audience { get; set; }
    public bool AllowDocumentSource { get; set; }
    public int? ValidityMonths { get; set; }
    public decimal? MinNumber { get; set; }
    public decimal? MaxNumber { get; set; }
    public int? MaxLength { get; set; }
    public List<string> Options { get; set; } = new();
    public FirmParameterMatchUsage MatchUsage { get; set; }
    public int Version { get; set; }
    public bool IsActive { get; set; }
    public int Order { get; set; }

    /// <summary>Değeri platformun kendi alanında yaşayan parametre: yalnız metni, zorunluluğu, süresi ve sırası değişir.</summary>
    public bool IsSystem { get; set; }

    /// <summary>Bu parametreye değer girmiş kurum sayısı (bütün kurumlar üzerinden).</summary>
    public int ValueOwnerCount { get; set; }
}

/// <summary>
/// Parametre oluşturma ve güncelleme girdisi. <see cref="Code"/> ve <see cref="DataType"/>
/// yalnız oluştururken okunur; güncellemede yok sayılır (ikisi de değişmez).
/// </summary>
public class SaveFirmParameterDefinitionDto
{
    public string? Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public FirmParameterDataType DataType { get; set; } = FirmParameterDataType.Text;
    public FirmParameterGroup Group { get; set; } = FirmParameterGroup.Kimlik;
    public FirmParameterRequirement Requirement { get; set; }
    public FirmParameterAudience Audience { get; set; }
    public bool AllowDocumentSource { get; set; }
    public int? ValidityMonths { get; set; }
    public decimal? MinNumber { get; set; }
    public decimal? MaxNumber { get; set; }
    public int? MaxLength { get; set; }

    /// <summary>Seçenekler, her satıra bir tane.</summary>
    public string? OptionsText { get; set; }

    public FirmParameterMatchUsage MatchUsage { get; set; }
    public bool IsActive { get; set; } = true;
    public int Order { get; set; }
}
