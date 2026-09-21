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
using Apya.Platform.Tenants;
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
public class GrantApplicationConversionAppService : PlatformAppService, IGrantApplicationConversionAppService
{
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationBudgetLine, Guid> _budgetRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantApplicationMessage, Guid> _messageRepo;
    private readonly IRepository<GrantConsultingLog, Guid> _logRepo;
    private readonly IRepository<GrantDisbursementTranche, Guid> _grantTrancheRepo;
    private readonly IRepository<GrantMilestone, Guid> _milestoneRepo;
    private readonly IRepository<GrantDecision, Guid> _decisionRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<Project, Guid> _projectRepo;
    private readonly IRepository<ProjectMember, Guid> _memberRepo;
    private readonly IRepository<ProjectBudgetLine, Guid> _projectBudgetRepo;
    private readonly IRepository<FundingTranche, Guid> _fundingRepo;
    private readonly IRepository<TaskItem, Guid> _taskRepo;
    private readonly ProjectManager _projectManager;
    private readonly TenantDisplayNameResolver _displayNames;
    private readonly IIdentityUserRepository _userRepo;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly GrantActivityRecorder _activityRecorder;
    private readonly GrantNotificationDispatcher _notifyDispatcher;

    public GrantApplicationConversionAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationBudgetLine, Guid> budgetRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantApplicationMessage, Guid> messageRepo,
        IRepository<GrantConsultingLog, Guid> logRepo,
        IRepository<GrantDisbursementTranche, Guid> grantTrancheRepo,
        IRepository<GrantMilestone, Guid> milestoneRepo,
        IRepository<GrantDecision, Guid> decisionRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<Project, Guid> projectRepo,
        IRepository<ProjectMember, Guid> memberRepo,
        IRepository<ProjectBudgetLine, Guid> projectBudgetRepo,
        IRepository<FundingTranche, Guid> fundingRepo,
        IRepository<TaskItem, Guid> taskRepo,
        ProjectManager projectManager,
        TenantDisplayNameResolver displayNames,
        IIdentityUserRepository userRepo,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> mtFilter,
        GrantActivityRecorder activityRecorder,
        GrantNotificationDispatcher notifyDispatcher)
    {
        _appRepo = appRepo;
        _budgetRepo = budgetRepo;
        _docRepo = docRepo;
        _messageRepo = messageRepo;
        _logRepo = logRepo;
        _grantTrancheRepo = grantTrancheRepo;
        _milestoneRepo = milestoneRepo;
        _decisionRepo = decisionRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _costItemRepo = costItemRepo;
        _projectRepo = projectRepo;
        _memberRepo = memberRepo;
        _projectBudgetRepo = projectBudgetRepo;
        _fundingRepo = fundingRepo;
        _taskRepo = taskRepo;
        _projectManager = projectManager;
        _displayNames = displayNames;
        _userRepo = userRepo;
        _currentTenant = currentTenant;
        _mtFilter = mtFilter;
        _activityRecorder = activityRecorder;
        _notifyDispatcher = notifyDispatcher;
    }

    /// <summary>
    /// Hibe kalemi → gider kategorisi önerisi. Eşleşme bulunamayan kalemi host
    /// kendisi seçer; yanlış bir kategoriyi varsayılan yapmaktansa boş bırakmak
    /// daha az zarar verir.
    /// </summary>
    private static readonly Dictionary<GrantCostItemKind, ExpenseCategory?> CategorySuggestions = new()
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

        // CNV-08: İkinci dönüşüm ancak HER ŞEY yazıldıktan sonra, LinkToProject'te
        // yakalanıyordu. İşlem geri alınıyordu ama o ana kadar proje, bütçe kalemleri,
        // görevler ve gelir planı boşuna yazılıyor; sıralı proje kodu da boşa harcanıyordu.
        // Aynı istisna kodu, yalnız daha erken.
        if (application.ProjectId.HasValue)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantApplicationAlreadyConverted);
        }

        if (application.ApprovedAmount is null or <= 0)
        {
            // Onaylanan destek girilmeden proje bütçesi kurulamaz.
            throw new BusinessException(PlatformDomainErrorCodes.GrantConversionNotApproved);
        }

        // CNV-03: Tutar tek başına "kabul edildi" demek değildi. Hiçbir akış reddedilen
        // başvurunun ApprovedAmount'unu temizlemediği için, tutarı önce girilmiş sonra
        // REDDEDİLMİŞ bir başvuru projeye dönüşebiliyordu — durum makinesinde
        // "ret → proje" gibi çelişik bir yol açıktı.
        await EnsureNotRejectedAsync(application);

        if (input.BudgetLines.Count == 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantConversionMappingMissing);
        }

        var (call, grant) = await GetCatalogAsync(application);

        // CNV-05: Tutarlar SUNUCUDAN yeniden okunur. İstemciden yalnız ad ve kategori
        // kabul edilir — proje bütçesi istemci beyanıyla kuruluyordu ve uç doğrudan
        // çağrılabildiği için beyan edilen tutar başvurunun gerçek kaydıyla hiç
        // karşılaştırılmıyordu. Kalem türü başvuru başına tekildir (sihirbaz aynı türe
        // ikinci satır açmaz), bu yüzden Kind güvenilir bir anahtardır.
        Dictionary<GrantCostItemKind, decimal> serverAmounts;
        using (_mtFilter.Disable())
        {
            serverAmounts = (await _budgetRepo.GetListAsync(l => l.GrantApplicationId == application.Id))
                .ToDictionary(l => l.Kind, l => l.Amount);
        }

        var lines = new List<(ConvertGrantBudgetLineInput Input, decimal Amount)>();
        foreach (var line in input.BudgetLines)
        {
            if (!serverAmounts.TryGetValue(line.Kind, out var amount) || amount <= 0)
            {
                // Sessizce atlamak, bütçesi eksik bir projeyi "başarıyla kuruldu" diye
                // döndürürdü; tutarsızlığı burada durdurmak daha az zarar verir.
                throw new BusinessException(PlatformDomainErrorCodes.GrantConversionBudgetLineUnknown)
                    .WithData("Kind", line.Kind);
            }
            lines.Add((line, amount));
        }

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
                totalBudget: lines.Sum(l => l.Amount),
                // CNV-11: Kategori geçilmeyince proje "Diğer/Genel" ile doğuyordu; Finans
                // Merkezi sekme setini kategoriden türettiği için donör ve kur köprüsü
                // sekmeleri hiç basılmıyor, kullanıcı hibe projesinin hibe olduğunu
                // sisteme ikinci kez elle söylemek zorunda kalıyordu.
                categoryId: ProjectCategoryConsts.SystemIds.GrantProject,
                // CNV-04: Başvuruda ZATEN yazılmış özet projede tekrar sorulmasın.
                purpose: application.ProjectSummary,
                startDate: input.StartDate,
                endDate: input.EndDate,
                overrideTenantId: application.TenantId);
            await _projectRepo.InsertAsync(project, autoSave: true);

            result.ProjectId = project.Id;
            result.ProjectCode = project.Code;

            var order = 0;
            foreach (var (line, amount) in lines)
            {
                order++;
                await _projectBudgetRepo.InsertAsync(new ProjectBudgetLine(
                    GuidGenerator.Create(), application.TenantId, project.Id,
                    // 🔴 CNV-10: Kod eskiden gider kategorisinin ENUM ADIydı ("Personnel").
                    // İki sorun: Türkçe arayüzde İngilizce teknik ad görünüyordu ve —
                    // daha kötüsü — aynı kategoriye düşen iki kalem AYNI kodu alıyordu
                    // (SarfMalzeme ve MakineTechizat ikisi de Material). Kod proje içinde
                    // TEKİL olmalı (ProjectBudgetManager.EnsureCodeIsFreeAsync); dönüşüm
                    // depoya doğrudan yazdığı için bu kural atlanıyor ve kullanıcı sonradan
                    // o kalemi düzenlemek istediğinde BudgetLineCodeAlreadyExists alıyordu.
                    // Sıra numarası hem tekil hem dilden bağımsız.
                    code: order.ToString("00"),
                    name: line.Name,
                    plannedAmount: amount,
                    approvedAmount: amount,
                    order: order - 1), autoSave: true);
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
                    var task = new TaskItem(
                        GuidGenerator.Create(), milestone.Title, project.Id,
                        dueDate: milestone.DueDate,
                        tenantId: application.TenantId,
                        now: Clock.Now);

                    // CNV-06: Tamamlanmış kilometre taşı da AÇIK göreve çevriliyordu —
                    // geçmişte biten iş panoda yapılacak gibi listeleniyordu. Atlamak
                    // yerine KAPALI açılır: iş gerçekten yapıldı, proje o izi korumalı.
                    if (milestone.IsCompleted)
                    {
                        task.ChangeStatus(Apya.Platform.Tasks.TaskStatus.Done, Clock.Now);
                    }

                    await _taskRepo.InsertAsync(task, autoSave: true);
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

        await AnnounceConversionAsync(application, grant, input.ProjectName, result);

        return result;
    }

    /// <summary>
    /// 🔴 NTF-02: Dönüşüm bugüne kadar ne iz ne bildirim üretiyordu — sürecin en
    /// sevindirici geçişi ("hibeniz projeye döndü") firma için tamamen sessizdi.
    ///
    /// <para>İz kaydı bildirimden ÖNCE yazılır: host şablonu kapatsa bile zaman
    /// çizelgesi dönüşümü göstermeli.</para>
    /// </summary>
    private async Task AnnounceConversionAsync(
        GrantApplication application, Grant grant, string projectName, GrantConversionResultDto result)
    {
        await _activityRecorder.RecordAsync(
            application.TenantId, application.Id, GrantActivityKind.ConvertedToProject,
            $"{result.ProjectCode} · {result.BudgetLineCount} bütçe kalemi");

        await _notifyDispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.ConvertedToProject,
            application.TenantId,
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = grant.Name,
                ["{proje_adı}"] = projectName,
                ["{proje_kodu}"] = result.ProjectCode
            },
            // Derin link PROJEYE çıkar: firmanın bundan sonra çalışacağı yer orası.
            nameof(Project), result.ProjectId);
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

    /// <summary>
    /// Kurum kararı reddse dönüşümü durdurur. Karar HENÜZ girilmemişse engellenmez:
    /// bugüne kadar tutarı girip kararı ayrı ekranda kaydetmeyen host akışı var ve
    /// onu kilitlemek çalışan bir süreci bozardı. Engellenen yalnız AÇIKÇA ret.
    /// </summary>
    private async Task EnsureNotRejectedAsync(GrantApplication application)
    {
        using (_mtFilter.Disable())
        {
            var decision = await _decisionRepo.FirstOrDefaultAsync(d => d.GrantApplicationId == application.Id);
            if (decision is { Outcome: GrantDecisionOutcome.Reddedildi })
            {
                throw new BusinessException(PlatformDomainErrorCodes.GrantConversionRejected);
            }
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
                var firmName = await _displayNames.GetAsync(application.TenantId.Value);
                dto.FirmName = firmName ?? "—";
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
