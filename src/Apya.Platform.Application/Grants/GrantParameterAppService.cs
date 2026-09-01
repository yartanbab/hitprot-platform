using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 1b · Hibe Parametre Formu. Programın uygunluk/finansal parametrelerini yönetir,
/// kaydedilmemiş değerlerle canlı eşleşme önizlemesi üretir ve taslak çağrıları yayına alır.
/// Katalog host verisidir — yalnız host bağlamında çalışır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantParameterAppService : ApplicationService, IGrantParameterAppService
{
    /// <summary>Yayın için doldurulması ZORUNLU alanların anahtarları — metinleri istemci yerelleştirir.</summary>
    public const string FieldIssuer = "Issuer";
    public const string FieldSupportRate = "SupportRatePercent";
    public const string FieldProjectDuration = "ProjectDurationMonths";
    public const string FieldCriteriaTags = "CriteriaTags";

    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<GrantDocumentRequirement, Guid> _documentRepo;
    private readonly IRepository<GrantStageTemplate, Guid> _templateRepo;
    private readonly IRepository<GrantStageTemplateStep, Guid> _templateStepRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly GrantMatchManager _matcher;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantParameterAppService(
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<GrantDocumentRequirement, Guid> documentRepo,
        IRepository<GrantStageTemplate, Guid> templateRepo,
        IRepository<GrantStageTemplateStep, Guid> templateStepRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<FirmProfile, Guid> profileRepo,
        ITenantRepository tenantRepo,
        GrantMatchManager matcher,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _grantRepo = grantRepo;
        _criteriaRepo = criteriaRepo;
        _costItemRepo = costItemRepo;
        _documentRepo = documentRepo;
        _templateRepo = templateRepo;
        _templateStepRepo = templateStepRepo;
        _callRepo = callRepo;
        _profileRepo = profileRepo;
        _tenantRepo = tenantRepo;
        _matcher = matcher;
        _mtFilter = mtFilter;
    }

    public async Task<GrantParameterDto> GetAsync(Guid id)
    {
        EnsureHostContext();
        var grant = await _grantRepo.GetAsync(id);
        return await MapAsync(grant);
    }

    public async Task<GrantParameterDto> UpdateAsync(Guid id, UpdateGrantParameterDto input)
    {
        EnsureHostContext();

        var grant = await _grantRepo.GetAsync(id);
        ObjectMapper.Map(input, grant);

        // MaxAmount kolonu NOT NULL; 0 = "üst limit yok" (ErasmusYouthCatalog seed sözleşmesi).
        // Description da NOT NULL — boş metne düşürülür.
        grant.MaxAmount ??= 0m;
        grant.Description ??= string.Empty;

        await _grantRepo.UpdateAsync(grant, autoSave: true);
        await SyncCriteriaTagsAsync(id, input.CriteriaTags);
        await SyncCostItemsAsync(id, input.EligibleCostItems);
        await SyncDocumentRequirementsAsync(id, input.DocumentRequirements);

        return await MapAsync(grant, input.CriteriaTags, input.EligibleCostItems, input.DocumentRequirements);
    }

    public async Task<GrantMatchPreviewDto> PreviewMatchAsync(Guid id, UpdateGrantParameterDto input)
    {
        EnsureHostContext();

        // Kalıcı olmayan program: yalnız uygunluk kurallarını taşır, kaydedilmez.
        var draft = ObjectMapper.Map<UpdateGrantParameterDto, Grant>(input);

        var tenants = await _tenantRepo.GetListAsync();

        // 🔴 Filtre burada BİLEREK tüm kiracılara açılıyor: host, kataloğun kaç firmaya
        // ulaştığını sayıyor. Okunan veri kiracıya ait olduğu için TenantId == null koşulu
        // KONMAZ — konursa yalnız host satırları gelir ve sayaç daima 0 çıkar.
        List<FirmProfile> profiles;
        using (_mtFilter.Disable())
        {
            profiles = await _profileRepo.GetListAsync();
        }
        var profileByTenant = profiles
            .Where(p => p.TenantId.HasValue)
            .GroupBy(p => p.TenantId!.Value)
            .ToDictionary(g => g.Key, g => g.First());

        var today = Clock.Now.Date; // ARCH-049: tarihi eşleştiriciye çağıran geçirir.
        var evaluations = new List<GrantEligibilityResult>();
        var confirmedSizes = new List<CompanySize>();
        foreach (var tenant in tenants)
        {
            var signals = ToSignals(profileByTenant.GetValueOrDefault(tenant.Id));
            var result = _matcher.Evaluate(signals, draft, today);
            evaluations.Add(result);
            if (result.IsConfirmed && signals.Size.HasValue)
            {
                confirmedSizes.Add(signals.Size.Value);
            }
        }

        var impacts = evaluations
            .SelectMany(e => e.Rules)
            .GroupBy(r => r.Rule)
            .Select(g => new GrantRuleImpactDto
            {
                Rule = g.Key,
                EliminatedCount = g.Count(r => r.Outcome == GrantRuleOutcome.Failed),
                MissingDataCount = g.Count(r => r.Outcome == GrantRuleOutcome.Unknown)
            })
            .OrderBy(i => i.Rule)
            .ToList();

        // Tamamlanma ve yayın kapısı da buradan döner: formdaki güncel (kaydedilmemiş)
        // değerlerle hesaplanır ki sol navdaki yüzde ve Yayınla düğmesi canlı kalsın —
        // aynı kural iki yerde (sunucu + istemci) tekrarlanmasın diye.
        var draftCallCount = (int)await _callRepo.CountAsync(
            c => c.GrantId == id && c.Status == GrantCallStatus.Taslak);
        var missing = FindMissingRequiredFields(draft, input.CriteriaTags.Count(t => !string.IsNullOrWhiteSpace(t.Value)));

        return new GrantMatchPreviewDto
        {
            CompletionPercent = CalculateCompletionPercent(
                draft,
                input.CriteriaTags.Count(t => !string.IsNullOrWhiteSpace(t.Value)),
                input.EligibleCostItems.Count,
                input.DocumentRequirements.Count(d => !string.IsNullOrWhiteSpace(d.Name))),
            MissingRequiredFields = missing,
            DraftCallCount = draftCallCount,
            CanPublish = missing.Count == 0 && draftCallCount > 0,
            TotalFirms = tenants.Count,
            MatchingFirms = evaluations.Count(e => e.IsConfirmed),
            SizeBreakdown = confirmedSizes
                .GroupBy(s => s)
                .Select(g => new GrantSizeBreakdownDto { Size = g.Key, Count = g.Count() })
                .OrderBy(s => s.Size)
                .ToList(),
            RuleImpacts = impacts,
            TopEliminatingRule = impacts
                .Where(i => i.EliminatedCount > 0)
                .OrderByDescending(i => i.EliminatedCount)
                .ThenBy(i => i.Rule)
                .Select(i => (GrantEligibilityRule?)i.Rule)
                .FirstOrDefault()
        };
    }

    public async Task<GrantParameterDto> PublishAsync(Guid id)
    {
        EnsureHostContext();

        var grant = await _grantRepo.GetAsync(id);
        var tags = await _criteriaRepo.GetListAsync(t => t.GrantId == id);

        var missing = FindMissingRequiredFields(grant, tags.Count);
        if (missing.Count > 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantPublishRequiredFieldsMissing)
                .WithData("Fields", string.Join(", ", missing));
        }

        // Yayın = taslak çağrıları açığa almak. Açılış tarihi ileri olan çağrıyı host
        // bugün olduğu gibi elle Planlandı'ya çeker; burada zamanlayıcı YOK.
        var drafts = await _callRepo.GetListAsync(c => c.GrantId == id && c.Status == GrantCallStatus.Taslak);
        foreach (var call in drafts)
        {
            call.Status = GrantCallStatus.Acik;
            await _callRepo.UpdateAsync(call);
        }

        return await MapAsync(grant);
    }

    private async Task<GrantParameterDto> MapAsync(
        Grant grant,
        List<GrantCriteriaTagDto>? knownTags = null,
        List<GrantEligibleCostItemDto>? knownCostItems = null,
        List<GrantDocumentRequirementDto>? knownDocuments = null)
    {
        var dto = ObjectMapper.Map<Grant, GrantParameterDto>(grant);

        // Aynı UoW içinde henüz flush edilmemiş satırlar yeniden okunamaz; yazma yolunda
        // kaydedilen girdi doğrudan geri verilir (FirmProfileAppService ile aynı gerekçe).
        dto.CriteriaTags = knownTags ?? (await _criteriaRepo.GetListAsync(t => t.GrantId == grant.Id))
            .Select(t => new GrantCriteriaTagDto { Kind = t.Kind, Value = t.Value })
            .ToList();
        dto.EligibleCostItems = knownCostItems ?? (await _costItemRepo.GetListAsync(c => c.GrantId == grant.Id))
            .Select(c => new GrantEligibleCostItemDto { Kind = c.Kind, LimitPercent = c.LimitPercent })
            .ToList();

        dto.DocumentRequirements = knownDocuments ?? (await _documentRepo.GetListAsync(d => d.GrantId == grant.Id))
            .OrderBy(d => d.Order)
            .Select(d => new GrantDocumentRequirementDto
            {
                Order = d.Order,
                Name = d.Name,
                Obligation = d.Obligation,
                UploaderParty = d.UploaderParty,
                RequiresESignature = d.RequiresESignature
            })
            .ToList();

        if (grant.StageTemplateId.HasValue)
        {
            var template = await _templateRepo.FindAsync(grant.StageTemplateId.Value);
            dto.StageTemplateName = template?.Name;
            dto.StageStepCount = template == null
                ? 0
                : (int)await _templateStepRepo.CountAsync(x => x.StageTemplateId == template.Id);
        }

        dto.CoFinancingRatePercent = grant.SupportRatePercent.HasValue
            ? 100 - grant.SupportRatePercent.Value
            : null;

        dto.MissingRequiredFields = FindMissingRequiredFields(grant, dto.CriteriaTags.Count);
        dto.CompletionPercent = CalculateCompletionPercent(
            grant, dto.CriteriaTags.Count, dto.EligibleCostItems.Count, dto.DocumentRequirements.Count);
        dto.DraftCallCount = (int)await _callRepo.CountAsync(
            c => c.GrantId == grant.Id && c.Status == GrantCallStatus.Taslak);
        dto.CanPublish = dto.MissingRequiredFields.Count == 0 && dto.DraftCallCount > 0;

        return dto;
    }

    private static List<string> FindMissingRequiredFields(Grant grant, int criteriaTagCount)
    {
        var missing = new List<string>();
        if (string.IsNullOrWhiteSpace(grant.Issuer))
        {
            missing.Add(FieldIssuer);
        }
        if (!grant.SupportRatePercent.HasValue)
        {
            missing.Add(FieldSupportRate);
        }
        if (!grant.ProjectDurationMonths.HasValue)
        {
            missing.Add(FieldProjectDuration);
        }
        // Hedefleme etiketi olmayan program hiçbir firmayla eşleşmez (GrantMatchManager.Score
        // etiketsiz programa 0 verir) — yayınlanması anlamsız olurdu.
        if (criteriaTagCount == 0)
        {
            missing.Add(FieldCriteriaTags);
        }
        return missing;
    }

    /// <summary>
    /// Sol navdaki tamamlanma yüzdesi. Saf bool parametreler (ön ödeme, teminat, öncelikler)
    /// hesaba GİRMEZ — "false" onlarda geçerli bir cevaptır, eksiklik değil. MaxAmount da
    /// girmez: kolonu NOT NULL ve 0 ("üst limit yok") geçerli bir değerdir.
    /// </summary>
    private static int CalculateCompletionPercent(Grant grant, int criteriaTagCount, int costItemCount, int documentCount)
    {
        var filled = new List<bool>
        {
            !string.IsNullOrWhiteSpace(grant.Name),
            !string.IsNullOrWhiteSpace(grant.Issuer),
            !string.IsNullOrWhiteSpace(grant.Description),
            !string.IsNullOrWhiteSpace(grant.SourceUrl),
            grant.EligibleCompanySizes != 0,
            grant.MinCompanyAgeYears.HasValue || grant.MaxCompanyAgeYears.HasValue,
            grant.MinTrl.HasValue || grant.MaxTrl.HasValue,
            grant.MinStaffCount.HasValue,
            grant.MinRdStaffCount.HasValue,
            grant.MinRevenue.HasValue || grant.MaxRevenue.HasValue,
            grant.SupportRatePercent.HasValue,
            grant.ProjectDurationMonths.HasValue,
            criteriaTagCount > 0,
            costItemCount > 0,
            documentCount > 0,
            grant.StageTemplateId.HasValue
        };
        if (grant.RequiresConsortium)
        {
            filled.Add(grant.MinConsortiumPartners.HasValue);
        }
        return (int)Math.Round(filled.Count(f => f) * 100.0 / filled.Count);
    }

    private static FirmSignals ToSignals(FirmProfile? profile)
    {
        if (profile == null)
        {
            return new FirmSignals();
        }
        return new FirmSignals
        {
            Size = profile.Size,
            FoundedOn = profile.FoundedOn,
            StaffCount = profile.StaffCount,
            RdStaffCount = profile.RdStaffCount,
            AnnualRevenue = profile.AnnualRevenue,
            Trl = profile.Trl,
            HasConsortiumPartner = profile.HasConsortiumPartner
        };
    }

    private async Task SyncCriteriaTagsAsync(Guid grantId, List<GrantCriteriaTagDto> tags)
    {
        var existing = await _criteriaRepo.GetListAsync(t => t.GrantId == grantId);
        await _criteriaRepo.DeleteManyAsync(existing);

        foreach (var tag in tags.Where(t => !string.IsNullOrWhiteSpace(t.Value)))
        {
            await _criteriaRepo.InsertAsync(
                new GrantCriteriaTag(GuidGenerator.Create(), grantId, tag.Kind, tag.Value));
        }
    }

    private async Task SyncDocumentRequirementsAsync(Guid grantId, List<GrantDocumentRequirementDto> documents)
    {
        var existing = await _documentRepo.GetListAsync(d => d.GrantId == grantId);
        await _documentRepo.DeleteManyAsync(existing);

        var order = 0;
        foreach (var doc in documents.Where(d => !string.IsNullOrWhiteSpace(d.Name)))
        {
            await _documentRepo.InsertAsync(
                new GrantDocumentRequirement(GuidGenerator.Create(), grantId, order, doc.Name)
                {
                    Obligation = doc.Obligation,
                    UploaderParty = doc.UploaderParty,
                    RequiresESignature = doc.RequiresESignature
                });
            order++;
        }
    }

    private async Task SyncCostItemsAsync(Guid grantId, List<GrantEligibleCostItemDto> items)
    {
        var existing = await _costItemRepo.GetListAsync(c => c.GrantId == grantId);
        await _costItemRepo.DeleteManyAsync(existing);

        foreach (var item in items.DistinctBy(i => i.Kind))
        {
            await _costItemRepo.InsertAsync(
                new GrantEligibleCostItem(GuidGenerator.Create(), grantId, item.Kind, item.LimitPercent));
        }
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Hibe parametreleri yalnızca host bağlamında yönetilebilir.");
        }
    }
}
