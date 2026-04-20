using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.DynamicAssets.Dtos;

/// <summary>
/// Output DTO for an AppDocument entity.
/// </summary>
public class DocumentDto : FullAuditedEntityDto<Guid>
{
    public string Title { get; set; } = null!;
    public bool IsTemplate { get; set; }
    public Guid? ParentTemplateId { get; set; }
    public string Slug { get; set; } = null!;
    public List<BlockDto> Blocks { get; set; } = new();
}

/// <summary>
/// Output DTO for an AppBlock entity.
/// </summary>
public class BlockDto : EntityDto<Guid>
{
    public Guid AppDocumentId { get; set; }
    public BlockType Type { get; set; }
    public int Order { get; set; }
    public string Content { get; set; } = null!;
    public string Settings { get; set; } = null!;
    public string? AgentContext { get; set; }
}

/// <summary>
/// Input DTO for creating a new template document.
/// </summary>
public class CreateTemplateDto
{
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public List<CreateBlockDto> Blocks { get; set; } = new();
}

/// <summary>
/// Input DTO for creating a block within a template.
/// </summary>
public class CreateBlockDto
{
    public BlockType Type { get; set; }
    public int Order { get; set; }
    public string Content { get; set; } = null!;
    public string Settings { get; set; } = null!;
    public string? AgentContext { get; set; }
}

/// <summary>
/// Input DTO for instantiating a new document from an existing template.
/// </summary>
public class InstantiateDocumentDto
{
    public Guid TemplateId { get; set; }
    public string NewTitle { get; set; } = null!;
}
