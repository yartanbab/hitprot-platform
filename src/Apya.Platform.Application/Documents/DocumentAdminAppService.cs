using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;

namespace Apya.Platform.Documents;

/// <summary>
/// Yönetim ekranının sunucu tarafı.
///
/// Kuru çalıştırma ile gerçek çalıştırma AYNI saf değerlendiriciyi
/// (<see cref="DocumentRuleEvaluator"/>) kullanır; aralarındaki tek fark planın
/// uygulanıp uygulanmamasıdır. Böylece "kuru çalıştırmada gördüğüm sayı
/// gerçekte tutmadı" durumu yapısal olarak imkânsızdır.
/// </summary>
[Authorize(PlatformPermissions.Documents.Administer)]
public class DocumentAdminAppService : ApplicationService, IDocumentAdminAppService
{
    private readonly IRepository<DocumentRule, Guid> _ruleRepository;
    private readonly IRepository<DocumentRuleCondition, Guid> _conditionRepository;
    private readonly IRepository<DocumentRuleAction, Guid> _actionRepository;
    private readonly IRepository<DocumentRuleRun, Guid> _runRepository;
    private readonly IRepository<DocumentFieldPermission, Guid> _fieldPermissionRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<DocumentTypeField, Guid> _fieldRepository;
    private readonly IRepository<DocumentFieldValue, Guid> _fieldValueRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<DocumentTag, Guid> _tagRepository;
    private readonly IRepository<DocumentFileTag, Guid> _fileTagRepository;
    private readonly IRepository<DocumentIntegration, Guid> _integrationRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public DocumentAdminAppService(
        IRepository<DocumentRule, Guid> ruleRepository,
        IRepository<DocumentRuleCondition, Guid> conditionRepository,
        IRepository<DocumentRuleAction, Guid> actionRepository,
        IRepository<DocumentRuleRun, Guid> runRepository,
        IRepository<DocumentFieldPermission, Guid> fieldPermissionRepository,
        IRepository<DocumentType, Guid> typeRepository,
        IRepository<DocumentTypeField, Guid> fieldRepository,
        IRepository<DocumentFieldValue, Guid> fieldValueRepository,
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<Document, Guid> documentRepository,
        IRepository<DocumentTag, Guid> tagRepository,
        IRepository<DocumentFileTag, Guid> fileTagRepository,
        IRepository<DocumentIntegration, Guid> integrationRepository,
        IRepository<Project, Guid> projectRepository,
        IIdentityRoleRepository roleRepository,
        ITenantRepository tenantRepository,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _ruleRepository = ruleRepository;
        _conditionRepository = conditionRepository;
        _actionRepository = actionRepository;
        _runRepository = runRepository;
        _fieldPermissionRepository = fieldPermissionRepository;
        _typeRepository = typeRepository;
        _fieldRepository = fieldRepository;
        _fieldValueRepository = fieldValueRepository;
        _fileRepository = fileRepository;
        _documentRepository = documentRepository;
        _tagRepository = tagRepository;
        _fileTagRepository = fileTagRepository;
        _integrationRepository = integrationRepository;
        _projectRepository = projectRepository;
        _roleRepository = roleRepository;
        _tenantRepository = tenantRepository;
        _mtFilter = mtFilter;
    }

    /* ─────────────────────────── Kural motoru ─────────────────────────── */

    public virtual async Task<List<DocumentRuleDto>> GetRulesAsync()
    {
        var rules = (await _ruleRepository.GetListAsync()).OrderBy(r => r.Order).ThenBy(r => r.Name).ToList();
        return await MapRulesAsync(rules);
    }

    public virtual async Task<DocumentRuleDto> GetRuleAsync(Guid id)
    {
        var rule = await _ruleRepository.GetAsync(id);
        return (await MapRulesAsync(new List<DocumentRule> { rule }))[0];
    }

