using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 6a · Kiracı · Başvurularım.
///
/// <para>Kiracı bağlamında çalışır: <c>IMultiTenant</c> filtresi başvuruları
/// zaten firmanın kendi satırlarıyla sınırlar. Katalog (Grant/GrantCall) host'ta
/// TenantId=null durduğu için okurken filtre kapatılır ve 🔴 <c>TenantId == null</c>
/// koşulu ELLE konur.</para>
///
/// <para>Ekran "sıradaki iş kimde" sorusuna cevap verir. Cümle sunucuda kurulmaz:
/// <see cref="GrantNextAction"/> + sayı döner, metni istemci yerelleştirir.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantMyApplicationsAppService : ApplicationService, IGrantMyApplicationsAppService
{
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationBudgetLine, Guid> _budgetRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantDisbursementTranche, Guid> _trancheRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantMyApplicationsAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationBudgetLine, Guid> budgetRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantDisbursementTranche, Guid> trancheRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<GrantStageTemplateStep, Guid> stepRepo,
        IIdentityUserRepository userRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _appRepo = appRepo;
        _budgetRepo = budgetRepo;
        _docRepo = docRepo;
        _trancheRepo = trancheRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _costItemRepo = costItemRepo;
        _stepRepo = stepRepo;
        _userRepo = userRepo;
        _mtFilter = mtFilter;
    }

    public async Task<GrantMyApplicationsDto> GetAsync()
    {
        var dto = new GrantMyApplicationsDto();

        var applications = await _appRepo.GetListAsync();
        if (applications.Count == 0) { return dto; }

        var appIds = applications.Select(a => a.Id).ToList();
        var callIds = applications.Select(a => a.GrantCallId).Distinct().ToList();

        var budgetLines = (await _budgetRepo.GetListAsync(l => appIds.Contains(l.GrantApplicationId)))
            .GroupBy(l => l.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList());
        var documents = (await _docRepo.GetListAsync(d => appIds.Contains(d.GrantApplicationId)))
            .GroupBy(d => d.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList());
        var tranches = (await _trancheRepo.GetListAsync(t => appIds.Contains(t.GrantApplicationId)))
            .GroupBy(t => t.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList());

        List<GrantCall> calls;
        Dictionary<Guid, Grant> grants;
        Dictionary<Guid, List<GrantEligibleCostItem>> costItems;
        Dictionary<Guid, List<GrantStageTemplateStep>> steps;

        using (_mtFilter.Disable())
        {
            calls = await _callRepo.GetListAsync(c => callIds.Contains(c.Id) && c.TenantId == null);
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null))
                .ToDictionary(g => g.Id);
            costItems = (await _costItemRepo.GetListAsync(c => grantIds.Contains(c.GrantId) && c.TenantId == null))
                .GroupBy(c => c.GrantId).ToDictionary(g => g.Key, g => g.ToList());

            var templateIds = grants.Values
                .Where(g => g.StageTemplateId.HasValue)
                .Select(g => g.StageTemplateId!.Value).Distinct().ToList();
            steps = templateIds.Count == 0
                ? new Dictionary<Guid, List<GrantStageTemplateStep>>()
                : (await _stepRepo.GetListAsync(s => templateIds.Contains(s.StageTemplateId) && s.TenantId == null))
                    .GroupBy(s => s.StageTemplateId)
                    .ToDictionary(g => g.Key, g => g.OrderBy(s => s.Order).ToList());
        }

        // Danışman adları: host kullanıcılarıdır, kiracı sorgulayamaz — filtre kapalı okunur.
        Dictionary<Guid, string> consultants;
        using (_mtFilter.Disable())
        {
            consultants = (await _userRepo.GetListAsync())
                .ToDictionary(u => u.Id, u => $"{u.Name} {u.Surname}".Trim());
        }

        var today = Clock.Now.Date;

        foreach (var application in applications)
        {
            var call = calls.FirstOrDefault(c => c.Id == application.GrantCallId);
            if (call == null) { continue; }
            var grant = grants.GetValueOrDefault(call.GrantId);

            var row = new GrantMyApplicationRowDto
            {
                Id = application.Id,
                GrantCallId = call.Id,
                GrantName = grant?.Name ?? "—",
                Issuer = grant?.Issuer ?? "—",
                Period = call.Period,
                Stage = application.Stage,
                Deadline = call.Deadline,
                DaysRemaining = call.Deadline.HasValue
                    ? (int)(call.Deadline.Value.Date - today).TotalDays
                    : null,
                SubmittedAt = application.SubmittedAt,
                PendingParty = application.PendingParty,
                ProjectId = application.ProjectId,
                CollectedAmount = tranches.GetValueOrDefault(application.Id, new())
                    .Where(t => t.Status == GrantDisbursementTrancheStatus.Odendi)
                    .Sum(t => t.Amount)
            };

            if (application.AssignedUserId.HasValue)
            {
                row.AssignedUserName = consultants.GetValueOrDefault(application.AssignedUserId.Value);
            }

            // --- Aşama adı ve ilerleme ---
            var templateSteps = grant?.StageTemplateId != null
                ? steps.GetValueOrDefault(grant.StageTemplateId.Value, new())
                : new List<GrantStageTemplateStep>();

            if (templateSteps.Count > 0)
            {
                var index = application.CurrentStepId.HasValue
                    ? templateSteps.FindIndex(s => s.Id == application.CurrentStepId.Value)
                    : 0;
                if (index < 0) { index = 0; }
                row.StageName = templateSteps[index].Name;
                row.ProgressPercent = (int)Math.Round((index + 1) * 100.0 / templateSteps.Count);
            }
            else
            {
                // Şablon yoksa dört sabit aşama; adını istemci yerelleştirir.
                row.ProgressPercent = (int)Math.Round(((int)application.Stage + 1) * 100.0 / 4);
            }

            // --- Tutar ---
            if (application.ApprovedAmount is > 0)
            {
                row.Amount = application.ApprovedAmount;
                row.IsApprovedAmount = true;
            }
            else if (budgetLines.TryGetValue(application.Id, out var lines) && grant != null)
            {
                var items = costItems.GetValueOrDefault(grant.Id, new());
                var byKind = lines.ToDictionary(l => l.Kind);
                row.Amount = GrantBudgetCalculator.Calculate(
                    items.Select(i => new GrantBudgetCalculator.LineInput(
                        i.Kind, byKind.TryGetValue(i.Kind, out var l) ? l.Amount : 0m, i.LimitPercent)),
                    grant.SupportRatePercent, grant.MaxAmount).TotalSupport;
            }

            // --- Sıradaki iş ---
            var missingDocs = documents.GetValueOrDefault(application.Id, new())
                .Count(d => d.Obligation == GrantDocumentObligation.Zorunlu
                            && d.Status != GrantDocumentStatus.Onaylandi
                            && d.UploaderParty != GrantPartyRole.Danisman);
            var emptyFields = CountEmptyFields(application, budgetLines.GetValueOrDefault(application.Id, new()),
                grant == null ? new() : costItems.GetValueOrDefault(grant.Id, new()));

            (row.NextAction, row.NextActionValue) = ResolveNextAction(
                application, missingDocs, emptyFields);

            row.IsClosed = application.ProjectId.HasValue
                           || application.Stage == GrantApplicationStage.Odeme;

            dto.Items.Add(row);
        }

        // --- KPI ---
        dto.OpenCount = dto.Items.Count(i => !i.IsClosed);
        dto.ApprovedCount = dto.Items.Count(i => i.IsApprovedAmount);
        dto.WaitingOnYouCount = dto.Items
            .Where(i => i.NextAction is GrantNextAction.CompleteForm or GrantNextAction.UploadDocuments)
            .Sum(i => Math.Max(1, i.NextActionValue));
        dto.CollectedAmount = dto.Items.Sum(i => i.CollectedAmount);
        dto.NearestDeadlineDays = dto.Items
            .Where(i => !i.IsClosed && i.DaysRemaining is >= 0)
            .Select(i => i.DaysRemaining!.Value)
            .DefaultIfEmpty(-1)
            .Min() is var nearest && nearest >= 0 ? nearest : null;

        dto.Items = dto.Items
            .OrderBy(i => i.IsClosed)
            .ThenBy(i => i.DaysRemaining ?? int.MaxValue)
            .ToList();

        return dto;
    }

    /// <summary>Proje özeti (3 alan) + açık harcama kalemleri üzerinden boş alan sayısı.</summary>
    private static int CountEmptyFields(
        GrantApplication application,
        List<GrantApplicationBudgetLine> lines,
        List<GrantEligibleCostItem> costItems)
    {
        var empty = 0;
        if (application.ProjectTitle.IsNullOrWhiteSpace()) { empty++; }
        if (application.ProjectSummary.IsNullOrWhiteSpace()) { empty++; }
        if (application.ProjectDurationMonths == null) { empty++; }

        var filled = lines.Count(l => l.Amount > 0);
        empty += Math.Max(0, costItems.Count - filled);
        return empty;
    }

    /// <summary>
    /// Sıradaki iş: önce kapanmış/proje durumları, sonra firmadan bekleneni,
    /// en sonda karşı tarafı söyler. Firma kendi işini en üstte görmeli.
    /// </summary>
    private static (GrantNextAction Action, int Value) ResolveNextAction(
        GrantApplication application, int missingDocuments, int emptyFields)
    {
        if (application.ProjectId.HasValue) { return (GrantNextAction.InProject, 0); }
        if (application.Stage == GrantApplicationStage.Odeme) { return (GrantNextAction.Done, 0); }

        if (application.SubmittedAt.HasValue)
        {
            // Gönderildikten sonra top kurumdadır; firmanın yapacağı bir şey yok.
            return (GrantNextAction.WaitingOnInstitution, 0);
        }

        if (application.PendingParty == GrantPartyRole.Danisman)
        {
            return (GrantNextAction.WaitingOnConsultant, missingDocuments);
        }

        if (missingDocuments > 0) { return (GrantNextAction.UploadDocuments, missingDocuments); }
        if (emptyFields > 0) { return (GrantNextAction.CompleteForm, emptyFields); }

        return (GrantNextAction.WaitingOnConsultant, 0);
    }
}
