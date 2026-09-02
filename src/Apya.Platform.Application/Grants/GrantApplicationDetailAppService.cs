using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Users;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 2d · Başvuru detayı — danışman görünümü.
///
/// <para>HOST-ONLY: ekran danışmanlık süresi ve başarı primi gösterir; bunlar
/// ücretlendirme verisidir, kiracı görmemelidir. Kiracının kendi başvurusu
/// sihirbazda (2a) ve evrak ekranında (2b).</para>
///
/// <para>Zaman çizelgesi ÜÇ kaynağın birleşimidir: mesajlar (2a), evrak sürümleri
/// (2b) ve aşama/atama olayları (<see cref="GrantApplicationActivity"/>). Aynı
/// olayı iki yere yazmadık; akış okuma anında birleştirilir.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantApplicationDetailAppService : ApplicationService, IGrantApplicationDetailAppService
{
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationBudgetLine, Guid> _budgetRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantApplicationDocumentVersion, Guid> _versionRepo;
    private readonly IRepository<GrantApplicationMessage, Guid> _messageRepo;
    private readonly IRepository<GrantApplicationActivity, Guid> _activityRepo;
    private readonly IRepository<GrantConsultingLog, Guid> _logRepo;
    private readonly IRepository<GrantDisbursementTranche, Guid> _trancheRepo;
    private readonly IRepository<GrantMilestone, Guid> _milestoneRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly GrantMatchManager _matcher;
    private readonly GrantMatchWeightResolver _weightResolver;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly GrantNotificationDispatcher _notifyDispatcher;

    public GrantApplicationDetailAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationBudgetLine, Guid> budgetRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantApplicationDocumentVersion, Guid> versionRepo,
        IRepository<GrantApplicationMessage, Guid> messageRepo,
        IRepository<GrantApplicationActivity, Guid> activityRepo,
        IRepository<GrantConsultingLog, Guid> logRepo,
        IRepository<GrantDisbursementTranche, Guid> trancheRepo,
        IRepository<GrantMilestone, Guid> milestoneRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<GrantStageTemplateStep, Guid> stepRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        FirmSignalsBuilder signalsBuilder,
        GrantMatchManager matcher,
        GrantMatchWeightResolver weightResolver,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> mtFilter,
        GrantNotificationDispatcher notifyDispatcher)
    {
        _appRepo = appRepo;
        _budgetRepo = budgetRepo;
        _docRepo = docRepo;
        _versionRepo = versionRepo;
        _messageRepo = messageRepo;
        _activityRepo = activityRepo;
        _logRepo = logRepo;
        _trancheRepo = trancheRepo;
        _milestoneRepo = milestoneRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _criteriaRepo = criteriaRepo;
        _costItemRepo = costItemRepo;
        _stepRepo = stepRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _signalsBuilder = signalsBuilder;
        _matcher = matcher;
        _weightResolver = weightResolver;
        _currentTenant = currentTenant;
        _mtFilter = mtFilter;
        _notifyDispatcher = notifyDispatcher;
    }

    public const string SectionFirm = "Firm";
    public const string SectionSummary = "Summary";
    public const string SectionBudget = "Budget";
    public const string SectionDocuments = "Documents";
    public const string SectionSubmit = "Submit";

    public async Task<GrantApplicationDetailDto> GetAsync(Guid applicationId)
    {
        EnsureHostContext();
        return await BuildAsync(await GetApplicationAsync(applicationId));
    }

    public async Task<GrantApplicationDetailDto> AddConsultingLogAsync(AddGrantConsultingLogInput input)
    {
        EnsureHostContext();
        var application = await GetApplicationAsync(input.ApplicationId);

        await _logRepo.InsertAsync(new GrantConsultingLog(
            GuidGenerator.Create(), application.TenantId, application.Id,
            CurrentUser.GetId(), ActorName, (input.WorkDate ?? Clock.Now).Date,
            input.Hours, input.Note), autoSave: true);

        return await BuildAsync(application);
    }

    public async Task<GrantApplicationDetailDto> SetSuccessFeeAsync(SetGrantSuccessFeeInput input)
    {
        EnsureHostContext();
        var application = await GetApplicationAsync(input.ApplicationId);

        application.SetSuccessFee(input.Percent);
        await _appRepo.UpdateAsync(application, autoSave: true);

        return await BuildAsync(application);
    }

    /// <summary>Şablondaki bir SONRAKİ adıma geçirir ("Aşama İlerlet").</summary>
    public async Task<GrantApplicationDetailDto> AdvanceToNextStepAsync(Guid applicationId)
    {
        EnsureHostContext();
        var application = await GetApplicationAsync(applicationId);
        var steps = await GetStepsAsync(application);

        if (steps.Count == 0)
        {
            // Şablonsuz programda pano dört sabit aşamayı kullanır; ilerletme orada.
            throw new BusinessException(PlatformDomainErrorCodes.GrantPipelineStepNotInTemplate);
        }

        // Adımı olmayan başvuru İLK adımda kabul edilir (pano da ilk sütunda gösterir);
        // burada -1 saysaydık 'ilerlet' ilk basışta yerinde sayardı.
        var index = application.CurrentStepId.HasValue
            ? steps.FindIndex(s => s.Id == application.CurrentStepId.Value)
            : 0;
        if (index < 0) { index = 0; }
        var next = steps.ElementAtOrDefault(index + 1);
        if (next == null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantPipelineNoNextStep);
        }

        application.MoveToStep(next.Id);
        await _appRepo.UpdateAsync(application, autoSave: true);
        await LogAsync(application, GrantActivityKind.StageMoved, next.Name);
        await NotifyStageAsync(application, next.Name);

        return await BuildAsync(application);
    }

    // ------------------------------------------------------------------ yardımcılar

    /// <summary>
    /// 6d · Aşama değişikliğini firmaya duyurur. Danışman ekranı host bağlamında
    /// koştuğu için bildirim kiracıya <see cref="ICurrentTenant.Change"/> ile yazılır.
    /// </summary>
    private async Task NotifyStageAsync(GrantApplication application, string? stageName)
    {
        var grantName = (await GetCatalogAsync(application)).Grant.Name;

        await _notifyDispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.ApplicationStageChanged,
            application.TenantId,
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = grantName,
                ["{aşama}"] = stageName
            },
            nameof(GrantApplication), application.Id);
    }

    private string ActorName =>
        CurrentUser.Name.IsNullOrWhiteSpace()
            ? (CurrentUser.UserName ?? "?")
            : $"{CurrentUser.Name} {CurrentUser.SurName}".Trim();

    private void EnsureHostContext()
    {
        if (_currentTenant.Id != null)
        {
            // Danışmanlık süresi ve başarı primi kiracıya kapalıdır.
            throw new AbpAuthorizationException();
        }
    }

    private async Task LogAsync(GrantApplication application, GrantActivityKind kind, string? context)
    {
        await _activityRepo.InsertAsync(new GrantApplicationActivity(
            GuidGenerator.Create(), application.TenantId, application.Id, kind,
            CurrentUser.GetId(), ActorName, GrantPartyRole.Danisman, context), autoSave: true);
    }

    private async Task<GrantApplication> GetApplicationAsync(Guid id)
    {
        using (_mtFilter.Disable())
        {
            return await _appRepo.FirstOrDefaultAsync(a => a.Id == id)
                   ?? throw new EntityNotFoundException(typeof(GrantApplication), id);
        }
    }

    private async Task<(GrantCall Call, Grant Grant)> GetCatalogAsync(GrantApplication application)
    {
        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FirstOrDefaultAsync(
                           c => c.Id == application.GrantCallId && c.TenantId == null)
                       ?? throw new EntityNotFoundException(typeof(GrantCall), application.GrantCallId);
            var grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null)
                        ?? throw new EntityNotFoundException(typeof(Grant), call.GrantId);
            return (call, grant);
        }
    }

    private async Task<List<GrantStageTemplateStep>> GetStepsAsync(GrantApplication application)
    {
        var (_, grant) = await GetCatalogAsync(application);
        if (grant.StageTemplateId == null) { return new List<GrantStageTemplateStep>(); }

        using (_mtFilter.Disable())
        {
            return (await _stepRepo.GetListAsync(
                    s => s.StageTemplateId == grant.StageTemplateId.Value && s.TenantId == null))
                .OrderBy(s => s.Order).ToList();
        }
    }

    private async Task<GrantApplicationDetailDto> BuildAsync(GrantApplication application)
    {
        var (call, grant) = await GetCatalogAsync(application);
        var steps = await GetStepsAsync(application);
        var today = Clock.Now.Date;

        var dto = new GrantApplicationDetailDto
        {
            Id = application.Id,
            GrantCallId = call.Id,
            GrantName = grant.Name,
            Issuer = grant.Issuer,
            Period = call.Period,
            // Referans kimlikten türetilir: ayrı bir sayaç tablosu tutmadan
            // insanın okuyup telefonda söyleyebileceği bir kod.
            Reference = $"GA-{application.CreationTime:yyyy}-{application.Id.ToString("N")[..6].ToUpperInvariant()}",
            OpenedAt = application.CreationTime,
            SubmittedAt = application.SubmittedAt,
            DaysRemaining = call.Deadline.HasValue
                ? (int)(call.Deadline.Value.Date - today).TotalDays
                : null,
            PendingParty = application.PendingParty,
            AssignedUserId = application.AssignedUserId,
            SuccessFeePercent = application.SuccessFeePercent
        };

        using (_mtFilter.Disable())
        {
            if (application.TenantId.HasValue)
            {
                var tenant = await _tenantRepo.FindAsync(application.TenantId.Value);
                dto.FirmName = tenant?.Name ?? "—";
            }
            else
            {
                dto.FirmName = "—";
            }

            if (application.AssignedUserId.HasValue)
            {
                var assignee = await _userRepo.FindAsync(application.AssignedUserId.Value);
                dto.AssignedUserName = assignee == null ? null : $"{assignee.Name} {assignee.Surname}".Trim();
            }

            // --- Süreç akışı ---
            var currentIndex = application.CurrentStepId.HasValue
                ? steps.FindIndex(s => s.Id == application.CurrentStepId.Value)
                : (steps.Count > 0 ? 0 : -1);

            dto.Steps = steps.Select((s, i) => new GrantDetailStepDto
            {
                StepId = s.Id,
                Name = s.Name,
                Order = s.Order,
                Owner = s.Owner,
                IsCurrent = i == currentIndex,
                IsDone = currentIndex >= 0 && i < currentIndex
            }).ToList();
            dto.CurrentStageName = currentIndex >= 0 ? steps[currentIndex].Name : null;

            // --- Bütçe / evrak / mesaj / olay ---
            var budgetLines = await _budgetRepo.GetListAsync(l => l.GrantApplicationId == application.Id);
            var costItems = await _costItemRepo.GetListAsync(c => c.GrantId == grant.Id && c.TenantId == null);
            var documents = await _docRepo.GetListAsync(d => d.GrantApplicationId == application.Id);
            var docIds = documents.Select(d => d.Id).ToList();
            var versions = docIds.Count == 0
                ? new List<GrantApplicationDocumentVersion>()
                : await _versionRepo.GetListAsync(v => docIds.Contains(v.DocumentId));
            var messages = await _messageRepo.GetListAsync(m => m.GrantApplicationId == application.Id);
            var activities = await _activityRepo.GetListAsync(a => a.GrantApplicationId == application.Id);

            dto.Sections = BuildSections(application, budgetLines, costItems, documents);
            dto.Activities = BuildActivities(documents, versions, messages, activities);

            dto.Tranches = (await _trancheRepo.GetListAsync(t => t.GrantApplicationId == application.Id))
                .OrderBy(t => t.SequenceNo)
                .Select(t => new GrantDisbursementTrancheDto
                {
                    Id = t.Id,
                    SequenceNo = t.SequenceNo,
                    Amount = t.Amount,
                    Status = t.Status,
                    DueDate = t.DueDate
                }).ToList();

            dto.Milestones = (await _milestoneRepo.GetListAsync(m => m.GrantApplicationId == application.Id))
                .OrderBy(m => m.DueDate ?? DateTime.MaxValue)
                .Select(m => new GrantMilestoneDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    DueDate = m.DueDate,
                    IsCompleted = m.IsCompleted
                }).ToList();

            // --- Danışmanlık kaydı ---
            var logs = await _logRepo.GetListAsync(l => l.GrantApplicationId == application.Id);
            dto.TotalHours = logs.Sum(l => l.Hours);
            dto.ConsultingLogs = logs
                .OrderByDescending(l => l.WorkDate)
                .Select(l => new GrantConsultingLogDto
                {
                    Id = l.Id, UserName = l.UserName, WorkDate = l.WorkDate,
                    Hours = l.Hours, Note = l.Note
                }).ToList();

            // Tahmini gelir: onaylı tutar varsa onun, yoksa talep edilen desteğin yüzdesi.
            var baseAmount = application.ApprovedAmount;
            if (baseAmount == null && budgetLines.Count > 0)
            {
                var byKind = budgetLines.ToDictionary(l => l.Kind);
                baseAmount = GrantBudgetCalculator.Calculate(
                    costItems.Select(c => new GrantBudgetCalculator.LineInput(
                        c.Kind, byKind.TryGetValue(c.Kind, out var l) ? l.Amount : 0m, c.LimitPercent)),
                    grant.SupportRatePercent, grant.MaxAmount).TotalSupport;
            }
            if (application.SuccessFeePercent.HasValue && baseAmount.HasValue)
            {
                dto.EstimatedRevenue = Math.Round(baseAmount.Value * application.SuccessFeePercent.Value / 100m, 2);
            }

            dto.MatchScore = await CalculateMatchScoreAsync(application, grant);
        }

        return dto;
    }

    /// <summary>
    /// Uyum skoru 1c/1e ile AYNI motorla hesaplanır; detayda başka bir rakam
    /// görünmesin. Firma profili yoksa null döner — uydurma bir skor gösterilmez.
    /// </summary>
    private async Task<int?> CalculateMatchScoreAsync(GrantApplication application, Grant grant)
    {
        if (application.TenantId == null) { return null; }

        var tags = await _criteriaRepo.GetListAsync(t => t.GrantId == grant.Id && t.TenantId == null);
        var weights = await _weightResolver.ResolveAsync(grant.Id);

        using (_currentTenant.Change(application.TenantId))
        {
            var signals = await _signalsBuilder.BuildAsync(application.TenantId.Value);
            if (signals == null) { return null; }
            return _matcher.Score(signals, grant, tags, weights);
        }
    }

    /// <summary>
    /// Form durumu kartı. Metin sunucuda kurulmaz: bölüm anahtarı + sayılar döner,
    /// cümleyi istemci yerelleştirir (1c'deki gerekçe cümlesiyle aynı yaklaşım).
    /// </summary>
    private static List<GrantDetailSectionDto> BuildSections(
        GrantApplication application,
        List<GrantApplicationBudgetLine> budgetLines,
        List<GrantEligibleCostItem> costItems,
        List<GrantApplicationDocument> documents)
    {
        var sections = new List<GrantDetailSectionDto>();

        // Proje özeti: üç alan.
        var summaryFilled = new[]
        {
            !application.ProjectTitle.IsNullOrWhiteSpace(),
            !application.ProjectSummary.IsNullOrWhiteSpace(),
            application.ProjectDurationMonths != null
        }.Count(x => x);

        sections.Add(new GrantDetailSectionDto
        {
            Key = SectionSummary,
            Value = summaryFilled,
            Total = 3,
            State = summaryFilled == 0 ? GrantDetailSectionState.Empty
                : summaryFilled < 3 ? GrantDetailSectionState.InProgress
                : GrantDetailSectionState.Complete,
            Party = summaryFilled < 3 ? application.PendingParty : null
        });

        var filledLines = budgetLines.Count(l => l.Amount > 0);
        sections.Add(new GrantDetailSectionDto
        {
            Key = SectionBudget,
            Value = filledLines,
            Total = costItems.Count,
            State = filledLines == 0 ? GrantDetailSectionState.Empty
                : filledLines < costItems.Count ? GrantDetailSectionState.InProgress
                : GrantDetailSectionState.Complete,
            Party = filledLines < costItems.Count ? application.PendingParty : null
        });

        var mandatory = documents.Count(d => d.Obligation == GrantDocumentObligation.Zorunlu);
        var approved = documents.Count(d => d.Obligation == GrantDocumentObligation.Zorunlu
                                            && d.Status == GrantDocumentStatus.Onaylandi);
        var missingOnFirm = documents.Count(d => d.Status != GrantDocumentStatus.Onaylandi
                                                 && d.UploaderParty == GrantPartyRole.Firma);
        sections.Add(new GrantDetailSectionDto
        {
            Key = SectionDocuments,
            Value = approved,
            Total = mandatory,
            State = mandatory == 0 ? GrantDetailSectionState.Empty
                : approved < mandatory ? GrantDetailSectionState.InProgress
                : GrantDetailSectionState.Complete,
            Party = approved < mandatory
                ? (missingOnFirm > 0 ? GrantPartyRole.Firma : GrantPartyRole.Danisman)
                : null
        });

        sections.Add(new GrantDetailSectionDto
        {
            Key = SectionSubmit,
            Value = application.SubmittedAt.HasValue ? 1 : 0,
            Total = 1,
            // Gönderim, zorunlu evrak tamamlanana kadar KİLİTLİ görünür.
            State = application.SubmittedAt.HasValue ? GrantDetailSectionState.Complete
                : approved < mandatory ? GrantDetailSectionState.Locked
                : GrantDetailSectionState.InProgress
        });

        return sections;
    }

    /// <summary>Üç kaynağı tek zaman çizelgesinde birleştirir (en yeni önce).</summary>
    private static List<GrantDetailActivityDto> BuildActivities(
        List<GrantApplicationDocument> documents,
        List<GrantApplicationDocumentVersion> versions,
        List<GrantApplicationMessage> messages,
        List<GrantApplicationActivity> activities)
    {
        var byId = documents.ToDictionary(d => d.Id, d => d.Name);
        var feed = new List<GrantDetailActivityDto>();

        feed.AddRange(messages.Select(m => new GrantDetailActivityDto
        {
            At = m.CreationTime,
            ActorName = m.SenderName,
            ActorRole = m.SenderRole,
            Channel = GrantDetailActivityChannel.Message,
            Text = m.Body
        }));

        feed.AddRange(versions.Select(v => new GrantDetailActivityDto
        {
            At = v.CreationTime,
            ActorName = v.UploaderName,
            ActorRole = v.UploaderRole,
            Channel = GrantDetailActivityChannel.Document,
            DocumentName = byId.GetValueOrDefault(v.DocumentId),
            VersionNo = v.VersionNo,
            Text = v.Note
        }));

        feed.AddRange(activities.Select(a => new GrantDetailActivityDto
        {
            At = a.CreationTime,
            ActorName = a.ActorName,
            ActorRole = a.ActorRole,
            Channel = GrantDetailActivityChannel.Stage,
            Kind = a.Kind,
            Text = a.Context
        }));

        return feed.OrderByDescending(f => f.At).ToList();
    }
}
