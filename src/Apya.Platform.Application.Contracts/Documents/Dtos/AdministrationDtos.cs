using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

/* ─── Kural motoru ───────────────────────────────────────────────────── */

public class DocumentRuleDto : FullAuditedEntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DocumentRuleTrigger Trigger { get; set; }
    public DocumentRuleLogicalOperator LogicalOperator { get; set; }
    public bool IsEnabled { get; set; }
    public int Order { get; set; }
    public DateTime? LastRunAt { get; set; }
    public int LastAffectedCount { get; set; }
    public int TotalAffectedCount { get; set; }

    public List<DocumentRuleConditionDto> Conditions { get; set; } = new();
    public List<DocumentRuleActionDto> Actions { get; set; } = new();
}

public class DocumentRuleConditionDto : EntityDto<Guid>
{
    public int Order { get; set; }
    public DocumentRuleField Field { get; set; }
    public DocumentRuleOperator Operator { get; set; }
    public string? CompareValue { get; set; }
}

public class DocumentRuleActionDto : EntityDto<Guid>
{
    public int Order { get; set; }
    public DocumentRuleActionType ActionType { get; set; }
    public string? Payload { get; set; }

    /// <summary>Payload bir kimlikse insan-okur karşılığı (klasör/tip/iş adımı adı).</summary>
    public string? PayloadLabel { get; set; }
}

public class CreateUpdateDocumentRuleDto
{
    [Required]
    [StringLength(RuleConsts.MaxRuleNameLength)]
    public string Name { get; set; } = string.Empty;

    [StringLength(RuleConsts.MaxDescriptionLength)]
    public string? Description { get; set; }

    public DocumentRuleTrigger Trigger { get; set; } = DocumentRuleTrigger.Upload;
    public DocumentRuleLogicalOperator LogicalOperator { get; set; } = DocumentRuleLogicalOperator.And;
    public int Order { get; set; }

    public List<DocumentRuleConditionInputDto> Conditions { get; set; } = new();
    public List<DocumentRuleActionInputDto> Actions { get; set; } = new();
}

public class DocumentRuleConditionInputDto
{
    public int Order { get; set; }
    public DocumentRuleField Field { get; set; }
    public DocumentRuleOperator Operator { get; set; }

    [StringLength(RuleConsts.MaxCompareValueLength)]
    public string? CompareValue { get; set; }
}

public class DocumentRuleActionInputDto
{
    public int Order { get; set; }
    public DocumentRuleActionType ActionType { get; set; }

    [StringLength(RuleConsts.MaxActionPayloadLength)]
    public string? Payload { get; set; }
}

/// <summary>
/// Çalıştırma sonucu. Kuru çalıştırmada <see cref="IsDryRun"/> true olur ve
/// hiçbir belge DEĞİŞMEZ — sayılar yine de gerçek çalıştırmayla birebir aynıdır
/// (aynı saf değerlendirici kullanılır).
/// </summary>
public class DocumentRuleRunResultDto
{
    public Guid RuleId { get; set; }
    public bool IsDryRun { get; set; }
    public int MatchedCount { get; set; }
    public int AffectedCount { get; set; }

    /// <summary>Etkilenecek/etkilenen ilk belgelerin adları — kullanıcıya örnek.</summary>
    public List<string> Sample { get; set; } = new();
}

/* ─── Alan bazlı izinler ─────────────────────────────────────────────── */

public class DocumentFieldPermissionDto : EntityDto<Guid>
{
    public Guid DocumentTypeId { get; set; }
    public Guid? FieldId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public DocumentFieldAccessLevel Level { get; set; }
}

/// <summary>Yönetim ekranındaki rol × alan matrisi.</summary>
public class DocumentFieldPermissionMatrixDto
{
    public Guid DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public List<DocumentFieldPermissionRowDto> Rows { get; set; } = new();
}

public class DocumentFieldPermissionRowDto
{
    public Guid FieldId { get; set; }
    public string Label { get; set; } = string.Empty;
    public DocumentFieldVisibility DefaultVisibility { get; set; }

    /// <summary>Rol adı → etkin seviye (kural yoksa varsayılandan türetilir).</summary>
    public Dictionary<string, DocumentFieldAccessLevel> Levels { get; set; } = new();
}

public class SetFieldPermissionDto
{
    public Guid DocumentTypeId { get; set; }

    /// <summary>Null = tipin tüm alanları için varsayılan kural.</summary>
    public Guid? FieldId { get; set; }

    [Required]
    [StringLength(RuleConsts.MaxRoleNameLength)]
    public string RoleName { get; set; } = string.Empty;

    public DocumentFieldAccessLevel Level { get; set; }
}

/* ─── Meta şema yazma ────────────────────────────────────────────────── */

public class CreateUpdateDocumentTypeDto
{
    [Required]
    [StringLength(DocumentConsts.MaxTypeNameLength)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(DocumentConsts.MaxTypeCodeLength)]
    public string Code { get; set; } = string.Empty;

    [StringLength(64)]
    public string? Icon { get; set; }

    public int? RetentionMonths { get; set; }

    [StringLength(DocumentConsts.MaxFileNamePatternLength)]
    public string? FileNamePattern { get; set; }

    public int Order { get; set; }
}

public class CreateUpdateDocumentTypeFieldDto
{
    public Guid DocumentTypeId { get; set; }

    [Required]
    [StringLength(DocumentConsts.MaxFieldKeyLength)]
    public string Key { get; set; } = string.Empty;

    [Required]
    [StringLength(DocumentConsts.MaxFieldLabelLength)]
    public string Label { get; set; } = string.Empty;

    public DocumentFieldType FieldType { get; set; } = DocumentFieldType.Text;
    public bool IsRequired { get; set; }
    public DocumentFieldFillSource FillSource { get; set; } = DocumentFieldFillSource.Manual;
    public DocumentFieldVisibility Visibility { get; set; } = DocumentFieldVisibility.Everyone;
    public int Order { get; set; }
    public string? OptionsJson { get; set; }
}

/* ─── Entegrasyonlar ─────────────────────────────────────────────────── */

public class DocumentIntegrationDto : FullAuditedEntityDto<Guid>
{
    public DocumentIntegrationKind Kind { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Target { get; set; }
    public bool IsEnabled { get; set; }
    public DateTime? LastSyncAt { get; set; }

    /// <summary>
    /// Gerçek bir eşitleme altyapısı olmadığı için durum daima "yapılandırıldı"
    /// seviyesindedir; UI bunu "kurulum bekliyor" olarak gösterir.
    /// </summary>
    public bool IsOperational => false;
}

public class CreateUpdateDocumentIntegrationDto
{
    public DocumentIntegrationKind Kind { get; set; }

    [Required]
    [StringLength(RuleConsts.MaxRuleNameLength)]
    public string Name { get; set; } = string.Empty;

    [StringLength(300)]
    public string? Target { get; set; }

    public string? SettingsJson { get; set; }
    public bool IsEnabled { get; set; }
}

/* ─── Konsolide kiracı raporu (host) ─────────────────────────────────── */

public class ConsolidatedTenantReportDto
{
    public int TenantCount { get; set; }
    public int TenantsWithProjects { get; set; }
    public int TotalDocuments { get; set; }
    public List<ConsolidatedTenantRowDto> Rows { get; set; } = new();
}

public class ConsolidatedTenantRowDto
{
    public Guid? TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public int ProjectCount { get; set; }
    public int DocumentCount { get; set; }
    public int MissingRequiredFieldDocuments { get; set; }
    public decimal DocumentedAmount { get; set; }
    public DateTime? LastDocumentAt { get; set; }
}
