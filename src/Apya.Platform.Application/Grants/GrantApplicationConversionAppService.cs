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
using Apya.Platform.Expenses;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;

namespace Apya.Platform.Grants;

/// <summary>
/// 2e · Onaylanan başvuruyu projeye dönüştürür.
///
/// <para>🔴 PROJE KİRACIYA AİTTİR. Host bağlamında çalışıyoruz ama proje, bütçe
/// kalemleri, görevler ve gelir planı kiracının bağlamında yazılır
/// (<c>ICurrentTenant.Change</c>); aksi halde kiracı kendi projesini göremezdi.</para>
///
/// <para>🔴 Başvuru KAPANMAZ, projeye BAĞLANIR. Tasarımın notu birebir: "Başvuru
/// kapanmaz; proje ile bağlı kalır." İkinci kez dönüştürme entity tarafından
/// reddedilir.</para>
///
/// <para>Muhasebe hesap planı bu repoda YOK; tasarımın "Hesap · 770 Ar-Ge" sütunu
/// yerine var olan <see cref="ExpenseCategory"/> kullanılır. Uydurma bir hesap
/// kodu göstermektense gerçek bir alanı eşlemek doğru.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantApplicationConversionAppService : ApplicationService, IGrantApplicationConversionAppService
{
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationBudgetLine, Guid> _budgetRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantApplicationMessage, Guid> _messageRepo;
    private readonly IRepository<GrantConsultingLog, Guid> _logRepo;
    private readonly IRepository<GrantDisbursementTranche, Guid> _grantTrancheRepo;
    private readonly IRepository<GrantMilestone, Guid> _milestoneRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<Project, Guid> _projectRepo;
    private readonly IRepository<ProjectMember, Guid> _memberRepo;
    private readonly IRepository<ProjectBudgetLine, Guid> _projectBudgetRepo;
    private readonly IRepository<FundingTranche, Guid> _fundingRepo;
    private readonly IRepository<TaskItem, Guid> _taskRepo;
    private readonly ProjectManager _projectManager;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantApplicationConversionAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationBudgetLine, Guid> budgetRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantApplicationMessage, Guid> messageRepo,
        IRepository<GrantConsultingLog, Guid> logRepo,
        IRepository<GrantDisbursementTranche, Guid> grantTrancheRepo,
        IRepository<GrantMilestone, Guid> milestoneRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<Project, Guid> projectRepo,
        IRepository<ProjectMember, Guid> memberRepo,
        IRepository<ProjectBudgetLine, Guid> projectBudgetRepo,
        IRepository<FundingTranche, Guid> fundingRepo,
        IRepository<TaskItem, Guid> taskRepo,
        ProjectManager projectManager,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _appRepo = appRepo;
        _budgetRepo = budgetRepo;
        _docRepo = docRepo;
        _messageRepo = messageRepo;
        _logRepo = logRepo;
        _grantTrancheRepo = grantTrancheRepo;
        _milestoneRepo = milestoneRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _costItemRepo = costItemRepo;
        _projectRepo = projectRepo;
        _memberRepo = memberRepo;
        _projectBudgetRepo = projectBudgetRepo;
        _fundingRepo = fundingRepo;
        _taskRepo = taskRepo;
        _projectManager = projectManager;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _currentTenant = currentTenant;
        _mtFilter = mtFilter;
    }

    /// <summary>
    /// Hibe kalemi → gider kategorisi önerisi. Eşleşme bulunamayan kalemi host
    /// kendisi seçer; yanlış bir kategoriyi varsayılan yapmaktansa boş bırakmak
    /// daha az zarar verir.
    /// </summary>
    private static readonly Dictionary<GrantCostItemKind, ExpenseCategory> CategorySuggestions = new()
    {
        [GrantCostItemKind.Personel] = ExpenseCategory.Personnel,
        [GrantCostItemKind.Danismanlik] = ExpenseCategory.Service,
        [GrantCostItemKind.Seyahat] = ExpenseCategory.Travel,
        [GrantCostItemKind.SarfMalzeme] = ExpenseCategory.Material,
        [GrantCostItemKind.MakineTechizat] = ExpenseCategory.Material
    };

    public async Task<GrantConversionPreviewDto> GetPreviewAsync(Guid applicationId)
    {
        EnsureHostContext();
        var application = await GetApplicationAsync(applicationId);
        return await BuildPreviewAsync(application);
    }

    public async Task<GrantConversionResultDto> ConvertAsync(ConvertGrantApplicationInput input)
    {
        EnsureHostContext();
        var application = await GetApplicationAsync(input.ApplicationId);

        if (application.ApprovedAmount is null or <= 0)
        {
            // Onaylanan destek girilmeden proje bütçesi kurulamaz.
            throw new BusinessException(PlatformDomainErrorCodes.GrantConversionNotApproved);
        }
        if (input.BudgetLines.Count == 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantConversionMappingMissing);
        }

        var (call, grant) = await GetCatalogAsync(application);
        var result = new GrantConversionResultDto();

        // 🔴 Proje kiracının bağlamında yazılır; host bağlamında yazılsaydı kiracı
        // kendi projesini göremezdi.
        using (_currentTenant.Change(application.TenantId))
        {
            var code = await BuildNextCodeAsync();
            var project = await _projectManager.CreateAsync(
                grantId: grant.Id,
                name: input.ProjectName,
                code: code,
                description: $"{grant.Name} · {call.Period}",
                totalBudget: input.BudgetLines.Sum(l => l.Amount),
                startDate: input.StartDate,
                endDate: input.EndDate,
                overrideTenantId: application.TenantId);
            await _projectRepo.InsertAsync(project, autoSave: true);

            result.ProjectId = project.Id;
            result.ProjectCode = project.Code;

            var order = 0;
            foreach (var line in input.BudgetLines)
            {
                await _projectBudgetRepo.InsertAsync(new ProjectBudgetLine(
                    GuidGenerator.Create(), application.TenantId, project.Id,
                    // Kalem kodu gider kategorisinden türetilir; kategori seçilmemişse
                    // kalem kodsuz kalır (bütçe ekranında elle girilebilir).
                    code: line.Category?.ToString() ?? string.Empty,
                    name: line.Name,
                    plannedAmount: line.Amount,
                    approvedAmount: line.Amount,
                    order: order++), autoSave: true);
                result.BudgetLineCount++;
            }

            foreach (var userId in input.MemberUserIds.Distinct())
            {
                await _memberRepo.InsertAsync(new ProjectMember(
                    GuidGenerator.Create(), project.Id, userId,
                    ProjectMemberRole.Member, application.TenantId), autoSave: true);
                result.MemberCount++;
            }

            if (input.CreateTasks)
            {
                var milestones = await _milestoneRepo.GetListAsync(m => m.GrantApplicationId == application.Id);
                foreach (var milestone in milestones.OrderBy(m => m.DueDate ?? DateTime.MaxValue))
                {
                    await _taskRepo.InsertAsync(new TaskItem(
                        GuidGenerator.Create(), milestone.Title, project.Id,
                        dueDate: milestone.DueDate,
                        tenantId: application.TenantId,
                        now: Clock.Now), autoSave: true);
                    result.TaskCount++;
                }
            }

            if (input.CreateTranches)
            {
                var tranches = await _grantTrancheRepo.GetListAsync(t => t.GrantApplicationId == application.Id);
                foreach (var tranche in tranches.OrderBy(t => t.SequenceNo))
                {
                    await _fundingRepo.InsertAsync(new FundingTranche(
                        GuidGenerator.Create(), application.TenantId, project.Id,
                        tranche.SequenceNo, tranche.Amount, tranche.DueDate,
                        title: L["Grants:Conversion:TrancheTitle", tranche.SequenceNo]), autoSave: true);
                    result.TrancheCount++;
                }
            }
        }

        application.LinkToProject(result.ProjectId);
        await _appRepo.UpdateAsync(application, autoSave: true);

        return result;
    }

    // ------------------------------------------------------------------ yardımcılar

    private void EnsureHostContext()
    {
        if (_currentTenant.Id != null)
        {
            // Dönüştürme host işidir: sözleşme imzalandıktan sonra danışman yürütür.
            throw new AbpAuthorizationException();
        }
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

    /// <summary>PRJ-{yıl}-{sıra}: Projeler ekranındaki kod üretimiyle AYNI biçim.</summary>
    private async Task<string> BuildNextCodeAsync()
    {
        var prefix = $"PRJ-{Clock.Now.Year}-";
        var existing = (await _projectRepo.GetListAsync(p => p.Code.StartsWith(prefix)))
            .Select(p => p.Code).ToList();

        var next = 1;
        foreach (var code in existing)
        {
            if (int.TryParse(code[prefix.Length..], out var seq) && seq >= next)
            {
                next = seq + 1;
            }
        }

        return prefix + next.ToString("D3");
    }

    private async Task<GrantConversionPreviewDto> BuildPreviewAsync(GrantApplication application)
    {
        var (call, grant) = await GetCatalogAsync(application);

        var dto = new GrantConversionPreviewDto
        {
            ApplicationId = application.Id,
            GrantName = grant.Name,
            Period = call.Period,
            ApprovedAmount = application.ApprovedAmount,
            ProjectId = application.ProjectId,
            CanConvert = application.ProjectId == null && application.ApprovedAmount is > 0,
            SuggestedProjectName = grant.Name,
            StartDate = Clock.Now.Date,
            EndDate = grant.ProjectDurationMonths.HasValue
                ? Clock.Now.Date.AddMonths(grant.ProjectDurationMonths.Value)
                : (application.ProjectDurationMonths.HasValue
                    ? Clock.Now.Date.AddMonths(application.ProjectDurationMonths.Value)
                    : null)
        };

        using (_mtFilter.Disable())
        {
            if (application.TenantId.HasValue)
            {
                var tenant = await _tenantRepo.FindAsync(application.TenantId.Value);
                dto.FirmName = tenant?.Name ?? "—";
                dto.SuggestedProjectName = $"{dto.FirmName} · {grant.Name}";
            }
            else
            {
                dto.FirmName = "—";
            }

            var costItems = await _costItemRepo.GetListAsync(c => c.GrantId == grant.Id && c.TenantId == null);
            var budgetLines = await _budgetRepo.GetListAsync(l => l.GrantApplicationId == application.Id);
            var eligible = costItems.Select(c => c.Kind).ToHashSet();

            foreach (var line in budgetLines.Where(l => l.Amount > 0).OrderBy(l => l.Kind))
            {
                dto.BudgetMappings.Add(new GrantConversionBudgetMapDto
                {
                    Kind = line.Kind,
                    Amount = line.Amount,
                    SuggestedName = L["Grants:CostItem:" + line.Kind],
                    SuggestedCategory = CategorySuggestions.GetValueOrDefault(line.Kind),
                    IsEligible = eligible.Contains(line.Kind)
                });
            }

            dto.TotalBudget = dto.BudgetMappings.Sum(m => m.Amount);
            dto.UnmappedCount = dto.BudgetMappings.Count(m => m.SuggestedCategory == null);

            dto.Tasks = (await _milestoneRepo.GetListAsync(m => m.GrantApplicationId == application.Id))
                .OrderBy(m => m.DueDate ?? DateTime.MaxValue)
                .Select(m => new GrantConversionTaskDto
                {
                    MilestoneId = m.Id, Title = m.Title, DueDate = m.DueDate
                }).ToList();

            var tranches = (await _grantTrancheRepo.GetListAsync(t => t.GrantApplicationId == application.Id))
                .OrderBy(t => t.SequenceNo).ToList();
            var approved = application.ApprovedAmount ?? 0m;
            dto.Tranches = tranches.Select(t => new GrantConversionTrancheDto
            {
                TrancheId = t.Id,
                SequenceNo = t.SequenceNo,
                Amount = t.Amount,
                DueDate = t.DueDate,
                SharePercent = approved > 0 ? (int)Math.Round(t.Amount / approved * 100m) : 0
            }).ToList();

            dto.DocumentCount = (await _docRepo.GetListAsync(d => d.GrantApplicationId == application.Id)).Count;
            dto.MessageCount = (await _messageRepo.GetListAsync(m => m.GrantApplicationId == application.Id)).Count;
            dto.ConsultingHours = (await _logRepo.GetListAsync(l => l.GrantApplicationId == application.Id))
                .Sum(l => l.Hours);
        }

        // Ekip adayları KİRACININ kullanıcılarıdır; proje onların.
        using (_currentTenant.Change(application.TenantId))
        {
            dto.SuggestedProjectCode = await BuildNextCodeAsync();
            dto.Members = (await _userRepo.GetListAsync())
                .Where(u => u.IsActive)
                .Select(u => new GrantConversionMemberDto
                {
                    UserId = u.Id,
                    Name = $"{u.Name} {u.Surname}".Trim()
                })
                .OrderBy(u => u.Name)
                .ToList();
        }

        return dto;
    }
}
