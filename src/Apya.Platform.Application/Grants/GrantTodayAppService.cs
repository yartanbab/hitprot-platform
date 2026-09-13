using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 11a/11b · "Bugün" — her rol için tek giriş ekranı.
///
/// <para>Kiracı bağlamında firmanın kendi işleri: <c>IMultiTenant</c> filtresi başvuruları
/// zaten firmayla sınırlar; katalog host'ta durduğu için okurken filtre kapatılır ve
/// 🔴 <c>TenantId == null</c> koşulu ELLE konur.</para>
///
/// <para>Host bağlamında danışman ekibinin kiracılar arası gelen kutusu: filtre kapatılır ve
/// başvurular BİLİNÇLE bütün kiracılardan okunur (pipeline konsoluyla aynı kural).</para>
///
/// <para>Cümle sunucuda kurulmaz: iş türü + sayı döner, metni ve bağlantıyı istemci kurar.
/// Sıra risk × tutar: en üstteki en pahalı ihmal.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantTodayAppService : ApplicationService, IGrantTodayAppService
{
    /// <summary>Kiracıda öne çıkan iş sayısı; gerisi katlı.</summary>
    private const int TenantTopCount = 3;

    /// <summary>Host'ta son tarihi bu günden uzak işler katlı kalır.</summary>
    private const int HostFoldDays = 30;

    /// <summary>"Son tarihe yakın" eşiği.</summary>
    private const int NearDays = 7;

    /// <summary>Rapor teslimi bu kadar gün içindeyse iş listesine girer.</summary>
    private const int ReportWindowDays = 30;

    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantApplicationBudgetLine, Guid> _budgetRepo;
    private readonly IRepository<GrantDecision, Guid> _decisionRepo;
    private readonly IRepository<GrantReport, Guid> _reportRepo;
    private readonly IRepository<GrantReportSection, Guid> _sectionRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantLead, Guid> _leadRepo;
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantRecommendation, Guid> _recRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantTodayAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantApplicationBudgetLine, Guid> budgetRepo,
        IRepository<GrantDecision, Guid> decisionRepo,
        IRepository<GrantReport, Guid> reportRepo,
        IRepository<GrantReportSection, Guid> sectionRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantLead, Guid> leadRepo,
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantRecommendation, Guid> recRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _appRepo = appRepo;
        _docRepo = docRepo;
        _budgetRepo = budgetRepo;
        _decisionRepo = decisionRepo;
        _reportRepo = reportRepo;
        _sectionRepo = sectionRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _costItemRepo = costItemRepo;
        _criteriaRepo = criteriaRepo;
        _leadRepo = leadRepo;
        _interestRepo = interestRepo;
        _recRepo = recRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _mtFilter = mtFilter;
    }

    public async Task<GrantTodayDto> GetAsync()
    {
        var dto = new GrantTodayDto
        {
            IsHost = CurrentTenant.Id == null,
            FirstName = CurrentUser.Name
        };

        if (dto.IsHost)
        {
            // Host görünümü kiracılar arası bakar: katalog düzenleme izni şart.
            await AuthorizationService.CheckAsync(PlatformPermissions.Grants.Edit);
            await BuildHostAsync(dto);
        }
        else
        {
            await BuildTenantAsync(dto);
        }

        Finish(dto);
        return dto;
    }

    // ---------- Kiracı (11a) ----------

    private async Task BuildTenantAsync(GrantTodayDto dto)
    {
        var today = Clock.Now.Date;
        var applications = await _appRepo.GetListAsync();
        var appIds = applications.Select(a => a.Id).ToList();

        var documents = await LoadDocumentsAsync(appIds);
        var budgetLines = await LoadBudgetLinesAsync(appIds);
        var decisions = await LoadDecisionsAsync(appIds);
        var (reports, sections) = await LoadReportsAsync(appIds);
        var (calls, grants, costItems) = await LoadCatalogAsync(applications.Select(a => a.GrantCallId));

        GrantApplication? consultantSource = null;
        int? consultantSourceDays = null;

        foreach (var application in applications)
        {
            var call = calls.GetValueOrDefault(application.GrantCallId);
            if (call == null) { continue; }
            var grant = grants.GetValueOrDefault(call.GrantId);
            var name = grant?.Name ?? "—";
            var days = DaysTo(call.Deadline, today);
            var amount = AmountOf(application, grant);

            var appDocs = documents.GetValueOrDefault(application.Id, new());
            var missingFirm = MissingDocuments(appDocs, GrantPartyRole.Firma);
            var missingConsultant = MissingDocuments(appDocs, GrantPartyRole.Danisman);
            var missingAll = appDocs.Count(d => d.Obligation == GrantDocumentObligation.Zorunlu
                                                && d.Status != GrantDocumentStatus.Onaylandi
                                                && d.UploaderParty != GrantPartyRole.Danisman);
            var emptyFields = GrantNextActionResolver.CountEmptyFields(
                application, budgetLines.GetValueOrDefault(application.Id, new()),
                grant == null ? new() : costItems.GetValueOrDefault(grant.Id, new()));
            var (next, nextValue) = GrantNextActionResolver.Resolve(application, missingAll, emptyFields);

            var decision = decisions.GetValueOrDefault(application.Id);
            var rejected = decision?.Outcome == GrantDecisionOutcome.Reddedildi;
            var appealOpen = decision != null && decision.IsAppealWindowOpen(today);
            int? appealDays = rejected && appealOpen && decision!.AppealDeadline.HasValue
                ? DaysTo(decision.AppealDeadline, today)
                : null;
            var closed = application.ProjectId.HasValue
                         || application.Stage == GrantApplicationStage.Odeme
                         || (rejected && !appealOpen);

            dto.Applications.Add(new GrantTodayApplicationDto
            {
                ApplicationId = application.Id,
                GrantCallId = call.Id,
                GrantName = name,
                Period = call.Period,
                Stage = application.Stage,
                NextAction = next,
                NextActionValue = nextValue,
                DaysRemaining = days,
                AppealDaysLeft = appealDays,
                ProjectId = application.ProjectId,
                IsClosed = closed
            });

            if (rejected && appealOpen)
            {
                dto.Items.Add(Item(GrantTodayItemKind.AppealDeadline, GrantTodayOwner.Me, name, application, call,
                    value: 0, amount, decision!.AppealDeadline, appealDays));
            }

            if (!closed && !rejected && application.SubmittedAt == null)
            {
                if (application.PendingParty == GrantPartyRole.Danisman)
                {
                    dto.ConsultantItems.Add(new GrantTodayConsultantItemDto
                    {
                        ApplicationId = application.Id, GrantName = name, IsWholeApplication = true
                    });
                }
                else
                {
                    if (missingFirm > 0)
                    {
                        dto.Items.Add(Item(GrantTodayItemKind.UploadDocuments, GrantTodayOwner.Me, name, application, call,
                            missingFirm, amount, call.Deadline, days));
                    }
                    if (emptyFields > 0)
                    {
                        dto.Items.Add(Item(GrantTodayItemKind.CompleteForm, GrantTodayOwner.Me, name, application, call,
                            emptyFields, amount, call.Deadline, days));
                    }
                }

                if (missingConsultant > 0)
                {
                    dto.ConsultantItems.Add(new GrantTodayConsultantItemDto
                    {
                        ApplicationId = application.Id, GrantName = name, DocumentCount = missingConsultant
                    });
                }
            }

            foreach (var report in DueReports(reports.GetValueOrDefault(application.Id, new()), today))
            {
                var open = sections.GetValueOrDefault(report.Id, new())
                    .Count(s => s.Status is not (GrantReportStatus.Onaylandi or GrantReportStatus.Gonderildi));
                dto.Items.Add(Item(GrantTodayItemKind.ReportDue, GrantTodayOwner.Me, name, application, call,
                    open, amount, report.DueDate, DaysTo(report.DueDate, today)));
            }

            // Danışman kartı: en yakın son tarihli açık başvurunun danışmanı.
            if (!closed && application.AssignedUserId.HasValue
                && (consultantSource == null || (days ?? int.MaxValue) < (consultantSourceDays ?? int.MaxValue)))
            {
                consultantSource = application;
                consultantSourceDays = days;
            }
        }

        if (consultantSource != null)
        {
            var users = await LoadUserNamesAsync();
            var userId = consultantSource.AssignedUserId!.Value;
            if (users.TryGetValue(userId, out var userName))
            {
                dto.Consultant = new GrantTodayConsultantDto
                {
                    UserId = userId, Name = userName, ApplicationId = consultantSource.Id
                };
            }
        }

        dto.Opportunity = await FindOpportunityAsync(applications, today);
    }

    /// <summary>
    /// Tek fırsat: danışmanın önerdiği, firmanın henüz başvurmadığı ve ilgi bildirmediği çağrı.
    /// Birden fazlaysa son tarihi en yakın olan. Öneri yoksa kart hiç çıkmaz — uydurma fırsat yok.
    /// </summary>
    private async Task<GrantTodayOpportunityDto?> FindOpportunityAsync(List<GrantApplication> applications, DateTime today)
    {
        var recommendations = await _recRepo.GetListAsync(r =>
            r.Source == GrantRecommendationSource.Host
            && (r.Status == GrantRecommendationStatus.New || r.Status == GrantRecommendationStatus.Seen));
        if (recommendations.Count == 0) { return null; }

        var appliedCalls = applications.Select(a => a.GrantCallId).ToHashSet();
        var pendingInterestCalls = (await _interestRepo.GetListAsync(i =>
                i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor))
            .Select(i => i.GrantCallId).ToHashSet();
        var candidates = recommendations
            .Select(r => r.GrantCallId)
            .Where(id => !appliedCalls.Contains(id) && !pendingInterestCalls.Contains(id))
            .Distinct()
            .ToList();
        if (candidates.Count == 0) { return null; }

        var (calls, grants, _) = await LoadCatalogAsync(candidates);
        var best = calls.Values
            .Where(c => c.Status == GrantCallStatus.Acik && (c.Deadline == null || c.Deadline.Value.Date >= today))
            .OrderBy(c => c.Deadline ?? DateTime.MaxValue)
            .FirstOrDefault();
        if (best == null) { return null; }

        var grant = grants.GetValueOrDefault(best.GrantId);
        return new GrantTodayOpportunityDto
        {
            GrantCallId = best.Id,
            GrantName = grant?.Name ?? "—",
            Issuer = grant?.Issuer ?? "—",
            MaxAmount = grant?.MaxAmount is > 0 ? grant.MaxAmount : null,
            SupportRatePercent = grant?.SupportRatePercent,
            DaysRemaining = DaysTo(best.Deadline, today)
        };
    }

    // ---------- Host (11b) ----------

    private async Task BuildHostAsync(GrantTodayDto dto)
    {
        var today = Clock.Now.Date;

        List<GrantApplication> applications;
        Dictionary<Guid, List<GrantApplicationDocument>> documents;
        Dictionary<Guid, List<GrantApplicationBudgetLine>> budgetLines;
        Dictionary<Guid, GrantDecision> decisions;
        Dictionary<Guid, List<GrantReport>> reports;
        Dictionary<Guid, List<GrantReportSection>> sections;
        Dictionary<Guid, GrantCall> calls;
        Dictionary<Guid, Grant> grants;
        Dictionary<Guid, List<GrantEligibleCostItem>> costItems;
        Dictionary<Guid, int> tagCounts;
        Dictionary<Guid, string> tenants;
        List<GrantLead> leads;
        List<GrantInterest> interests;

        // 🔴 Kiracılar arası okuma bilinçli: gelen kutusu bütün firmaların dosyalarına bakar.
        using (_mtFilter.Disable())
        {
            applications = (await _appRepo.GetListAsync())
                .Where(a => !a.ProjectId.HasValue && a.Stage != GrantApplicationStage.Odeme)
                .ToList();
            var appIds = applications.Select(a => a.Id).ToList();
            documents = await LoadDocumentsAsync(appIds);
            budgetLines = await LoadBudgetLinesAsync(appIds);
            decisions = await LoadDecisionsAsync(appIds);
            (reports, sections) = await LoadReportsAsync(appIds);

            calls = (await _callRepo.GetListAsync(c => c.TenantId == null)).ToDictionary(c => c.Id);
            grants = (await _grantRepo.GetListAsync(g => g.TenantId == null)).ToDictionary(g => g.Id);
            costItems = (await _costItemRepo.GetListAsync(c => c.TenantId == null))
                .GroupBy(c => c.GrantId).ToDictionary(g => g.Key, g => g.ToList());
            tagCounts = (await _criteriaRepo.GetListAsync(t => t.TenantId == null))
                .GroupBy(t => t.GrantId).ToDictionary(g => g.Key, g => g.Count());
            tenants = (await _tenantRepo.GetListAsync()).ToDictionary(t => t.Id, t => t.Name);
            leads = await _leadRepo.GetListAsync(l => l.PreferredMeetingAt != null);
            interests = await _interestRepo.GetListAsync(i =>
                i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor);
        }

        var users = await LoadUserNamesAsync();

        foreach (var application in applications)
        {
            var call = calls.GetValueOrDefault(application.GrantCallId);
            if (call == null) { continue; }
            var grant = grants.GetValueOrDefault(call.GrantId);
            var name = grant?.Name ?? "—";
            var firm = application.TenantId.HasValue ? tenants.GetValueOrDefault(application.TenantId.Value) : null;
            var days = DaysTo(call.Deadline, today);
            var amount = AmountOf(application, grant);
            var assigned = application.AssignedUserId.HasValue
                ? users.GetValueOrDefault(application.AssignedUserId.Value)
                : null;

            var appDocs = documents.GetValueOrDefault(application.Id, new());
            var missingFirm = MissingDocuments(appDocs, GrantPartyRole.Firma);
            var missingConsultant = MissingDocuments(appDocs, GrantPartyRole.Danisman);
            var missingAny = appDocs.Count(d => d.Obligation == GrantDocumentObligation.Zorunlu
                                                && d.Status != GrantDocumentStatus.Onaylandi);
            var emptyFields = GrantNextActionResolver.CountEmptyFields(
                application, budgetLines.GetValueOrDefault(application.Id, new()),
                grant == null ? new() : costItems.GetValueOrDefault(grant.Id, new()));

            var decision = decisions.GetValueOrDefault(application.Id);
            var rejected = decision?.Outcome == GrantDecisionOutcome.Reddedildi;

            GrantTodayItemDto Host(GrantTodayItemKind kind, GrantTodayOwner owner, int value, DateTime? deadline, int? d)
            {
                var item = Item(kind, owner, name, application, call, value, amount, deadline, d);
                item.FirmName = firm;
                item.AssignedUserName = assigned;
                return item;
            }

            if (rejected)
            {
                if (decision!.IsAppealWindowOpen(today))
                {
                    dto.Items.Add(Host(GrantTodayItemKind.AppealDeadline, GrantTodayOwner.Me, 0,
                        decision.AppealDeadline, DaysTo(decision.AppealDeadline, today)));
                }
            }
            else if (application.SubmittedAt == null)
            {
                if (missingFirm > 0)
                {
                    dto.Items.Add(Host(GrantTodayItemKind.WaitingOnFirm, GrantTodayOwner.Firm, missingFirm, call.Deadline, days));
                }
                if (missingConsultant > 0)
                {
                    dto.Items.Add(Host(GrantTodayItemKind.UploadDocuments, GrantTodayOwner.Me, missingConsultant, call.Deadline, days));
                }
                if (application.PendingParty == GrantPartyRole.Danisman && missingAny == 0 && emptyFields == 0)
                {
                    dto.Items.Add(Host(GrantTodayItemKind.SubmitPackage, GrantTodayOwner.Me, 0, call.Deadline, days));
                }
            }
            else if (decision == null)
            {
                // Kurumda: beklemekten başka yapılacak yok; tarih de bilinmiyor.
                dto.Items.Add(Host(GrantTodayItemKind.WaitingOnInstitution, GrantTodayOwner.Institution, 0, null, null));
            }

            foreach (var report in DueReports(reports.GetValueOrDefault(application.Id, new()), today))
            {
                var open = sections.GetValueOrDefault(report.Id, new())
                    .Count(s => s.Status is not (GrantReportStatus.Onaylandi or GrantReportStatus.Gonderildi));
                dto.Items.Add(Host(GrantTodayItemKind.ReportDue, GrantTodayOwner.Me, open, report.DueDate,
                    DaysTo(report.DueDate, today)));
            }
        }

        // Görüşme saati önermiş, henüz müşteri olmamış talepler.
        foreach (var lead in leads.Where(l =>
                     l.PreferredMeetingAt!.Value.Date >= today
                     && l.Status is GrantLeadStatus.Yeni or GrantLeadStatus.Arandi or GrantLeadStatus.RandevuVerildi))
        {
            var call = calls.GetValueOrDefault(lead.GrantCallId);
            var grant = call == null ? null : grants.GetValueOrDefault(call.GrantId);
            dto.Items.Add(new GrantTodayItemDto
            {
                Kind = GrantTodayItemKind.LeadMeeting,
                Owner = GrantTodayOwner.Me,
                GrantName = grant?.Name ?? "—",
                FirmName = lead.FirmName,
                LeadId = lead.Id,
                GrantCallId = lead.GrantCallId,
                Value = lead.HeatScore,
                Amount = lead.EstimatedSupport is > 0 ? lead.EstimatedSupport : null,
                Deadline = lead.PreferredMeetingAt,
                DaysRemaining = DaysTo(lead.PreferredMeetingAt, today)
            });
        }

        // Yayın bekleyen taslak çağrılar — parametre formunun yayın kapısıyla AYNI eksik listesi.
        foreach (var call in calls.Values.Where(c => c.Status == GrantCallStatus.Taslak))
        {
            var grant = grants.GetValueOrDefault(call.GrantId);
            if (grant == null) { continue; }
            var missing = GrantParameterAppService.FindMissingRequiredFields(grant, tagCounts.GetValueOrDefault(grant.Id));
            dto.Items.Add(new GrantTodayItemDto
            {
                Kind = GrantTodayItemKind.DraftCallPublish,
                Owner = GrantTodayOwner.Me,
                GrantName = grant.Name,
                GrantId = grant.Id,
                GrantCallId = call.Id,
                Value = missing.Count,
                Amount = grant.MaxAmount > 0 ? grant.MaxAmount : null,
                Deadline = call.Deadline,
                DaysRemaining = DaysTo(call.Deadline, today)
            });
        }

        // Karara bağlanmamış ilgi talepleri — tek satır, sayıyla.
        if (interests.Count > 0)
        {
            var interestCalls = interests
                .Select(i => calls.GetValueOrDefault(i.GrantCallId))
                .Where(c => c != null)
                .Select(c => c!)
                .ToList();
            var nearest = interestCalls.Where(c => c.Deadline.HasValue).OrderBy(c => c.Deadline).FirstOrDefault();
            var singleGrant = interestCalls.Select(c => c.GrantId).Distinct().Count() == 1 && interestCalls.Count > 0
                ? grants.GetValueOrDefault(interestCalls[0].GrantId)?.Name
                : null;
            dto.Items.Add(new GrantTodayItemDto
            {
                Kind = GrantTodayItemKind.InterestReview,
                Owner = GrantTodayOwner.Me,
                GrantName = singleGrant ?? string.Empty,
                Value = interests.Count,
                Deadline = nearest?.Deadline,
                DaysRemaining = DaysTo(nearest?.Deadline, today)
            });
        }
    }

    // ---------- Öncelik, sayaçlar, katlama ----------

    private static void Finish(GrantTodayDto dto)
    {
        var all = dto.Items;
        var maxAmount = all.Where(i => i.Amount is > 0).Select(i => i.Amount!.Value).DefaultIfEmpty(0m).Max();
        foreach (var item in all)
        {
            // Tutarı bilinmeyen iş orta tutar sayılır — bilinmiyor diye en dibe düşmesin.
            var amountShare = item.Amount is > 0 && maxAmount > 0 ? (double)(item.Amount.Value / maxAmount) : 0.5;
            item.Priority = Math.Round(Risk(item.DaysRemaining) * (0.5 + 0.5 * amountShare), 4);
        }

        var ordered = all
            .OrderByDescending(i => i.Priority)
            .ThenBy(i => i.DaysRemaining ?? int.MaxValue)
            .ToList();

        dto.ItemCount = ordered.Count;
        dto.FileCount = ordered
            .Select(i => (i.ApplicationId ?? i.LeadId ?? i.GrantCallId)?.ToString() ?? i.Kind.ToString())
            .Distinct()
            .Count();
        dto.NearDeadlineCount = ordered.Count(i => i.DaysRemaining is <= NearDays);

        var nearest = ordered.Where(i => i.DaysRemaining is >= 0).OrderBy(i => i.DaysRemaining).FirstOrDefault();
        dto.NearestDeadlineDays = nearest?.DaysRemaining;
        dto.NearestGrantName = nearest?.GrantName;

        if (dto.IsHost)
        {
            dto.Items = ordered.Where(i => i.DaysRemaining == null || i.DaysRemaining <= HostFoldDays).ToList();
            dto.MoreItems = ordered.Where(i => i.DaysRemaining > HostFoldDays).ToList();
        }
        else
        {
            dto.Items = ordered.Take(TenantTopCount).ToList();
            dto.MoreItems = ordered.Skip(TenantTopCount).ToList();
        }

        dto.ConsultantItemCount = dto.ConsultantItems.Sum(i => i.IsWholeApplication ? 1 : i.DocumentCount);
        dto.Applications = dto.Applications
            .OrderBy(a => a.IsClosed)
            .ThenBy(a => a.DaysRemaining ?? int.MaxValue)
            .ToList();
    }

    /// <summary>Son tarihe göre risk. Tarihi bilinmeyen iş "orta" sayılır, geçmiş tarih en riskli.</summary>
    private static double Risk(int? days) => days switch
    {
        null => 0.4,
        <= 0 => 1.0,
        < NearDays => 0.9,
        < 14 => 0.7,
        < HostFoldDays => 0.5,
        _ => 0.3
    };

    // ---------- Yardımcılar ----------

    private static GrantTodayItemDto Item(
        GrantTodayItemKind kind, GrantTodayOwner owner, string grantName,
        GrantApplication application, GrantCall call, int value, decimal? amount, DateTime? deadline, int? days)
        => new()
        {
            Kind = kind,
            Owner = owner,
            GrantName = grantName,
            ApplicationId = application.Id,
            GrantCallId = call.Id,
            GrantId = call.GrantId,
            Value = value,
            Amount = amount,
            Deadline = deadline,
            DaysRemaining = days
        };

    private static int? DaysTo(DateTime? date, DateTime today)
        => date.HasValue ? (int)(date.Value.Date - today).TotalDays : null;

    /// <summary>Onaylanan destek, yoksa programın üst limiti (0 = "limit yok" → bilinmiyor).</summary>
    private static decimal? AmountOf(GrantApplication application, Grant? grant)
        => application.ApprovedAmount is > 0 ? application.ApprovedAmount
            : grant?.MaxAmount is > 0 ? grant.MaxAmount
            : null;

    private static int MissingDocuments(List<GrantApplicationDocument> docs, GrantPartyRole uploader)
        => docs.Count(d => d.Obligation == GrantDocumentObligation.Zorunlu
                           && d.Status != GrantDocumentStatus.Onaylandi
                           && d.UploaderParty == uploader);

    private static IEnumerable<GrantReport> DueReports(List<GrantReport> reports, DateTime today)
        => reports.Where(r => r.DueDate.HasValue
                              && r.Status is GrantReportStatus.Planlandi or GrantReportStatus.Hazirlaniyor
                                  or GrantReportStatus.RevizyonIstendi
                              && (r.DueDate.Value.Date - today).TotalDays <= ReportWindowDays);

    private async Task<Dictionary<Guid, List<GrantApplicationDocument>>> LoadDocumentsAsync(List<Guid> appIds)
        => appIds.Count == 0
            ? new()
            : (await _docRepo.GetListAsync(d => appIds.Contains(d.GrantApplicationId)))
                .GroupBy(d => d.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList());

    private async Task<Dictionary<Guid, List<GrantApplicationBudgetLine>>> LoadBudgetLinesAsync(List<Guid> appIds)
        => appIds.Count == 0
            ? new()
            : (await _budgetRepo.GetListAsync(l => appIds.Contains(l.GrantApplicationId)))
                .GroupBy(l => l.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList());

    private async Task<Dictionary<Guid, GrantDecision>> LoadDecisionsAsync(List<Guid> appIds)
        => appIds.Count == 0
            ? new()
            : (await _decisionRepo.GetListAsync(x => appIds.Contains(x.GrantApplicationId)))
                .ToDictionary(x => x.GrantApplicationId);

    private async Task<(Dictionary<Guid, List<GrantReport>> Reports, Dictionary<Guid, List<GrantReportSection>> Sections)>
        LoadReportsAsync(List<Guid> appIds)
    {
        if (appIds.Count == 0) { return (new(), new()); }
        var reports = await _reportRepo.GetListAsync(r => appIds.Contains(r.GrantApplicationId));
        var reportIds = reports.Select(r => r.Id).ToList();
        var sections = reportIds.Count == 0
            ? new List<GrantReportSection>()
            : await _sectionRepo.GetListAsync(s => reportIds.Contains(s.ReportId));
        return (
            reports.GroupBy(r => r.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList()),
            sections.GroupBy(s => s.ReportId).ToDictionary(g => g.Key, g => g.ToList()));
    }

    /// <summary>Katalog host'ta yaşıyor: filtre kapatılır, 🔴 TenantId == null elle konur.</summary>
    private async Task<(Dictionary<Guid, GrantCall> Calls, Dictionary<Guid, Grant> Grants,
            Dictionary<Guid, List<GrantEligibleCostItem>> CostItems)>
        LoadCatalogAsync(IEnumerable<Guid> callIds)
    {
        var ids = callIds.Distinct().ToList();
        if (ids.Count == 0) { return (new(), new(), new()); }

        using (_mtFilter.Disable())
        {
            var calls = (await _callRepo.GetListAsync(c => ids.Contains(c.Id) && c.TenantId == null))
                .ToDictionary(c => c.Id);
            var grantIds = calls.Values.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null))
                .ToDictionary(g => g.Id);
            var costItems = (await _costItemRepo.GetListAsync(c => grantIds.Contains(c.GrantId) && c.TenantId == null))
                .GroupBy(c => c.GrantId).ToDictionary(g => g.Key, g => g.ToList());
            return (calls, grants, costItems);
        }
    }

    /// <summary>Danışmanlar host kullanıcılarıdır; kiracı bağlamında da filtre kapalı okunur.</summary>
    private async Task<Dictionary<Guid, string>> LoadUserNamesAsync()
    {
        using (_mtFilter.Disable())
        {
            return (await _userRepo.GetListAsync()).ToDictionary(u => u.Id, u =>
            {
                var full = $"{u.Name} {u.Surname}".Trim();
                return full.IsNullOrWhiteSpace() ? u.UserName : full;
            });
        }
    }
}
