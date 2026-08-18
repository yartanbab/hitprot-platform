using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Documents;

/// <summary>Detay panelindeki meta düzenlemesi — hem birinci sınıf kolonlar hem özel alanlar.</summary>
public class UpdateDocumentFileMetaDto
{
    [Required]
    [StringLength(DocumentConsts.MaxDisplayNameLength)]
    public string DisplayName { get; set; } = string.Empty;

    public Guid? DocumentTypeId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? WorkStepId { get; set; }

    public decimal? Amount { get; set; }

    [StringLength(DocumentConsts.CurrencyLength)]
    public string? Currency { get; set; }

    public DateTime? DocumentDate { get; set; }

    [StringLength(DocumentConsts.MaxPeriodCodeLength)]
    public string? PeriodCode { get; set; }

    public DateTime? ExpiryDate { get; set; }

    [StringLength(DocumentConsts.MaxExternalRefLength)]
    public string? ExternalRef { get; set; }

    public DocumentFileStatus Status { get; set; } = DocumentFileStatus.Draft;

    public List<DocumentFieldValueInputDto> Fields { get; set; } = new();

    public List<string> Tags { get; set; } = new();
}

public class DocumentFieldValueInputDto
{
    public Guid FieldId { get; set; }
    public string? ValueText { get; set; }
    public decimal? ValueNumber { get; set; }
    public DateTime? ValueDate { get; set; }
}
