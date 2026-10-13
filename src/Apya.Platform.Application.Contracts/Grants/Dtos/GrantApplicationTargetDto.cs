using System;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Projects;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Başvurunun ölçülebilir hedefi; dönüşümde proje göstergesine kopyalanır.</summary>
public class GrantApplicationTargetDto : EntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? Unit { get; set; }
    public decimal BaselineValue { get; set; }
    public decimal TargetValue { get; set; }
    public DateTime? TargetDate { get; set; }
}

/// <summary>DataAnnotations yerelleştirilmediği için hata metinleri ELLE Türkçe yazılır.</summary>
public class SaveWizardTargetInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    [Required(ErrorMessage = "Hedef adı zorunludur.")]
    [StringLength(ProjectIndicatorConsts.MaxNameLength, ErrorMessage = "Hedef adı en fazla 128 karakter olabilir.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(ProjectIndicatorConsts.MaxUnitLength, ErrorMessage = "Birim en fazla 32 karakter olabilir.")]
    public string? Unit { get; set; }

    public decimal BaselineValue { get; set; }
    public decimal TargetValue { get; set; }
    public DateTime? TargetDate { get; set; }
}
