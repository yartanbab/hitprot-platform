using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Ai.Bindings.Dtos;

public class AiFormBindingDto : EntityDto<Guid>
{
    public Guid DocumentId { get; set; }
    public string? DocumentTitle { get; set; }
    public Guid PromptId { get; set; }
    public string? PromptName { get; set; }
    public BindingTriggerMode TriggerMode { get; set; }
    public string TriggerModeText => TriggerMode.ToString();
    public PromptVersionPolicy VersionPolicy { get; set; }
    public int Order { get; set; }
    public bool IsActive { get; set; }
}

public class CreateUpdateAiFormBindingDto
{
    [Required]
    public Guid DocumentId { get; set; }

    [Required]
    public Guid PromptId { get; set; }

    public BindingTriggerMode TriggerMode { get; set; } = BindingTriggerMode.OnSubmit;

    public int Order { get; set; }

    public bool IsActive { get; set; } = true;
}

/// <summary>Lightweight {id, name} option for form/prompt pickers.</summary>
public class AiBindingLookupDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
}
