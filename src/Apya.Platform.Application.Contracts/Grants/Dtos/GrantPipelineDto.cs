using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 2c · Başvuru pipeline konsolu. Sütunlar çağrının aşama ŞABLONUNDAN gelir;
/// şablon yoksa dört değerli <see cref="GrantApplicationStage"/> enum'una düşülür
/// (<see cref="IsTemplateDriven"/> hangisinin geçerli olduğunu söyler).
/// </summary>
public class GrantPipelineBoardDto
{
    public Guid? GrantCallId { get; set; }
    public string? GrantCallLabel { get; set; }

    /// <summary>Sütunlar şablondan mı geliyor — ekranda "şablonu düzenle" bağlantısı buna bakar.</summary>
    public bool IsTemplateDriven { get; set; }

    public Guid? StageTemplateId { get; set; }
    public string? StageTemplateName { get; set; }

    public List<GrantPipelineColumnDto> Columns { get; set; } = new();
    public List<GrantPipelineConsultantDto> Consultants { get; set; } = new();

    // --- Özet (tasarım 2c · alt şerit) ---
    public int RiskyCount { get; set; }
    public int RiskyDayThreshold { get; set; }
    public int WaitingDocumentApplicationCount { get; set; }
    public int WaitingDocumentCount { get; set; }
    public int ReadyForProjectCount { get; set; }
    public decimal PipelineAmount { get; set; }
}

public class GrantPipelineColumnDto
{
    /// <summary>Şablon adımının kimliği; enum yolunda null.</summary>
    public Guid? StepId { get; set; }

    /// <summary>Enum yolunda aşama değeri; şablon yolunda null.</summary>
    public GrantApplicationStage? Stage { get; set; }

    public string Name { get; set; } = null!;
    public int Order { get; set; }
    public GrantPartyRole Owner { get; set; }
    public List<GrantPipelineCardDto> Cards { get; set; } = new();
}

public class GrantPipelineCardDto
{
    public Guid ApplicationId { get; set; }
    public Guid TenantId { get; set; }
    public string FirmName { get; set; } = null!;
    public string GrantName { get; set; } = null!;
    public string? Period { get; set; }

    /// <summary>Talep edilen destek (bütçe adımından); girilmemişse null.</summary>
    public decimal? RequestedSupport { get; set; }

    public decimal? ApprovedAmount { get; set; }
    public int? DaysRemaining { get; set; }

    /// <summary>Bekleyen zorunlu evrak sayısı — kartın risk sinyallerinden biri.</summary>
    public int MissingDocumentCount { get; set; }

    public GrantPartyRole PendingParty { get; set; }
    public Guid? AssignedUserId { get; set; }
    public string? AssignedUserName { get; set; }
    public bool IsSubmitted { get; set; }

    /// <summary>Kart üzerinde gösterilecek risk sinyalleri.</summary>
    public List<GrantPipelineRiskDto> Risks { get; set; } = new();
}

public class GrantPipelineRiskDto
{
    public GrantPipelineRisk Kind { get; set; }

    /// <summary>Sinyalin sayısal bağlamı (kalan gün, eksik evrak sayısı…).</summary>
    public int Value { get; set; }
}

public class GrantPipelineConsultantDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
    public int AssignedCount { get; set; }
}

// ------------------------------------------------------------------ girdiler

public class MoveGrantApplicationInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    /// <summary>Şablon adımı; enum yolunda boş bırakılır.</summary>
    public Guid? StepId { get; set; }

    /// <summary>Enum yolunda hedef aşama.</summary>
    public GrantApplicationStage? Stage { get; set; }
}

public class AssignGrantApplicationInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    /// <summary>null = atamayı kaldır.</summary>
    public Guid? UserId { get; set; }
}
