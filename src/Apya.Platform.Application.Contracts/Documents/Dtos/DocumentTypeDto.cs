using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

public class DocumentTypeDto : EntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int? RetentionMonths { get; set; }
    public string? FileNamePattern { get; set; }
    public bool IsSystem { get; set; }
    public int Order { get; set; }

    /// <summary>Yönetim ekranındaki "N alan" rozeti ve detay panelinin şema render'ı için.</summary>
    public List<DocumentTypeFieldDto> Fields { get; set; } = new();
}

public class DocumentTypeFieldDto : EntityDto<Guid>
{
    public Guid DocumentTypeId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public DocumentFieldType FieldType { get; set; }
    public bool IsRequired { get; set; }
    public DocumentFieldFillSource FillSource { get; set; }
    public DocumentFieldVisibility Visibility { get; set; }
    public int Order { get; set; }
    public string? OptionsJson { get; set; }
}
