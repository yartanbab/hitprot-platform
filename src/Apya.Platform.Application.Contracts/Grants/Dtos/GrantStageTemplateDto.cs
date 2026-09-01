using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

/// <summary>3b · Aşama şablonu ve kullanım özeti.</summary>
public class GrantStageTemplateDto : EntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsDefault { get; set; }
    public List<GrantStageTemplateStepDto> Steps { get; set; } = new();

    /// <summary>Bu şablona bağlı program sayısı — sol listedeki "N çağrıda" değeri.</summary>
    public int GrantCount { get; set; }

    /// <summary>Şablonu değiştirmenin etkileyeceği açık başvuru sayısı (sağ paneldeki uyarı).</summary>
    public int OpenApplicationCount { get; set; }

    /// <summary>Bu şablonu kullanan çağrılar — sağ panel listesi.</summary>
    public List<GrantStageTemplateCallDto> Calls { get; set; } = new();
}

public class GrantStageTemplateStepDto
{
    public int Order { get; set; }

    [Required(ErrorMessage = "Aşama adı zorunludur.")]
    [StringLength(96, ErrorMessage = "Aşama adı en fazla {1} karakter olabilir.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(128, ErrorMessage = "Açıklama en fazla {1} karakter olabilir.")]
    public string? Note { get; set; }

    public GrantPartyRole Owner { get; set; }

    [StringLength(128, ErrorMessage = "Zorunlu evrak notu en fazla {1} karakter olabilir.")]
    public string? RequiredDocumentsNote { get; set; }

    [StringLength(128, ErrorMessage = "Tamamlanma koşulu en fazla {1} karakter olabilir.")]
    public string? CompletionCondition { get; set; }

    [Range(0, 365, ErrorMessage = "Hatırlatma 0 ile 365 gün arasında olmalıdır.")]
    public int? ReminderDays { get; set; }
}

public class GrantStageTemplateCallDto
{
    public Guid GrantCallId { get; set; }
    public string Label { get; set; } = string.Empty;
    public int OpenApplicationCount { get; set; }
}

/// <summary>3b · şablon yazma modeli. Adımlar tümüyle değiştirilir (sil-yeniden ekle).</summary>
public class CreateUpdateGrantStageTemplateDto
{
    [Required(ErrorMessage = "Şablon adı zorunludur.")]
    [StringLength(96, ErrorMessage = "Şablon adı en fazla {1} karakter olabilir.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(256, ErrorMessage = "Açıklama en fazla {1} karakter olabilir.")]
    public string? Description { get; set; }

    public bool IsDefault { get; set; }

    public List<GrantStageTemplateStepDto> Steps { get; set; } = new();
}