    public virtual async Task<DocumentRuleDto> CreateRuleAsync(CreateUpdateDocumentRuleDto input)
    {
        Validate(input);

        var rule = new DocumentRule(
            GuidGenerator.Create(), CurrentTenant.Id, input.Name, input.Trigger,
            input.LogicalOperator, input.Description, isEnabled: false, order: input.Order);

        await _ruleRepository.InsertAsync(rule, autoSave: true);
        await ReplaceConditionsAndActionsAsync(rule.Id, input);

        return await GetRuleAsync(rule.Id);
    }

    public virtual async Task<DocumentRuleDto> UpdateRuleAsync(Guid id, CreateUpdateDocumentRuleDto input)
    {
        Validate(input);

        var rule = await _ruleRepository.GetAsync(id);
        rule.Update(input.Name, input.Description, input.Trigger, input.LogicalOperator, input.Order);
        await _ruleRepository.UpdateAsync(rule);

        await ReplaceConditionsAndActionsAsync(rule.Id, input);

        return await GetRuleAsync(rule.Id);
    }

    public virtual async Task DeleteRuleAsync(Guid id)
    {
        var rule = await _ruleRepository.GetAsync(id);

        var conditions = await _conditionRepository.GetListAsync(c => c.RuleId == id);
        if (conditions.Count > 0) await _conditionRepository.DeleteManyAsync(conditions);

        var actions = await _actionRepository.GetListAsync(a => a.RuleId == id);
        if (actions.Count > 0) await _actionRepository.DeleteManyAsync(actions);

        await _ruleRepository.DeleteAsync(rule);
    }

    public virtual async Task<DocumentRuleDto> SetRuleEnabledAsync(Guid id, bool isEnabled)
    {
        var rule = await _ruleRepository.GetAsync(id);
        rule.SetEnabled(isEnabled);
        await _ruleRepository.UpdateAsync(rule);

        return await GetRuleAsync(id);
    }

    public virtual async Task<DocumentRuleRunResultDto> DryRunAsync(Guid ruleId)
        => await ExecuteAsync(ruleId, isDryRun: true);

    public virtual async Task<DocumentRuleRunResultDto> RunAsync(Guid ruleId)
        => await ExecuteAsync(ruleId, isDryRun: false);

    /// <summary>
    /// Kuralı değerlendirir; <paramref name="isDryRun"/> false ise planı uygular.
    /// Kuru çalıştırmada tek yazma <see cref="DocumentRuleRun"/> kaydıdır — "bu
    /// kural ne yapardı" sorusunun yanıtı sonradan da görülebilsin diye.
    /// </summary>
    private async Task<DocumentRuleRunResultDto> ExecuteAsync(Guid ruleId, bool isDryRun)
    {
        var rule = await _ruleRepository.GetAsync(ruleId);

        if (!isDryRun && !rule.IsEnabled)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DocumentRuleNoActions)
                .WithData("Reason", "Kapalı kural çalıştırılamaz.");
        }

        var conditions = (await _conditionRepository.GetListAsync(c => c.RuleId == ruleId))
            .OrderBy(c => c.Order).ToList();
        var actions = (await _actionRepository.GetListAsync(a => a.RuleId == ruleId))
            .OrderBy(a => a.Order).ToList();

        var documents = await LoadRuleDocumentsAsync();
        var plan = DocumentRuleEvaluator.Plan(rule, conditions, actions, documents);

        if (plan.AffectedCount > RuleConsts.MaxAffectedPerRun)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DocumentRuleAffectedLimit)
                .WithData("Affected", plan.AffectedCount)
                .WithData("Max", RuleConsts.MaxAffectedPerRun);
        }

        var sample = plan.Matched.Take(10).Select(d => d.DisplayName).ToList();

        if (!isDryRun)
        {
            await ApplyAsync(plan);
            rule.RegisterRun(plan.AffectedCount, Clock.Now);
            await _ruleRepository.UpdateAsync(rule);
        }

        await _runRepository.InsertAsync(new DocumentRuleRun(
            GuidGenerator.Create(), CurrentTenant.Id, ruleId, isDryRun,
            plan.MatchedCount, plan.AffectedCount, JsonSerializer.Serialize(sample)));

        return new DocumentRuleRunResultDto
        {
            RuleId = ruleId,
            IsDryRun = isDryRun,
            MatchedCount = plan.MatchedCount,
            AffectedCount = plan.AffectedCount,
            Sample = sample,
        };
    }

    /// <summary>Planı belgelere uygular. Kuru çalıştırmadan ASLA çağrılmaz.</summary>
    private async Task ApplyAsync(RulePlan plan)
    {
        if (plan.Changes.Count == 0)
        {
            return;
        }

        var fileIds = plan.Changes.Select(c => c.DocumentFileId).Distinct().ToList();
        var files = (await _fileRepository.GetListAsync(f => fileIds.Contains(f.Id)))
            .ToDictionary(f => f.Id);

        var tagChanges = new List<(Guid FileId, string Tag)>();

        foreach (var change in plan.Changes)
        {
            if (!files.TryGetValue(change.DocumentFileId, out var file) || file.IsLocked)
            {
                // Kilitli belgeye kural da dokunamaz — kilit kullanıcı kararıdır.
                continue;
            }

            switch (change.ActionType)
            {
                case DocumentRuleActionType.MoveToFolder when Guid.TryParse(change.Payload, out var folderId):
                    file.MoveTo(folderId);
                    break;

                case DocumentRuleActionType.SetDocumentType when Guid.TryParse(change.Payload, out var typeId):
                    file.SetClassification(typeId, file.ProjectId, file.WorkStepId);
                    break;

                case DocumentRuleActionType.SetWorkStep when Guid.TryParse(change.Payload, out var stepId):
                    file.SetClassification(file.DocumentTypeId, file.ProjectId, stepId);
                    break;

                case DocumentRuleActionType.SetStatus when int.TryParse(change.Payload, out var status):
                    file.ChangeStatus((DocumentFileStatus)status);
                    break;

                case DocumentRuleActionType.SetPeriodCode:
                    file.SetDates(file.DocumentDate, change.Payload, file.ExpiryDate);
                    break;

                case DocumentRuleActionType.AddTag when !string.IsNullOrWhiteSpace(change.Payload):
                    tagChanges.Add((file.Id, change.Payload!.Trim().ToLowerInvariant()));
                    break;
            }
        }

        await _fileRepository.UpdateManyAsync(files.Values.ToList());

        if (tagChanges.Count > 0)
        {
            await ApplyTagsAsync(tagChanges);
        }
    }

    private async Task ApplyTagsAsync(List<(Guid FileId, string Tag)> tagChanges)
    {
        var names = tagChanges.Select(t => t.Tag).Distinct().ToList();

        var existingTags = await _tagRepository.GetListAsync(t => names.Contains(t.Name));
        var tagByName = existingTags.ToDictionary(t => t.Name);

        var newTags = names
            .Where(n => !tagByName.ContainsKey(n))
            .Select(n => new DocumentTag(GuidGenerator.Create(), n, CurrentTenant.Id))
            .ToList();

        if (newTags.Count > 0)
        {
            await _tagRepository.InsertManyAsync(newTags, autoSave: true);
            foreach (var tag in newTags) tagByName[tag.Name] = tag;
        }

        var fileIds = tagChanges.Select(t => t.FileId).Distinct().ToList();
        var existingLinks = (await _fileTagRepository.GetListAsync(l => fileIds.Contains(l.DocumentFileId)))
            .Select(l => (l.DocumentFileId, l.TagId))
            .ToHashSet();

        var toInsert = tagChanges
            .Select(t => (t.FileId, TagId: tagByName[t.Tag].Id))
            .Where(pair => !existingLinks.Contains(pair))
            .Distinct()
            .Select(pair => new DocumentFileTag(GuidGenerator.Create(), pair.FileId, pair.TagId))
            .ToList();

        if (toInsert.Count > 0)
        {
            await _fileTagRepository.InsertManyAsync(toInsert);
        }
    }

    /// <summary>Kural değerlendirmesi için belgeleri okunabilir hale getirir.</summary>
    private async Task<List<RuleDocument>> LoadRuleDocumentsAsync()
    {
        var fileQueryable = await _fileRepository.GetQueryableAsync();
        var files = await AsyncExecuter.ToListAsync(
            fileQueryable.AsNoTracking().Select(f => new
            {
                f.Id, f.DisplayName, f.DocumentId, f.DocumentTypeId, f.Amount,
                f.PeriodCode, f.Status, f.WorkStepId, f.ExpiryDate,
            }));

        if (files.Count == 0)
        {
            return new List<RuleDocument>();
        }

        var missing = await CountMissingRequiredFieldsAsync(
            files.Where(f => f.DocumentTypeId.HasValue)
                .Select(f => (f.Id, TypeId: f.DocumentTypeId!.Value)).ToList());

        return files.Select(f => new RuleDocument(
            f.Id, f.DisplayName, f.DocumentId, f.DocumentTypeId, f.Amount,
            f.PeriodCode, f.Status, f.WorkStepId, f.ExpiryDate,
            missing.GetValueOrDefault(f.Id))).ToList();
    }

    private async Task<Dictionary<Guid, int>> CountMissingRequiredFieldsAsync(List<(Guid FileId, Guid TypeId)> files)
    {
        var result = new Dictionary<Guid, int>();

        if (files.Count == 0)
        {
            return result;
        }

        var typeIds = files.Select(f => f.TypeId).Distinct().ToList();

        var fieldQueryable = await _fieldRepository.GetQueryableAsync();
        var requiredFields = await AsyncExecuter.ToListAsync(
            fieldQueryable.AsNoTracking()
                .Where(f => typeIds.Contains(f.DocumentTypeId) && f.IsRequired)
                .Select(f => new { f.Id, f.DocumentTypeId }));

        if (requiredFields.Count == 0)
        {
            return result;
        }

        var fileIds = files.Select(f => f.FileId).ToList();
        var valueQueryable = await _fieldValueRepository.GetQueryableAsync();
        var filled = await AsyncExecuter.ToListAsync(
            valueQueryable.AsNoTracking()
                .Where(v => fileIds.Contains(v.DocumentFileId)
                    && (v.ValueText != null || v.ValueNumber != null || v.ValueDate != null))
                .Select(v => new { v.DocumentFileId, v.FieldId }));

        var filledByFile = filled.GroupBy(v => v.DocumentFileId)
            .ToDictionary(g => g.Key, g => g.Select(x => x.FieldId).ToHashSet());

        foreach (var (fileId, typeId) in files)
        {
            var required = requiredFields.Where(f => f.DocumentTypeId == typeId).ToList();
            var have = filledByFile.GetValueOrDefault(fileId) ?? new HashSet<Guid>();
            var count = required.Count(f => !have.Contains(f.Id));

            if (count > 0)
            {
                result[fileId] = count;
            }
        }

        return result;
    }

    private static void Validate(CreateUpdateDocumentRuleDto input)
    {
        if (input.Conditions.Count > RuleConsts.MaxConditions)
            throw new BusinessException(PlatformDomainErrorCodes.DocumentRuleConditionLimit)
                .WithData("Max", RuleConsts.MaxConditions);

        if (input.Actions.Count > RuleConsts.MaxActions)
            throw new BusinessException(PlatformDomainErrorCodes.DocumentRuleActionLimit)
                .WithData("Max", RuleConsts.MaxActions);

        if (input.Actions.Count == 0)
            throw new BusinessException(PlatformDomainErrorCodes.DocumentRuleNoActions);
    }

    private async Task ReplaceConditionsAndActionsAsync(Guid ruleId, CreateUpdateDocumentRuleDto input)
    {
        var oldConditions = await _conditionRepository.GetListAsync(c => c.RuleId == ruleId);
        if (oldConditions.Count > 0) await _conditionRepository.DeleteManyAsync(oldConditions, autoSave: true);

        var oldActions = await _actionRepository.GetListAsync(a => a.RuleId == ruleId);
        if (oldActions.Count > 0) await _actionRepository.DeleteManyAsync(oldActions, autoSave: true);

        var conditions = input.Conditions.Select((c, i) => new DocumentRuleCondition(
            GuidGenerator.Create(), CurrentTenant.Id, ruleId, c.Order == 0 ? i + 1 : c.Order,
            c.Field, c.Operator, c.CompareValue)).ToList();

        if (conditions.Count > 0) await _conditionRepository.InsertManyAsync(conditions);

        var actions = input.Actions.Select((a, i) => new DocumentRuleAction(
            GuidGenerator.Create(), CurrentTenant.Id, ruleId, a.Order == 0 ? i + 1 : a.Order,
            a.ActionType, a.Payload)).ToList();

        if (actions.Count > 0) await _actionRepository.InsertManyAsync(actions);
    }

    private async Task<List<DocumentRuleDto>> MapRulesAsync(List<DocumentRule> rules)
    {
        if (rules.Count == 0)
        {
            return new List<DocumentRuleDto>();
        }

        var ruleIds = rules.Select(r => r.Id).ToList();
        var conditions = await _conditionRepository.GetListAsync(c => ruleIds.Contains(c.RuleId));
        var actions = await _actionRepository.GetListAsync(a => ruleIds.Contains(a.RuleId));

        var labels = await BuildPayloadLabelsAsync(actions);

        return rules.Select(rule => new DocumentRuleDto
        {
            Id = rule.Id,
            CreationTime = rule.CreationTime,
            CreatorId = rule.CreatorId,
            Name = rule.Name,
            Description = rule.Description,
            Trigger = rule.Trigger,
            LogicalOperator = rule.LogicalOperator,
            IsEnabled = rule.IsEnabled,
            Order = rule.Order,
            LastRunAt = rule.LastRunAt,
            LastAffectedCount = rule.LastAffectedCount,
            TotalAffectedCount = rule.TotalAffectedCount,
            Conditions = conditions.Where(c => c.RuleId == rule.Id).OrderBy(c => c.Order)
                .Select(c => new DocumentRuleConditionDto
                {
                    Id = c.Id, Order = c.Order, Field = c.Field,
                    Operator = c.Operator, CompareValue = c.CompareValue,
                }).ToList(),
            Actions = actions.Where(a => a.RuleId == rule.Id).OrderBy(a => a.Order)
                .Select(a => new DocumentRuleActionDto
                {
                    Id = a.Id, Order = a.Order, ActionType = a.ActionType,
                    Payload = a.Payload, PayloadLabel = labels.GetValueOrDefault(a.Payload ?? string.Empty),
                }).ToList(),
        }).ToList();
    }

    /// <summary>Guid taşıyan payload'ları insan-okur ada çevirir (klasör/tip/iş adımı).</summary>
    private async Task<Dictionary<string, string>> BuildPayloadLabelsAsync(List<DocumentRuleAction> actions)
    {
        var guids = actions
            .Select(a => a.Payload)
            .Where(p => Guid.TryParse(p, out _))
            .Select(p => Guid.Parse(p!))
            .Distinct()
            .ToList();

        var labels = new Dictionary<string, string>();

        if (guids.Count == 0)
        {
            return labels;
        }

        foreach (var folder in await _documentRepository.GetListAsync(d => guids.Contains(d.Id)))
        {
            labels[folder.Id.ToString()] = folder.Title;
        }

        using (_mtFilter.Disable())
        {
            var typeQueryable = await _typeRepository.GetQueryableAsync();
            foreach (var type in await AsyncExecuter.ToListAsync(typeQueryable.Where(t => guids.Contains(t.Id))))
            {
                labels[type.Id.ToString()] = type.Name;
            }
        }

        return labels;
    }

    /* ─────────────────────── Alan bazlı izinler ─────────────────────── */

    public virtual async Task<DocumentFieldPermissionMatrixDto> GetFieldPermissionMatrixAsync(Guid documentTypeId)
    {
        var type = await GetVisibleTypeAsync(documentTypeId);

        var fieldQueryable = await _fieldRepository.GetQueryableAsync();
        List<DocumentTypeField> fields;
        using (_mtFilter.Disable())
        {
            fields = await AsyncExecuter.ToListAsync(
                fieldQueryable.AsNoTracking().Where(f => f.DocumentTypeId == documentTypeId).OrderBy(f => f.Order));
        }

        var roles = (await _roleRepository.GetListAsync()).Select(r => r.Name).OrderBy(n => n).ToList();
        var permissions = await _fieldPermissionRepository.GetListAsync(p => p.DocumentTypeId == documentTypeId);

        var matrix = new DocumentFieldPermissionMatrixDto
        {
            DocumentTypeId = documentTypeId,
            DocumentTypeName = type.Name,
            Roles = roles,
        };

        foreach (var field in fields)
        {
            var row = new DocumentFieldPermissionRowDto
            {
                FieldId = field.Id,
                Label = field.Label,
                DefaultVisibility = field.Visibility,
            };

            foreach (var role in roles)
            {
                // Matris ETKİN seviyeyi gösterir (kural + devralma + varsayılan),
                // ham kuralı değil — yönetici ekranda gördüğü şeyin kullanıcının
                // göreceği şey olduğuna güvenebilmeli.
                row.Levels[role] = DocumentFieldMasker.ResolveLevel(
                    new MaskableField(field.Id, documentTypeId, field.Visibility),
                    new[] { role },
                    permissions);
            }

            matrix.Rows.Add(row);
        }

        return matrix;
    }

    public virtual async Task SetFieldPermissionAsync(SetFieldPermissionDto input)
    {
        await GetVisibleTypeAsync(input.DocumentTypeId);

        var existing = await _fieldPermissionRepository.FindAsync(p =>
            p.DocumentTypeId == input.DocumentTypeId &&
            p.FieldId == input.FieldId &&
            p.RoleName == input.RoleName);

        if (existing != null)
        {
            existing.SetLevel(input.Level);
            await _fieldPermissionRepository.UpdateAsync(existing);
            return;
        }

        await _fieldPermissionRepository.InsertAsync(new DocumentFieldPermission(
            GuidGenerator.Create(), CurrentTenant.Id, input.DocumentTypeId,
            input.FieldId, input.RoleName, input.Level));
    }

    /* ─────────────────────── Meta şema yazma ────────────────────────── */

    public virtual async Task<DocumentTypeDto> CreateTypeAsync(CreateUpdateDocumentTypeDto input)
    {
        var type = new DocumentType(
            GuidGenerator.Create(), CurrentTenant.Id, input.Name, input.Code,
            input.Icon, input.RetentionMonths, input.FileNamePattern, isSystem: false, order: input.Order);

        await _typeRepository.InsertAsync(type, autoSave: true);

        return MapType(type, new List<DocumentTypeField>());
    }

    public virtual async Task<DocumentTypeDto> UpdateTypeAsync(Guid id, CreateUpdateDocumentTypeDto input)
    {
        var type = await _typeRepository.GetAsync(id);
        EnsureNotSystem(type);

        type.SetName(input.Name);
        type.SetCode(input.Code);
        type.SetRetention(input.RetentionMonths);
        type.SetFileNamePattern(input.FileNamePattern);

        await _typeRepository.UpdateAsync(type);

        var fields = await _fieldRepository.GetListAsync(f => f.DocumentTypeId == id);
        return MapType(type, fields.OrderBy(f => f.Order).ToList());
    }

    public virtual async Task DeleteTypeAsync(Guid id)
    {
        var type = await _typeRepository.GetAsync(id);
        EnsureNotSystem(type);

        // Tipi kullanan belge varsa tip silinmez; belgeler sınıfsız kalırdı.
        var inUse = await _fileRepository.CountAsync(f => f.DocumentTypeId == id);
        if (inUse > 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DocumentTypeIsSystem)
                .WithData("Reason", $"Bu tip {inUse} belgede kullanılıyor.");
        }

        var fields = await _fieldRepository.GetListAsync(f => f.DocumentTypeId == id);
        if (fields.Count > 0) await _fieldRepository.DeleteManyAsync(fields);

        await _typeRepository.DeleteAsync(type);
    }

    public virtual async Task<DocumentTypeFieldDto> CreateFieldAsync(CreateUpdateDocumentTypeFieldDto input)
    {
        var type = await _typeRepository.GetAsync(input.DocumentTypeId);
        EnsureNotSystem(type);

        var field = new DocumentTypeField(
            GuidGenerator.Create(), CurrentTenant.Id, input.DocumentTypeId, input.Key, input.Label,
            input.FieldType, input.IsRequired, input.FillSource, input.Visibility, input.Order, input.OptionsJson);

        await _fieldRepository.InsertAsync(field, autoSave: true);

        return MapField(field);
    }

    public virtual async Task<DocumentTypeFieldDto> UpdateFieldAsync(Guid id, CreateUpdateDocumentTypeFieldDto input)
    {
        var field = await _fieldRepository.GetAsync(id);
        var type = await _typeRepository.GetAsync(field.DocumentTypeId);
        EnsureNotSystem(type);

        field.Update(input.Label, input.FieldType, input.IsRequired,
            input.FillSource, input.Visibility, input.Order, input.OptionsJson);

        await _fieldRepository.UpdateAsync(field);

        return MapField(field);
    }

    public virtual async Task DeleteFieldAsync(Guid id)
    {
        var field = await _fieldRepository.GetAsync(id);
        var type = await _typeRepository.GetAsync(field.DocumentTypeId);
        EnsureNotSystem(type);

        var values = await _fieldValueRepository.GetListAsync(v => v.FieldId == id);
        if (values.Count > 0) await _fieldValueRepository.DeleteManyAsync(values);

        await _fieldRepository.DeleteAsync(field);
    }

    /// <summary>
    /// Sistem tipleri host'ta yaşar ve tüm kiracılar tarafından paylaşılır;
    /// bir kiracının düzenlemesi diğerlerini de etkilerdi.
    /// </summary>
    private static void EnsureNotSystem(DocumentType type)
    {
        if (type.IsSystem)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DocumentTypeIsSystem)
                .WithData("Name", type.Name);
        }
    }

    private async Task<DocumentType> GetVisibleTypeAsync(Guid id)
    {
        var tenantId = CurrentTenant.Id;

        using (_mtFilter.Disable())
        {
            var queryable = await _typeRepository.GetQueryableAsync();
            var type = await AsyncExecuter.FirstOrDefaultAsync(
                queryable.Where(t => t.Id == id && (t.TenantId == null || t.TenantId == tenantId)));

            return type ?? throw new EntityNotFoundException(typeof(DocumentType), id);
        }
    }

    private static DocumentTypeDto MapType(DocumentType type, List<DocumentTypeField> fields) => new()
    {
        Id = type.Id,
        TenantId = type.TenantId,
        Name = type.Name,
        Code = type.Code,
        Icon = type.Icon,
        RetentionMonths = type.RetentionMonths,
        FileNamePattern = type.FileNamePattern,
        IsSystem = type.IsSystem,
        Order = type.Order,
        Fields = fields.Select(MapField).ToList(),
    };

    private static DocumentTypeFieldDto MapField(DocumentTypeField field) => new()
    {
        Id = field.Id,
        DocumentTypeId = field.DocumentTypeId,
        Key = field.Key,
        Label = field.Label,
        FieldType = field.FieldType,
        IsRequired = field.IsRequired,
        FillSource = field.FillSource,
        Visibility = field.Visibility,
        Order = field.Order,
        OptionsJson = field.OptionsJson,
    };

    /* ─────────────────────── Entegrasyonlar ─────────────────────────── */

    public virtual async Task<List<DocumentIntegrationDto>> GetIntegrationsAsync()
    {
        var integrations = (await _integrationRepository.GetListAsync())
            .OrderBy(i => i.Kind).ThenBy(i => i.Name).ToList();

        return integrations.Select(MapIntegration).ToList();
    }

    public virtual async Task<DocumentIntegrationDto> SaveIntegrationAsync(
        Guid? id, CreateUpdateDocumentIntegrationDto input)
    {
        if (id.HasValue)
        {
            var existing = await _integrationRepository.GetAsync(id.Value);
            existing.Update(input.Name, input.Target, input.SettingsJson, input.IsEnabled);
            await _integrationRepository.UpdateAsync(existing);
            return MapIntegration(existing);
        }

        var integration = new DocumentIntegration(
            GuidGenerator.Create(), CurrentTenant.Id, input.Kind, input.Name, input.Target, input.SettingsJson);

        await _integrationRepository.InsertAsync(integration, autoSave: true);
        return MapIntegration(integration);
    }

    public virtual async Task DeleteIntegrationAsync(Guid id)
    {
        var integration = await _integrationRepository.GetAsync(id);
        await _integrationRepository.DeleteAsync(integration);
    }

    private static DocumentIntegrationDto MapIntegration(DocumentIntegration i) => new()
    {
        Id = i.Id,
        CreationTime = i.CreationTime,
        Kind = i.Kind,
        Name = i.Name,
        Target = i.Target,
        IsEnabled = i.IsEnabled,
        LastSyncAt = i.LastSyncAt,
    };

    /* ─────────────────── Konsolide kiracı raporu ────────────────────── */

    /// <summary>
    /// Tüm kiracıların belge durumu. Yalnız HOST bağlamında anlamlıdır;
    /// kiracı içinden çağrıldığında yalnız kendi satırını görür (veri filtresi
    /// zaten sınırlar) — çapraz kiracı sızıntısı olmaz.
    /// </summary>
    public virtual async Task<ConsolidatedTenantReportDto> GetConsolidatedReportAsync()
    {
        var isHost = CurrentTenant.Id == null;
        var report = new ConsolidatedTenantReportDto();

        var tenants = isHost
            ? (await _tenantRepository.GetListAsync()).Select(t => ((Guid?)t.Id, t.Name)).ToList()
            : new List<(Guid?, string)> { (CurrentTenant.Id, CurrentTenant.Name ?? "(kiracı)") };

        using (isHost ? _mtFilter.Disable() : null)
        {
            var fileQueryable = await _fileRepository.GetQueryableAsync();
            var files = await AsyncExecuter.ToListAsync(
                fileQueryable.AsNoTracking().Select(f => new { f.TenantId, f.Amount, f.CreationTime }));

            var projectQueryable = await _projectRepository.GetQueryableAsync();
            var projects = await AsyncExecuter.ToListAsync(
                projectQueryable.AsNoTracking().Select(p => new { p.TenantId }));

            foreach (var (tenantId, name) in tenants)
            {
                var tenantFiles = files.Where(f => f.TenantId == tenantId).ToList();
                var projectCount = projects.Count(p => p.TenantId == tenantId);

                report.Rows.Add(new ConsolidatedTenantRowDto
                {
                    TenantId = tenantId,
                    TenantName = name,
                    ProjectCount = projectCount,
                    DocumentCount = tenantFiles.Count,
                    DocumentedAmount = tenantFiles.Sum(f => f.Amount ?? 0m),
                    LastDocumentAt = tenantFiles.Count == 0 ? null : tenantFiles.Max(f => f.CreationTime),
                });
            }

            report.TotalDocuments = files.Count;
        }

        report.TenantCount = report.Rows.Count;
        report.TenantsWithProjects = report.Rows.Count(r => r.ProjectCount > 0);

        return report;
    }
}
